import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  type: { type: String, enum: ["income", "expense"], required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  note: { type: String },
  wallet: { type: Number, default: 0 },
  totalIncome: { type: Number, default: 0 },
  totalExpense: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
