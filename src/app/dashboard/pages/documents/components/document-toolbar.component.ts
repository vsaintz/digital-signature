import { Component, Input, Output, EventEmitter } from "@angular/core"
import { IconComponent } from "@shared/icons/icons.component"

@Component({
  selector: "document-toolbar",
  standalone: true,
  imports: [IconComponent],
  templateUrl: "./document-toolbar.component.html",
})
export class DocumentToolbarComponent {
  @Input() totalCount = 0
  @Input() selectedCount = 0
  @Output() clearSelection = new EventEmitter<void>()
}
