import { useEffect, useState } from "react";
import { PieChart,ResponsiveContainer,Pie,Tooltip,Legend,Cell } from "recharts"
export default function Balance(){
    const d={ name: 'JUL', food: 1000, medical: 300, groceries: 0, transport: 200, rent: 0, other: 1000 }
    const data=Object.entries(d).filter(([key])=>(key!=="name" && key!=="month")).map(([key,value])=>({name:key,value:value}));
    const [budget,setBudget]=useState<0>(0);
    const date=new Date;
    useEffect(()=>{
        const fetchBdgt=async()=>{
            const resp=await fetch(`/api/budget?year=${date.getFullYear()}&month=${date.getMonth()+1}`);
            const data=await resp.json();
            console.log(data)
            setBudget(data.budget[0].budget)
        }
        fetchBdgt()
    },[])

    const spent=Object.entries(d).filter(([key])=>(key!=="name" && key!=="month")).reduce((total:number,[key,value])=>total+parseInt(value as string),0);
    const COLORS = [
    "#ea580c",
    "#2563eb",
    "#059669",
    "#9333ea",
    "#dc2626",
    "#334155"
    ];
    return <div className="flex flex-col lg:w-[40%] sm:w-[100%] w-full bg-orange-400 md:w-[100%] md:bg-red-500 lg:bg-green-500  rounded-3xl sm:h-[100dvh] h-[75%] md:h-[100dvh] lg:h-[100%]">
                                <div className=" h-[40%] flex w-full rounded-3xl rounded-b-none">
                                    <div className="w-[60%] h-full flex items-start px-10 justify-center flex-col">
                                        <h1 className="font-bold text-white text-3xl roboto">Available</h1>
                                        <h1 className="text-white self-center font-light roboto">This month</h1>
                                        <h1 className="font-bold text-white self-end text-3xl roboto">${budget.toPrecision(4)}</h1>
                                    </div>
                                    <div className="w-[40%] flex justify-center items-start p-5">
                                        <button className="roboto bg-white/20 p-2 rounded-2xl hover:bg-white/10 active:bg-white/10 cursor-pointer text-gray-200 font-medium ">
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
                                            endAngle={90-(360*(spent/budget))}
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