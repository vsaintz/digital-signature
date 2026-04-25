import { Component, signal } from "@angular/core"
import { Router, RouterLink, RouterLinkActive } from "@angular/router"
import { AuthService } from "@services/auth.service"

import { UserProfileComponent } from "@dashboard/components/user-profile.component"
import { AppIconName } from "@shared/icons/icons"
import { IconComponent } from "@shared/icons/icons.component"

interface NavItem {
  title: string
  path: string
  icon: AppIconName
}

interface NavGroup {
  section: string
  links: NavItem[]
  isExpanded: boolean
}

@Component({
  selector: "dash-sidebar",
  standalone: true,
  imports: [RouterLink, RouterLinkActive, UserProfileComponent, IconComponent],
  templateUrl: "./sidebar.component.html",
})
export class SidebarComponent {
  showCreateNewOptions = signal(false)
  navGroups: NavGroup[] = [
    {
      section: "Overview",
      isExpanded: true,
      links: [
        { title: "Overview", path: "overview", icon: "Layers" },
        { title: "Projects", path: "overview/projects", icon: "FolderOpen" },
      ],
    },
    {
      section: "Documents",
      isExpanded: true,
      links: [
        { title: "My Documents", path: "documents", icon: "FileArchive" },
        { title: "Signatures", path: "documents/signatures", icon: "KeyRound" },
      ],
    },
    {
      section: "Workspace",
      isExpanded: true,
      links: [
        { title: "Shared with me", path: "workspace/shared", icon: "Users" },
        { title: "Team People", path: "workspace/team", icon: "BicepsFlexed" },
      ],
    },
    {
      section: "Configuration",
      isExpanded: true,
      links: [
        {
          title: "Verification Status",
          path: "configuration/verificationstatus",
          icon: "ShieldAlert",
        },
        { title: "Document Locking", path: "configuration/documentlocking", icon: "Lock" },
        { title: "Billing", path: "configuration/billing", icon: "BadgeIndianRupee" },
        { title: "Settings", path: "configuration/settings", icon: "Settings" },
      ],
    },
  ]

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  toggleGroup(group: NavGroup) {
    group.isExpanded = !group.isExpanded
  }

  handleSignOut() {
    this.authService.signout()
    this.router.navigate(["/auth/signin"])
  }
}
