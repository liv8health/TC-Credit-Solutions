import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  decimal
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  membershipTier: varchar("membership_tier").$type<"single" | "couples" | "vip">(),
  membershipStatus: varchar("membership_status").$type<"active" | "inactive" | "suspended">().default("inactive"),
  approvalStatus: varchar("approval_status").$type<"pending" | "approved" | "rejected">().default("pending"),
  vboutApiKey: varchar("vbout_api_key"),
  gohighlevelApiKey: varchar("gohighlevel_api_key"),
  joinDate: timestamp("join_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User applications for admin approval
export const userApplications = pgTable("user_applications", {
  id: serial("id").primaryKey(),
  email: varchar("email").unique().notNull(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  phone: varchar("phone"),
  membershipTier: varchar("membership_tier").$type<"single" | "couples" | "vip">().default("single"),
  status: varchar("status").$type<"pending" | "approved" | "rejected">().default("pending"),
  notes: text("notes"),
  submittedAt: timestamp("submitted_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: varchar("reviewed_by"),
});

// Consultation requests
export const consultations = pgTable("consultations", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  email: varchar("email").notNull(),
  phone: varchar("phone").notNull(),
  bestTimeToCall: varchar("best_time_to_call"),
  currentCreditScore: varchar("current_credit_score"),
  primaryGoal: varchar("primary_goal"),
  timeline: varchar("timeline"),
  negativeItems: text("negative_items").array(),
  additionalComments: text("additional_comments"),
  status: varchar("status").$type<"pending" | "contacted" | "scheduled" | "completed">().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Chat messages
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  message: text("message").notNull(),
  isFromTeam: boolean("is_from_team").default(false),
  teamMemberName: varchar("team_member_name"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Documents
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  fileName: varchar("file_name").notNull(),
  originalName: varchar("original_name").notNull(),
  fileSize: integer("file_size").notNull(),
  mimeType: varchar("mime_type").notNull(),
  uploadedBy: varchar("uploaded_by").$type<"user" | "team">().notNull(),
  isShared: boolean("is_shared").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Credit progress tracking
export const creditProgress = pgTable("credit_progress", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  bureau: varchar("bureau").$type<"experian" | "equifax" | "transunion">().notNull(),
  score: integer("score"),
  previousScore: integer("previous_score"),
  itemsRemoved: integer("items_removed").default(0),
  disputesActive: integer("disputes_active").default(0),
  recordedAt: timestamp("recorded_at").defaultNow(),
});

// Contact form submissions
export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  email: varchar("email").notNull(),
  phone: varchar("phone"),
  subject: varchar("subject"),
  message: text("message").notNull(),
  status: varchar("status").$type<"new" | "responded" | "closed">().default("new"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  chatMessages: many(chatMessages),
  documents: many(documents),
  creditProgress: many(creditProgress),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  user: one(users, {
    fields: [chatMessages.userId],
    references: [users.id],
  }),
}));

export const documentsRelations = relations(documents, ({ one }) => ({
  user: one(users, {
    fields: [documents.userId],
    references: [users.id],
  }),
}));

export const creditProgressRelations = relations(creditProgress, ({ one }) => ({
  user: one(users, {
    fields: [creditProgress.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertConsultationSchema = createInsertSchema(consultations).omit({
  id: true,
  status: true,
  createdAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  timestamp: true,
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  createdAt: true,
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  status: true,
  createdAt: true,
});

export const insertUserApplicationSchema = createInsertSchema(userApplications).omit({
  id: true,
  status: true,
  submittedAt: true,
  reviewedAt: true,
  reviewedBy: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertUserApplication = z.infer<typeof insertUserApplicationSchema>;
export type UserApplication = typeof userApplications.$inferSelect;
export type InsertConsultation = z.infer<typeof insertConsultationSchema>;
export type Consultation = typeof consultations.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;
export type CreditProgress = typeof creditProgress.$inferSelect;
export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
