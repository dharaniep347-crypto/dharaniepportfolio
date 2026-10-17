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
- Files live in the private "portfolio-files" bucket (public buckets are blocked); DB stores storage paths and the site resolves them to signed URLs. Paths starting with "/" or "http" are used as-is.
- First signup becomes admin via an auth.users trigger; a second trigger rejects signups once an admin exists. Admin access is enforced by RLS with has_role().
