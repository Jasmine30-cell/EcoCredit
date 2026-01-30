import express from "express";
import { db } from "../db";

const router = express.Router();

router.get("/monthly/:userId", (req, res) => {
  const userId = req.params.userId;

  const emissions = db.prepare(`
    SELECT strftime('%Y-%m', date) as month,
           SUM(carbon_emissions) as emissions
    FROM billing_data
    WHERE user_id = ?
    GROUP BY month
    ORDER BY month
  `).all(userId);

  const credits = db.prepare(`
    SELECT strftime('%Y-%m', created_at) as month,
           SUM(credits) as credits
    FROM recycling_entries
    WHERE user_id = ?
    GROUP BY month
    ORDER BY month
  `).all(userId);

  res.json({ emissions, credits });
});

export default router;
