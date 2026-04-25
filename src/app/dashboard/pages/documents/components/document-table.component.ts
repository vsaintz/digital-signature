import { Component, Input, Output, EventEmitter } from "@angular/core"
import { DatePipe, NgClass } from "@angular/common"
import { Document } from "@services/document.service"

import { IconComponent } from "@shared/icons/icons.component"

@Component({
  selector: "document-table",
  standalone: true,
  imports: [DatePipe, NgClass, IconComponent],
  templateUrl: "./document-table.component.html",
})
export class DocumentTableComponent {
  @Input() documents: Document[] = []
  @Input() selectedIds = new Set<string>()
  @Output() toggleOne = new EventEmitter<string>()
  @Output() toggleAll = new EventEmitter<void>()

  get isAllSelected(): boolean {
    return this.documents.length > 0 && this.selectedIds.size === this.documents.length
  }

  get isIndeterminate(): boolean {
    return this.selectedIds.size > 0 && this.selectedIds.size < this.documents.length
  }
}
