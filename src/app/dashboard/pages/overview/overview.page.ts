import { Component } from "@angular/core"
import { FileUploadComponent } from "@dashboard/components/file-upload.component"

@Component({
  selector: "page-overview",
  standalone: true,
  imports: [FileUploadComponent],
  template: `
    <div class="w-full h-full flex items-center justify-center">
      <div class="min-w-3xl">
        <dash-file-upload />
      </div>
    </div>
  `,
})
export class OverviewPage {}
