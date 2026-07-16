// All marketing copy from the Dinesh Kiran Kashi Laabh spec (§§1–6, 10, 13), kept in one place so
// content can be edited without touching layout. Verbatim from the source doc.

export const site = {
  // Stylised brand name shown in the wordmark/headings (Latin + Devanagari).
  fullName: "Dinesh Kiran काशी लाभ",
  // Romanised name for the SEO title, structured data and prose references.
  romanName: "Dinesh Kiran Kashi Laabh",
  name: "Dinesh Kiran Kashi Laabh",
  legalName: "Dinesh Kiran Kashi Laabh",
  tagline: "Long-term residential stay in Kashi",
  phone: process.env.NEXT_PUBLIC_PHONE ?? "",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "",
};

export const nav = [
  { label: "Home", href: "#home" },
  { label: "Who It Is For", href: "#who" },
  { label: "Accommodation", href: "#help" },
  { label: "Stay & Pricing", href: "#pricing" },
  { label: "How It Works", href: "#how" },
  { label: "FAQs", href: "#faqs" },
  { label: "Contact", href: "#contact" },
];

export const hero = {
  eyebrow: "Long-term residential stay in Kashi",
  headline:
    "A Dignified Place to Spend the Final Years, Months or Days in Kashi",
  body: "Dinesh Kiran Kashi Laabh offers long-term twin-sharing accommodation for terminally ill, elderly and frail people who wish to live in Kashi during the final phase of life. A family member or personal attendant stays with the resident and remains primarily responsible for their care. Our local team helps with food, hospital visits, temple visits and end-of-life arrangements when required.",
  primaryCta: "Calculate Stay Cost",
  secondaryCta: "Speak to Our Kashi Team",
};

export const who = {
  heading: "Is Dinesh Kiran Kashi Laabh Right for Your Family?",
  forTitle: "Who it is for",
  forItems: [
    "Terminally ill patients who wish to spend their final days in Kashi",
    "Elderly and frail people planning to live in Kashi for their final years, months or days",
    "Families seeking a long-term residential arrangement",
    "Residents accompanied by a responsible family member or personal attendant",
  ],
  notForTitle: "Who it is not for",
  notForItems: [
    "Short-term tourist or pilgrimage stays",
    "Regular hotel bookings",
    "Non-geriatric residents who do not have a terminal or advanced-care need",
    "Residents arriving without a responsible family member or attendant",
  ],
};

export const includes = {
  heading: "Accommodation & Pricing",
  intro:
    "Choose the stay option that best suits your needs. Our rooms are designed to provide comfort, privacy and a peaceful living environment during your time in Varanasi.",

  // Room offerings (charges exclude GST).
  rooms: [
    {
      name: "Single Occupancy",
      price: "₹25,000",
      gst: "+ GST",
      per: "per month",
      desc: "A private single room for one resident seeking comfort, quiet and personal space.",
      featured: false,
    },
    {
      name: "Double Occupancy",
      price: "₹30,000",
      gst: "+ GST",
      per: "per month",
      desc: "A comfortable twin-sharing room ideal for a resident with a companion or attendant — spacious and well-maintained.",
      featured: true,
    },
    {
      name: "Shared Occupancy",
      price: "₹18,000",
      gst: "+ GST",
      per: "per month",
      desc: "A single bed within a shared room — a comfortable and affordable long-term stay with a sense of community.",
      featured: false,
    },
  ],

  includedTitle: "What's included",
  included: [
    "Fully furnished accommodation",
    "Housekeeping and maintenance",
    "Electricity and Wi-Fi",
    "Safe, clean and peaceful environment",
  ],

  supportTitle: "Additional services (charged separately)",
  supportLead:
    "The following services are available based on your individual requirements and are billed separately.",
  // Scannable services (icon keys map to icons in the UI).
  services: [
    { icon: "food", label: "Nutritious meals — ₹5,000 / person / month" },
    { icon: "nursing", label: "Nursing and caregiving support" },
    { icon: "transport", label: "Hospital and medical transportation" },
    { icon: "temple", label: "Temple visits and local travel assistance" },
    { icon: "medical", label: "Medical coordination" },
    { icon: "other", label: "Other personalised support services" },
  ],
  servicesNote:
    "Medical, temple and ritual assistance is coordinated based on the resident's health condition, local availability, applicable rules and third-party service availability. Dinesh Kiran Kashi Laabh does not provide hospital care or guarantee medical or spiritual outcomes.",
};

export const responsibility = {
  heading: "We Help. The Family or Attendant Remains Responsible.",
  body: "The accompanying family member or personal attendant is primarily responsible for daily supervision, personal care, medicines, medical decisions, consent and legal matters. Dinesh Kiran Kashi Laabh provides accommodation and local coordination support. Dinesh Kiran Kashi Laabh does not take responsibility for the resident's death, medical outcome or cremation. We may help the family coordinate local cremation arrangements when required.",
};

export const howItWorks = {
  heading: "How It Works",
  steps: [
    "Confirm that the resident fits the eligibility criteria.",
    "Choose an occupancy type and the expected number of months of stay.",
    "View the total accommodation amount for your chosen room.",
    "Enter resident and family details.",
    "Accept the responsibility, cancellation and refund terms.",
    "Continue to Razorpay and complete payment.",
    "Receive payment and booking confirmation.",
    "Dinesh Kiran Kashi Laabh calls the family to complete arrival planning and support assessment.",
  ],
};

export const faqs = {
  heading: "Frequently Asked Questions",
  items: [
    {
      q: "Can the resident stay alone?",
      a: "No. A responsible family member or personal attendant must stay with the resident.",
    },
    {
      q: "Is this available for short visits?",
      a: "No. Dinesh Kiran Kashi Laabh is designed for long-term stays, not tourism or short pilgrimages.",
    },
    {
      q: "Can you arrange food and hospital visits?",
      a: "Yes. Our team helps coordinate food, hospital visits and local transport according to the family's requirements.",
    },
    {
      q: "Can you help with temple visits?",
      a: "Yes. We can help coordinate temple visits based on the resident's health, mobility and family preferences.",
    },
    {
      q: "Do you take responsibility for cremation?",
      a: "No. The family remains responsible. Dinesh Kiran Kashi Laabh may help coordinate local arrangements when required.",
    },
    {
      q: "Are nursing and medical services included?",
      a: "No. They are assessed separately, arranged where available and charged according to the requirement.",
    },
  ],
};

export const twinSharingNote =
  "Resident plus one family member/personal attendant may stay in the twin-sharing room for the cost of one room.";

export const optionalServicesNote =
  "Food, nursing, hospital transport, temple visits and other support are not included unless specifically selected or quoted.";

export const paymentNote =
  "Food, nursing, medical consultations, local transport, temple visits and other additional support are arranged separately according to need and are not included in this payment unless expressly shown.";

export const footerDisclaimer =
  "Dinesh Kiran Kashi Laabh provides long-term residential accommodation and local coordination support for eligible terminally ill, elderly and frail residents. A responsible family member or personal attendant must remain with the resident and is primarily responsible for daily care, medical decisions, medicines, consent and legal matters. Dinesh Kiran Kashi Laabh may help coordinate food, hospital visits, temple visits and end-of-life arrangements but does not assume responsibility for medical outcomes, death or cremation.";
