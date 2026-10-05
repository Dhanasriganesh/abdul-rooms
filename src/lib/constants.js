export const CITIES = [
  "Berlin",
  "München",
  "Hamburg",
  "Köln",
  "Frankfurt",
  "Leipzig",
  "Stuttgart",
  "Dresden",
  "Heidelberg",
  "Aachen",
];

export const ROOM_TYPES = [
  { id: "wg", label: "WG room" },
  { id: "studio", label: "Studio" },
  { id: "apartment", label: "Apartment" },
];

export const OCCUPATIONS = [
  { id: "student", label: "Student" },
  { id: "working", label: "Working" },
  { id: "other", label: "Other" },
];

export const STAYS = ["3–6 months", "6–12 months", "More than a year", "Flexible"];

export const GERMAN_LEVELS = ["", "None yet", "A1", "A2", "B1", "B2", "C1", "C2", "Native"];

export const SMOKING = [
  { id: "no", label: "Non-smoker" },
  { id: "outside", label: "Outside only" },
  { id: "yes", label: "Smoker" },
];

export const HOUSEHOLDS = [
  { id: "any", label: "Any household" },
  { id: "mixed", label: "Mixed WG" },
  { id: "women", label: "Women's WG" },
  { id: "men", label: "Men's WG" },
];

export const AMENITIES = [
  "Furnished",
  "Kitchen",
  "Wi-Fi",
  "Washing machine",
  "Desk",
  "Balcony",
  "Cellar",
  "Bike room",
  "Near transit",
];

export const REQUEST_STATUSES = [
  { id: "new", label: "Received" },
  { id: "in_review", label: "In review" },
  { id: "viewing", label: "Viewing" },
  { id: "offered", label: "Offer sent" },
  { id: "placed", label: "Moved in" },
  { id: "closed", label: "Closed" },
];

export const STATUS_HELP = {
  new: "The desk has the request and is checking the owner network.",
  in_review: "A coordinator is comparing the request with open rooms.",
  viewing: "A viewing is being arranged. Watch your phone and email.",
  offered: "A room has been offered. Confirm with the desk to proceed.",
  placed: "Move-in is confirmed. The file stays open for handover questions.",
  closed: "This request is closed. A new request can be sent at any time.",
};

export const LISTING_STATUSES = [
  { id: "pending", label: "With the desk" },
  { id: "live", label: "Open" },
  { id: "reserved", label: "Reserved" },
  { id: "let", label: "Let" },
  { id: "hidden", label: "Offline" },
];

export const REFERRAL_STATUSES = {
  registered: "Signed up",
  earned: "Move-in confirmed",
  paid: "Paid out",
};

export const REWARD_EURO = 75;

export function homeFor(role) {
  if (role === "mediator") return "/desk";
  if (role === "landlord") return "/portal";
  return "/account";
}

export function labelOf(list, id) {
  return list.find((item) => item.id === id)?.label || id || "—";
}

export function statusLabel(id) {
  return labelOf(REQUEST_STATUSES, id);
}
