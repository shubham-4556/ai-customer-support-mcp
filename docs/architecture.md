# Architecture

## Initial flow

Next.js frontend
      |
      v
Express API
      |
      +---- JWT authentication
      |
      v
AI Agent
      |
      v
MCP tools
      |
      v
PostgreSQL

## Initial MCP tools

- get_customer
- get_order_status
- create_support_ticket

## Next steps

1. Initialize npm dependencies.
2. Configure PostgreSQL connection.
3. Implement registration/login and JWT.
4. Add protected API routes.
5. Add the official MCP SDK and register tools.
6. Connect an LLM API.
7. Implement tool-calling agent loop.
8. Connect the Next.js chat UI.
