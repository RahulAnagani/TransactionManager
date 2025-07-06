    import { AppDispatch, RootState } from "@/lib/store";
    import { setBudget } from "@/lib/features/budgetSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
    import { PieChart,ResponsiveContainer,Pie,Tooltip,Legend,Cell } from "recharts"
    type spendingData={
        name: string, food: number, medical: number, groceries: number, transport: number, rent: number, other: number 
    }
    type Props = {
  changeHandler: () => void;
};
interface BudgetResponse {
  budget: { budget: number; balance: number }[];
}
    export default function Balance({changeHandler}:Props){
        const [d,setD]=useState<spendingData>({name:"",food:0,medical:0,groceries:0,transport:0,rent:0,other:0});
        const budg=useSelector((state:RootState)=>state.budget);
        const dispatch=useDispatch<AppDispatch>();
        const date=new Date;
        const spent=Object.entries(d).filter(([key])=>key!=="name").reduce((total,[_,value])=>(total+parseInt(value as string)),0)
        const data=Object.entries(d).filter(([key])=>key!=="name").map(([key,value])=>({name:key,value:Number(value)}))
        useEffect(()=>{
            const fetchBdgt=async()=>{
                const resp=await fetch(`/api/budget?year=${date.getFullYear()}&month=${date.getMonth()+1}`);
                const data: BudgetResponse = await resp.json();
                dispatch(setBudget({
                    balance:data.budget[0].balance,
                    budget:data.budget[0].budget
                }))
            }
            const fetchTransactions=async()=>{
                const resp=await fetch(`/api/transactions?year=${date.getFullYear()}&month=${date.getMonth()+1}`);
                const data=await resp.json();
                const trans=data.transactions;
                trans.forEach((el:{category:keyof spendingData,amount:number}) => {
                    setD(prev=>({...prev,
                        [el.category]:(prev[el.category] as number)+el.amount,
                    }))
                });
            }
            fetchBdgt()
            fetchTransactions()
        },[])
        const COLORS = [
        "#ea580c",
        "#2563eb",
        "#059669",
        "#9333ea",
        "#dc2626",
        "#334155"
        ];
        return <div className="flex flex-col lg:w-[40%] relative sm:w-[100%] w-full bg-orange-400 md:w-[100%] md:bg-red-500 lg:bg-green-500  rounded-3xl sm:h-[100dvh] h-[75%] md:h-[100dvh] lg:h-[100%]">
                                    <div className=" h-[40%] flex w-full rounded-3xl rounded-b-none">
                                        <div className="w-[60%] h-full flex items-start px-10 justify-center flex-col">
                                            <h1 className="font-bold text-white text-3xl roboto">Available</h1>
                                            <h1 className="text-white self-center font-light roboto">This month</h1>
                                            <h1 className={`font-bold ${budg.balance<1?"text-red-800":"text-white"} self-end text-3xl roboto`}>${budg.balance.toFixed(2)}</h1>
                                        </div>
                                        <div className="w-[40%] flex flex-col h-full   justify-around items-center p-5">
                                            <h1 className={`font-extrabold text-black `}><span className="font-bold text-white">Budget: </span>{budg.budget.toFixed(2)}$</h1>
                                            <button onClick={()=>changeHandler()} className="roboto bg-white/20 p-2 rounded-2xl hover:bg-white/10 active:bg-white/10 cursor-pointer text-gray-200 font-medium ">
                                                Change
                                            </button>
                                        </div>
                                    </div>
                                    <div className="h-[60%] w-full rounded-b-3xl">
                                        <div className="piechart-container w-full p-5  h-full">
                                        <ResponsiveContainer
                                        width={"100%"}
                                        height={"100%"}
                                        >   
                                            <PieChart
                                            style={{ outline: "none" }}
                                            width={"100%"}
                                            height={"100%"}
                                            >
                                                
                                                <Pie
                                                startAngle={90}
                                                endAngle={90-(360*(spent/budg.budget))}
                                                innerRadius={60}
                                                outerRadius={80}
                                                // cy={10}
                                                data={data}
                                                >
                                                    {data.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip></Tooltip>
                                                <Legend></Legend>
                                            </PieChart>
                                        </ResponsiveContainer>
                                                    </div>
                                    </div>
                                </div>
    }