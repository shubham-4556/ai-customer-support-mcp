export const createSupportTicketTool = {
  name: "create_support_ticket",
  description: "Create a support ticket for a customer.",
  inputSchema: {
    type: "object",
    properties: {
      customerId: { type: "string" },
      subject: { type: "string" },
      message: { type: "string" }
    },
    required: ["customerId", "subject", "message"]
  }
};

// TODO: Implement tool handler.
// Validate input, authorize the user, then insert into PostgreSQL.
