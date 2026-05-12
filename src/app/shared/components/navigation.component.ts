import { Component, HostListener, ElementRef } from "@angular/core"
import { IconComponent } from "@shared/icons/icons.component"
import { AppIconName } from "@shared/icons/icons"

interface NavChild {
  label: string
  description: string
  link: string
  icon?: AppIconName
}

interface NavItem {
  title: string
  icon: AppIconName
  children?: NavChild[]
}

@Component({
  selector: "app-navigation",
  standalone: true,
  imports: [IconComponent],
  template: `
    <nav
      class="flex w-full items-center justify-between py-3 px-8 bg-background sticky top-0 z-100"
    >
      <div class="flex items-center">
        <span class="text-xl font-bold tracking-tight cursor-pointer">DocuSign Pro</span>
      </div>

      <div class="flex gap-1">
        @for (item of NAV_ITEMS; track item.title) {
          <div class="relative">
            <button
              type="button"
              (click)="toggleDropdown(item.title, $event)"
              [class.bg-hover-background]="activeDropdown === item.title"
              [class.text-foreground]="activeDropdown === item.title"
              class="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-foreground-muted hover:text-foreground hover:bg-hover-background rounded-lg transition-all duration-200 cursor-pointer group"
            >
              {{ item.title }}
              <app-icon
                [name]="item.icon"
                [size]="14"
                class="opacity-40 transition-transform duration-300 group-hover:opacity-100"
                [class.rotate-180]="activeDropdown === item.title"
              />
            </button>

            @if (item.children && activeDropdown === item.title) {
              <div
                class="absolute top-full left-0 mt-3 w-80 bg-background-subtle border border-border rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-50 p-2 overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200"
              >
                <div class="grid gap-1">
                  @for (child of item.children; track child.label) {
                    <a
                      [href]="child.link"
                      class="group flex items-start gap-4 p-3 rounded-xl hover:bg-hover-background transition-all border border-transparent hover:border-border/50"
                    >
                      <div
                        class="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-hover-background group-hover:bg-accent/10 transition-colors"
                      >
                        <app-icon
                          [name]="'ChevronDown'"
                          [size]="14"
                          class="text-accent opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </div>

                      <div class="flex flex-col">
                        <span
                          class="text-sm font-medium text-foreground group-hover:text-accent transition-colors"
                        >
                          {{ child.label }}
                        </span>
                        <span class="text-xs text-foreground-muted mt-0.5 leading-relaxed">
                          {{ child.description }}
                        </span>
                      </div>
                    </a>
                  }
                </div>

                <div class="mt-2 border-t border-border p-3 bg-hover-background/30 rounded-b-xl">
                  <a
                    href="#"
                    class="text-[11px] font-bold uppercase tracking-widest text-accent hover:underline"
                    >View All Updates</a
                  >
                </div>
              </div>
            }
          </div>
        }
      </div>

      <div class="flex items-center gap-4 text-sm">
        <button
          class="px-4 py-2 text-foreground-muted hover:text-foreground font-medium transition-colors cursor-pointer"
        >
          Contact
        </button>
        <a href="/auth/signin">
          <button
            class="theme-inverse bg-(--background) text-(--foreground) px-6 py-2.5 rounded-lg font-medium cursor-pointer"
          >
            Sign In
          </button>
        </a>
      </div>
    </nav>
  `,
})
export class NavigationComponent {
  activeDropdown: string | null = null

  readonly NAV_ITEMS: NavItem[] = [
    {
      title: "Documentation",
      icon: "ChevronDown",
      children: [
        {
          label: "Quick Start",
          description: "Get started with Digital Signature in under 5 minutes.",
          link: "/docs/quickstart",
        },
        {
          label: "Architecture",
          description: "Technical overview of the cryptographic system.",
          link: "/docs/architecture",
        },
        {
          label: "API Reference",
          description: "Complete REST API documentation and examples.",
          link: "/docs/api",
        },
        {
          label: "Security Model",
          description: "How signatures, verification, and auditing work.",
          link: "/docs/security",
        },
      ],
    },
    {
      title: "Features",
      icon: "ChevronDown",
      children: [
        {
          label: "Digital Signatures",
          description: "RSA-PSS cryptographic signing for documents.",
          link: "/features/signing",
        },
        {
          label: "Verification",
          description: "Instant tamper detection and integrity checks.",
          link: "/features/verification",
        },
        {
          label: "Audit Trail",
          description: "Complete historical tracking of all changes.",
          link: "/features/audit",
        },
        {
          label: "File Support",
          description: "CSV and Excel with flexible schema handling.",
          link: "/features/formats",
        },
      ],
    },
    {
      title: "Resources",
      icon: "ChevronDown",
      children: [
        {
          label: "GitHub",
          description: "View source, report issues, and contribute.",
          link: "https://github.com/vsaintz/digital-signature",
        },
        {
          label: "Changelog",
          description: "Version history and release notes.",
          link: "/changelog",
        },
        {
          label: "Self-Hosting Guide",
          description: "Deploy on your own infrastructure.",
          link: "/docs/self-hosting",
        },
        {
          label: "License",
          description: "MIT License - use freely in any project.",
          link: "/license",
        },
      ],
    },
  ]

  constructor(private el: ElementRef) {}

  toggleDropdown(title: string, event: Event) {
    event.stopPropagation()
    this.activeDropdown = this.activeDropdown === title ? null : title
  }

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: Event) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.activeDropdown = null
    }
  }
}
