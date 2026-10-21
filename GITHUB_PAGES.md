# Deploy the existing portfolio to GitHub Pages

Target: https://dharaniep347-crypto.github.io/dharaniepportfolio/

## Configuration

- Framework: **TanStack Start / React with Vite**. Package manager: **Bun**, using existing `bun.lock` and Bun 1.3.3.
- `vite.github-pages.config.ts` builds the existing site as a static SPA using `/dharaniepportfolio/` for assets and routes. Normal Lovable builds remain unchanged.
- `.github/workflows/deploy.yml` installs locked dependencies, tests, builds and deploys **only `dist`** on pushes to `main` or manually.
- Portrait and resume are downloaded from existing asset pointers into the static output. `/admin` gets its own HTML document. `404.html` provides a fallback for other direct links (unknown paths may still return HTTP 404).
- GitHub Pages cannot execute server functions. Only the Pages build uses a browser adapter for public content and message submission. Admin uses existing cloud sign-in and permissions. Database constraints validate message lengths; the existing TanStack server-side email-format validator does not execute on Pages. Database permissions are not changed.

## Required GitHub settings

1. Ensure these source changes reach **dharaniep347-crypto/dharaniepportfolio** on `main`. If your branch differs, update `branches` in the workflow. Lovable Git sync cannot attach an already-existing repository; copy the source changes there if it is not already connected.
2. **Settings → Pages → Build and deployment → Source → GitHub Actions** (not branch deployment).
3. **Settings → Secrets and variables → Actions → Variables**: add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` from the existing project's **public browser configuration**. Those values are in the existing `.env` / generated browser configuration. Never use a private key, service-role key, password or secret. The workflow accepts only `sb_publishable_` keys.
4. Optional: set `PAGES_ASSET_ORIGIN` to a working Lovable preview or published origin. It defaults to the current preview. It must serve original portrait and resume URLs without a login; missing assets stop deployment instead of silently shipping broken images.
5. Ensure Actions are enabled. If deployment is blocked, **Settings → Environments → github-pages** must allow `main`.
6. In **Lovable Cloud authentication settings**, allow `https://dharaniep347-crypto.github.io/dharaniepportfolio/admin` as an email-confirmation redirect if using signup confirmation there. Existing email/password sign-in does not require changing your primary URL. Hosted authentication settings have not been changed or verified here.
7. Open **Actions → Deploy portfolio to GitHub Pages → Run workflow**, or push a commit to `main`; visit the target URL after deployment succeeds.

## Local commands

```sh
bun install --frozen-lockfile
bun run test
bun run build:pages
```

Provide only public `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` for Pages. Browser configuration is necessarily visible to visitors; it is not a private credential. Database permissions protect cloud access. Never place private values in `VITE_*`, workflow source or artifacts. The existing tracked `.env` contains public configuration only; do not add secrets to it. This configuration never publishes `.env` or server output.

New admin image uploads use cloud storage and signed URLs as before. Future Lovable asset pointers must be available from `PAGES_ASSET_ORIGIN` during deployment. Deployment is configured here but not executed against GitHub: the owner must enable Pages, set variables and run the workflow.

## Checks completed here

All 29 tests pass, including repository-path routing and the Pages cloud adapter. Resolved Vite configuration confirms the requested base, `dist` browser output, separate server output, and static adapter. Packaging downloaded the real portrait and resume successfully. The existing preview's About dialog, portrait, resume links and admin sign-in screen still work without browser errors. The full Pages production build, hosted Pages site, authenticated admin actions and email redirect settings remain unverified until the workflow runs and an admin account is available.