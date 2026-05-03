import {
  Component,
  afterNextRender,
  inject,
  ChangeDetectorRef,
  signal,
  computed,
} from "@angular/core"
import { DocumentService, Document } from "@services/document.service"

import { DocumentToolbarComponent, FilterStatus, SortField } from "./document-toolbar.component"
import { StatsCardComponent } from "./stats-card.component"
import { DocumentTableComponent } from "./document-table.component"
import { IconComponent } from "@shared/icons/icons.component"

const PAGE_SIZE = 10

@Component({
  selector: "list-document",
  standalone: true,
  imports: [StatsCardComponent, DocumentToolbarComponent, DocumentTableComponent, IconComponent],
  templateUrl: "./document-list.component.html",
})
export class ListDocumentComponent {
  allDocuments = signal<Document[]>([])
  isLoading = signal(true)

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
  private cdr = inject(ChangeDetectorRef)

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
