import {
  Component,
  afterNextRender,
  inject,
  ChangeDetectorRef,
  signal,
  computed,
} from "@angular/core"
import { DocumentService, Document } from "@services/document.service"
import { SignatureService, VerificationResponse } from "@services/signature.service"
import { IconComponent } from "@shared/icons/icons.component"

import { DocumentToolbarComponent, FilterStatus, SortField } from "./document-toolbar.component"
import { StatsCardComponent } from "./stats-card.component"
import { DocumentTableComponent } from "./document-table.component"
import { VerificationModalComponent } from "./verification-modal.component"

const PAGE_SIZE = 10

@Component({
  selector: "list-document",
  standalone: true,
  imports: [
    StatsCardComponent,
    DocumentToolbarComponent,
    DocumentTableComponent,
    IconComponent,
    VerificationModalComponent,
  ],
  templateUrl: "./document-list.component.html",
})
export class ListDocumentComponent {
  allDocuments = signal<Document[]>([])
  isLoading = signal(true)
  showVerificationModal = signal(false)
  isVerifying = signal(false)
  verificationResult = signal<VerificationResponse | null>(null)

  private signatureService = inject(SignatureService)
  private cdr = inject(ChangeDetectorRef)

  signingInProgress = signal<Set<string>>(new Set())

  selectedIds = new Set<string>()

  searchQuery = signal("")
  activeFilter = signal<FilterStatus>("all")
  sortField = signal<SortField>("date")

  currentPage = signal(1)

  filteredDocs = computed(() => {
    const q = this.searchQuery().toLowerCase().trim()
    const filter = this.activeFilter()
    const sort = this.sortField()

    let list = [...this.allDocuments()]

    if (q) list = list.filter((d) => d.name.toLowerCase().includes(q))

    if (filter !== "all") {
      list = list.filter((d) => {
        if (filter === "pending")
          return d.processing_status !== "ready" && d.processing_status !== "error"
        return d.processing_status === filter
      })
    }

    list.sort((a, b) => {
      switch (sort) {
        case "name":
          return a.name.localeCompare(b.name)
        case "size":
          return (b.file_size ?? 0) - (a.file_size ?? 0)
        case "status":
          return a.processing_status.localeCompare(b.processing_status)
        case "date":
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

    return list
  })

  paginatedDocs = computed(() => {
    const start = (this.currentPage() - 1) * PAGE_SIZE
    return this.filteredDocs().slice(start, start + PAGE_SIZE)
  })

  totalPages = computed(() => Math.max(1, Math.ceil(this.filteredDocs().length / PAGE_SIZE)))

  pageNumbers = computed(() => {
    const total = this.totalPages()
    const cur = this.currentPage()
    const range: number[] = []
    const delta = 2
    for (let i = Math.max(1, cur - delta); i <= Math.min(total, cur + delta); i++) {
      range.push(i)
    }
    return range
  })

  get selectedCount(): number {
    return this.selectedIds.size
  }

  private documentService = inject(DocumentService)

  constructor() {
    afterNextRender(() => this.loadDocuments())
  }

  loadDocuments(): void {
    this.isLoading.set(true)
    this.documentService.getDocuments().subscribe({
      next: (data) => {
        this.allDocuments.set(data)
        this.isLoading.set(false)
        this.cdr.detectChanges()
      },
      error: () => {
        this.isLoading.set(false)
        this.cdr.detectChanges()
      },
    })
  }

  onSignDocument(id: string): void {
    this.signingInProgress.update((set) => {
      const newSet = new Set(set)
      newSet.add(id)
      return newSet
    })

    this.signatureService.signDocument(id).subscribe({
      next: (res) => {
        console.log("Success:", res.message)
        this.loadDocuments()
      },
      error: (err) => {
        console.error("Failed to sign document:", err)
      },
      complete: () => {
        this.signingInProgress.update((set) => {
          const newSet = new Set(set)
          newSet.delete(id)
          return newSet
        })
      },
    })
  }

  onVerifyDocument(id: string): void {
    this.showVerificationModal.set(true)
    this.isVerifying.set(true)
    this.verificationResult.set(null)

    this.signatureService.verifyDocument(id).subscribe({
      next: (res) => {
        this.verificationResult.set(res)
        this.isVerifying.set(false)
      },
      error: (err) => {
        console.error("Failed to verify document:", err)
        this.verificationResult.set({ status: "tampered" })
        this.isVerifying.set(false)
      },
    })
  }

  closeVerificationModal() {
    this.showVerificationModal.set(false)
    // slight delay to clear data so it doesn't flicker while animating out
    setTimeout(() => this.verificationResult.set(null), 200)
  }

  visibleEndCount = computed(() => {
    return Math.min(this.currentPage() * 10, this.filteredDocs().length)
  })

  toggleAll(): void {
    const pageDocs = this.paginatedDocs()
    const allSelected = pageDocs.every((d) => this.selectedIds.has(d.id))
    if (allSelected) pageDocs.forEach((d) => this.selectedIds.delete(d.id))
    else pageDocs.forEach((d) => this.selectedIds.add(d.id))
  }

  toggleOne(id: string): void {
    this.selectedIds.has(id) ? this.selectedIds.delete(id) : this.selectedIds.add(id)
  }

  clearSelection(): void {
    this.selectedIds.clear()
  }

  onSearchChange(q: string): void {
    this.searchQuery.set(q)
    this.currentPage.set(1)
  }

  onFilterChange(f: FilterStatus): void {
    this.activeFilter.set(f)
    this.currentPage.set(1)
    this.clearSelection()
  }

  onSortChange(s: SortField): void {
    this.sortField.set(s)
    this.currentPage.set(1)
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return
    this.currentPage.set(page)
    this.clearSelection()
  }
}
