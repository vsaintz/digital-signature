import { Component, signal, ViewChild, ElementRef } from "@angular/core"
import { DecimalPipe } from "@angular/common"
import { IconComponent } from "@shared/icons/icons.component"

@Component({
  selector: "dash-file-upload",
  standalone: true,
  imports: [DecimalPipe, IconComponent],
  template: `
    <div class="w-full">
      @if (status(); as currentStatus) {
        <div
          [class]="
            currentStatus.type === 'success'
              ? 'bg-success-bg text-success-text border-success-border'
              : 'bg-error-bg text-error-text border-error-border'
          "
          class="mb-4 p-4 rounded-xl border flex items-start gap-3"
        >
          <div class="mt-0.5">
            @if (currentStatus.type === "success") {
              <app-icon name="BadgeCheck" />
            } @else {
              <app-icon name="BadgeX" />
            }
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium">{{ currentStatus.message }}</p>
          </div>
          <button (click)="status.set(null)" class="text-current opacity-50 hover:opacity-100">
            <app-icon name="X" />
          </button>
        </div>
      }

      <div
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave()"
        (drop)="onDrop($event)"
        (click)="onDropZoneClick($event)"
        [class.border-accent]="isDragging()"
        [class.bg-hover-background]="isDragging()"
        [class.cursor-pointer]="!selectedFile()"
        [class.cursor-default]="selectedFile()"
        class="relative group border-2 border-dashed border-border rounded-2xl p-8 bg-background-subtle hover:border-accent/50 text-center shadow-sm"
      >
        <input
          #fileInput
          type="file"
          (change)="onFileSelected($event)"
          accept=".csv, .xlsx, .xls"
          class="hidden"
        />

        <div class="flex flex-col items-center gap-1">
          <div
            class="mb-4 p-4 bg-background rounded-full text-foreground-muted"
            [class.group-hover:text-accent]="!selectedFile()"
            [class.group-hover:bg-hover-background]="!selectedFile()"
          >
            @if (selectedFile()) {
              <app-icon name="FileSpreadsheet" [size]="30" class="text-accent" />
            } @else {
              <app-icon name="CloudUpload" [size]="30" />
            }
          </div>

          <h3 class="text-sm font-semibold text-foreground mb-1">
            @if (selectedFile()) {
              {{ selectedFile()?.name }}
            } @else {
              Upload your data
            }
          </h3>

          <p class="text-xs text-foreground-muted mb-4">
            @if (selectedFile()) {
              {{ selectedFile()!.size | number: "1.0-0" }} bytes ready to upload
            } @else {
              Drag & drop or browse ( CSV, XLSX, XLS )
            }
          </p>

          @if (!selectedFile()) {
            <button
              type="button"
              (click)="$event.stopPropagation(); fileInput.click()"
              class="theme-inverse inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg mt-3
                     bg-(--background) text-(--foreground) hover:bg-(--hover-background) cursor-pointer"
            >
              <app-icon name="FolderOpen" [size]="16" />
              Browse Files
            </button>
          }

          @if (selectedFile()) {
            <div class="flex items-center gap-3 mt-3" (click)="$event.stopPropagation()">
              <button
                type="button"
                (click)="discardFile()"
                class="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg
                       text-error-text bg-error-bg border border-error-border hover:border-error-border-hover
                       hover:bg-error-bg-hover cursor-pointer"
              >
                <app-icon name="X" [size]="16" />
                Discard
              </button>
              <button
                type="button"
                (click)="confirmUpload()"
                class="theme-inverse inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg
                       bg-(--background) text-(--foreground) border border-(--broder) hover:bg-(--hover-background)
                       cursor-pointer"
              >
                <app-icon name="Upload" [size]="16" />
                Upload File
              </button>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class FileUploadComponent {
  @ViewChild("fileInput") fileInput!: ElementRef<HTMLInputElement>

  selectedFile = signal<File | null>(null)
  isDragging = signal(false)
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

  confirmUpload() {}
}
