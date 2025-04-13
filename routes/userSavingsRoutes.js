import express from "express";
import {
  createSavingGoal,
  getSavingsGoalsByEmail,
  getSavingGoalById,
  updateSavingGoal,
  deleteSavingGoal,
} from "../controllers/userSavingsController.js";

const router = express.Router();

router.post("/add", createSavingGoal);

router.get("/email/:email", getSavingsGoalsByEmail);

router.get("/:id", getSavingGoalById);

router.put("/update/:id", updateSavingGoal);

router.delete("/:id", deleteSavingGoal);

export default router;
