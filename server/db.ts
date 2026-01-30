import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";



const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, "..", "ecocredit.db");

export const db = new Database(dbPath);

// Enable foreign keys
db.pragma("foreign_keys = ON");

// Create users table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT,
    carbon_credits INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS billing_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    energy_type TEXT NOT NULL,
    units_consumed REAL NOT NULL,
    carbon_emissions REAL NOT NULL,
    credits_earned INTEGER NOT NULL,
    date TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);
await db.exec(`
CREATE TABLE IF NOT EXISTS recycling_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT,
  waste_type TEXT,
  quantity REAL,
  credits INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);


// Add demo user if it doesn't exist
const existingDemo = db
  .prepare("SELECT id FROM users WHERE email = ?")
  .get("demo@example.com");

if (!existingDemo) {
  const hashedPassword = bcrypt.hashSync("password123", 10);
  const result = db
    .prepare(
      "INSERT INTO users (username, email, password_hash, full_name, carbon_credits) VALUES (?, ?, ?, ?, ?)",
    )
    .run("demouser", "demo@example.com", hashedPassword, "Demo User", 2450);

  const demoUserId = (result.lastInsertRowid as number) || 0;

  // Add sample billing data for demo user
  if (demoUserId) {
    db.prepare(
      "INSERT INTO billing_data (user_id, energy_type, units_consumed, carbon_emissions, credits_earned, date) VALUES (?, ?, ?, ?, ?, ?)",
    ).run(demoUserId, "Electricity (kWh)", 450, 180, 450, "2024-06-15");

    db.prepare(
      "INSERT INTO billing_data (user_id, energy_type, units_consumed, carbon_emissions, credits_earned, date) VALUES (?, ?, ?, ?, ?, ?)",
    ).run(demoUserId, "Electricity (kWh)", 520, 208, 520, "2024-05-15");

    db.prepare(
      "INSERT INTO billing_data (user_id, energy_type, units_consumed, carbon_emissions, credits_earned, date) VALUES (?, ?, ?, ?, ?, ?)",
    ).run(demoUserId, "Natural Gas (therms)", 12, 140, 280, "2024-04-15");
  }
}

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string | null;
  carbon_credits: number;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: number;
  user_id: number;
  token: string;
  created_at: string;
  expires_at: string;
}

export interface BillingData {
  id: number;
  user_id: number;
  energy_type: string;
  units_consumed: number;
  carbon_emissions: number;
  credits_earned: number;
  date: string;
  created_at: string;
}
