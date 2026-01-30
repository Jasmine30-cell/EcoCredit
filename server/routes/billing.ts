import { RequestHandler } from "express";
import { z } from "zod";
import { usersStorage, billingStorage, sessionsStorage } from "../storage";

// Carbon conversion factors (kg CO2 per unit)
const CARBON_FACTORS: Record<string, number> = {
  "Electricity (kWh)": 0.4,
  "Natural Gas (therms)": 5.3,
  "Fuel Oil (gallons)": 10.2,
  "Gasoline (gallons)": 8.9,
};

// Credits conversion (1 kg CO2 reduction = 1 credit)
const CREDITS_MULTIPLIER = 1;

const BillingSchema = z.object({
  energy_type: z.string(),
  units_consumed: z.number().positive(),
  date: z.string(),
});

interface BillingResponse {
  success: boolean;
  message?: string;
  data?: {
    id: number;
    user_id: number;
    energy_type: string;
    units_consumed: number;
    carbon_emissions: number;
    credits_earned: number;
    date: string;
    created_at: string;
  };
}

// Upload billing data
export const handleBillingUpload: RequestHandler = (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      } as BillingResponse);
    }

    // Verify token
    const session = sessionsStorage.get(token);
    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      } as BillingResponse);
    }

    const data = BillingSchema.parse(req.body);
    const userId = session.user_id;
    const user = usersStorage.getById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      } as BillingResponse);
    }

    // Calculate carbon emissions
    const carbonFactor = CARBON_FACTORS[data.energy_type] || 0.5;
    const carbonEmissions = data.units_consumed * carbonFactor;
    const creditsEarned = Math.round(carbonEmissions * CREDITS_MULTIPLIER);

    // Create billing entry
    const billingId = billingStorage.getNextId();
    const billingEntry = {
      id: billingId,
      user_id: userId,
      energy_type: data.energy_type,
      units_consumed: data.units_consumed,
      carbon_emissions: carbonEmissions,
      credits_earned: creditsEarned,
      date: data.date,
      created_at: new Date().toISOString(),
    };

    // Store billing data
    billingStorage.save(billingEntry);

    // Update user's carbon credits
    user.carbon_credits += creditsEarned;
    user.updated_at = new Date().toISOString();
    usersStorage.save(user);

    return res.status(201).json({
      success: true,
      message: "Billing data submitted successfully",
      data: billingEntry,
    } as BillingResponse);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Invalid input",
      } as BillingResponse);
    }
    console.error("Billing upload error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    } as BillingResponse);
  }
};

// Get user's billing history
export const handleGetBillingHistory: RequestHandler = (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const session = sessionsStorage.get(token);
    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    const userBillingData = billingStorage.getByUserId(session.user_id);

    return res.status(200).json({
      success: true,
      data: userBillingData,
    });
  } catch (error) {
    console.error("Get billing history error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get user dashboard data
export const handleGetUserDashboard: RequestHandler = (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const session = sessionsStorage.get(token);
    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    const user = usersStorage.getById(session.user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userBillingData = billingStorage.getByUserId(session.user_id);

    // Calculate statistics
    const totalConsumption = userBillingData.reduce(
      (sum, b) => sum + b.units_consumed,
      0,
    );
    const totalEmissions = userBillingData.reduce(
      (sum, b) => sum + b.carbon_emissions,
      0,
    );
    const totalCredits = user.carbon_credits;

    // Group billing data by month
    const monthlyData: Record<string, { emissions: number; credits: number }> =
      {};
    userBillingData.forEach((entry) => {
      const date = new Date(entry.date);
      const monthKey = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      });

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { emissions: 0, credits: 0 };
      }
      monthlyData[monthKey].emissions += entry.carbon_emissions;
      monthlyData[monthKey].credits += entry.credits_earned;
    });

    // Get last 6 months
    const now = new Date();
    const lastSixMonths = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      lastSixMonths.push(date.toLocaleDateString("en-US", { month: "short" }));
    }

    const monthlyChartData = lastSixMonths.map((month) => ({
      month,
      emissions: monthlyData[month]?.emissions || 0,
      credits: monthlyData[month]?.credits || 0,
    }));

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          full_name: user.full_name,
          carbon_credits: user.carbon_credits,
        },
        stats: {
          totalConsumption,
          totalEmissions,
          totalCredits,
          recyclingContributions: 0,
        },
        monthlyData: monthlyChartData,
        recentUploads: userBillingData.slice(-5).reverse(),
      },
    });
  } catch (error) {
    console.error("Get user dashboard error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get leaderboard data
export const handleGetLeaderboard: RequestHandler = (_req, res) => {
  try {
    // Get all users
    const allUsers = usersStorage.getAll();

    // Convert to leaderboard format
    const leaderboardUsers = allUsers
      .map((user) => ({
        rank: 0,
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        credits: user.carbon_credits,
        reduction: Math.round(user.carbon_credits * 0.5),
        badge: null as "gold" | "silver" | "bronze" | null,
      }))
      .sort((a, b) => b.credits - a.credits);

    // Assign badges to top 3
    if (leaderboardUsers.length > 0) leaderboardUsers[0].badge = "gold";
    if (leaderboardUsers.length > 1) leaderboardUsers[1].badge = "silver";
    if (leaderboardUsers.length > 2) leaderboardUsers[2].badge = "bronze";

    // Assign ranks
    leaderboardUsers.forEach((user, index) => {
      user.rank = index + 1;
    });

    // Calculate stats
    const totalUsers = leaderboardUsers.length;
    const totalCredits = leaderboardUsers.reduce(
      (sum, u) => sum + u.credits,
      0,
    );
    const totalReduction = leaderboardUsers.reduce(
      (sum, u) => sum + u.reduction,
      0,
    );

    return res.status(200).json({
      success: true,
      data: leaderboardUsers,
      stats: {
        totalUsers,
        totalCredits,
        totalReduction,
      },
    });
  } catch (error) {
    console.error("Get leaderboard error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
