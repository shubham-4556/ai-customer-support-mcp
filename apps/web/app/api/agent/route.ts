import { NextResponse } from "next/server";

// Mock Database Records for initial demo integration
const MOCK_CUSTOMERS: Record<string, { id: string; name: string; email: string; tier: string; activeTickets: number }> = {
  "cust_902": { id: "cust_902", name: "Sarah Jenkins", email: "sarah.j@example.com", tier: "VIP Pro", activeTickets: 1 },
  "cust_104": { id: "cust_104", name: "Alex Vance", email: "alex.v@techcorp.io", tier: "Enterprise", activeTickets: 0 },
  "cust_550": { id: "cust_550", name: "Elena Rostova", email: "elena@designstudio.co", tier: "Standard", activeTickets: 2 },
};

const MOCK_ORDERS: Record<string, { id: string; customerId: string; item: string; status: string; trackingNumber: string; eta: string; total: string }> = {
  "ORD-8942": { id: "ORD-8942", customerId: "cust_902", item: "Ergonomic Smart Chair Pro", status: "In Transit", trackingNumber: "TRK-99281-US", eta: "Tomorrow by 2:00 PM", total: "$429.00" },
  "ORD-3109": { id: "ORD-3109", customerId: "cust_104", item: "UltraWide 4K Developer Monitor", status: "Delivered", trackingNumber: "TRK-44102-US", eta: "Delivered Aug 24", total: "$899.00" },
  "ORD-7712": { id: "ORD-7712", customerId: "cust_550", item: "Wireless ANC Headphones X", status: "Processing in Warehouse", trackingNumber: "Pending Allocation", eta: "Aug 30, 2026", total: "$199.00" },
};

export async function POST(req: Request) {
  try {
    const { message, customerId = "cust_902" } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message string is required" }, { status: 400 });
    }

    const lowercaseMsg = message.toLowerCase();
    const steps: Array<{ type: "thought" | "tool_call" | "tool_result"; content: string; toolName?: string; params?: any; result?: any }> = [];

    // Analyze intent and map to MCP Tools
    if (lowercaseMsg.includes("order") || lowercaseMsg.includes("ord-") || lowercaseMsg.includes("track") || lowercaseMsg.includes("ship")) {
      // Extract order ID if present or default to ORD-8942
      const match = message.match(/ORD-\d+/i);
      const orderId = match ? match[0].toUpperCase() : "ORD-8942";

      steps.push({
        type: "thought",
        content: `User query involves order status. Identifying target order ID: ${orderId}`
      });

      steps.push({
        type: "tool_call",
        toolName: "get_order_status",
        params: { orderId }
      });

      const orderData = MOCK_ORDERS[orderId] || {
        id: orderId,
        customerId,
        item: "Custom Order Package",
        status: "In Transit",
        trackingNumber: `TRK-${Math.floor(10000 + Math.random() * 90000)}-US`,
        eta: "2 Business Days",
        total: "$149.99"
      };

      steps.push({
        type: "tool_result",
        toolName: "get_order_status",
        result: orderData
      });

      return NextResponse.json({
        reply: `Here is the current tracking update for **Order ${orderData.id}** (${orderData.item}):\n\n- **Status**: \`${orderData.status}\`\n- **Tracking Number**: \`${orderData.trackingNumber}\`\n- **Estimated Delivery**: ${orderData.eta}\n- **Total Amount**: ${orderData.total}\n\nWould you like me to notify you via SMS when it arrives?`,
        steps,
        timestamp: new Date().toISOString()
      });

    } else if (lowercaseMsg.includes("customer") || lowercaseMsg.includes("user") || lowercaseMsg.includes("profile") || lowercaseMsg.includes("cust_")) {
      const match = message.match(/cust_\d+/i);
      const targetCustId = match ? match[0].toLowerCase() : customerId;

      steps.push({
        type: "thought",
        content: `Query requires customer metadata lookup for ID: ${targetCustId}`
      });

      steps.push({
        type: "tool_call",
        toolName: "get_customer",
        params: { customerId: targetCustId }
      });

      const customerData = MOCK_CUSTOMERS[targetCustId] || {
        id: targetCustId,
        name: "Valued Customer",
        email: "customer@example.com",
        tier: "Standard Gold",
        activeTickets: 0
      };

      steps.push({
        type: "tool_result",
        toolName: "get_customer",
        result: customerData
      });

      return NextResponse.json({
        reply: `Retrieved record for **${customerData.name}** (\`${customerData.id}\`):\n\n- **Email**: ${customerData.email}\n- **Membership Tier**: ${customerData.tier}\n- **Active Tickets**: ${customerData.activeTickets}\n\nHow can I further assist with this profile?`,
        steps,
        timestamp: new Date().toISOString()
      });

    } else if (lowercaseMsg.includes("ticket") || lowercaseMsg.includes("issue") || lowercaseMsg.includes("bug") || lowercaseMsg.includes("refund") || lowercaseMsg.includes("create")) {
      const ticketId = `TCK-${Math.floor(1000 + Math.random() * 9000)}`;

      steps.push({
        type: "thought",
        content: "User request indicates support escalation. Generating automated support ticket."
      });

      steps.push({
        type: "tool_call",
        toolName: "create_support_ticket",
        params: {
          customerId,
          subject: message.slice(0, 50) + "...",
          message: message,
          priority: lowercaseMsg.includes("urgent") || lowercaseMsg.includes("refund") ? "high" : "medium"
        }
      });

      const newTicket = {
        ticketId,
        customerId,
        subject: message.slice(0, 60),
        status: "open",
        assignedTeam: "Tier-2 Technical Operations",
        createdTime: "Just now"
      };

      steps.push({
        type: "tool_result",
        toolName: "create_support_ticket",
        result: newTicket
      });

      return NextResponse.json({
        reply: `I've registered your issue under Support Ticket **#${ticketId}**.\n\n- **Assigned Team**: ${newTicket.assignedTeam}\n- **Priority**: ${lowercaseMsg.includes("urgent") ? "High 🔴" : "Standard 🟡"}\n- **Status**: \`open\`\n\nOur engineering team has been notified and will reach out within 2 hours.`,
        steps,
        timestamp: new Date().toISOString()
      });

    } else {
      // General customer support knowledge base inquiry
      steps.push({
        type: "thought",
        content: "Query categorized as knowledge base lookup. Invoking internal support doc retriever."
      });

      steps.push({
        type: "tool_call",
        toolName: "query_knowledge_base",
        params: { query: message, limit: 2 }
      });

      steps.push({
        type: "tool_result",
        toolName: "query_knowledge_base",
        result: {
          matchedDocs: 2,
          relevanceScore: 0.96,
          sources: ["Return_Policy_2026.pdf", "MCP_Support_SLA.md"]
        }
      });

      return NextResponse.json({
        reply: `Thank you for contacting AI Support! Powered by our **Model Context Protocol (MCP)** agent:\n\n1. **Standard Returns**: You have a 30-day money-back guarantee on all hardware items.\n2. **Express Shipping**: Orders placed before 3 PM EST ship the same day.\n3. **MCP Integration**: Real-time tools connect directly to PostgreSQL database schemas.\n\nHow else can I help you today? You can ask me to track an order (e.g. \`ORD-8942\`), check customer details, or open a support ticket!`,
        steps,
        timestamp: new Date().toISOString()
      });
    }

  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to process agent request" }, { status: 500 });
  }
}
