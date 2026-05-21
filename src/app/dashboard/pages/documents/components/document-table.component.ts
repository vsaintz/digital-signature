import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  HostListener,
  ElementRef,
} from "@angular/core"
import { DatePipe } from "@angular/common"
import { Document } from "@services/document.service"
import { IconComponent } from "@shared/icons/icons.component"

@Component({
  selector: "document-table",
  standalone: true,
  imports: [DatePipe, IconComponent],
  templateUrl: "./document-table.component.html",
})
export class DocumentTableComponent {
  @Input() documents: Document[] = []
  @Input() selectedIds = new Set<string>()
  @Input() signingInProgress = new Set<string>()

  @Output() toggleOne = new EventEmitter<string>()
  @Output() toggleAll = new EventEmitter<void>()
  @Output() signDocument = new EventEmitter<string>()
  @Output() verifyDocument = new EventEmitter<string>()

  activeMenu = signal<string | null>(null)

  constructor(private elRef: ElementRef) {}

  @HostListener("document:click")
  onDocClick() {
    this.activeMenu.set(null)
  }

  toggleMenu(id: string, e: MouseEvent) {
    e.stopPropagation()
    this.activeMenu.update((cur) => (cur === id ? null : id))
  }

  onSignClick(id: string, e: MouseEvent) {
    e.stopPropagation()
    this.activeMenu.set(null)
    this.signDocument.emit(id)
  }

  onVerifyClick(id: string, e: MouseEvent) {
    e.stopPropagation()
    this.activeMenu.set(null)
    this.verifyDocument.emit(id)
  }

  get isAllSelected(): boolean {
    return this.documents.length > 0 && this.selectedIds.size === this.documents.length
  }
  get isIndeterminate(): boolean {
    return this.selectedIds.size > 0 && this.selectedIds.size < this.documents.length
  }

  fileTypeBg(ext: string): string {
    const map: Record<string, string> = {
      csv: "bg-[oklch(0.94_0.05_25)]  text-[oklch(0.48_0.14_25)]",
      xlsx: "bg-[oklch(0.92_0.07_149)] text-[oklch(0.38_0.12_149)]",
      xls: "bg-[oklch(0.92_0.07_149)] text-[oklch(0.38_0.12_149)]",
    }
    return map[ext?.toLowerCase()] ?? "bg-[oklch(0.93_0.01_240)] text-[oklch(0.45_0.02_240)]"
  }

  statusBg(status: string): string {
    switch (status) {
      case "ready":
        return "bg-[oklch(0.93_0.06_149)] text-[oklch(0.38_0.12_149)] border border-[oklch(0.85_0.08_149)]"
      case "error":
        return "bg-[oklch(0.94_0.06_25)]  text-[oklch(0.45_0.14_25)]  border border-[oklch(0.85_0.10_25)]"
      case "processing":
        return "bg-[oklch(0.94_0.06_68)]  text-[oklch(0.44_0.12_68)]  border border-[oklch(0.85_0.09_68)]"
      default:
        return "bg-background text-foreground-muted border border-border"
    }
  }

  statusDot(status: string): string {
    switch (status) {
      case "ready":
        return "bg-[oklch(0.50_0.14_149)]"
      case "error":
        return "bg-[oklch(0.55_0.16_25)]"
      case "processing":
        return "bg-[oklch(0.60_0.14_68)]"
      default:
        return "bg-foreground-muted"
    }
  }

  signingBg(status: string): string {
    switch (status) {
      case "signed":
        return "bg-[oklch(0.93_0.06_149)] text-[oklch(0.38_0.12_149)]"
      case "pending":
        return "bg-[oklch(0.94_0.06_68)]  text-[oklch(0.44_0.12_68)]"
      case "declined":
        return "bg-[oklch(0.94_0.06_25)]  text-[oklch(0.45_0.14_25)]"
      default:
        return "bg-background text-foreground-muted border border-border"
    }
  }
}
