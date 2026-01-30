import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import recyclingRoutes from "./routes/recycling";
import analyticsRoutes from "./routes/analytics";

import {
  handleSignup,
  handleSignin,
  handleVerifyToken,
  handleLogout,
} from "./routes/auth";
import {
  handleBillingUpload,
  handleGetBillingHistory,
  handleGetLeaderboard,
  handleGetUserDashboard,
} from "./routes/billing";
 
export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/api/recycling", recyclingRoutes);
  app.use("/api/analytics", analyticsRoutes);

 


  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Auth routes
  app.post("/api/auth/signup", handleSignup);
  app.post("/api/auth/signin", handleSignin);
  app.post("/api/auth/verify", handleVerifyToken);
  app.post("/api/auth/logout", handleLogout);

  // Billing routes
  app.post("/api/billing/upload", handleBillingUpload);
  app.get("/api/billing/history", handleGetBillingHistory);
  app.get("/api/billing/dashboard", handleGetUserDashboard);
  app.get("/api/leaderboard", handleGetLeaderboard);



  return app;
}
