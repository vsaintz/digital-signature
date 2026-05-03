import { Component, signal, computed, HostListener, ElementRef } from "@angular/core"
import { IconComponent } from "@shared/icons/icons.component"

export type ViewMode = "grid" | "list"
export type SortKey = "name" | "modified" | "documents"

export interface Project {
  id: string
  name: string
  docCount: number
  modifiedAt: Date
  modifiedLabel: string
  accentClass: string
  pinned?: boolean
  owner: string
}

@Component({
  selector: "page-projects",
  standalone: true,
  imports: [IconComponent],
  templateUrl: "./projects.page.html",
})
export class ProjectsPage {
  viewMode = signal<ViewMode>("grid")
  sortKey = signal<SortKey>("modified")
  searchQuery = signal("")
  showNewFolder = signal(false)
  newFolderName = signal("")
  newFolderColor = signal("bg-[oklch(0.91_0.05_240)]")
  activeMenu = signal<string | null>(null)

  breadcrumbs = signal([{ label: "Projects", id: "root" }])

  readonly colorOptions = [
    { label: "Blue", bg: "bg-[oklch(0.91_0.05_240)]", dot: "oklch(0.42 0.08 240)" },
    { label: "Green", bg: "bg-[oklch(0.91_0.08_149)]", dot: "oklch(0.45 0.14 149)" },
    { label: "Amber", bg: "bg-[oklch(0.93_0.07_68)]", dot: "oklch(0.55 0.14 68)" },
    { label: "Rose", bg: "bg-[oklch(0.93_0.05_10)]", dot: "oklch(0.52 0.14 10)" },
    { label: "Slate", bg: "bg-[oklch(0.93_0.01_240)]", dot: "oklch(0.50 0.02 240)" },
    { label: "Warm", bg: "bg-[oklch(0.93_0.04_95)]", dot: "oklch(0.55 0.06 80)" },
  ]

  projects = signal<Project[]>([
    {
      id: "1",
      name: "Meridian Partners NDA",
      docCount: 7,
      modifiedAt: new Date("2026-04-27"),
      modifiedLabel: "2 hours ago",
      accentClass: "bg-[oklch(0.91_0.05_240)]",
      pinned: true,
      owner: "You",
    },
    {
      id: "2",
      name: "Q2 Vendor Contracts",
      docCount: 14,
      modifiedAt: new Date("2026-04-26"),
      modifiedLabel: "Yesterday",
      accentClass: "bg-[oklch(0.91_0.08_149)]",
      pinned: true,
      owner: "You",
    },
    {
      id: "3",
      name: "HR Onboarding Docs",
      docCount: 23,
      modifiedAt: new Date("2026-04-24"),
      modifiedLabel: "3 days ago",
      accentClass: "bg-[oklch(0.93_0.07_68)]",
      owner: "Priya Nair",
    },
    {
      id: "4",
      name: "Lumen Co. Agreements",
      docCount: 5,
      modifiedAt: new Date("2026-04-22"),
      modifiedLabel: "5 days ago",
      accentClass: "bg-[oklch(0.93_0.05_10)]",
      owner: "You",
    },
    {
      id: "5",
      name: "Annual Report 2025",
      docCount: 9,
      modifiedAt: new Date("2026-04-18"),
      modifiedLabel: "Apr 18",
      accentClass: "bg-[oklch(0.93_0.01_240)]",
      owner: "Jordan Lee",
    },
    {
      id: "6",
      name: "Legal Templates",
      docCount: 31,
      modifiedAt: new Date("2026-04-10"),
      modifiedLabel: "Apr 10",
      accentClass: "bg-[oklch(0.93_0.04_95)]",
      owner: "You",
    },
    {
      id: "7",
      name: "Client Proposals",
      docCount: 4,
      modifiedAt: new Date("2026-04-05"),
      modifiedLabel: "Apr 5",
      accentClass: "bg-[oklch(0.91_0.05_240)]",
      owner: "You",
    },
    {
      id: "8",
      name: "Compliance Archive",
      docCount: 58,
      modifiedAt: new Date("2026-03-28"),
      modifiedLabel: "Mar 28",
      accentClass: "bg-[oklch(0.91_0.08_149)]",
      owner: "Priya Nair",
    },
  ])

  recentProjects = computed(() =>
    [...this.projects()]
      .sort((a, b) => b.modifiedAt.getTime() - a.modifiedAt.getTime())
      .slice(0, 5),
  )

  filteredProjects = computed(() => {
    const q = this.searchQuery().toLowerCase().trim()
    let list = q
      ? this.projects().filter((p) => p.name.toLowerCase().includes(q))
      : [...this.projects()]

    switch (this.sortKey()) {
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "documents":
        list.sort((a, b) => b.docCount - a.docCount)
        break
      case "modified":
        list.sort((a, b) => b.modifiedAt.getTime() - a.modifiedAt.getTime())
        break
    }
    return list
  })

  constructor(private elRef: ElementRef) {}

  @HostListener("document:click")
  onDocClick() {
    this.activeMenu.set(null)
  }

  toggleMenu(id: string, event: MouseEvent) {
    event.stopPropagation()
    this.activeMenu.update((cur) => (cur === id ? null : id))
  }

  createFolder() {
    const name = this.newFolderName().trim()
    if (!name) return

    const id = Date.now().toString()
    this.projects.update((list) => [
      {
        id,
        name,
        docCount: 0,
        modifiedAt: new Date(),
        modifiedLabel: "Just now",
        accentClass: this.newFolderColor(),
        owner: "You",
      },
      ...list,
    ])

    this.newFolderName.set("")
    this.newFolderColor.set("bg-[oklch(0.91_0.05_240)]")
    this.showNewFolder.set(false)
  }

  deleteFolder(id: string) {
    this.projects.update((list) => list.filter((p) => p.id !== id))
    this.activeMenu.set(null)
  }

  togglePin(id: string) {
    this.projects.update((list) => list.map((p) => (p.id === id ? { ...p, pinned: !p.pinned } : p)))
    this.activeMenu.set(null)
  }

  openFolder(project: Project) {
    this.breadcrumbs.update((b) => [...b, { label: project.name, id: project.id }])
  }

  navigateBreadcrumb(index: number) {
    this.breadcrumbs.update((b) => b.slice(0, index + 1))
  }

  get sortOptions(): { key: SortKey; label: string }[] {
    return [
      { key: "modified", label: "Last modified" },
      { key: "name", label: "Name" },
      { key: "documents", label: "Documents" },
    ]
  }
}
