export const getOrderStatusTool = {
  name: "get_order_status",
  description: "Get the current status of a customer's order.",
  inputSchema: {
    type: "object",
    properties: {
      orderId: { type: "string" }
    },
    required: ["orderId"]
  }
};

// TODO: Implement tool handler.
// It should authenticate/authorize the request and query PostgreSQL.
