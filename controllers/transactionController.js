import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import UserSavings from "../models/UserSavings.js";

// Get all transactions for a user by userId
export const getUserTransactions = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const transactions = await Transaction.find({ user: userId }).sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};

// Add a new transaction
export const addTransaction = async (req, res) => {
  try {
    const { user, type, amount, category, note, date } = req.body;

    const existingUser = await User.findById(user);
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const newTransaction = new Transaction({ user, type, amount, category, note, date });
    await newTransaction.save();

    res.status(201).json({
      message: "Transaction added successfully",
      transaction: newTransaction,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to add transaction" });
  }
};

// Get total income, expense, savings, and chart data by user email
export const getIncomeByEmailAndTotal = async (req, res) => {
  try {
    const { email } = req.params;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const transactions = await Transaction.find({ user: user._id }).sort({ _id: -1 });
    const incomes = await Transaction.find({ user: user._id, type: "income" }).sort({ date: -1 });
    const expenses = await Transaction.find({ user: user._id, type: "expense" }).sort({ date: -1 });

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((t) => {
      if (t.type === "income") totalIncome += t.amount;
      else if (t.type === "expense") totalExpense += t.amount;
    });

    const walletTotal = totalIncome - totalExpense;

    const savings = await UserSavings.find({ userId: user._id }).sort({ _id: -1 });
    const totalSavings = savings.reduce((acc, s) => acc + s.currentAmount, 0);

    const incomeByCategory = {};
    incomes.forEach((i) => {
      incomeByCategory[i.category] = (incomeByCategory[i.category] || 0) + i.amount;
    });

    const expenseByCategory = {};
    expenses.forEach((e) => {
      expenseByCategory[e.category] = (expenseByCategory[e.category] || 0) + e.amount;
    });

    const incomePercentages = {};
    for (const category in incomeByCategory) {
      incomePercentages[category] = (incomeByCategory[category] / totalIncome) * 100;
    }

    const expensePercentages = {};
    for (const category in expenseByCategory) {
      expensePercentages[category] = (expenseByCategory[category] / totalExpense) * 100;
    }

    
    const incomeColorCodes = [
      { name: "Salary", color: "#084594" },
      { name: "Freelancing", color: "#2171B5" },
      { name: "Investments", color: "#4292C6" },
      { name: "Business", color: "#6BAED6" },
      { name: "Rental Income", color: "#9ECAE1" },
      { name: "Dividends", color: "#C6DBEF" },
      { name: "Gifts", color: "#DEEBF7" },
      { name: "Grants", color: " #4C4CFF" },
      { name: "Bonuses", color: "#1C7ED0" },
      { name: "Family", color: "#67A4DA" },
      { name: "Others", color: "#A0CBE8" },
    ];

    const expenseColorCodes = [
      { name: "Food", color: "#FFF9C4" },   
      { name: "Shopping", color: "#FFF59D" }, 
      { name: "Transport", color: "#FFEE58" }, 
      { name: "Health", color: "#FFEB3B" },   
      { name: "Entertainment", color: "#FFC107" }, 
      { name: "Education", color: "#FFCA28" }, 
      { name: "Bills", color: "#FFB300" },    
      { name: "Subscriptions", color: "#FFA000" }, 
      { name: "Investment", color: "#FF8F00" },  
      { name: "Family", color: "#FF6F00" },    
      { name: "Others", color: "#FF6D00" },    
    ];

    const IncomeChartData = Object.keys(incomePercentages).map((category) => {
      const colorObj = incomeColorCodes.find((item) => item.name === category);
      return {
        browser: category,
        visitors: incomePercentages[category],
        fill: colorObj ? colorObj.color : "#808080",
        amount: incomeByCategory[category],
      };
    });

    const ExpenseChartData = Object.keys(expensePercentages).map((category) => {
      const colorObj = expenseColorCodes.find((item) => item.name === category);
      return {
        browser: category,
        visitors: expensePercentages[category],
        fill: colorObj ? colorObj.color : "#808080",
        amount: expenseByCategory[category],
      };
    });

    res.status(200).json({
      transactions,
      totalIncome,
      totalExpense,
      walletTotal,
      savings,
      totalSavings,
      incomes,
      expenses,
      incomeByCategory,
      incomePercentages,
      IncomeChartData,
      expenseByCategory,
      expensePercentages,
      ExpenseChartData,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
};

// Update a transaction by ID
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

// Get expense transactions by email
export const getExpenseTransactionsByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const expenses = await Transaction.find({ user: user._id, type: "expense" }).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch expense transactions" });
  }
};

// Get income transactions by email
export const getIncomeTransactionsByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const expenses = await Transaction.find({ user: user._id }).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch expense transactions" });
  }
};

// Delete a transaction by ID
export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    await Transaction.findByIdAndDelete(id);
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete transaction" });
  }
};

// Get only income transactions by email
export const getIncomeByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const incomes = await Transaction.find({ user: user._id, type: "income" }).sort({ date: -1 });
    res.status(200).json(incomes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch income transactions" });
  }
};

// Get a single transaction by ID
export const getSingleTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid transaction ID" });
    }

    const transaction = await Transaction.findById(id);
    if (!transaction) return res.status(404).json({ error: "Transaction not found" });

    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transaction" });
  }
};

// Get transactions by email and optionally filter by type
export const getTransactionsByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const { type } = req.query;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const filter = { user: user._id };
    if (type) filter.type = type;

    const transactions = await Transaction.find(filter).sort({ _id: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};

// Get income and expense data for chart by email
export const getIncomeAndCostDataForChart = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const transactions = await Transaction.find({ user: user._id }).sort({ date: 1 });

    const chartData = transactions.reduce((acc, t) => {
      const date = new Date(t.date);
      const formattedDate = `${String(date.getDate()).padStart(2, '0')}-${String(
        date.getMonth() + 1
      ).padStart(2, '0')}-${date.getFullYear()}`;

      if (!acc[formattedDate]) {
        acc[formattedDate] = { date: formattedDate, income: 0, expense: 0 };
      }

      if (t.type === "income") acc[formattedDate].income += t.amount;
      else if (t.type === "expense") acc[formattedDate].expense += t.amount;

      return acc;
    }, {});

    const chartDataArray = Object.values(chartData).sort((a, b) => {
      const [dayA, monthA, yearA] = a.date.split('-').map(Number);
      const [dayB, monthB, yearB] = b.date.split('-').map(Number);
      return new Date(yearA, monthA - 1, dayA) - new Date(yearB, monthB - 1, dayB);
    });

    res.status(200).json(chartDataArray);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chart data" });
  }
};
