import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

const timestamps = {
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`)
    .$onUpdateFn(() => new Date()),
};

export const users = sqliteTable("Users", {
  id: integer("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  fullname: text("fullname").notNull(),
  ...timestamps,
});

export const hasSessions = relations(users, ({ many }) => ({
  sessions: many(sessions),
}));

export const sessions = sqliteTable("Sessions", {
  id: integer("id").primaryKey(),
  session_token: text("session_token").unique(),
  session_data: text("session_data"),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  ...timestamps,
});

export const hasUser = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const links = sqliteTable("Links", {
  id: integer("id").primaryKey(),
  title: text("title").default("Link").notNull(),
  slug: text("slug").notNull().unique(),
  link: text("link").notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  ...timestamps,
});


export const pages = sqliteTable("Pages", {
  id: integer("id").primaryKey(),
  title: text("title").default("Pages").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").default(""),
  content: text("content", {mode: "json"}).$type<PageContent>(),
  published: integer({mode: "boolean"}).default(false).notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  ...timestamps
})
