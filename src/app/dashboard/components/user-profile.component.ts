import { Component } from "@angular/core"

@Component({
  selector: "dash-userprofile",
  standalone: true,
  template: `
    <div class="flex items-center gap-3">
      <div class="relative w-11 h-11 shrink-0">
        <img
          src="/b75b29441bbd967deda4365441497221.jpg"
          alt="Profile Picture"
          class="w-full h-full object-cover rounded-xl ring-1 ring-border"
        />
        <div
          class="absolute -bottom-1 -right-1 w-3 h-3 bg-status border-2 border-background rounded-full"
        ></div>
      </div>

      <div class="flex flex-col min-w-0">
        <span class="text-sm font-semibold truncate">{{ profile.fullName }}</span>
        <span class="text-xs text-foreground-muted truncate">{{ profile.email }}</span>
      </div>
    </div>
  `,
})
export class UserProfileComponent {
  profile = {
    fullName: "Example User",
    email: "exampleuser@dsa.com",
  }
}
