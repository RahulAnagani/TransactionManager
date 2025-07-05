import mongoose from "mongoose";
const transactionSchema=new mongoose.Schema({
    description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    },
    date: {
    type: Date,
    default: Date.now,
  }
},{ timestamps: true});

export default mongoose.models.Transaction||mongoose.model("Transaction",transactionSchema);