import {
  users,
  consultations,
  chatMessages,
  documents,
  creditProgress,
  contactSubmissions,
  userApplications,
  type User,
  type UpsertUser,
  type InsertConsultation,
  type Consultation,
  type InsertChatMessage,
  type ChatMessage,
  type InsertDocument,
  type Document,
  type CreditProgress,
  type InsertContactSubmission,
  type ContactSubmission,
  type InsertUserApplication,
  type UserApplication,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Consultation operations
  createConsultation(consultation: InsertConsultation): Promise<Consultation>;
  getConsultations(): Promise<Consultation[]>;
  updateConsultationStatus(id: number, status: "pending" | "contacted" | "scheduled" | "completed"): Promise<void>;
  
  // Chat operations
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatMessages(userId: string, limit?: number): Promise<ChatMessage[]>;
  
  // Document operations
  createDocument(document: InsertDocument): Promise<Document>;
  getUserDocuments(userId: string): Promise<Document[]>;
  getDocument(id: number): Promise<Document | undefined>;
  deleteDocument(id: number): Promise<void>;
  
  // Credit progress operations
  getUserCreditProgress(userId: string): Promise<CreditProgress[]>;
  getLatestCreditProgress(userId: string): Promise<CreditProgress[]>;
  
  // Contact operations
  createContactSubmission(contact: InsertContactSubmission): Promise<ContactSubmission>;
  getContactSubmissions(): Promise<ContactSubmission[]>;
  
  // User application operations
  createUserApplication(application: InsertUserApplication): Promise<UserApplication>;
  getUserApplications(): Promise<UserApplication[]>;
  getUserApplicationByEmail(email: string): Promise<UserApplication | undefined>;
  updateApplicationStatus(id: number, status: "pending" | "approved" | "rejected", notes?: string, reviewerId?: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Consultation operations
  async createConsultation(consultation: InsertConsultation): Promise<Consultation> {
    const [created] = await db
      .insert(consultations)
      .values(consultation)
      .returning();
    return created;
  }

  async getConsultations(): Promise<Consultation[]> {
    return await db
      .select()
      .from(consultations)
      .orderBy(desc(consultations.createdAt));
  }

  async updateConsultationStatus(id: number, status: "pending" | "contacted" | "scheduled" | "completed"): Promise<void> {
    await db
      .update(consultations)
      .set({ status })
      .where(eq(consultations.id, id));
  }

  // Chat operations
  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [created] = await db
      .insert(chatMessages)
      .values(message)
      .returning();
    return created;
  }

  async getChatMessages(userId: string, limit: number = 50): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.userId, userId))
      .orderBy(desc(chatMessages.timestamp))
      .limit(limit);
  }

  // Document operations
  async createDocument(document: InsertDocument): Promise<Document> {
    const [created] = await db
      .insert(documents)
      .values(document)
      .returning();
    return created;
  }

  async getUserDocuments(userId: string): Promise<Document[]> {
    return await db
      .select()
      .from(documents)
      .where(eq(documents.userId, userId))
      .orderBy(desc(documents.createdAt));
  }

  async getDocument(id: number): Promise<Document | undefined> {
    const [document] = await db
      .select()
      .from(documents)
      .where(eq(documents.id, id));
    return document;
  }

  async deleteDocument(id: number): Promise<void> {
    await db
      .delete(documents)
      .where(eq(documents.id, id));
  }

  // Credit progress operations
  async getUserCreditProgress(userId: string): Promise<CreditProgress[]> {
    return await db
      .select()
      .from(creditProgress)
      .where(eq(creditProgress.userId, userId))
      .orderBy(desc(creditProgress.recordedAt));
  }

  async getLatestCreditProgress(userId: string): Promise<CreditProgress[]> {
    return await db
      .select()
      .from(creditProgress)
      .where(eq(creditProgress.userId, userId))
      .orderBy(desc(creditProgress.recordedAt))
      .limit(3);
  }

  // Contact operations
  async createContactSubmission(contact: InsertContactSubmission): Promise<ContactSubmission> {
    const [created] = await db
      .insert(contactSubmissions)
      .values(contact)
      .returning();
    return created;
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return await db
      .select()
      .from(contactSubmissions)
      .orderBy(desc(contactSubmissions.createdAt));
  }
}

export const storage = new DatabaseStorage();
