
import express from "express"; 
import { createSavingGoal } from "../controllers/userSavingsController.js";

const router = express.Router();

router.post('/add',createSavingGoal)

export default router