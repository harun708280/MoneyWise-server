import express from "express";
import { 
    getIncomeTransactionsByEmail, 
    getExpenseTransactionsByEmail,  
    addTransaction, 
    updateTransaction, 
    
    getSingleTransaction,
    deleteTransaction,
    getTransactionsByEmail,
    getIncomeByEmailAndTotal,
} from "../controllers/transactionController.js";

const router = express.Router();
router.get("/email/:email", getTransactionsByEmail)
router.get("/:id", getSingleTransaction);
router.delete("/:id", deleteTransaction);
router.get("/:email/income", getIncomeTransactionsByEmail);
router.get("/:email/expenses", getExpenseTransactionsByEmail); 
router.post("/add", addTransaction);
router.get("/income/total/:email", getIncomeByEmailAndTotal);

router.put("/edit/:id", updateTransaction);


export default router;