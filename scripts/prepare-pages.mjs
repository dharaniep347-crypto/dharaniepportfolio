import { readFile, readdir, mkdir, writeFile, copyFile, stat } from "node:fs/promises";
import { join } from "node:path";

// Publish only browser files, never server output or environment files.
await stat("dist/index.html");
const origin = process.env.PAGES_ASSET_ORIGIN || "https://id-preview--8bfa1210-ee79-460e-9011-1e6a09429df0.lovable.app";
for (const file of (await readdir("src/assets")).filter(f => f.endsWith(".asset.json"))) {
  const asset = JSON.parse(await readFile(join("src/assets", file), "utf8"));
  if (!asset.url.startsWith("/__l5e/assets-v1/") || asset.url.includes("..")) throw new Error(`Unsupported asset path: ${file}`);
  const response = await fetch(new URL(asset.url, origin));
  if (!response.ok || !response.headers.get("content-type")?.startsWith(asset.content_type)) {
    throw new Error(`Unable to export ${file}; check PAGES_ASSET_ORIGIN points to your Lovable site.`);
  }
  const target = join("dist", asset.url.slice(1));
  await mkdir(join(target, ".."), { recursive: true });
  await writeFile(target, new Uint8Array(await response.arrayBuffer()));
}
await mkdir("dist/admin", { recursive: true });
await copyFile("dist/index.html", "dist/admin/index.html");
await copyFile("dist/index.html", "dist/404.html");
await writeFile("dist/.nojekyll", "");
console.log("GitHub Pages files prepared in dist (portfolio assets and admin included).");
