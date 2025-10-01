// server/index.ts

import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
// You will need to install an adapter library, e.g., 'express-to-worker'
// If you are using Cloudflare Pages, the official @cloudflare/pages-plugin-express might be a better fit.
import { toWorker } from 'express-to-worker'; 

// --- Utilities for Cloudflare Environment ---
// In a Worker environment, the built-in console is safe, and server logic is gone.
// We'll simplify these imports, assuming they are no longer necessary or are adapted.
// NOTE: Since we are running in a custom environment, setupVite and serveStatic must be handled by Cloudflare Pages/Vite itself.
// We remove the Node.js server setup and logger middleware for simplicity in the Worker context.

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ⚠️ We MUST remove the custom logger middleware that uses Node.js `res.on('finish')`
// and global server listeners, as these APIs don't exist in the Workers runtime.
// If logging is critical, you must use simple `console.log` within routes or a separate Worker middleware.

// --- Route Registration ---
// Use an asynchronous IIFE to handle the async route registration
(async () => {
    // This calls registerRoutes and configures your Express app.
    await registerRoutes(app);

    // --- Error Handler ---
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
        const status = err.status || err.statusCode || 500;
        const message = err.message || "Internal Server Error";

        // Simple error logging for debugging (will show in Cloudflare logs)
        console.error(`Error ${status}: ${message}`, err.stack);
        
        res.status(status).json({ message });
        
        // Don't re-throw the error, as it can halt the worker.
        // In Express error middleware, we send the response and stop.
    });

    // ⚠️ Development/Static Serving Logic Removed:
    // This logic belongs to your build process (Vite/Pages configuration) 
    // and conflicts with the Worker runtime.
    // Cloudflare Pages automatically handles static assets in the `/public` folder.
})();

// 🔑 THE CRITICAL CHANGE: Export the Worker Handler
// Convert the Express app into a handler compatible with Cloudflare's Fetch API.
// This is what Wrangler deploys and what Cloudflare executes.
// The `toWorker(app)` utility function handles mapping Fetch Requests/Responses to Express's Req/Res.
export default {
    fetch: toWorker(app)
};
