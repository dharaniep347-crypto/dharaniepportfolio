export const GITHUB_PAGES_BASE = "/dharaniepportfolio/";

/** Keep root-relative assets inside the deployment mount without double prefixes. */
export function withBasePath(path: string, base = import.meta.env.BASE_URL || "/"): string {
  if (!path.startsWith("/") || path.startsWith("//") || base === "/") return path;
  const prefix = base.replace(/\/$/, "");
  return path === prefix || path.startsWith(`${prefix}/`) ? path : `${prefix}${path}`;
}
