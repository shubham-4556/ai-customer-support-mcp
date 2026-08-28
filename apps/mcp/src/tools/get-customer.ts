export const getCustomerTool = {
  name: "get_customer",
  description: "Find customer information by customer ID.",
  inputSchema: {
    type: "object",
    properties: {
      customerId: { type: "string" }
    },
    required: ["customerId"]
  }
};

// TODO: Implement tool handler.
