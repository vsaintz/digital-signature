import { Component } from "@angular/core"
import { IconComponent } from "@shared/icons/icons.component"

interface StatItem {
  label: string
  value: string
  trend: string
  up: boolean
}

@Component({
  selector: "stats-card",
  standalone: true,
  imports: [IconComponent],
  template: `
    <div
      class="grid grid-cols-2 sm:grid-cols-4 divide-x divide-border border border-border
             rounded-xl overflow-hidden bg-background"
    >
      @for (item of stats; track item.label) {
        <div class="flex flex-col gap-2 sm:gap-3 px-3.5 sm:px-5 py-3.5 sm:py-4">
          <span
            class="text-[10px] sm:text-[10.5px] font-medium uppercase tracking-[0.08em] text-foreground-muted leading-tight"
          >
            {{ item.label }}
          </span>
          <span class="text-2xl sm:text-3xl font-normal text-foreground leading-none">
            {{ item.value }}
          </span>
          <div class="flex flex-wrap items-center gap-1 sm:gap-1.5">
            <span
              class="text-[10.5px] sm:text-[11px] font-light text-foreground-muted whitespace-nowrap"
              >vs last month</span
            >
            <span
              class="flex items-center gap-1 text-[10px] sm:text-[10.5px] font-medium px-1.5 py-0.5 rounded-md whitespace-nowrap
                     {{ item.up ? 'bg-success-bg text-success-text' : 'bg-error-bg text-error' }}"
            >
              @if (item.up) {
                <app-icon name="TrendingUp" [size]="12" />
              } @else {
                <app-icon name="TrendingDown" [size]="12" />
              }
              {{ item.trend }}%
            </span>
          </div>
        </div>
      }
    </div>
  `,
})
export class StatsCardComponent {
  readonly stats: StatItem[] = [
    { label: "Total Documents", value: "26K", trend: "9", up: true },
    { label: "Signed", value: "27,345", trend: "6", up: true },
    { label: "Pending Signatures", value: "54", trend: "4", up: false },
    { label: "Shared Files", value: "55K", trend: "3", up: true },
  ]
}
