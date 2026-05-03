import { Component, signal, ViewChild } from "@angular/core"

import { IconComponent } from "@shared/icons/icons.component"
import { ListDocumentComponent } from "./components/document-list.component"
import { FileUploadComponent } from "@dashboard/components/file-upload.component"

@Component({
  selector: "page-documents",
  imports: [ListDocumentComponent, IconComponent, FileUploadComponent],
  standalone: true,
  templateUrl: "./documents.page.html",
})
export class DocumentsPage {
  @ViewChild(ListDocumentComponent) listDocument!: ListDocumentComponent
  showUploadModal = signal(false)

  onUploadSuccess(): void {
    console.log("uploadSuccess fired")
    this.showUploadModal.set(false)
    this.listDocument.loadDocuments()
  }
}
