import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const tributeVisitsTable = pgTable("tribute_visits", {
  id: serial("id").primaryKey(),
  ip: text("ip"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tributeLikesTable = pgTable("tribute_likes", {
  id: serial("id").primaryKey(),
  ip: text("ip"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tributeMessagesTable = pgTable("tribute_messages", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  ip: text("ip"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tributeSharesTable = pgTable("tribute_shares", {
  id: serial("id").primaryKey(),
  ip: text("ip"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tributeSettingsTable = pgTable("tribute_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertTributeMessageSchema = createInsertSchema(tributeMessagesTable).omit({ id: true, ip: true, createdAt: true });
export type InsertTributeMessage = z.infer<typeof insertTributeMessageSchema>;
export type TributeMessage = typeof tributeMessagesTable.$inferSelect;
export type TributeSetting = typeof tributeSettingsTable.$inferSelect;
