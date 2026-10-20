import { useEffect, useState, type ComponentProps } from "react";
import { normalizeExternalUrl } from "@/lib/external-url";

export default function ExternalLink({ href = "", ...props }: ComponentProps<"a">) {
  const normalized = normalizeExternalUrl(href);
  const [origin, setOrigin] = useState("");
  useEffect(() => setOrigin(window.location.origin), []);
  const destination = normalized.startsWith("/") && origin
    ? new URL(normalized, origin).href
    : normalized;
  return <a {...props} href={destination} target="_blank" rel="noopener noreferrer" />;
}