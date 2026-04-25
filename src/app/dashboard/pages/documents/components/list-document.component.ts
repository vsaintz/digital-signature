import { Component, afterNextRender, inject, ChangeDetectorRef } from "@angular/core"
import { DocumentService, Document } from "@services/document.service"

import { IconComponent } from "@shared/icons/icons.component"
import { StatsCardComponent } from "./stats-card.component"
import { DocumentToolbarComponent } from "./document-toolbar.component"
import { DocumentTableComponent } from "./document-table.component"

@Component({
  selector: "list-document",
  standalone: true,
  imports: [IconComponent, StatsCardComponent, DocumentToolbarComponent, DocumentTableComponent],
  templateUrl: "./list-document.component.html",
})
export class ListDocumentComponent {
  documents: Document[] = []
  isLoading = true
  selectedIds = new Set<string>()

  private documentService = inject(DocumentService)
  private cdr = inject(ChangeDetectorRef)

  constructor() {
    afterNextRender(() => this.loadDocuments())
  }

  get selectedCount(): number {
    return this.selectedIds.size
  }

  toggleAll(): void {
    if (this.selectedIds.size === this.documents.length) {
      this.selectedIds.clear()
    } else {
      this.documents.forEach((doc) => this.selectedIds.add(doc.id))
    }
  }

  toggleOne(id: string): void {
    this.selectedIds.has(id) ? this.selectedIds.delete(id) : this.selectedIds.add(id)
  }

  clearSelection(): void {
    this.selectedIds.clear()
  }

  loadDocuments(): void {
    this.isLoading = true
    this.documentService.getDocuments().subscribe({
      next: (data) => {
        this.documents = data
        this.isLoading = false
        this.cdr.detectChanges()
      },
      error: () => {
        this.isLoading = false
        this.cdr.detectChanges()
      },
    })
  }
}
