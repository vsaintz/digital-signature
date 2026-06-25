import { inject } from "@angular/core"
import { Router, Routes } from "@angular/router"

import { authGuard } from "@guards/auth.guard"
import { guestGuard } from "@guards/guest.guard"
import { adminGuard } from "@guards/admin.guard"

import { AuthService } from "@services/auth.service"

import { SigninComponent } from "@auth/signin/signin.component"
import { SignupComponent } from "@auth/signup/signup.component"
import { DocumentVerifyComponent } from "@verification/document-verify.component"
import { LandingComponent } from "@landing/landing.component"
import { DashboardComponent } from "@dashboard/dashboard.component"

import { OverviewPage } from "@dashboard/pages/overview/overview/overview.page"
import { ProjectsPage } from "@dashboard/pages/overview/projects/projects.page"
import { DocumentsPage } from "@dashboard/pages/documents/documents/documents.page"
import { SignaturesPage } from "@dashboard/pages/documents/signatures/signatures.page"
import { SharedPage } from "@dashboard/pages/workspace/shared.page"
import { TeamPage } from "@dashboard/pages/workspace/team.page"
import { SettingsPage } from "@dashboard/pages/configuration/settings.page"

import { AdminOverviewPage } from "@app/dashboard/pages/admin/overview/admin-overview.page"
import { AdminDocumentsPage } from "@app/dashboard/pages/admin/documents/admin-documents.page"
import { AdminUsersPage } from "@app/dashboard/pages/admin/users/admin-users.page"
import { AdminAuditPage } from "@app/dashboard/pages/admin/audit/admin-audit.page"

export const routes: Routes = [
  {
    path: "",
    redirectTo: "/landing",
    pathMatch: "full",
  },
  {
    path: "verification",
    component: DocumentVerifyComponent,
  },
  {
    path: "auth",
    canActivate: [guestGuard],
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
    canActivate: [authGuard],
    children: [
      {
        path: "",
        pathMatch: "full",
        children: [],
        canActivate: [
          () => {
            const authService = inject(AuthService)
            const router = inject(Router)

            if (authService.currentUser?.is_staff) {
              return router.createUrlTree(["/dashboard/admin/overview"])
            }
            return router.createUrlTree(["/dashboard/overview"])
          },
        ],
      },
      {
        path: "admin",
        canActivate: [adminGuard],
        children: [
          { path: "", redirectTo: "overview", pathMatch: "full" },
          { path: "overview", component: AdminOverviewPage },
          { path: "documents", component: AdminDocumentsPage },
          { path: "users", component: AdminUsersPage },
          { path: "audit", component: AdminAuditPage },
        ],
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
