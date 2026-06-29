import { Component, signal, ViewChild, inject } from "@angular/core"

import { IconComponent } from "@shared/icons/icons.component"
import { ListDocumentComponent } from "./components/document-list.component"
import { FileUploadComponent } from "@dashboard/components/file-upload.component"
import { DocumentService } from "@services/document.service"

@Component({
  selector: "page-documents",
  imports: [ListDocumentComponent, IconComponent, FileUploadComponent],
  standalone: true,
  templateUrl: "./documents.page.html",
})
export class DocumentsPage {
  @ViewChild(ListDocumentComponent) listDocument!: ListDocumentComponent
  showUploadModal = signal(false)

  private documentService = inject(DocumentService)

  onUploadSuccess(): void {
    this.showUploadModal.set(false)
    this.listDocument.loadDocuments()
  }

  onExport(): void {
    this.documentService.exportAllDocuments()
  }
}
