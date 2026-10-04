/**
 * Ticket categories as the API knows them (TicketCategory in the backend's
 * ticket.schema.ts), with the label the admin sees. The API's list is
 * append-only, so a value missing here still shows, as itself.
 */
export const TICKET_CATEGORIES = [
  { value: "account", label: "Account" },
  { value: "payment", label: "Payment" },
  { value: "subscription", label: "Subscription" },
  { value: "task", label: "Tasks" },
  { value: "booking", label: "Bookings" },
  { value: "review", label: "Reviews" },
  { value: "dispute", label: "Disputes" },
  { value: "trust_safety", label: "Trust & safety" },
  { value: "technical", label: "Technical" },
  { value: "other", label: "Other" },
  // "Can't find your service?" during business registration in the app.
  { value: "service_request", label: "Service request" },
] as const;

export type TicketCategoryValue = (typeof TICKET_CATEGORIES)[number]["value"];

export function ticketCategoryLabel(value: string | null | undefined): string {
  if (!value) return "";
  return TICKET_CATEGORIES.find((c) => c.value === value)?.label ?? value;
}
