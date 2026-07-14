import { z } from "zod";
import { MAX_MONTHS, MIN_MONTHS } from "./pricing";

// Pre-payment details (spec §8) + selected months. Shared by the client form
// and the server order route so validation is defined once.

export const bookingSchema = z.object({
  months: z.coerce
    .number()
    .int()
    .min(MIN_MONTHS)
    .max(MAX_MONTHS),

  familyName: z.string().trim().min(2, "Enter the family contact name"),
  familyMobile: z
    .string()
    .trim()
    .regex(/^(\+?\d[\d\s-]{7,14})$/, "Enter a valid mobile number"),

  residentName: z.string().trim().min(2, "Enter the resident's name"),
  residentAge: z.coerce.number().int().min(0).max(120),

  condition: z.enum(["TERMINALLY_ILL", "ELDERLY_FRAIL", "OTHER"]),
  mobility: z.enum(["INDEPENDENT", "ASSISTED", "BEDRIDDEN"]),

  arrivalDate: z.coerce.date(),

  attendantName: z.string().trim().min(2, "Enter the attendant's name"),
  attendantRelation: z
    .string()
    .trim()
    .min(2, "Enter the relationship to the resident"),

  // Required confirmations (spec §8). Must be true.
  longTermConfirmed: z.literal(true, {
    error: "Please confirm this is a long-term stay, not tourist accommodation",
  }),
  consentAccepted: z.literal(true, {
    error: "Please accept the responsibility, cancellation, refund and privacy terms",
  }),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export const CONDITION_OPTIONS = [
  { value: "TERMINALLY_ILL", label: "Terminally ill" },
  { value: "ELDERLY_FRAIL", label: "Elderly and frail" },
  { value: "OTHER", label: "Other" },
] as const;

export const MOBILITY_OPTIONS = [
  { value: "INDEPENDENT", label: "Independent" },
  { value: "ASSISTED", label: "Assisted" },
  { value: "BEDRIDDEN", label: "Bedridden" },
] as const;
