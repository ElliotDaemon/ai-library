import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Tool submissions from users
 * Stores suggested AI tools that visitors submit
 */
export const toolSubmissions = mysqlTable("tool_submissions", {
  id: int("id").autoincrement().primaryKey(),
  /** Name of the AI tool */
  toolName: varchar("toolName", { length: 256 }).notNull(),
  /** URL of the tool */
  toolUrl: varchar("toolUrl", { length: 512 }).notNull(),
  /** Category suggestion */
  category: varchar("category", { length: 128 }),
  /** Description of the tool */
  description: text("description"),
  /** Submitter's email (optional) */
  submitterEmail: varchar("submitterEmail", { length: 320 }),
  /** IP address hash for tracking */
  ipHash: varchar("ipHash", { length: 64 }).notNull(),
  /** Status of the submission */
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  /** Whether this is marked as a hidden gem */
  isHiddenGem: boolean("isHiddenGem").default(false).notNull(),
  /** AI validation result */
  aiValidated: boolean("aiValidated").default(false).notNull(),
  /** AI validation score (0-100) */
  aiScore: int("aiScore"),
  /** AI validation notes */
  aiNotes: text("aiNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ToolSubmission = typeof toolSubmissions.$inferSelect;
export type InsertToolSubmission = typeof toolSubmissions.$inferInsert;

/**
 * IP-based favorites tracking
 * Stores favorite tools by IP hash (no account required)
 */
export const favorites = mysqlTable("favorites", {
  id: int("id").autoincrement().primaryKey(),
  /** Hashed IP address for privacy */
  ipHash: varchar("ipHash", { length: 64 }).notNull(),
  /** Tool ID from the mindmap data */
  toolId: varchar("toolId", { length: 128 }).notNull(),
  /** Tool name for display */
  toolName: varchar("toolName", { length: 256 }).notNull(),
  /** Tool URL */
  toolUrl: varchar("toolUrl", { length: 512 }),
  /** Category of the tool */
  category: varchar("category", { length: 128 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = typeof favorites.$inferInsert;

/**
 * Click tracking for trending tools
 * Tracks which tools are clicked to determine popularity
 */
export const toolClicks = mysqlTable("tool_clicks", {
  id: int("id").autoincrement().primaryKey(),
  /** Tool ID from the mindmap data */
  toolId: varchar("toolId", { length: 128 }).notNull(),
  /** Tool name for reference */
  toolName: varchar("toolName", { length: 256 }).notNull(),
  /** Tool URL */
  toolUrl: varchar("toolUrl", { length: 512 }),
  /** Category of the tool */
  category: varchar("category", { length: 128 }),
  /** Hashed IP address for unique click tracking */
  ipHash: varchar("ipHash", { length: 64 }).notNull(),
  /** Timestamp of the click */
  clickedAt: timestamp("clickedAt").defaultNow().notNull(),
});

export type ToolClick = typeof toolClicks.$inferSelect;
export type InsertToolClick = typeof toolClicks.$inferInsert;

/**
 * Admin passkey storage
 * Stores hashed passkey for admin authentication
 */
export const adminSettings = mysqlTable("admin_settings", {
  id: int("id").autoincrement().primaryKey(),
  /** Setting key */
  settingKey: varchar("settingKey", { length: 64 }).notNull().unique(),
  /** Setting value (hashed for sensitive data) */
  settingValue: text("settingValue").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AdminSetting = typeof adminSettings.$inferSelect;
export type InsertAdminSetting = typeof adminSettings.$inferInsert;
