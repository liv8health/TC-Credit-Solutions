import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import multer from "multer";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertConsultationSchema, insertChatMessageSchema, insertContactSubmissionSchema } from "@shared/schema";
import { creditRepairAI } from "./aiService";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Consultation routes
  app.post('/api/consultations', async (req, res) => {
    try {
      const validatedData = insertConsultationSchema.parse(req.body);
      const consultation = await storage.createConsultation(validatedData);
      res.json(consultation);
    } catch (error) {
      console.error("Error creating consultation:", error);
      res.status(400).json({ message: "Invalid consultation data" });
    }
  });

  app.get('/api/consultations', isAuthenticated, async (req, res) => {
    try {
      const consultations = await storage.getConsultations();
      res.json(consultations);
    } catch (error) {
      console.error("Error fetching consultations:", error);
      res.status(500).json({ message: "Failed to fetch consultations" });
    }
  });

  // Contact form routes
  app.post('/api/contact', async (req, res) => {
    try {
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      const contact = await storage.createContactSubmission(validatedData);
      res.json(contact);
    } catch (error) {
      console.error("Error creating contact submission:", error);
      res.status(400).json({ message: "Invalid contact data" });
    }
  });

  // Protected chat routes
  app.get('/api/chat/messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const messages = await storage.getChatMessages(userId);
      res.json(messages.reverse()); // Return in chronological order
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post('/api/chat/messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const messageData = insertChatMessageSchema.parse({
        ...req.body,
        userId,
        isFromTeam: false,
      });
      
      // Save user message
      const userMessage = await storage.createChatMessage(messageData);
      
      // Generate AI response
      const aiResponse = await creditRepairAI.generateResponse(messageData.message);
      
      // Save AI response if it's automated
      if (aiResponse.type === 'automated') {
        const aiMessageData = {
          userId,
          message: aiResponse.message,
          isFromTeam: true,
          teamMemberName: "TC Credit AI Assistant"
        };
        const aiMessage = await storage.createChatMessage(aiMessageData);
        
        // Broadcast AI response via WebSocket
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              type: 'ai_response',
              data: aiMessage
            }));
          }
        });
      } else {
        // If escalated, notify live agents
        const escalationMessage = {
          userId,
          message: "🔔 This conversation has been escalated to a live agent. A team member will respond shortly.",
          isFromTeam: true,
          teamMemberName: "System"
        };
        const systemMessage = await storage.createChatMessage(escalationMessage);
        
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              type: 'escalation_notice',
              data: systemMessage
            }));
          }
        });
      }
      
      res.json(userMessage);
    } catch (error) {
      console.error("Error creating chat message:", error);
      res.status(400).json({ message: "Invalid message data" });
    }
  });

  // Document routes
  app.get('/api/documents', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const documents = await storage.getUserDocuments(userId);
      res.json(documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  app.post('/api/documents/upload', isAuthenticated, upload.single('file'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const userId = req.user.claims.sub;
      const document = await storage.createDocument({
        userId,
        fileName: req.file.filename,
        originalName: req.file.originalname,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        uploadedBy: 'user',
        isShared: false,
      });

      res.json(document);
    } catch (error) {
      console.error("Error uploading document:", error);
      res.status(500).json({ message: "Failed to upload document" });
    }
  });

  app.get('/api/documents/:id/download', isAuthenticated, async (req: any, res) => {
    try {
      const documentId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const document = await storage.getDocument(documentId);

      if (!document || document.userId !== userId) {
        return res.status(404).json({ message: "Document not found" });
      }

      const filePath = path.join(uploadDir, document.fileName);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "File not found on disk" });
      }

      res.setHeader('Content-Disposition', `attachment; filename="${document.originalName}"`);
      res.setHeader('Content-Type', document.mimeType);
      res.sendFile(filePath);
    } catch (error) {
      console.error("Error downloading document:", error);
      res.status(500).json({ message: "Failed to download document" });
    }
  });

  // Credit progress routes
  app.get('/api/credit/progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const progress = await storage.getLatestCreditProgress(userId);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching credit progress:", error);
      res.status(500).json({ message: "Failed to fetch credit progress" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket server for real-time chat
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws) => {
    console.log('New WebSocket connection established');

    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        if (message.type === 'chat_message') {
          // Broadcast message to relevant users
          wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: 'new_message',
                data: message.data
              }));
            }
          });
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });
  });

  return httpServer;
}
