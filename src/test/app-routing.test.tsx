import { QueryClient } from "@tanstack/react-query";
import { createMemoryHistory, createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";
import { GITHUB_PAGES_BASE } from "@/lib/site-path";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });
  it("matches the portfolio at its GitHub Pages repository path", () => {
    const router = createRouter({ routeTree, basepath: GITHUB_PAGES_BASE,
      history: createMemoryHistory({ initialEntries: ["/dharaniepportfolio/"] }),
      context: { queryClient: new QueryClient() } });
    expect(router.matchRoutes(router.latestLocation.pathname).at(-1)?.routeId).toBe("/");
    expect(router.buildLocation({ to: "/" }).publicHref).toBe("/dharaniepportfolio/");
  });
  it("matches direct admin links under the repository path", () => {
    const router = createRouter({ routeTree, basepath: GITHUB_PAGES_BASE,
      history: createMemoryHistory({ initialEntries: ["/dharaniepportfolio/admin"] }),
      context: { queryClient: new QueryClient() } });
    expect(router.matchRoutes(router.latestLocation.pathname).at(-1)?.routeId).toBe("/admin");
  });
});
