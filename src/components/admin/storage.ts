import { supabase } from "@/integrations/supabase/client";

export const BUCKET = "portfolio-files";
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export async function uploadFile(folder: "projects" | "avatar" | "resume", file: File) {
  if (folder === "resume") {
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf"))
      throw new Error("The resume must be a PDF file.");
  } else {
    if (!file.type.startsWith("image/")) throw new Error("Choose an image file.");
    if (file.size > MAX_IMAGE_BYTES) throw new Error("Images must be 5 MB or smaller.");
  }
  const ext = file.name.split(".").pop()?.toLowerCase() || (folder === "resume" ? "pdf" : "png");
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type });
  if (error) throw new Error(error.message);
  return path;
}

/** Turns a stored path into a viewable URL (paths starting with / or http are used as-is). */
export async function viewUrl(path: string | null | undefined) {
  if (!path) return "";
  if (path.startsWith("/") || path.startsWith("http")) return path;
  const { data } = await supabase.storage.from(BUCKET).createSignedUrl(path, 3600);
  return data?.signedUrl ?? "";
}
