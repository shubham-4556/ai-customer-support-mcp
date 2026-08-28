// TODO: Install pg or your preferred PostgreSQL client.
// Create a shared connection pool here.

export const db = {
  query: async (_sql: string, _params: unknown[] = []) => {
    throw new Error("Database client not configured yet.");
  }
};
