import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(100, "Keep your name under 100 characters"),
  email: z.string().trim().email("Enter a valid email").max(255, "Keep your email under 255 characters"),
  subject: z.string().trim().min(3, "Add a subject").max(150, "Keep the subject under 150 characters"),
  message: z.string().trim().min(10, "Write at least 10 characters").max(2000, "Keep your message under 2000 characters"),
});
export type ContactFields = z.infer<typeof contactSchema>;
