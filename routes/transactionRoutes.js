import express from "express";
import { 
  getTransactionsByEmail, 
  getIncomeTransactionsByEmail, 
  getExpenseTransactionsByEmail, 
  addTransaction, 
  updateTransaction 
} from "../controllers/transactionController.js";

const router = express.Router();

// ✅ নির্দিষ্ট user er email অনুযায়ী transaction filter
router.get("/:email", getTransactionsByEmail);
router.get("/:email/income", getIncomeTransactionsByEmail);
router.get("/:email/expenses", getExpenseTransactionsByEmail);

router.post("/add", addTransaction);
router.put("/edit/:id", updateTransaction);

export default router;
