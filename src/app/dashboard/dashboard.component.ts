import { Component, ViewChild } from "@angular/core"
import { RouterOutlet } from "@angular/router"

import { IconComponent } from "@shared/icons/icons.component"
import { SidebarComponent } from "@dashboard/components/sidebar.component"

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, IconComponent],
  templateUrl: "./dashboard.component.html",
})
export class DashboardComponent {
  @ViewChild(SidebarComponent) sidebar!: SidebarComponent
}
