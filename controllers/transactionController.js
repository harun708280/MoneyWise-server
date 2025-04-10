import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import UserSavings from "../models/UserSavings.js";
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
    const transactions = await Transaction.find({ user: userId }).sort({
      date: -1,
    });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};

export const addTransaction = async (req, res) => {
  try {
    console.log("📥 Received Transaction Data:", req.body);

    const { user, type, amount, category, note, date } = req.body;

    const existingUser = await User.findById(user);
    if (!existingUser) {
      console.log("❌ User not found:", user);
      return res.status(404).json({ error: "User not found" });
    }

    const newTransaction = new Transaction({
      user,
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


export const getIncomeByEmailAndTotal = async (req, res) => {
  try {
    const { email } = req.params;

    // ইউজার ইমেইল দ্বারা ভ্যালিডেট করুন
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // সব লেনদেন আনুন
    const transactions = await Transaction.find({
      user: user._id,
    }).sort({ _id: -1 });

    // আয়ের লেনদেন আনুন
    const incomes = await Transaction.find({
      user: user._id,
      type: "income",
    }).sort({ date: -1 });

    const expenses = await Transaction.find({
      user: user._id,
      type: "expense",
    }).sort({ date: -1 });

    // মোট আয় এবং খরচ গণনা করুন
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        totalIncome += transaction.amount;
      } else if (transaction.type === "expense") {
        totalExpense += transaction.amount;
      }
    });

    // ওয়ালেট টোটাল গণনা করুন
    const walletTotal = totalIncome - totalExpense;

    // সেভিংস ডেটা আনুন
    const savings = await UserSavings.find({ userId: user._id }).sort({ _id: -1 });

    // মোট সেভিংস গণনা করুন
    const totalSavings = savings.reduce(
      (acc, saving) => acc + saving.currentAmount,
      0
    );

    // বিভাগ অনুযায়ী আয় গণনা করুন
    const incomeByCategory = {};
    incomes.forEach((income) => {
      if (income.category) {
        if (incomeByCategory[income.category]) {
          incomeByCategory[income.category] += income.amount;
        } else {
          incomeByCategory[income.category] = income.amount;
        }
      }
    });

    // বিভাগ অনুযায়ী খরচ গণনা করুন
    const expenseByCategory = {};
    expenses.forEach((expense) => {
      if (expense.category) {
        if (expenseByCategory[expense.category]) {
          expenseByCategory[expense.category] += expense.amount;
        } else {
          expenseByCategory[expense.category] = expense.amount;
        }
      }
    });

    // বিভাগ অনুযায়ী আয়ের শতাংশ গণনা করুন
    const incomePercentages = {};
    for (const category in incomeByCategory) {
      incomePercentages[category] =
        (incomeByCategory[category] / totalIncome) * 100;
    }

    // বিভাগ অনুযায়ী খরচের শতাংশ গণনা করুন
    const expensePercentages = {};
    for (const category in expenseByCategory) {
      expensePercentages[category] =
        (expenseByCategory[category] / totalExpense) * 100;
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
      { name: "Food", color: "#FFF9C4" },   // Very Light Yellow-Orange
      { name: "Shopping", color: "#FFF59D" }, // Light Yellow-Orange
      { name: "Transport", color: "#FFEE58" }, // Light Medium Yellow-Orange
      { name: "Health", color: "#FFEB3B" },   // Medium Yellow-Orange
      { name: "Entertainment", color: "#FFC107" }, // Medium Dark Yellow-Orange
      { name: "Education", color: "#FFCA28" },  // Dark Yellow-Orange
      { name: "Bills", color: "#FFB300" },    // Darker Yellow-Orange
      { name: "Subscriptions", color: "#FFA000" }, // Very Dark Yellow-Orange
      { name: "Investment", color: "#FF8F00" },  // Intense Dark Yellow-Orange
      { name: "Family", color: "#FF6F00" },    // Brownish Yellow-Orange
      { name: "Others", color: "#FF6D00" },    // Very Dark Brownish Yellow-Orange
    ];

    // IncomeChartData অ্যারে তৈরি করুন
    const IncomeChartData = Object.keys(incomePercentages).map((category) => {
      const colorObj = incomeColorCodes.find((item) => item.name === category);
      return {
        browser: category,
        visitors: incomePercentages[category],
        fill: colorObj ? colorObj.color : "#808080",
        amount: incomeByCategory[category],
      };
    });

    // ExpenseChartData অ্যারে তৈরি করুন
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
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
};


// 🔄 **লেনদেন আপডেট করবে**
export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );
    res.status(200).json(updatedTransaction);
  } catch (error) {
    res.status(500).json({ error: "Failed to update transaction" });
  }
};

export const getExpenseTransactionsByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const { type } = req.query;

    // Validate user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch expense transactions
    const expenses = await Transaction.find({
      user: user._id,
      type: "expense",
    }).sort({ date: -1 });
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
    const expenses = await Transaction.find({ user: user._id }).sort({
      date: -1,
    });
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

// 🔍 User Email অনুযায়ী শুধু আয় (Income) আনবে
export const getIncomeByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    // Validate user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch income transactions
    const incomes = await Transaction.find({ user: user._id, type: "income" }).sort({ date: -1 });
    res.status(200).json(incomes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch income transactions" });
  }
};

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
    const { type } = req.query;
    console.log("Fetching transactions for email:", email);

    // Validate user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found for email:", email);
      return res.status(404).json({ error: "User not found" });
    }

    let transactions;
    if (type) {
      transactions = await Transaction.find({ user: user._id, type }).sort({
        _id: -1,
      });
    } else {
      transactions = await Transaction.find({ user: user._id }).sort({
        _id: -1,
      });
    }

    console.log("Transactions found:", transactions);
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};


export const getIncomeAndCostDataForChart = async (req, res) => {
  try {
      const { email } = req.params;

      // ইউজার ইমেইল দ্বারা ভ্যালিডেট করুন
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({ error: "User not found" });
      }

      // সব লেনদেন আনুন
      const transactions = await Transaction.find({
          user: user._id,
      }).sort({ date: 1 }); // তারিখ অনুসারে সাজানো

      // চার্টের জন্য ডেটা প্রস্তুত করা
      const chartData = transactions.reduce((acc, transaction) => {
          const date = new Date(transaction.date);
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();
          const formattedDate = `${day}-${month}-${year}`; // DD-MM-YYYY ফরম্যাট

          const amount = transaction.amount;
          const type = transaction.type;

          if (!acc[formattedDate]) {
              acc[formattedDate] = { date: formattedDate, income: 0, expense: 0 };
          }

          if (type === "income") {
              acc[formattedDate].income += amount;
          } else if (type === "expense") {
              acc[formattedDate].expense += amount;
          }

          return acc;
      }, {});

      const chartDataArray = Object.values(chartData).sort((a, b) => {
          const [dayA, monthA, yearA] = a.date.split('-').map(Number);
          const [dayB, monthB, yearB] = b.date.split('-').map(Number);
          return new Date(yearA, monthA - 1, dayA) - new Date(yearB, monthB - 1, dayB);
      });

      res.status(200).json(chartDataArray);
  } catch (error) {
      console.error("Error fetching chart data:", error);
      res.status(500).json({ error: "Failed to fetch chart data" });
  }
};
