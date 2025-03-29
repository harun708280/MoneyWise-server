import express from "express";
import {
  createSavingGoal,
  getSavingsGoalsByEmail,
  getSavingGoalById,
  updateSavingGoal,
  deleteSavingGoal,
} from "../controllers/userSavingsController.js";

const router = express.Router();

// Create a new saving goal
router.post("/add", createSavingGoal);

// Get all saving goals for a user by email
router.get("/email/:email", getSavingsGoalsByEmail);

// Get a single saving goal by ID
router.get("/:id", getSavingGoalById);

// Update a saving goal by ID (add transaction)
router.put("/update/:id", updateSavingGoal);

// Delete a saving goal by ID
router.delete("/:id", deleteSavingGoal);

export default router;