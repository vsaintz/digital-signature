import { Routes } from "@angular/router"
import { SigninComponent } from "@auth/signin/signin.component"
import { SignupComponent } from "@auth/signup/signup.component"
import { LandingComponent } from "@landing/landing.component"
import { DashboardComponent } from "@dashboard/dashboard.component"

import { OverviewPage } from "@dashboard/pages/overview/overview.page"
import { ProjectsPage } from "@dashboard/pages/overview/projects.page"
import { DocumentsPage } from "@dashboard/pages/documents/documents.page"
import { SignaturesPage } from "@dashboard/pages/documents/signatures.page"
import { SharedPage } from "@dashboard/pages/workspace/shared.page"
import { TeamPage } from "@dashboard/pages/workspace/team.page"
import { SettingsPage } from "@dashboard/pages/configuration/settings.page"

export const routes: Routes = [
  {
    path: "",
    redirectTo: "/landing",
    pathMatch: "full",
  },
  {
    path: "auth",
    children: [
      { path: "signin", component: SigninComponent },
      { path: "signup", component: SignupComponent },
    ],
  },
  {
    path: "landing",
    component: LandingComponent,
  },
  {
    path: "dashboard",
    component: DashboardComponent,
    children: [
      {
        path: "",
        redirectTo: "overview",
        pathMatch: "full",
      },
      {
        path: "overview",
        children: [
          { path: "", component: OverviewPage },
          { path: "projects", component: ProjectsPage },
        ],
      },
      {
        path: "documents",
        children: [
          { path: "", component: DocumentsPage },
          { path: "signatures", component: SignaturesPage },
        ],
      },
      {
        path: "workspace",
        children: [
          { path: "shared", component: SharedPage },
          { path: "team", component: TeamPage },
        ],
      },
      {
        path: "configuration",
        children: [{ path: "settings", component: SettingsPage }],
      },
    ],
  },
]
