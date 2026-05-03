import { Component, OnInit, inject } from "@angular/core"
import { RouterLink } from "@angular/router"
import { AsyncPipe } from "@angular/common"

import { AuthService } from "@services/auth.service"
import { UiIconComponent } from "./components/ui-icon.component"
import { SignatureProgressComponent } from "./components/signature-progress.component"

export type ActivityIconType = "sign" | "upload" | "shared" | "locked" | "pending"
export type QuickActionType = "upload" | "sign" | "share" | "pending"

export interface StatCard {
  label: string
  value: number
  sub: string
  warnSub?: boolean
  accentColor: string
}

export interface ActivityItem {
  iconType: ActivityIconType
  iconBg: string
  iconColor: string
  title: string
  meta: string
  time: string
  badge?: { label: string; bg: string; text: string }
}

export interface RecentDoc {
  name: string
  date: string
}

export interface QuickAction {
  type: QuickActionType
  label: string
  iconBg: string
  iconColor: string
}

@Component({
  selector: "page-overview",
  standalone: true,
  imports: [RouterLink, AsyncPipe, UiIconComponent, SignatureProgressComponent],
  templateUrl: "./overview.page.html",
})
export class OverviewPage implements OnInit {
  private authService = inject(AuthService)
  user$ = this.authService.user$
  today = ""
  greeting = ""

  readonly totalDocs = 142
  readonly signedDocs = 89
  readonly pendingDocs = 14
  readonly sharedDocs = 31

  statCards: StatCard[] = []

  readonly activityItems: ActivityItem[] = [
    {
      iconType: "sign",
      iconBg: "bg-[oklch(0.91_0.05_240)]",
      iconColor: "text-[oklch(0.36_0.10_240)]",
      title: "NDA — Meridian Partners.pdf",
      meta: "Signed by Jordan Lee · via email link",
      time: "2h ago",
      badge: {
        label: "Signed",
        bg: "bg-[oklch(0.93_0.06_149)]",
        text: "text-[oklch(0.38_0.12_149)]",
      },
    },
    {
      iconType: "shared",
      iconBg: "bg-[oklch(0.94_0.06_68)]",
      iconColor: "text-[oklch(0.44_0.12_68)]",
      title: "Q2 Contract Review.docx",
      meta: "Shared by Priya Nair with the team",
      time: "4h ago",
      badge: {
        label: "Shared",
        bg: "bg-[oklch(0.91_0.05_240)]",
        text: "text-[oklch(0.36_0.10_240)]",
      },
    },
    {
      iconType: "pending",
      iconBg: "bg-[oklch(0.94_0.05_68)]",
      iconColor: "text-[oklch(0.44_0.12_68)]",
      title: "Vendor Agreement — Lumen Co.",
      meta: "Sent to 2 signatories · awaiting response",
      time: "Yesterday",
      badge: {
        label: "Pending",
        bg: "bg-[oklch(0.94_0.07_68)]",
        text: "text-[oklch(0.42_0.12_68)]",
      },
    },
    {
      iconType: "upload",
      iconBg: "bg-[oklch(0.93_0.06_149)]",
      iconColor: "text-[oklch(0.38_0.12_149)]",
      title: "Annual_Report_2025_Final.pdf",
      meta: "Uploaded to My Documents",
      time: "Yesterday",
    },
    {
      iconType: "locked",
      iconBg: "bg-[oklch(0.94_0.005_95)]",
      iconColor: "text-[oklch(0.40_0_0)]",
      title: "Employment Contract — S. Walsh",
      meta: "Document locking applied by you",
      time: "2 days ago",
      badge: { label: "Locked", bg: "bg-[oklch(0.93_0.005_95)]", text: "text-[oklch(0.38_0_0)]" },
    },
  ]

  readonly recentDocs: RecentDoc[] = [
    { name: "NDA — Meridian Partners.pdf", date: "Apr 27" },
    { name: "Q2 Contract Review.docx", date: "Apr 26" },
    { name: "Annual_Report_2025_Final.pdf", date: "Apr 25" },
    { name: "Vendor Agreement — Lumen Co.pdf", date: "Apr 23" },
    { name: "Employment Contract — S. Walsh.pdf", date: "Apr 21" },
  ]

  readonly quickActions: QuickAction[] = [
    {
      type: "upload",
      label: "Upload a document",
      iconBg: "bg-[oklch(0.92_0.06_149)]",
      iconColor: "text-[oklch(0.38_0.12_149)]",
    },
    {
      type: "sign",
      label: "Request a signature",
      iconBg: "bg-[oklch(0.91_0.05_240)]",
      iconColor: "text-[oklch(0.36_0.10_240)]",
    },
    {
      type: "share",
      label: "Share with team",
      iconBg: "bg-[oklch(0.93_0.06_68)]",
      iconColor: "text-[oklch(0.44_0.12_68)]",
    },
    {
      type: "pending",
      label: "View pending signatures",
      iconBg: "bg-[oklch(0.93_0.05_30)]",
      iconColor: "text-[oklch(0.46_0.12_30)]",
    },
  ]

  ngOnInit(): void {
    const now = new Date()
    const hour = now.getHours()

    this.today = now.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })

    this.greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"

    this.statCards = [
      {
        label: "Total Documents",
        value: this.totalDocs,
        sub: "+8 this month",
        accentColor: "bg-[oklch(0.42_0.08_240)]",
      },
      {
        label: "Signed",
        value: this.signedDocs,
        sub: `${Math.round((this.signedDocs / this.totalDocs) * 100)}% completion rate`,
        accentColor: "bg-[oklch(0.55_0.14_149)]",
      },
      {
        label: "Awaiting Signature",
        value: this.pendingDocs,
        sub: "3 overdue",
        warnSub: true,
        accentColor: "bg-[oklch(0.68_0.13_68)]",
      },
      {
        label: "Shared With Me",
        value: this.sharedDocs,
        sub: "from 6 team members",
        accentColor: "bg-[oklch(0.70_0.04_240)]",
      },
    ]
  }
}
