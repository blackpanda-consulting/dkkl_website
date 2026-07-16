import { z } from "zod";

// Contact / consultation enquiry (spec §1: generate qualified enquiries).
// Shared by the client form and the server route.
export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name"),
  mobile: z
    .string()
    .trim()
    .regex(/^(\+?\d[\d\s-]{7,14})$/, "Enter a valid mobile number"),
  email: z
    .union([z.string().trim().email("Enter a valid email"), z.literal("")])
    .optional(),
  preferredStay: z.string().trim().optional(),
  message: z.string().trim().max(1000).optional(),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

export const STAY_OPTIONS = [
  "Not sure yet",
  "1–3 months",
  "3–6 months",
  "6–12 months",
  "More than 12 months",
] as const;
