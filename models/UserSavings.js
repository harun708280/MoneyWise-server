import mongoose from 'mongoose';

const userSavingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  accountName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  targetAmount: {
    type: Number,
    required: true,
  },
  currentAmount: {
    type: Number,
    default: 0,
  },
  reason: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  recurring: {
    type: String,
    default: 'no', 
  },
  transactions: [
    {
      date: {
        type: Date,
        default: Date.now,
      },
      amount: {
        type: Number,
        required: true,
      },
    },
  ],
}, { timestamps: true });

const UserSavings = mongoose.model('UserSavings', userSavingsSchema);

export default UserSavings;