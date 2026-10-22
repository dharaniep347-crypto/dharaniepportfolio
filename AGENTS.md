<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->
- Public site content comes from the database via getSiteContent (src/lib/content.functions.ts); src/data/portfolio.ts is only the fallback when the database is empty or unreachable.
- Education and certificate records are locally editable exports in src/data/portfolio.ts, rendered by focused stream components; certificate binaries live in public/certificates and use withBasePath so Pages downloads remain same-origin.
- Shared Row auto-advance uses a single viewport-centre selection registry and per-row visibility observers; only the qualifying active row owns a running timer, so offscreen strips cannot move behind dialogs or user interactions.
- GitHub Pages uses a separate Start SPA config and browser content adapter under existing database permissions; this preserves Lovable server functions while exporting only browser files in dist.
- Local public URLs use withBasePath and the router uses Vite BASE_URL; this keeps root previews and repository-subpath deployments working without duplicate prefixes.
- Export asset pointers into dist during Pages packaging and fail on missing downloads; Lovable-relative media otherwise do not exist on GitHub Pages.
- Files live in the private "portfolio-files" bucket (public buckets are blocked); DB stores storage paths and the site resolves them to signed URLs. Paths starting with "/" or "http" are used as-is.
- First signup becomes admin via an auth.users trigger; a second trigger rejects signups once an admin exists. Admin access is enforced by RLS with has_role().

- Frontend is a streaming-service-style UI: all homepage components live in src/components/stream/ (state.tsx holds viewer-profile + My List localStorage state); content still comes from getSiteContent with src/data/portfolio.ts as fallback.
- Fallback project descriptions are HTML, sanitized by the detail dialog just like database descriptions; shared category filtering and skill annotations live alongside fallback content so every public view uses the same definitions.
- About and project details have separate rendering branches in the shared detail dialog so portrait framing never inherits project-cover overlays.
- Public portrait placements share Portrait and external anchors share ExternalLink; centralizing framing and URL handling prevents inconsistent crops and navigation behavior.
- Define all colours and gradients in src/styles.css using the Tailwind v4 CSS theme; Three.js reads resolved sRGB scene variables through useSceneColours because materials do not understand CSS variables or OKLCH.
- Render the global blend once on fixed body::before with an isolated body stacking context and overscan for transform-only ambient drift; fixed body::after supplies noninteractive grain. Disable drift under reduced motion. Page wrappers stay transparent and surfaces use themed tokens so scrolling never creates background seams. Reserve ink for preserved dark foreground text, never backgrounds.
