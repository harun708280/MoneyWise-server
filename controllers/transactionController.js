import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

// 🔍 **User ID অনুযায়ী সব লেনদেন আনবে**
export const getUserTransactions = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch transactions by user ID
    const transactions = await Transaction.find({ user: userId }).sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};

// ✅ **নতুন Transaction যোগ করবে**
export const addTransaction = async (req, res) => {
    try {
      console.log("📥 Received Transaction Data:", req.body); // ✅ Debug Log
  
      // ✅ `userId` না বলে `user` নেওয়া হচ্ছে
      const { user, type, amount, category, note, date } = req.body;
  
      // ✅ Validate user using the correct field (`user` instead of `userId`)
      const existingUser = await User.findById(user);
      if (!existingUser) {
        console.log("❌ User not found:", user);
        return res.status(404).json({ error: "User not found" });
      }
  
      // ✅ Creating a new transaction
      const newTransaction = new Transaction({
        user, // ✅ `userId` পরিবর্তে `user`
        type,
        amount,
        category,
        note,
        date,
      });
  
      await newTransaction.save();
  
      console.log("✅ Transaction Added:", newTransaction); // ✅ Debug Log
  
      res.status(201).json({
        message: "Transaction added successfully",
        transaction: newTransaction,
      });
    } catch (error) {
      console.error("❌ Error adding transaction:", error);
      res.status(500).json({ error: "Failed to add transaction" });
    }
  };
  
  

// 🔄 **লেনদেন আপডেট করবে**
export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const updatedTransaction = await Transaction.findByIdAndUpdate(id, updatedData, { new: true });
    res.status(200).json(updatedTransaction);
  } catch (error) {
    res.status(500).json({ error: "Failed to update transaction" });
  }
};
// 🔍 **User Email অনুযায়ী শুধু ব্যয় (Expense) আনবে**
export const getExpenseTransactionsByEmail = async (req, res) => {
    try {
      const { email } = req.params;
  
      // Validate user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Fetch expense transactions
      const expenses = await Transaction.find({ user: user._id, type: "expense" }).sort({ date: -1 });
      res.status(200).json(expenses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch expense transactions" });
    }
  };
  
export const getIncomeTransactionsByEmail = async (req, res) => {
    try {
      const { email } = req.params;
  
      // Validate user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Fetch expense transactions
      const expenses = await Transaction.find({ user: user._id, }).sort({ date: -1 });
      res.status(200).json(expenses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch expense transactions" });
    }
  };
  
  export const deleteTransaction = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Check if the transaction exists
      const transaction = await Transaction.findById(id);
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
  
      // Delete the transaction
      await Transaction.findByIdAndDelete(id);
      
      res.status(200).json({ message: "Transaction deleted successfully" });
    } catch (error) {
      console.error("❌ Error deleting transaction:", error);
      res.status(500).json({ error: "Failed to delete transaction" });
    }
  };
  