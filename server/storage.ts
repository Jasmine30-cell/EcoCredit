import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "data");

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const usersFile = path.join(dataDir, "users.json");
const billingFile = path.join(dataDir, "billing.json");
const sessionsFile = path.join(dataDir, "sessions.json");

// Types
export interface StoredUser {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  full_name: string | null;
  carbon_credits: number;
  created_at: string;
  updated_at: string;
}

export interface BillingEntry {
  id: number;
  user_id: number;
  energy_type: string;
  units_consumed: number;
  carbon_emissions: number;
  credits_earned: number;
  date: string;
  created_at: string;
}

export interface Session {
  user_id: number;
  token: string;
  expires_at: string;
}

// Initialize storage
function initializeStorage() {
  try {
    // Initialize users file
    if (!fs.existsSync(usersFile)) {
      fs.writeFileSync(
        usersFile,
        JSON.stringify({ users: [], nextId: 1 }, null, 2),
      );
    } else {
      // Validate file can be parsed
      const content = fs.readFileSync(usersFile, "utf-8");
      JSON.parse(content);
    }

    // Initialize billing file
    if (!fs.existsSync(billingFile)) {
      fs.writeFileSync(
        billingFile,
        JSON.stringify({ entries: [], nextId: 1 }, null, 2),
      );
    } else {
      const content = fs.readFileSync(billingFile, "utf-8");
      JSON.parse(content);
    }

    // Initialize sessions file
    if (!fs.existsSync(sessionsFile)) {
      fs.writeFileSync(sessionsFile, JSON.stringify({ sessions: {} }, null, 2));
    } else {
      const content = fs.readFileSync(sessionsFile, "utf-8");
      JSON.parse(content);
    }

    console.log("✓ Storage initialized successfully at:", dataDir);
  } catch (error) {
    console.error("✗ Storage initialization error:", error);
    process.exit(1);
  }
}

// Users storage
export const usersStorage = {
  getAll(): StoredUser[] {
    try {
      const content = fs.readFileSync(usersFile, "utf-8");
      const data = JSON.parse(content) as {
        users: StoredUser[];
      };
      return data.users;
    } catch (error) {
      console.error(`[STORAGE] Error reading users: ${error}`);
      return [];
    }
  },

  getById(id: number): StoredUser | undefined {
    return this.getAll().find((u) => u.id === id);
  },

  getByEmail(email: string): StoredUser | undefined {
    try {
      const users = this.getAll();
      console.log(
        `[STORAGE] Searching for user with email: ${email}. Total users in storage: ${users.length}`,
      );
      const user = users.find((u) => u.email === email);
      if (user) {
        console.log(`[STORAGE] Found user: ${email}`);
      } else {
        console.log(`[STORAGE] User not found: ${email}`);
      }
      return user;
    } catch (error) {
      console.error(`[STORAGE] Error retrieving user by email: ${error}`);
      return undefined;
    }
  },

  getByUsername(username: string): StoredUser | undefined {
    return this.getAll().find((u) => u.username === username);
  },

  save(user: StoredUser): void {
    try {
      const content = fs.readFileSync(usersFile, "utf-8");
      const data = JSON.parse(content) as {
        users: StoredUser[];
        nextId: number;
      };
      const existingIndex = data.users.findIndex((u) => u.id === user.id);

      if (existingIndex >= 0) {
        data.users[existingIndex] = user;
        console.log(`[STORAGE] Updated user ${user.id}`);
      } else {
        data.users.push(user);
        console.log(`[STORAGE] Added new user ${user.id}: ${user.email}`);
      }

      fs.writeFileSync(usersFile, JSON.stringify(data, null, 2));
      console.log(
        `[STORAGE] User file saved. Total users: ${data.users.length}`,
      );
    } catch (error) {
      console.error(`[STORAGE] Error saving user: ${error}`);
      throw error;
    }
  },

  getNextId(): number {
    try {
      const content = fs.readFileSync(usersFile, "utf-8");
      const data = JSON.parse(content) as {
        users: StoredUser[];
        nextId: number;
      };
      const nextId = data.nextId;
      data.nextId++;
      fs.writeFileSync(usersFile, JSON.stringify(data, null, 2));
      console.log(`[STORAGE] Generated new ID: ${nextId}`);
      return nextId;
    } catch (error) {
      console.error(`[STORAGE] Error generating ID: ${error}`);
      throw error;
    }
  },
};

// Billing storage
export const billingStorage = {
  getByUserId(userId: number): BillingEntry[] {
    try {
      const data = JSON.parse(fs.readFileSync(billingFile, "utf-8")) as {
        entries: BillingEntry[];
      };
      return data.entries.filter((e) => e.user_id === userId);
    } catch {
      return [];
    }
  },

  getAll(): BillingEntry[] {
    try {
      const data = JSON.parse(fs.readFileSync(billingFile, "utf-8")) as {
        entries: BillingEntry[];
      };
      return data.entries;
    } catch {
      return [];
    }
  },

  save(entry: BillingEntry): void {
    const data = JSON.parse(fs.readFileSync(billingFile, "utf-8")) as {
      entries: BillingEntry[];
      nextId: number;
    };
    data.entries.push(entry);
    fs.writeFileSync(billingFile, JSON.stringify(data, null, 2));
  },

  getNextId(): number {
    const data = JSON.parse(fs.readFileSync(billingFile, "utf-8")) as {
      nextId: number;
    };
    const nextId = data.nextId;
    data.nextId++;
    fs.writeFileSync(billingFile, JSON.stringify(data, null, 2));
    return nextId;
  },
};

// Sessions storage
export const sessionsStorage = {
  get(token: string): Session | undefined {
    try {
      const data = JSON.parse(fs.readFileSync(sessionsFile, "utf-8")) as {
        sessions: Record<string, Session>;
      };
      return data.sessions[token];
    } catch {
      return undefined;
    }
  },

  set(token: string, session: Session): void {
    const data = JSON.parse(fs.readFileSync(sessionsFile, "utf-8")) as {
      sessions: Record<string, Session>;
    };
    data.sessions[token] = session;
    fs.writeFileSync(sessionsFile, JSON.stringify(data, null, 2));
  },

  delete(token: string): void {
    const data = JSON.parse(fs.readFileSync(sessionsFile, "utf-8")) as {
      sessions: Record<string, Session>;
    };
    delete data.sessions[token];
    fs.writeFileSync(sessionsFile, JSON.stringify(data, null, 2));
  },
};

// Initialize on module load
initializeStorage();
