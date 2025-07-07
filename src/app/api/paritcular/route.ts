import { ConnectDb } from "@/lib/db";
import Transactions from "@/models/Transactions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
    await ConnectDb()
    const {searchParams}=new URL(req.url);
    const id=searchParams.get("id");
    if(!id){
        return NextResponse.json({success:false,msg:"Id for the transaction is required !"},{status:400});
    }
    try{
        const transaction=await Transactions.findById(id);
        console.log(transaction);
        if(!transaction)return NextResponse.json({success:false,msg:"No transaction found"},{status:404});
        return NextResponse.json({success:true,transaction:transaction});
    }
    catch(e){
        return NextResponse.json({success:false},{status:500})
    }
}

export async function POST(req:NextRequest){
    await ConnectDb();
    const body=await req.json();
    const {amount,description,category,id}=body;
    if(!amount||!description||!category||!id)return NextResponse.json({success:false,msg:"All fields are required :)"},{status:400});
    const yeah=await Transactions.findById(id);
    if(!yeah)return NextResponse.json({success:false,msg:"No transaction found"},{status:400});
    console.log(yeah);
}