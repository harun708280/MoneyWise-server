import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import mongoose from "mongoose"
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
      const expenses = await Transaction.find({ user: user._id,}).sort({ date: -1 });
      res.status(200).json(expenses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch expense transactions" });
    }
  };

  
  // 🗑️ লেনদেন ডিলিট করবে
export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    await Transaction.findByIdAndDelete(id);
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete transaction" });
  }
};

// // 🔍 User Email অনুযায়ী শুধু আয় (Income) আনবে
// export const getIncomeTransactionsByEmail = async (req, res) => {
//   try {
//     const { email } = req.params;

//     // Validate user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Fetch income transactions
//     const incomes = await Transaction.find({ user: user._id, type: "income" }).sort({ date: -1 });
//     res.status(200).json(incomes);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch income transactions" });
//   }
// };

// 🔍 **নির্দিষ্ট Transaction আনবে**
export const getSingleTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Fetching transaction with ID:", id); // ডিবাগ লগ

    // ObjectId বৈধ কিনা যাচাই করুন
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid transaction ID:", id); // ডিবাগ লগ
      return res.status(400).json({ error: "Invalid transaction ID" });
    }

    const transaction = await Transaction.findById(id);
    console.log("Transaction found:", transaction); // ডিবাগ লগ

    if (!transaction) {
      console.log("Transaction not found for ID:", id); // ডিবাগ লগ
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.status(200).json(transaction);
  } catch (error) {
    console.error("Error fetching transaction:", error); // ডিবাগ লগ
    res.status(500).json({ error: "Failed to fetch transaction" });
  }
};

export const getTransactionsByEmail = async (req, res) => {
  try {
      const { email } = req.params;
      console.log("Fetching transactions for email:", email); // ডিবাগ লগ

      // Validate user by email
      const user = await User.findOne({ email });
      if (!user) {
          console.log("User not found for email:", email); // ডিবাগ লগ
          return res.status(404).json({ error: "User not found" });
      }

      // Fetch all transactions (income and expense)
      const transactions = await Transaction.find({ user: user._id }).sort({ date: -1 });
      console.log("Transactions found:", transactions); // ডিবাগ লগ
      res.status(200).json(transactions);
  } catch (error) {
      console.error("Error fetching transactions:", error); // ডিবাগ লগ
      res.status(500).json({ error: "Failed to fetch transactions" });
  }
};