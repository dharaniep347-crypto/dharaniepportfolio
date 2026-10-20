import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { contactSchema as schema, type ContactFields as Fields } from "@/lib/contact-schema";
import { submitMessage } from "@/lib/content.functions";
import { Button } from "@/components/ui/button";

export default function ContactModal({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [sending, setSending] = useState(false);
  const [failure, setFailure] = useState("");

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    ref.current?.querySelector<HTMLElement>("input")?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prev?.focus();
    };
  }, [onClose]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setFailure("");
    if (fd.get("company")) { onClose(); toast.success("Thanks! Your message was sent."); return; } // honeypot
    fd.delete("company");
    const r = schema.safeParse(Object.fromEntries(fd));
    if (!r.success) {
      const errs: typeof errors = {};
      r.error.issues.forEach((i) => { errs[i.path[0] as keyof Fields] ??= i.message; });
      setErrors(errs);
      return;
    }
    setErrors({});
    setSending(true);
    try {
      const res = await submitMessage({ data: r.data });
      if (res.ok) { onClose(); toast.success("Thanks! Your message was sent. I'll get back to you soon."); }
      else setFailure(res.error);
    } catch {
      setFailure("Your message couldn't be sent. Please check your entries and try again.");
    } finally {
      setSending(false);
    }
  };

  const field = (name: keyof Fields, label: string, type = "text") => (
    <div>
      <label htmlFor={`cm-${name}`} className="mb-1 block text-sm font-bold">{label}</label>
      {name === "message" ? (
        <textarea id={`cm-${name}`} name={name} rows={5} aria-invalid={!!errors[name]} aria-describedby={`cm-${name}-err`} className="w-full rounded-md border border-border bg-input text-heading px-3 py-2 aria-[invalid=true]:border-primary" />
      ) : (
        <input id={`cm-${name}`} name={name} type={type} aria-invalid={!!errors[name]} aria-describedby={`cm-${name}-err`} className="w-full rounded-md border border-border bg-input text-heading px-3 py-2 aria-[invalid=true]:border-primary" />
      )}
      <p id={`cm-${name}-err`} className="mt-1 min-h-5 text-sm text-destructive">{errors[name]}</p>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto bg-chrome/75 p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Send a message"
    >
      <div ref={ref} className="relative my-8 w-full max-w-lg rounded-md bg-card p-6 shadow-2xl md:p-8">
        <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 rounded-full bg-background/80 p-2 text-heading hover:bg-background">
          <X className="size-5" aria-hidden />
        </button>
        <h2 className="font-wide text-2xl">Send a message</h2>
        <p className="mt-1 text-sm text-muted-foreground">Have a project, internship or idea? I'd love to hear about it.</p>
        <form onSubmit={onSubmit} noValidate className="mt-4 space-y-2">
          <div className="grid gap-x-4 sm:grid-cols-2">
            {field("name", "Name")}
            {field("email", "Email", "email")}
          </div>
          {field("subject", "Subject")}
          {field("message", "Message")}
          <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
          <Button type="submit" size="lg" disabled={sending}>{sending ? "Sending…" : "Send message"}</Button>
          {failure && <p role="alert" className="mt-3 text-sm font-semibold text-destructive">{failure}</p>}
        </form>
      </div>
    </div>
  );
}
