# AI Customer Support + MCP

Initial full-stack starter for an AI customer support platform.

## Stack
- Next.js + React + TypeScript + Tailwind CSS
- Node.js + Express
- PostgreSQL
- JWT authentication
- LLM API integration placeholder
- MCP agent/tool layer

## Structure
apps/web       -> Next.js frontend
apps/api       -> Express backend
apps/mcp       -> MCP server/tools
packages/db    -> PostgreSQL connection/schema
packages/shared -> shared TypeScript types

## Setup
1. Install Node.js 20+
2. Copy `.env.example` to `.env` and fill values.
3. Install dependencies in each app/package as you implement them.
4. Create the PostgreSQL database.
5. Start API, MCP server, and web app.

This is intentionally an initial scaffold. MCP/LLM calls are represented by clear TODOs so you can build them step-by-step.
