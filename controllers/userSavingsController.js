import UserSavings from "../models/UserSavings.js";
import User from "../models/User.js";
import mongoose from "mongoose";

// Create a new saving goal
export const createSavingGoal = async (req, res) => {
  try {
    const {
      userId,
      accountName,
      category,
      targetAmount,
      reason,
      startDate,
      endDate,
      recurring,
    } = req.body;

    const newSavingGoal = new UserSavings({
      userId,
      accountName,
      category,
      targetAmount,
      reason,
      startDate,
      endDate,
      recurring,
    });
    const savedSaving = await newSavingGoal.save();
    res.status(201).json(savedSaving);
  } catch (error) {
    console.error("Error creating savings goal:", error);
    res.status(500).json({ message: "Failed to create savings goal" });
  }
};

// Get all saving goals for a user by email
export const getSavingsGoalsByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find all saving goals for the user
    const savingsGoals = await UserSavings.find({ userId: user._id });
    res.status(200).json(savingsGoals);
  } catch (error) {
    console.error("Error fetching savings goals:", error);
    res.status(500).json({ message: "Failed to fetch savings goals" });
  }
};

// Get a single saving goal by ID
export const getSavingGoalById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid saving goal ID" });
    }

    const savingGoal = await UserSavings.findById(id);

    if (!savingGoal) {
      return res.status(404).json({ message: "Saving goal not found" });
    }

    res.status(200).json(savingGoal);
  } catch (error) {
    console.error("Error fetching saving goal:", error);
    res.status(500).json({ message: "Failed to fetch saving goal" });
  }
};

// Update a saving goal by ID
export const updateSavingGoal = async (req, res) => {
  try {
    const { id } = req.params; // req.params থেকে id ধরুন
    const { amount } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid saving goal ID" });
    }

    const savingGoal = await UserSavings.findById(id);

    if (!savingGoal) {
      return res.status(404).json({ message: "Saving goal not found" });
    }

    // লক্ষ্যমাত্রা পূরণ হলে টাকা যোগ করা বন্ধ করুন
    if (savingGoal.currentAmount >= savingGoal.targetAmount) {
      return res.status(400).json({ message: "Target amount already reached" });
    }

    // নতুন লেনদেন যোগ করুন
    savingGoal.transactions.push({ amount });

    // currentAmount আপডেট করুন
    savingGoal.currentAmount += amount;

    // লক্ষ্যমাত্রা অতিক্রম করলে, currentAmount লক্ষ্যমাত্রার সমান করুন
    if (savingGoal.currentAmount > savingGoal.targetAmount) {
      savingGoal.currentAmount = savingGoal.targetAmount;
    }

    const updatedSavingGoal = await savingGoal.save();
    res.status(200).json(updatedSavingGoal);
  } catch (error) {
    console.error("Error updating saving goal:", error);
    res.status(500).json({ message: "Failed to update saving goal" });
  }
};

// Delete a saving goal by ID
export const deleteSavingGoal = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid saving goal ID" });
    }

    const deletedSavingGoal = await UserSavings.findByIdAndDelete(id);

    if (!deletedSavingGoal) {
      return res.status(404).json({ message: "Saving goal not found" });
    }

    res.status(200).json({ message: "Saving goal deleted successfully" });
  } catch (error) {
    console.error("Error deleting saving goal:", error);
    res.status(500).json({ message: "Failed to delete saving goal" });
  }
};