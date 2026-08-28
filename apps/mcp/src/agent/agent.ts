/**
 * Agent orchestration placeholder.
 *
 * Intended flow:
 * User message
 *   -> LLM
 *   -> model chooses an MCP tool
 *   -> MCP tool executes
 *   -> tool result returns to LLM
 *   -> final response
 *
 * TODO: Add your chosen LLM SDK/API.
 */
export async function runSupportAgent(message: string) {
  return {
    message,
    status: "not_implemented"
  };
}
