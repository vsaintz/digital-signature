import { HttpInterceptorFn } from "@angular/common/http"
import { inject, PLATFORM_ID } from "@angular/core"
import { isPlatformBrowser } from "@angular/common"
import { AuthService } from "@services/auth.service"

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID)

  if (!isPlatformBrowser(platformId)) {
    return next(req)
  }

  const authService = inject(AuthService)
  const token = authService.getAccessToken()

  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    })
  }

  return next(req)
}
