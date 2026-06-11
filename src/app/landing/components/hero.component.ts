import { Component } from "@angular/core"
import { IconComponent } from "@shared/icons/icons.component"

@Component({
  selector: "app-hero",
  imports: [IconComponent],
  standalone: true,
  template: `
    <div class="w-full flex flex-col items-center justify-center py-24 px-10">
      <div class="max-w-5xl flex flex-col items-center text-center mb-16">
        <h1 class="text-7xl md:text-8xl font-bold tracking-tighter leading-tight mb-8">
          Cryptographic Integrity. <br />
          <span class="text-accent">Simplified</span> Workflow
        </h1>
        <div class="max-w-2xl mb-8">
          <p class="text-xl text-foreground-muted leading-relaxed">
            Secure your documents with a deterministic signature engine designed for absolute data
            consistency and permanent audit trails.
          </p>
        </div>
        <div class="theme-inverse flex gap-5">
          <a
            href="/verification"
            class="flex items-center gap-1.5 py-3 px-4 theme-inverse bg-(--background) text-(--foreground) text-sm font-medium rounded-lg cursor-pointer"
          >
            Verify Signature <app-icon name="ArrowUpRight" [size]="18" />
          </a>
          <a
            href="/dashboard"
            class="flex items-center gap-1.5 py-3 px-4 theme-inverse bg-(--background-subtle) text-foreground text-sm font-medium rounded-lg cursor-pointer"
          >
            <app-icon name="Files" [size]="18" /> Learn more
          </a>
        </div>
      </div>
      <div
        class="relative w-full max-w-7xl rounded-3xl border border-border shadow-2xl backdrop-blur-sm"
      >
        <img
          src="/1b625e595b8c7db5d8eb8a99392d56b7.png"
          class="rounded-3xl w-full h-190 object-cover"
          alt="Hero Image"
        />
      </div>
    </div>
  `,
})
export class HeroComponent {}
