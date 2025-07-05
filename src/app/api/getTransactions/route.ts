import { ConnectDb } from "@/lib/db";
import Transactions from "@/models/Transactions";
import { NextRequest, NextResponse } from "next/server";
const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const categories = ["food", "medical", "groceries", "transport", "rent", "other"];
type Category = "food" | "medical" | "groceries" | "transport" | "rent" | "other";

interface Transaction {
  date: Date;
  amount: number;
  category: Category;
}

export async function GET(req:NextRequest) {
  await ConnectDb();
  try {
    const { searchParams } = new URL(req.url);
    const year = parseInt(searchParams.get("year") || "0");

    if (!year) {
      return NextResponse.json({success: false, msg: "Year is required" }, {status:400});
    }
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year + 1, 0, 1);
    const transactions:Transaction[] = await Transactions.find({
      date: {
        $gte: startOfYear,
        $lt: endOfYear,
      },
    });
    const spendingData = Array.from({length: 12}, (_, index) => ({
      name: monthNames[index],
      food: 0,
      medical: 0,
      groceries: 0,
      transport: 0,
      rent: 0,
      other: 0,
    }));

    for (const txn of transactions) {
      const monthIndex = new Date(txn.date).getMonth();
      const category = txn.category;

      if (categories.includes(category)) {
        spendingData[monthIndex][category] += txn.amount;
      }
    }
    return NextResponse.json({success: true, spendingData}, {status:200});
  } catch (e) {
    console.error(e);
    return NextResponse.json({success: false, error: e}, {status: 500});
  }
}
