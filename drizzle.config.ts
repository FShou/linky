import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: 'sqlite', // 'mysql' | 'sqlite' | 'turso'
  schema: './db/schema/',
  driver: "d1-http",
  dbCredentials: {
    accountId: "94ab6cfa37f0de2a1683a380bf55dcf7",
    databaseId: "a4b3f7a8-d402-4cb4-9ca2-9bc22980eb9e",
    token: "1jW0viu5eYACpYWYt7sVr6EX0FiVG4xW-XqA_0tY"
  },
  out: './db/migrations/',
})
