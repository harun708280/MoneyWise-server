import express from "express";
import { 
  getTransactions, 
  getIncomeTransactions, 
  getExpenseTransactions, 
  addTransaction, 
  updateTransaction 
} from "../controllers/transactionController.js";

const router = express.Router();

router.get("/", getTransactions);
router.get("/income", getIncomeTransactions);
router.get("/expenses", getExpenseTransactions);
router.post("/add", addTransaction);
router.put("/edit/:id", updateTransaction);

export default router;
