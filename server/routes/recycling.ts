import express from "express";
import { db } from "../db";

const router = express.Router();

// credit calculator
const creditRates: Record<string, number> = {
  plastic: 50,
  paper: 75,
  glass: 60,
  metal: 85,
  ewaste: 200,
  organic: 40,
};

// submit recycling
router.post("/submit", (req, res) => {
  try {
    console.log("SUBMIT HIT:", req.body); // ✅ debug log

    const { userId, wasteType, quantity } = req.body;

    if (!userId || !wasteType || !quantity) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const credits = creditRates[wasteType] * quantity;

    const result = db.prepare(`
      INSERT INTO recycling_entries 
      (user_id, waste_type, quantity, credits)
      VALUES (?, ?, ?, ?)
    `).run(userId, wasteType, quantity, credits);

    console.log("INSERT RESULT:", result); // ✅ debug insert

    res.json({ success: true, credits });
  } catch (err) {
    console.error("SUBMIT ERROR:", err);
    res.status(500).json({ error: "Submit failed" });
  }
});

// fetch user data
router.get("/my-data/:userId", (req, res) => {
  try {
    const userId = req.params.userId;

    const total = db
      .prepare(
        `SELECT COALESCE(SUM(credits), 0) as total 
         FROM recycling_entries 
         WHERE user_id = ?`
      )
      .get(userId);

    const history = db
      .prepare(
        `SELECT * FROM recycling_entries
         WHERE user_id = ?
         ORDER BY created_at DESC`
      )
      .all(userId);

    console.log("FETCH DATA:", { total, history }); // ✅ debug fetch

    res.json({
      total: total.total || 0,
      history,
    });
  } catch (err) {
    console.error("FETCH ERROR:", err);
    res.status(500).json({ error: "Fetch failed" });
  }
});

export default router;

