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
    getIncomeAndCostDataForChart,
} from "../controllers/transactionController.js";

const router = express.Router();
router.get("/email/:email", getTransactionsByEmail)
router.get("/:id", getSingleTransaction);
router.delete("/:id", deleteTransaction);
router.get("/:email/income", getIncomeTransactionsByEmail);
router.get("/:email/expenses", getExpenseTransactionsByEmail); 
router.post("/add", addTransaction);
router.get("/income/total/:email", getIncomeByEmailAndTotal);
router.get('/chart-data/:email', getIncomeAndCostDataForChart)
router.put("/edit/:id", updateTransaction);


export default router;