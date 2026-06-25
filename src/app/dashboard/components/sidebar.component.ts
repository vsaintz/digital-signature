import { Component, signal, HostListener, ElementRef, inject } from "@angular/core"
import { Router, RouterLink, RouterLinkActive } from "@angular/router"
import { AsyncPipe } from "@angular/common"

import { AuthService } from "@services/auth.service"
import { AppIconName } from "@shared/icons/icons"
import { IconComponent } from "@shared/icons/icons.component"

import { SvgSitelogoComponent } from "@shared/icons/svg-sitelogo.component"

interface NavItem {
  title: string
  path: string
  icon: AppIconName
}

interface NavGroup {
  section: string
  links: NavItem[]
  isExpanded: boolean
  isAdmin?: boolean
}

@Component({
  selector: "dash-sidebar",
  standalone: true,
  imports: [RouterLink, RouterLinkActive, IconComponent, AsyncPipe, SvgSitelogoComponent],
  templateUrl: "./sidebar.component.html",
})
export class SidebarComponent {
  private authService = inject(AuthService)
  showCreateModal = signal(false)
  showUserPopover = signal(false)
  mobileOpen = signal(false)

  user$ = this.authService.user$

  navGroups: NavGroup[] = [
    {
      section: "Overview",
      isExpanded: true,
      links: [
        { title: "Overview", path: "overview", icon: "LayoutGrid" },
        { title: "Projects", path: "overview/projects", icon: "Presentation" },
      ],
    },
    {
      section: "Documents",
      isExpanded: true,
      links: [
        { title: "My Documents", path: "documents", icon: "FileText" },
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
        { title: "Verification", path: "configuration/verificationstatus", icon: "ShieldAlert" },
        { title: "Doc Locking", path: "configuration/documentlocking", icon: "Lock" },
        { title: "Billing", path: "configuration/billing", icon: "BadgeIndianRupee" },
        { title: "Settings", path: "configuration/settings", icon: "Settings" },
      ],
    },

    {
      section: "Administration",
      isExpanded: true,
      isAdmin: true,
      links: [
        { title: "System Overview", path: "admin/overview", icon: "LayoutGrid" },
        { title: "Manage Users", path: "admin/users", icon: "Users" },
        { title: "Manage Documents", path: "admin/documents", icon: "FileText" },
        { title: "Security & Audit Logs", path: "admin/audit", icon: "ShieldCheck" },
      ],
    },
  ]

  constructor(
    private router: Router,
    private elRef: ElementRef,
  ) {}

  toggleGroup(group: NavGroup): void {
    group.isExpanded = !group.isExpanded
  }

  toggleUserPopover(event: MouseEvent): void {
    event.stopPropagation()
    this.showUserPopover.update((v) => !v)
  }

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.showUserPopover.set(false)
    }
  }

  handleSignOut(): void {
    this.showUserPopover.set(false)
    this.authService.signout().subscribe({
      next: () => this.router.navigate(["/auth/signin"]),
      error: () => this.router.navigate(["/auth/signin"]),
    })
  }

  navigateTo(path: string): void {
    this.showUserPopover.set(false)
    this.router.navigate([path])
  }

  closeMobile(): void {
    this.mobileOpen.set(false)
  }

  getInitials(firstName: string, lastName: string): string {
    const first = firstName?.charAt(0) ?? ""
    const last = lastName?.charAt(0) ?? ""
    return (first + last).toUpperCase() || "US"
  }
}
