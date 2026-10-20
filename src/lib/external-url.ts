import { withBasePath } from "@/lib/site-path";

/** Keep app assets and contact protocols intact; qualify bare web domains. */
export function normalizeExternalUrl(value: string): string {
  const url = value.trim();
  if (!url || /^(https?:\/\/|\/|mailto:|tel:|#)/i.test(url)) return withBasePath(url);
  return `https://${url}`;
}

export function phoneHref(phone: string): string {
  return `tel:${phone.replace(/[^+\d]/g, "")}`;
}