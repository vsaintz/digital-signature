import { Component } from "@angular/core"

interface CardItem {
  type: string
  value: string
  stats_title: string
  stats: string
}

@Component({
  selector: "stats-card",
  standalone: true,
  template: `
    <div class="grid grid-flow-col auto-cols-fr">
      @for (items of cardItems; track items.type) {
        <div class="flex flex-col gap-2 p-5 border-r border-border last:border-r-0">
          <span class="text-foreground-muted text-sm font-medium tracking-wider">
            {{ items.type }}
          </span>
          <h1 class="text-2xl font-bold">{{ items.value }}</h1>
          <div class="flex items-center gap-2">
            <span class="text-foreground-muted text-xs font-medium"> {{ items.stats_title }} </span>
            <span
              class="px-2 py-1 text-[11px] font-medium bg-success-bg text-success-text font-mono tracking-wider"
            >
              {{ items.stats }}
            </span>
          </div>
        </div>
      }
    </div>
  `,
})
export class StatsCardComponent {
  readonly cardItems: CardItem[] = [
    {
      type: "Total Documents",
      value: "26K",
      stats_title: "via last month",
      stats: "+9 documents",
    },
    {
      type: "Signed Documents",
      value: "27,345",
      stats_title: "via last month",
      stats: "+6 signed",
    },
    {
      type: "Pending Signatures",
      value: "54",
      stats_title: "via last month",
      stats: "+4 pending",
    },
    {
      type: "Shared Files",
      value: "55K",
      stats_title: "via last month",
      stats: "+3 shared",
    },
    {
      type: "Pending Review",
      value: "10K",
      stats_title: "via last month",
      stats: "+15 pending",
    },
  ]
}
