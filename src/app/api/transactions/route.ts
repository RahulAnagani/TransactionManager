import { ConnectDb } from "@/lib/db";
import Transactions from "@/models/Transactions";
import { NextRequest,NextResponse } from "next/server";
import mongoose from "mongoose";
import { error } from "console";
import Budget from "@/models/Budget";

export async function POST(req:NextRequest){
    await ConnectDb();
    try{
        const body=await req.json();
        if(body.amount<0){
            return NextResponse.json({success:false},{status:400});
        }
        const date = new Date(body.date);
        const year=date.getFullYear();
        const month=date.getMonth()+1;
        const budget=await Budget.find({
            year:year,
            month:month
        });
        if(budget.length===0){
            await Budget.create({year,month});
            const newTransaction=await Transactions.create(body);
            return NextResponse.json({newTransaction,success:true},{status:200});
        }
        await Budget.findOneAndUpdate({month,year},{$inc:{budget:-body.amount}},{new:true})
        const newTransaction=await Transactions.create(body);
        return NextResponse.json({newTransaction,success:true},{status:200});
    }
    catch(e){
        return NextResponse.json({error:e,success:false},{status:500});
    }
}

export async function GET(req:NextRequest){
    await ConnectDb();
    try{
        const { searchParams } = new URL(req.url);
        const year = parseInt(searchParams.get("year") || "0");
        const month = parseInt(searchParams.get("month") || "0");
         if (!year || !month) {
            return NextResponse.json({ error: "Missing year or month" }, { status: 400});
            }
        const startDate=new Date(year,month-1,1);
        const endDate=new Date(year,month,1);   
        const transactions=await Transactions.find({
            date:{
                $gte:startDate,
                $lt:endDate
            }
        });
        return NextResponse.json({success:true,transactions},{status:200});

    }
    catch(e){
        return NextResponse.json({success:false,error:e},{status:500})
    }
}