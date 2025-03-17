import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

// 🔍 সকল লেনদেন নির্দিষ্ট User এর Email অনুসারে দেখাবে
export const getTransactionsByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find transactions by user ID
    const transactions = await Transaction.find({ user: user._id }).sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};

// 🔍 শুধু আয় দেখাবে নির্দিষ্ট User এর Email অনুসারে
export const getIncomeTransactionsByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const incomes = await Transaction.find({ user: user._id, type: "income" }).sort({ date: -1 });
    res.status(200).json(incomes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch income transactions" });
  }
};

// 🔍 শুধু ব্যয় দেখাবে নির্দিষ্ট User এর Email অনুসারে
export const getExpenseTransactionsByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const expenses = await Transaction.find({ user: user._id, type: "expense" }).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch expense transactions" });
  }
};
