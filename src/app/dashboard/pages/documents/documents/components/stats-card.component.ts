import { Component, Input, OnChanges, signal } from "@angular/core"
import { DocumentStats } from "@services/document.service"

interface StatItem {
  label: string
  value: string | number
  unit?: string
  subtitle: string
}

@Component({
  selector: "stats-card",
  standalone: true,
  template: `
    <div
      class="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-border border border-border
             rounded-xl overflow-hidden theme-inverse bg-background"
    >
      @for (item of displayStats(); track item.label) {
        <div class="flex flex-col gap-2 sm:gap-3 px-3.5 sm:px-5 py-3.5 sm:py-4">
          <span
            class="text-[10px] sm:text-[10.5px] font-medium uppercase tracking-[0.08em] text-foreground-muted leading-tight"
          >
            {{ item.label }}
          </span>
          <span class="text-2xl sm:text-3xl font-normal text-foreground">
            {{ item.value }}
            @if (item.unit) {
              <span class="text-sm sm:text-base text-foreground-muted">{{ item.unit }}</span>
            }
          </span>
          <span class="text-[11px] text-foreground-muted leading-tight">
            {{ item.subtitle }}
          </span>
        </div>
      }
    </div>
  `,
})
export class StatsCardComponent implements OnChanges {
  @Input() data: DocumentStats | null = null

  displayStats = signal<StatItem[]>([
    { label: "Total Documents", value: "0", subtitle: "documents uploaded" },
    { label: "Signed Documents", value: "0", subtitle: "signatures collected" },
    { label: "Pending Documents", value: "0", subtitle: "awaiting signature" },
    { label: "Storage Used", value: "0", unit: "Byte", subtitle: "space consumed" },
  ])

  ngOnChanges() {
    if (!this.data) return

    const total = this.data.total_documents
    const signed = this.data.signed_documents
    const pending = this.data.unsigned_documents
    const storage = this.data.total_storage_bytes

    const signedPct = total > 0 ? Math.round((signed / total) * 100) : 0
    const pendingPct = total > 0 ? Math.round((pending / total) * 100) : 0

    const { value: storageValue, unit: storageUnit } = this.formatBytes(storage || 0)

    this.displayStats.set([
      {
        label: "Total Documents",
        value: total || 0,
        subtitle: "documents uploaded",
      },
      {
        label: "Signed Documents",
        value: signed || 0,
        subtitle: `${signedPct}% of total`,
      },
      {
        label: "Pending Documents",
        value: pending || 0,
        subtitle: `${pendingPct}% of total`,
      },
      {
        label: "Storage Used",
        value: storageValue,
        unit: storageUnit,
        subtitle: "space consumed",
      },
    ])
  }

  private formatBytes(bytes: number): { value: string; unit: string } {
    if (bytes === 0) return { value: "0", unit: "Byte" }
    const k = 1024
    const sizes = ["Byte", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return {
      value: parseFloat((bytes / Math.pow(k, i)).toFixed(1)).toString(),
      unit: sizes[i],
    }
  }
}
