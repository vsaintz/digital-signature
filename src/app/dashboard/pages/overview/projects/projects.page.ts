import { Component, signal, computed, OnInit, OnDestroy, PLATFORM_ID, Inject } from "@angular/core"
import { isPlatformBrowser } from "@angular/common"
import { forkJoin } from "rxjs"
import { ProjectService, ProjectDTO } from "@services/project.service"
import { DocumentService, Document as DocumentModel } from "@services/document.service"
import { IconComponent } from "@shared/icons/icons.component"
import { SvgFolderIconComponent } from "./components/icons/svg-folder-icon.component"
import { SvgEmptyStateComponent } from "./components/icons/svg-emptystate-icon.component"

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

const THEMES = [
  {
    label: "Blue",
    bg: "bg-[oklch(0.91_0.05_240)]",
    stroke: "oklch(0.55 0.07 240)",
    fill: "oklch(0.91 0.05 240 / 0.45)",
  },
  {
    label: "Sand",
    bg: "bg-[oklch(0.94_0.04_55)]",
    stroke: "oklch(0.63 0.10 52)",
    fill: "oklch(0.94 0.04 55 / 0.45)",
  },
  {
    label: "Terra",
    bg: "bg-[oklch(0.93_0.05_35)]",
    stroke: "oklch(0.61 0.11 32)",
    fill: "oklch(0.93 0.05 35 / 0.45)",
  },
  {
    label: "Honey",
    bg: "bg-[oklch(0.93_0.04_75)]",
    stroke: "oklch(0.64 0.10 78)",
    fill: "oklch(0.93 0.04 75 / 0.45)",
  },
  {
    label: "Clay",
    bg: "bg-[oklch(0.93_0.03_20)]",
    stroke: "oklch(0.60 0.08 18)",
    fill: "oklch(0.93 0.03 20 / 0.45)",
  },
  {
    label: "Moss",
    bg: "bg-[oklch(0.93_0.03_100)]",
    stroke: "oklch(0.62 0.08 103)",
    fill: "oklch(0.93 0.03 100 / 0.45)",
  },
  {
    label: "Sage",
    bg: "bg-[oklch(0.93_0.02_200)]",
    stroke: "oklch(0.59 0.05 200)",
    fill: "oklch(0.93 0.02 200 / 0.45)",
  },
]

const COLOR_MAP = new Map(THEMES.map((t) => [t.bg, t]))

@Component({
  selector: "page-projects",
  standalone: true,
  imports: [IconComponent, SvgFolderIconComponent, SvgEmptyStateComponent],
  templateUrl: "./projects.page.html",
})
export class ProjectsPage implements OnInit, OnDestroy {
  viewMode = signal<ViewMode>("grid")
  sortKey = signal<SortKey>("modified")
  searchQuery = signal("")
  showNewFolder = signal(false)
  newFolderName = signal("")
  newFolderColor = signal(THEMES[0].bg)
  activeMenu = signal<string | null>(null)
  lastOpenedMap = signal<Map<string, number>>(new Map())
  isLoading = signal(true)
  error = signal<string | null>(null)

  openFolderId = signal<string | null>(null)

  showRenameModal = signal(false)
  renamingProject = signal<Project | null>(null)
  renameValue = signal("")
  renameError = signal<string | null>(null)

  allDocuments = signal<DocumentModel[]>([])
  docsLoading = signal(false)
  showAddDocModal = signal(false)
  addDocError = signal<string | null>(null)

  removingDocIds = signal<Set<string>>(new Set())

  readonly colorOptions = THEMES

  readonly sortOptions: { key: SortKey; label: string }[] = [
    { key: "modified", label: "Last modified" },
    { key: "name", label: "Name" },
    { key: "documents", label: "Documents" },
  ]

  projects = signal<Project[]>([])

  openProject = computed(() => {
    const id = this.openFolderId()
    if (!id) return null
    return this.projects().find((p) => p.id === id) ?? null
  })

  folderDocuments = computed(() => {
    const id = this.openFolderId()
    if (!id) return []
    return this.allDocuments().filter((d) => d.project === id)
  })

  unassignedDocuments = computed(() => {
    return this.allDocuments().filter((d) => !d.project)
  })

  recentProjects = computed(() => {
    const openedMap = this.lastOpenedMap()
    return [...this.projects()]
      .filter((p) => openedMap.has(p.id))
      .sort((a, b) => (openedMap.get(b.id) ?? 0) - (openedMap.get(a.id) ?? 0))
      .slice(0, 5)
  })

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

  private readonly isBrowser: boolean
  private readonly onDocClick = () => this.activeMenu.set(null)

  private readonly onPopState = (event: PopStateEvent) => {
    const folderId = event.state?.folderId ?? null
    this.openFolderId.set(folderId)
  }

  constructor(
    private projectService: ProjectService,
    private documentService: DocumentService,
    @Inject(PLATFORM_ID) platformId: object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId)
  }

  ngOnInit() {
    if (this.isBrowser) {
      document.addEventListener("click", this.onDocClick)
      window.addEventListener("popstate", this.onPopState)
      history.replaceState({ folderId: null }, "")
    }

    forkJoin({
      projects: this.projectService.list(),
      documents: this.documentService.getDocuments(),
    }).subscribe({
      next: ({ projects, documents }) => {
        this.projects.set(projects.map(ProjectsPage.toProject))
        this.allDocuments.set(documents)
        this.isLoading.set(false)
      },
      error: () => {
        this.error.set("Failed to load data. Please refresh.")
        this.isLoading.set(false)
      },
    })
  }

  ngOnDestroy() {
    if (this.isBrowser) {
      document.removeEventListener("click", this.onDocClick)
      window.removeEventListener("popstate", this.onPopState)
    }
  }

  toggleMenu(id: string, event: MouseEvent) {
    event.stopPropagation()
    this.activeMenu.update((cur) => (cur === id ? null : id))
  }

  openFolder(project: Project) {
    this.openFolderId.set(project.id)
    this.activeMenu.set(null)
    this.lastOpenedMap.update((map) => new Map(map).set(project.id, Date.now()))
    if (this.isBrowser) {
      history.pushState({ folderId: project.id }, "")
    }
  }

  closeFolder() {
    this.openFolderId.set(null)
    if (this.isBrowser) {
      history.pushState({ folderId: null }, "")
    }
  }

  createFolder() {
    const name = this.newFolderName().trim()
    if (!name) return

    const duplicate = this.projects().some((p) => p.name.toLowerCase() === name.toLowerCase())
    if (duplicate) {
      this.error.set(`A folder named "${name}" already exists.`)
      return
    }

    this.projectService.create({ name, color: this.newFolderColor() }).subscribe({
      next: (dto) => {
        this.projects.update((list) => [ProjectsPage.toProject(dto), ...list])
        this.newFolderName.set("")
        this.newFolderColor.set(THEMES[0].bg)
        this.showNewFolder.set(false)
        this.error.set(null)
      },
      error: (err) => {
        const detail = err?.error?.name?.[0] ?? err?.error?.detail ?? null
        this.error.set(detail ?? "Failed to create folder. Please try again.")
      },
    })
  }

  deleteFolder(id: string) {
    this.projectService.delete(id).subscribe({
      next: () => {
        this.projects.update((list) => list.filter((p) => p.id !== id))
        this.allDocuments.update((docs) =>
          docs.map((d) => (d.project === id ? { ...d, project: null } : d)),
        )
        this.activeMenu.set(null)
        if (this.openFolderId() === id) this.openFolderId.set(null)
      },
      error: () => {
        this.error.set("Failed to delete folder. Please try again.")
      },
    })
  }

  togglePin(id: string) {
    const project = this.projects().find((p) => p.id === id)
    if (!project) return

    this.projectService.update(id, { pinned: !project.pinned }).subscribe({
      next: (dto) => {
        this.projects.update((list) =>
          list.map((p) => (p.id === id ? ProjectsPage.toProject(dto) : p)),
        )
        this.activeMenu.set(null)
      },
      error: () => {
        this.error.set("Failed to update folder. Please try again.")
      },
    })
  }

  openRenameModal(project: Project, event: MouseEvent) {
    event.stopPropagation()
    this.renamingProject.set(project)
    this.renameValue.set(project.name)
    this.renameError.set(null)
    this.showRenameModal.set(true)
    this.activeMenu.set(null)
  }

  submitRename() {
    const project = this.renamingProject()
    const newName = this.renameValue().trim()
    if (!project || !newName) return

    if (newName.toLowerCase() === project.name.toLowerCase()) {
      this.showRenameModal.set(false)
      return
    }

    const duplicate = this.projects().some(
      (p) => p.id !== project.id && p.name.toLowerCase() === newName.toLowerCase(),
    )
    if (duplicate) {
      this.renameError.set(`A folder named "${newName}" already exists.`)
      return
    }

    this.projectService.update(project.id, { name: newName }).subscribe({
      next: (dto) => {
        this.projects.update((list) =>
          list.map((p) => (p.id === project.id ? ProjectsPage.toProject(dto) : p)),
        )
        this.showRenameModal.set(false)
        this.renamingProject.set(null)
        this.renameError.set(null)
      },
      error: (err) => {
        const detail = err?.error?.name?.[0] ?? err?.error?.detail ?? null
        this.renameError.set(detail ?? "Failed to rename folder. Please try again.")
      },
    })
  }

  closeRenameModal() {
    this.showRenameModal.set(false)
    this.renamingProject.set(null)
    this.renameError.set(null)
  }

  openAddDocModal(event?: MouseEvent) {
    event?.stopPropagation()
    this.addDocError.set(null)
    this.showAddDocModal.set(true)
  }

  addDocumentToFolder(doc: DocumentModel) {
    const folderId = this.openFolderId()
    if (!folderId) return

    this.projectService.addDocument(folderId, doc.id).subscribe({
      next: () => {
        this.allDocuments.update((docs) =>
          docs.map((d) => (d.id === doc.id ? { ...d, project: folderId } : d)),
        )
        this.projects.update((list) =>
          list.map((p) => (p.id === folderId ? { ...p, docCount: p.docCount + 1 } : p)),
        )
        this.showAddDocModal.set(false)
        this.addDocError.set(null)
      },
      error: () => {
        this.addDocError.set("Failed to add document. Please try again.")
      },
    })
  }

  removeDocumentFromFolder(doc: DocumentModel) {
    const folderId = this.openFolderId()
    if (!folderId) return

    this.removingDocIds.update((ids) => new Set(ids).add(doc.id))

    this.projectService.removeDocument(doc.id).subscribe({
      next: () => {
        this.allDocuments.update((docs) =>
          docs.map((d) => (d.id === doc.id ? { ...d, project: null } : d)),
        )
        this.projects.update((list) =>
          list.map((p) =>
            p.id === folderId ? { ...p, docCount: Math.max(0, p.docCount - 1) } : p,
          ),
        )
        this.removingDocIds.update((ids) => {
          const next = new Set(ids)
          next.delete(doc.id)
          return next
        })
      },
      error: () => {
        this.error.set("Failed to remove document. Please try again.")
        this.removingDocIds.update((ids) => {
          const next = new Set(ids)
          next.delete(doc.id)
          return next
        })
      },
    })
  }

  getFolderColor(accentClass: string): string {
    return (COLOR_MAP.get(accentClass) ?? THEMES[0]).stroke
  }

  getFolderBgColor(accentClass: string): string {
    return (COLOR_MAP.get(accentClass) ?? THEMES[0]).fill
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  dismissError() {
    this.error.set(null)
  }

  static toProject(dto: ProjectDTO): Project {
    return {
      id: dto.id,
      name: dto.name,
      docCount: dto.doc_count,
      modifiedAt: new Date(dto.updated_at),
      modifiedLabel: ProjectsPage.formatRelative(new Date(dto.updated_at)),
      accentClass: dto.color,
      pinned: dto.pinned,
      owner: "You",
    }
  }

  static formatRelative(date: Date): string {
    const diff = Date.now() - date.getTime()
    const hours = diff / 36e5
    if (hours < 1) return "Just now"
    if (hours < 24) return `${Math.floor(hours)} hours ago`
    if (hours < 48) return "Yesterday"
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" })
  }
}
