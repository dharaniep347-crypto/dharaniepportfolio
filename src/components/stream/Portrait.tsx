import { withBasePath } from "@/lib/site-path";

export default function Portrait({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <span className={`block aspect-square shrink-0 overflow-hidden rounded-full border-[3px] border-primary shadow-portrait ${className}`}>
      <img src={withBasePath(src)} alt={alt} className="h-full w-full object-cover object-[center_25%]" />
    </span>
  );
}