import { ConnectDb } from "@/lib/db";
import Budget from "@/models/Budget";
import { NextRequest,NextResponse } from "next/server";
import Transactions from "@/models/Transactions";

export async function GET(req:NextRequest){
    await ConnectDb()
    try{
        const {searchParams}=new URL(req.url);
        const month=parseInt(searchParams.get("month")|| "0");
        const year=parseInt(searchParams.get("year")||"0")
        if(!month||!year){
            return NextResponse.json({msg:"Month and Year fields are empty !"},{status:400});
        }
        const budget=await Budget.find({
            year:year,
            month:month
        });
        if(budget.length===0){
            const pspk=await Budget.create({year:year,month:month});
            return NextResponse.json({success:true,budget:[pspk]},{status:200})
        }
        const startDate=new Date(year,month-1,1);
        const endDate=new Date(year,month,1);

        const transactions=await Transactions.find({
                    date:{
                        $gte:startDate,
                        $lt:endDate
                    }
        });
        const spent=transactions.reduce((total,ele)=>total+ele.amount,0);
        if(budget[0].budget-spent!==budget[0].balance){
            await Budget.findByIdAndUpdate(
                {_id:budget[0]._id}
                ,{balance:budget[0].budget-spent}
            )
        }
        return NextResponse.json({success:true,budget},{status:200});
    }
    catch(e){
        console.log(e)
        return NextResponse.json({success:false},{status:500});
    }
}

export async function POST(req:NextRequest){
    const {newBudget,month,year}=await req.json();
    if (!newBudget || !month || !year) {
  return NextResponse.json({ success: false, msg: "Missing required fields" }, { status: 400 });
}
    try{
        const check=await Budget.find({
            month:month,year:year
        });
        if(check.length===0){
            const pspk=await Budget.create({year:year,month:month});
        }
        const startDate=new Date(year,month-1,1);
        const endDate=new Date(year,month,1);
        const transactions=await Transactions.find({
                    date:{
                        $gte:startDate,
                        $lt:endDate
                    }
        });
        const spent=transactions.reduce((total,ele)=>total+ele.amount,0);
        console.log(spent);
        if(newBudget<spent){
            return NextResponse.json({success:false,msg:"Not allowed"},{status:400});
        }
        const balance = newBudget - spent;
        const budget=await Budget.findOneAndUpdate(
            {month,year},
            {budget:newBudget,balance},
            {new:true}
        )
        return NextResponse.json({success:true,budget},{status:200});
    }
    catch(e){
        console.log(e);
        return NextResponse.json({success:false,error:e},{status:500});
    }
}