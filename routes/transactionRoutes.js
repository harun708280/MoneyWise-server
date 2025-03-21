import express from "express";
import { 
    
  getIncomeTransactionsByEmail, 
  getExpenseTransactionsByEmail,  
  addTransaction, 
  updateTransaction, 
  deleteTransaction
} from "../controllers/transactionController.js";

const router = express.Router();

router.get("/:email", getIncomeTransactionsByEmail);
router.get("/:email/income", getIncomeTransactionsByEmail);
router.get("/:email/expenses", getExpenseTransactionsByEmail); 
router.post("/add", addTransaction);
router.put("/edit/:id", updateTransaction);
router.delete("/:id",deleteTransaction)

export default router;
