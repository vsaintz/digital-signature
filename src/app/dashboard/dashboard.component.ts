import { Component } from "@angular/core"
import { RouterOutlet } from "@angular/router"

import { SidebarComponent } from "@dashboard/components/sidebar.component"

@Component({
  selector: "app-dashboard",
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: "./dashboard.component.html",
})
export class DashboardComponent {}
