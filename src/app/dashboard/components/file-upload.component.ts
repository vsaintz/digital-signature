import {
  Component,
  signal,
  ViewChild,
  ElementRef,
  inject,
  Output,
  EventEmitter,
} from "@angular/core"
import { DecimalPipe } from "@angular/common"
import { finalize } from "rxjs"

import { DocumentService } from "@services/document.service"
import { IconComponent } from "@shared/icons/icons.component"

@Component({
  selector: "dash-file-upload",
  standalone: true,
  imports: [DecimalPipe, IconComponent],
  templateUrl: "./file-upload.component.html",
})
export class FileUploadComponent {
  @ViewChild("fileInput") fileInput!: ElementRef<HTMLInputElement>
  @Output() uploadSuccess = new EventEmitter<void>()

  private documentService = inject(DocumentService)

  selectedFile = signal<File | null>(null)
  isDragging = signal(false)
  isUploading = signal(false)
  status = signal<{ type: "success" | "error"; message: string } | null>(null)

  onDropZoneClick(event: MouseEvent) {
    if (!this.selectedFile()) {
      this.fileInput.nativeElement.click()
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    if (file) {
      this.selectedFile.set(file)
      this.status.set(null)
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault()
    this.isDragging.set(true)
  }

  onDragLeave() {
    this.isDragging.set(false)
  }

  onDrop(event: DragEvent) {
    event.preventDefault()
    this.isDragging.set(false)
    const file = event.dataTransfer?.files[0]
    if (file) {
      this.selectedFile.set(file)
      this.status.set(null)
    }
  }

  discardFile() {
    this.selectedFile.set(null)
    this.fileInput.nativeElement.value = ""
    this.status.set(null)
  }

  confirmUpload() {
    const file = this.selectedFile()
    if (!file) return

    this.isUploading.set(true)
    this.documentService
      .uploadDocument(file)
      .pipe(finalize(() => this.isUploading.set(false)))
      .subscribe({
        next: () => {
          this.discardFile()
          this.uploadSuccess.emit()
        },
        error: (err) => {
          const message = err?.error?.detail ?? "Upload failed. Please try again."
          this.status.set({ type: "error", message })
        },
      })
  }
}
