export type TicketStatus = "open" | "in_progress" | "resolved";

export interface Customer {
  id: string;
  name: string;
  email: string;
}

export interface SupportTicket {
  id: string;
  customerId: string;
  subject: string;
  message: string;
  status: TicketStatus;
}
