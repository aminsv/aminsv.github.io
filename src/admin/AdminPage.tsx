import {
  AdminLoadingSection,
  AdminLoginSection,
  AdminLayout,
  AdminUnauthorizedSection,
} from '../components/admin'
import { useEffect } from 'react'
import { AdminAuthProvider } from './context/AdminAuthContext'
import { useAdminAuth } from './hooks/useAdminAuth'

function AdminPage() {
  const auth = useAdminAuth()

  // Ensure admin uses the same Gitfolio favicon instead of default Vite icon.
  useEffect(() => {
    const firstChar = 'G'
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
        <defs>
          <linearGradient id="grad-admin" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#22c55e;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="6" fill="url(#grad-admin)"/>
        <text x="16" y="22" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="600" fill="#020617" text-anchor="middle">${firstChar}</text>
      </svg>
    `
    const svgBlob = new Blob([svg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(svgBlob)
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.getElementsByTagName('head')[0].appendChild(link)
    }
    link.type = 'image/svg+xml'
    link.href = url
    return () => URL.revokeObjectURL(url)
  }, [auth.repoName])

  const showLogin = !auth.token || auth.viewState === 'unauthenticated'
  const showUnauthorized = Boolean(
    auth.token && auth.viewState === 'unauthorized',
  )
  const showLoading =
    Boolean(auth.token) &&
    (auth.viewState === 'checkingAuth' ||
      auth.viewState === 'authenticating' ||
      auth.viewState === 'checkingPermissions' ||
      auth.viewState === 'loadingConfig')
  const showDashboard =
    auth.token &&
    (auth.viewState === 'ready' || auth.viewState === 'saving')

  if (showLogin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6">
        <div className="w-full max-w-4xl">
          <AdminLoginSection
            isBusy={auth.isBusy}
            isAuthenticating={auth.viewState === 'authenticating'}
            errorMessage={auth.error?.message ?? null}
            onLogin={auth.handleLogin}
            deviceInfo={auth.deviceInfo}
          />
        </div>
      </div>
    )
  }

  if (showUnauthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6">
        <div className="w-full max-w-md">
          <AdminUnauthorizedSection />
        </div>
      </div>
    )
  }

  if (showLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6">
        <div className="w-full max-w-md">
          <AdminLoadingSection message={auth.heading} />
        </div>
      </div>
    )
  }

  if (!showDashboard) return null

  return (
    <AdminAuthProvider value={auth}>
      <AdminLayout repoName={auth.repoName} onLogout={auth.handleLogout} />
    </AdminAuthProvider>
  )
}

export default AdminPage
