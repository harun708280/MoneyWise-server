import express from "express";
import { 
    getIncomeTransactionsByEmail, 
    getExpenseTransactionsByEmail,  
    addTransaction, 
    updateTransaction, 
    
    getSingleTransaction,
    deleteTransaction,
    getTransactionsByEmail,
} from "../controllers/transactionController.js";

const router = express.Router();
router.get("/email/:email", getTransactionsByEmail)
router.get("/:id", getSingleTransaction);
router.delete("/:id", deleteTransaction);


router.get("/:email/income", getIncomeTransactionsByEmail);
router.get("/:email/expenses", getExpenseTransactionsByEmail); 
router.post("/add", addTransaction);

router.put("/edit/:id", updateTransaction);


export default router;