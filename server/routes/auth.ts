import { RequestHandler } from "express";
import { z } from "zod";
import crypto from "crypto";
import { usersStorage, sessionsStorage } from "../storage";

// Simple password hashing (not secure - for demo only)
export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

// Validation schemas
const SignupSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_-]+$/),
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().optional(),
});

const SigninSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: {
    id: number;
    username: string;
    email: string;
    full_name: string | null;
    carbon_credits: number;
    created_at: string;
    updated_at: string;
  };
  token?: string;
}

// Sign up endpoint
export const handleSignup: RequestHandler = async (req, res) => {
  try {
    const data = SignupSchema.parse(req.body);
    console.log(`[SIGNUP] New signup request for email: ${data.email}`);

    // Check if user already exists
    const existingUserByEmail = usersStorage.getByEmail(data.email);
    const existingUserByUsername = usersStorage.getByUsername(data.username);

    if (existingUserByEmail || existingUserByUsername) {
      console.log(`[SIGNUP] User already exists: ${data.email}`);
      return res.status(400).json({
        success: false,
        message: "Email or username already exists",
      } as AuthResponse);
    }

    // Hash password
    const passwordHash = hashPassword(data.password);
    console.log(`[SIGNUP] Password hashed for: ${data.email}`);

    // Create user
    const userId = usersStorage.getNextId();
    const now = new Date().toISOString();
    const user = {
      id: userId,
      username: data.username,
      email: data.email,
      password_hash: passwordHash,
      full_name: data.fullName || null,
      carbon_credits: 0,
      created_at: now,
      updated_at: now,
    };

    usersStorage.save(user);
    console.log(`[SIGNUP] User saved successfully with ID: ${userId}`);

    // Create session token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    sessionsStorage.set(token, {
      user_id: userId,
      token,
      expires_at: expiresAt.toISOString(),
    });

    const { password_hash, ...userWithoutPassword } = user;

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: userWithoutPassword,
      token,
    } as AuthResponse);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Invalid input",
      } as AuthResponse);
    }
    console.error("Signup error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    } as AuthResponse);
  }
};

// Sign in endpoint
export const handleSignin: RequestHandler = async (req, res) => {
  try {
    const data = SigninSchema.parse(req.body);

    // Find user by email
    const user = usersStorage.getByEmail(data.email);

    if (!user) {
      console.log(`[SIGNIN] User not found with email: ${data.email}`);
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      } as AuthResponse);
    }

    // Verify password
    const isValidPassword = verifyPassword(data.password, user.password_hash);
    const inputHash = hashPassword(data.password);
    const storedHash = user.password_hash;

    console.log(`[SIGNIN] User: ${user.email}`);
    console.log(`[SIGNIN] Input hash matches: ${inputHash === storedHash}`);

    if (!isValidPassword) {
      console.log(`[SIGNIN] Password verification failed for: ${data.email}`);
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      } as AuthResponse);
    }

    console.log(`[SIGNIN] Signin successful for: ${data.email}`);

    // Create session token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    sessionsStorage.set(token, {
      user_id: user.id,
      token,
      expires_at: expiresAt.toISOString(),
    });

    const { password_hash, ...userWithoutPassword } = user;

    return res.status(200).json({
      success: true,
      message: "Signed in successfully",
      user: userWithoutPassword,
      token,
    } as AuthResponse);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Invalid input",
      } as AuthResponse);
    }
    console.error("Signin error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    } as AuthResponse);
  }
};

// Verify token endpoint
export const handleVerifyToken: RequestHandler = (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      } as AuthResponse);
    }

    // Check if token is valid and not expired
    const session = sessionsStorage.get(token);

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      } as AuthResponse);
    }

    // Check if token is expired
    if (new Date(session.expires_at) < new Date()) {
      sessionsStorage.delete(token);
      return res.status(401).json({
        success: false,
        message: "Token expired",
      } as AuthResponse);
    }

    // Get user data
    const user = usersStorage.getById(session.user_id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      } as AuthResponse);
    }

    const { password_hash, ...userWithoutPassword } = user;

    return res.status(200).json({
      success: true,
      user: userWithoutPassword,
      token,
    } as AuthResponse);
  } catch (error) {
    console.error("Verify token error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    } as AuthResponse);
  }
};

// Logout endpoint
export const handleLogout: RequestHandler = (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "No token provided",
      } as AuthResponse);
    }

    // Delete session
    sessionsStorage.delete(token);

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    } as AuthResponse);
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    } as AuthResponse);
  }
};
