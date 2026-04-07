import { Component } from "@angular/core"

@Component({
  selector: "page-shared",
  standalone: true,
  template: `
    <div class="w-full h-full flex items-center justify-center">
      <h1>Shared page works</h1>
    </div>
  `,
})
export class SharedPage {}
