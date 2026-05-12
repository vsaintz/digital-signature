import { Component } from "@angular/core"

@Component({
  selector: "app-footer",
  standalone: true,
  imports: [],
  template: `
    <footer
      class="w-full theme-inverse bg-(--background) text-(--foreground) border-t border-(--border) py-12"
    >
      <div class="w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-24">
          <div class="col-span-1 md:col-span-1">
            <h2 class="text-xl font-semibold mb-4 theme-inverse text-(--foreground)">
              DocuSign Pro.
            </h2>
            <p class="text-sm leading-relaxed theme-inverse text-(--foreground-muted)">
              Open-source cryptographic document signing with RSA-PSS signatures, audit trails, and
              tamper detection. Built for integrity and transparency.
            </p>
          </div>

          @for (group of footerGroups; track group.section) {
            <div class="flex flex-col gap-4">
              <h3 class="text-xs font-semibold uppercase tracking-widest">{{ group.section }}</h3>
              @for (link of group.links; track link.title) {
                <a
                  href="{{ link.link }}"
                  class="w-fit text-sm theme-inverse text-(--foreground-muted) hover:text-accent transition-colors"
                >
                  {{ link.title }}
                </a>
              }
            </div>
          }
          <div class="flex flex-col gap-4">
            <h3 class="text-xs font-semibold uppercase tracking-widest">Status</h3>
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-(--status)"></span>
              <span class="text-sm">All Systems Operational</span>
            </div>
          </div>
        </div>

        <div
          class="pt-8 theme-inverse border-t border-(--border) flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p class="text-xs">
            &copy; 2026 DocuSign Pro. Open source under
            <a href="/">
              <span class="underline underline-offset-2 cursor-pointer">MIT License.</span>
            </a>
          </p>
          <div class="flex gap-6">
            <a href="https://github.com/vsaintz/digital-signature" class="text-xs hover:text-accent"
              >GitHub</a
            >
            <a
              href="https://github.com/vsaintz/digital-signature/discussions"
              class="text-xs hover:text-accent"
              >Discussions</a
            >
            <a
              href="https://github.com/vsaintz/digital-signature/security"
              class="text-xs hover:text-accent"
              >Security</a
            >
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  footerGroups = [
    {
      section: "Product",
      links: [
        { title: "Features", link: "/features" },
        { title: "Security", link: "/docs/security" },
        { title: "Verification", link: "/features/verification" },
        { title: "Self-Hosting", link: "/docs/self-hosting" },
      ],
    },
    {
      section: "Developers",
      links: [
        { title: "Documentation", link: "/docs" },
        { title: "API Reference", link: "/docs/api" },
        { title: "GitHub", link: "https://github.com/vsaintz/digital-signature" },
        { title: "Changelog", link: "/changelog" },
      ],
    },
  ]
}
