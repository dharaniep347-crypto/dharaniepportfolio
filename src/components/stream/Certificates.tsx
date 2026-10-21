import { useState } from "react";
import { Award, Download, ExternalLink as ExternalLinkIcon } from "lucide-react";
import { certificates, certificateCategories, filterCertificates, type CertificateCategory, type Certificate } from "@/data/portfolio";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { withBasePath } from "@/lib/site-path";
import ExternalLink from "./ExternalLink";
import Row from "./Row";

function Preview({ item, large = false }: { item: Certificate; large?: boolean }) {
  return item.image ? <img src={withBasePath(item.image)} alt={`${item.title} certificate issued to Dharani E P`} loading={large ? "eager" : "lazy"} className={large ? "max-h-[55dvh] w-full object-contain" : "aspect-video w-full bg-paper object-contain"} /> : <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 bg-raised p-6 text-heading"><Award className="size-12 text-primary" aria-hidden="true" /><span className="text-center font-display font-bold">{item.title}</span></div>;
}

export default function Certificates() {
  const [category, setCategory] = useState<CertificateCategory>("All");
  const [selected, setSelected] = useState<Certificate | null>(null);
  const visible = filterCertificates(certificates, category);
  return <>
    <Row id="certificates" title="Certificates" headerContent={<div className="flex flex-wrap gap-2" role="group" aria-label="Certificate categories">{certificateCategories.map((c) => <Button key={c} size="sm" variant={category === c ? "default" : "outline"} className={category === c ? undefined : "bg-chip text-heading"} aria-pressed={category === c} onClick={() => setCategory(c)}>{c}</Button>)}</div>}>
      {visible.map((item) => <article key={item.id} className="w-64 shrink-0 sm:w-72"><Button variant="ghost" onClick={() => setSelected(item)} aria-label={`Open ${item.title} certificate`} className="block h-full w-full overflow-hidden whitespace-normal rounded-md border border-border bg-card p-0 text-left hover:border-card-hover-border"><Preview item={item} /><div className="p-4"><h3 className="break-words font-display text-base font-extrabold leading-snug">{item.title}</h3><p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.issuer}</p><p className="mt-2 text-xs text-muted-foreground">{item.date || "Date not listed"}</p><span className="mt-3 inline-block rounded-sm bg-chip px-2 py-1 text-[10px] font-semibold text-heading">{item.category}</span></div></Button></article>)}
      {!visible.length && <p className="py-8 text-sm text-muted-foreground">No certificates in this category.</p>}
    </Row>
    <Dialog open={selected !== null} onOpenChange={(open) => { if (!open) setSelected(null); }}>
      {selected && <DialogContent className="z-[60] flex h-dvh max-h-dvh w-screen max-w-none flex-col gap-0 overflow-hidden rounded-none border-border p-0 sm:h-auto sm:max-h-[90dvh] sm:w-[calc(100vw-3rem)] sm:max-w-4xl sm:rounded-md [&>button]:right-3 [&>button]:top-3 [&>button]:z-20 [&>button]:flex [&>button]:size-11 [&>button]:items-center [&>button]:justify-center [&>button]:bg-raised [&>button]:text-heading [&>button]:opacity-100 [&>button_svg]:size-6">
        <div className="overflow-y-auto overscroll-contain p-5 pt-16 sm:p-8 sm:pt-16">
          <Preview item={selected} large />
          <DialogTitle className="mt-6 break-words font-display text-xl font-extrabold leading-snug tracking-normal sm:text-2xl">{selected.title}</DialogTitle>
          <p className="mt-3 text-sm text-muted-foreground">{selected.issuer}</p>
          <p className="mt-2 text-xs text-muted-foreground">{selected.date || "Date not listed"} · {selected.category}</p>
          <DialogDescription className="mt-4 leading-relaxed">{selected.description}</DialogDescription>
          <div className="mt-6 flex flex-wrap gap-3">
            {selected.credential && <Button asChild variant="secondary"><ExternalLink href={selected.credential}><ExternalLinkIcon aria-hidden="true" />View credential</ExternalLink></Button>}
            {selected.file && <Button asChild><a href={withBasePath(selected.file)} download={`${selected.id}-certificate.jpg`}><Download aria-hidden="true" />Download</a></Button>}
          </div>
        </div>
      </DialogContent>}
    </Dialog>
  </>;
}