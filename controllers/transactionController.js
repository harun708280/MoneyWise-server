import Transaction from "../models/Transaction.js";

// 1️⃣ সকল লেনদেন দেখাবে
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};

// 2️⃣ শুধু আয় দেখাবে
export const getIncomeTransactions = async (req, res) => {
  try {
    const incomes = await Transaction.find({ type: "income" }).sort({ date: -1 });
    res.status(200).json(incomes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch income transactions" });
  }
};

// 3️⃣ শুধু ব্যয় দেখাবে
export const getExpenseTransactions = async (req, res) => {
  try {
    const expenses = await Transaction.find({ type: "expense" }).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch expense transactions" });
  }
};

// 4️⃣ নতুন লেনদেন যোগ করবে
export const addTransaction = async (req, res) => {
  try {
    const { user, type, amount, category, note, date } = req.body;
    const newTransaction = new Transaction({ user, type, amount, category, note, date });
    await newTransaction.save();
    res.status(201).json({ message: "Transaction added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add transaction" });
  }
};

// 5️⃣ লেনদেন আপডেট করবে
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
