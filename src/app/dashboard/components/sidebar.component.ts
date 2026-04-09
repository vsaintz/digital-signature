import { Component } from "@angular/core"
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
  imports: [UserProfileComponent, IconComponent, RouterLink, RouterLinkActive],
  template: `
    <aside class="w-full h-full flex flex-col p-4">
      <div class="mb-10 px-2">
        <dash-userprofile />
      </div>
      <nav class="flex-1 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
        @for (group of navGroups; track group.section) {
          <div class="flex flex-col">
            <div
              (click)="toggleGroup(group)"
              class="group flex items-center justify-between px-2 py-2 cursor-pointer rounded-md hover:bg-muted/50 transition-colors"
            >
              <h3 class="text-[11px] text-foreground-muted uppercase tracking-wider">
                {{ group.section }}
              </h3>
              <app-icon
                [name]="'ChevronDown'"
                [size]="14"
                class="text-foreground-muted transition-transform duration-200"
                [class.rotate-[-90deg]]="!group.isExpanded"
              />
            </div>

            @if (group.isExpanded) {
              <div class="mt-1 flex flex-col gap-1">
                @for (link of group.links; track link.title) {
                  <a
                    [routerLink]="link.path"
                    routerLinkActive="bg-hover-background text-foreground"
                    [routerLinkActiveOptions]="{ exact: true }"
                    class="flex items-center gap-3 px-3 py-2 text-sm text-foreground-muted font-normal
                    rounded-lg transition-all hover:bg-hover-background hover:text-foreground
                    group/link"
                  >
                    <app-icon [name]="link.icon" [size]="18" />
                    {{ link.title }}
                  </a>
                }
              </div>
            }
          </div>
        }
      </nav>
      <div class="pt-4 border-t border-border">
        <button
          (click)="handleSignOut()"
          class="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-foreground-muted rounded-lg hover:bg-hover-background hover:text-foreground"
        >
          <app-icon name="LogOut" [size]="18" />
          Log out
        </button>
      </div>
    </aside>
  `,
})
export class SidebarComponent {
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
        { title: "Documents", path: "documents", icon: "File" },
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
