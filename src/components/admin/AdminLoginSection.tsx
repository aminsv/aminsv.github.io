type AdminLoginSectionProps = {
  isBusy: boolean
  isAuthenticating: boolean
  errorMessage: string | null
  onLogin: () => void
}

export function AdminLoginSection({
  isBusy,
  isAuthenticating,
  errorMessage,
  onLogin,
}: AdminLoginSectionProps) {
  return (
    <div className="flex w-full flex-col gap-6 rounded-lg border border-slate-800 bg-slate-900/60 p-6 sm:flex-row">
      {/* Left: Login */}
      <section className="flex shrink-0 flex-col justify-center sm:w-64">
        <h2 className="text-lg font-semibold text-slate-100">
          Gitfolio Admin
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Sign in with GitHub to edit portfolio configuration. Only users with{' '}
          <span className="font-semibold">admin</span> access to this repository
          can save changes.
        </p>
        <button
          type="button"
          onClick={onLogin}
          disabled={isBusy}
          className="mt-4 inline-flex items-center gap-2 rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
        >
          {isBusy ? 'Signing in…' : 'Login with GitHub'}
        </button>
        {isAuthenticating && (
          <p className="mt-3 text-xs text-slate-400">
            If you've authorized in the other tab, return here and wait a few
            seconds for the dashboard to load.
          </p>
        )}
        {errorMessage && (
          <p className="mt-3 text-xs text-rose-400">{errorMessage}</p>
        )}
      </section>

      {/* Right: Setup docs */}
      <section className="min-w-0 flex-1 border-t border-slate-800 pt-6 text-xs sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
        <h3 className="text-sm font-semibold text-slate-200">
          How to set up admin (repo owners)
        </h3>
        <p className="mt-2 text-slate-400">
          If you forked Gitfolio, follow these steps so the admin panel can authenticate and save changes. Locally, the dev server proxies GitHub OAuth; for a deployed site you also need the OAuth proxy (step 3).
        </p>
        <ol className="mt-4 list-inside list-decimal space-y-5 text-slate-400">
          <li className="pl-1">
            <strong className="text-slate-300">Create a GitHub OAuth App</strong>
            <ul className="mt-1.5 list-inside list-disc space-y-1 pl-1">
              <li>
                Go to{' '}
                <a
                  href="https://github.com/settings/developers"
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:underline"
                >
                  GitHub → Settings → Developer settings → OAuth Apps
                </a>
              </li>
              <li>Create a new OAuth App.</li>
              <li>
                Set <strong>Homepage URL</strong> and <strong>Authorization callback URL</strong> to your site (e.g. <code className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-300">https://yourusername.github.io/gitfolio</code>).
              </li>
              <li>Copy the <strong>Client ID</strong>.</li>
            </ul>
          </li>
          <li className="pl-1">
            <strong className="text-slate-300">Add the Client ID to your repo</strong>
            <ul className="mt-1.5 list-inside list-disc space-y-1 pl-1">
              <li>In your repo: <strong>Settings → Secrets and variables → Actions</strong>.</li>
              <li>Create a <strong>repository secret</strong> named <code className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-300">VITE_GITHUB_CLIENT_ID</code> and paste the Client ID.</li>
              <li>The deploy workflow uses it at build time so the admin panel can start login.</li>
            </ul>
          </li>
          <li className="pl-1">
            <strong className="text-slate-300">Production only: OAuth proxy (fix CORS)</strong>
            <ul className="mt-1.5 list-inside list-disc space-y-1 pl-1">
              <li>GitHub’s OAuth endpoints don’t allow direct browser requests; the deployed site needs a proxy.</li>
              <li>From <code className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-300">workers/github-oauth-proxy/</code> run <code className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-300">npx wrangler deploy</code> (free Cloudflare account).</li>
              <li>In your repo add a <strong>repository variable</strong> (not secret): <code className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-300">VITE_GITHUB_OAUTH_PROXY_URL</code> = your worker URL (e.g. <code className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-300">https://github-oauth-proxy.yoursub.workers.dev</code>, no trailing slash).</li>
              <li>Re-run the deploy workflow so the build picks it up.</li>
            </ul>
          </li>
        </ol>
        <p className="mt-4 text-slate-500">
          If branch protection requires pull requests, allow bypass for admins (or disable “Do not allow bypassing”) so the admin panel can commit config and data files. Full details are in the project README.
        </p>
      </section>
    </div>
  )
}
