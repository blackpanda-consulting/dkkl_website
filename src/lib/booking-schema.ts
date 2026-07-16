import { z } from "zod";
import { MAX_MONTHS, MIN_MONTHS } from "./pricing";

// Pre-payment details (spec §8) + selected months. Shared by the client form
// and the server order route so validation is defined once.

export const bookingSchema = z.object({
  roomType: z.enum(["SINGLE", "DOUBLE", "SHARED"], { error: "Please choose a room type" }),

  months: z.coerce
    .number({ error: "Please select the number of months" })
    .int({ error: "Please select the number of months" })
    .min(MIN_MONTHS, { error: "Please select the number of months" })
    .max(MAX_MONTHS, { error: "Please select the number of months" }),

  familyName: z.string().trim().min(2, { error: "Please enter the family contact name" }),
  familyMobile: z
    .string()
    .trim()
    .regex(/^(\+?\d[\d\s-]{7,14})$/, { error: "Please enter a valid mobile number" }),

  residentName: z.string().trim().min(2, { error: "Please enter the resident's name" }),
  residentAge: z.coerce
    .number({ error: "Please enter the resident's age" })
    .int({ error: "Please enter a valid age" })
    .min(1, { error: "Please enter a valid age" })
    .max(120, { error: "Please enter a valid age (up to 120)" }),

  condition: z.enum(["TERMINALLY_ILL", "ELDERLY_FRAIL", "OTHER"], {
    error: "Please select the current condition",
  }),
  mobility: z.enum(["INDEPENDENT", "ASSISTED", "BEDRIDDEN"], {
    error: "Please select the mobility level",
  }),

  arrivalDate: z.coerce.date({ error: "Please choose the expected arrival date" }),

  attendantName: z.string().trim().min(2, { error: "Please enter the attendant's name" }),
  attendantRelation: z
    .string()
    .trim()
    .min(2, { error: "Please enter the relationship to the resident" }),

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
