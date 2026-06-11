import { Component, ElementRef, ViewChild } from "@angular/core"
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms"
import { IconComponent } from "@shared/icons/icons.component"
import { SvgSitelogoComponent } from "@shared/icons/svg-sitelogo.component"

@Component({
  selector: "app-document-verify",
  standalone: true,
  imports: [ReactiveFormsModule, IconComponent, SvgSitelogoComponent],
  templateUrl: "./document-verify.component.html",
})
export class DocumentVerifyComponent {
  @ViewChild("fileInput") fileInputRef!: ElementRef<HTMLInputElement>

  signatureId = new FormControl("", [Validators.maxLength(8), Validators.pattern(/^[0-9A-Fa-f]*$/)])

  selectedFile: File | null = null
  isDragging = false

  get characterCount(): number {
    return this.signatureId.value?.length || 0
  }

  triggerFileInput(): void {
    this.fileInputRef.nativeElement.click()
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement
    if (input.files?.length) {
      this.handleFile(input.files[0])
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault()
    this.isDragging = true
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault()
    this.isDragging = false
  }

  onDrop(event: DragEvent): void {
    event.preventDefault()
    this.isDragging = false
    if (event.dataTransfer?.files?.length) {
      this.handleFile(event.dataTransfer.files[0])
    }
  }

  private handleFile(file: File): void {
    const validExtensions = [".csv", ".xls", ".xlsx"]
    const isValid = validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))

    if (isValid) {
      this.selectedFile = file
    } else {
      console.warn("Invalid file type selected.")
    }
  }

  verifyDocument(): void {
    if (!this.selectedFile || this.characterCount !== 8) {
      return
    }
    const payload = {
      signature: this.signatureId.value,
      file: this.selectedFile,
    }
    console.log("Ready to verify:", payload)
  }
}
