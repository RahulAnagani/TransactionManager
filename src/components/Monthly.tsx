import { useEffect, useState } from "react"
import { ResponsiveContainer,BarChart,Bar,CartesianGrid,XAxis,YAxis,Tooltip,Legend } from "recharts"
type spendingData={
     name: string, food: number, medical: number, groceries: number, transport: number, rent: number, other: number ,month:number
}
type props={
    spendingData:spendingData
}
export default function Monthly(){
    const [spendingData,setSpendingData]=useState<spendingData[]>([]);
    const date=new Date;
    useEffect(()=>{
        const fetchTransactions=async()=>{
            const resp=await fetch(`/api/getTransactions?year=${date.getFullYear()}`,{method:"GET"});
            const data=await resp.json();
            setSpendingData(data.spendingData)
        }
        fetchTransactions();
    },[])
    return <div className="h-[50dvh] sm:h-[50dvh] lg:h-[50%] md:h-[30%] w-full rounded-2xl bg-emerald-800">
                                    <ResponsiveContainer>
                                        <BarChart
                                        width={"100%"}
                                        height={"100%"}
                                        className=""
                                        data={spendingData.slice(0,6)}
                                        margin={{
                                            top: 20,
                                            right: 30,
                                            left: 20,
                                            bottom: 5,
                                        }}>
                                            <CartesianGrid strokeDasharray="0 0 " />
                                            <XAxis axisLine={{stroke:"#000",strokeWidth:2}} tick={{fill:"white",fontWeight:"bold",fontSize:"x-small"}} dataKey="name" />
                                            <YAxis axisLine={{stroke:"#000",strokeWidth:2}} tick={{fill:"white"}}/>
                                            <Tooltip />
                                            <Legend />
                                                <Bar dataKey="food" stackId="a" radius={[0, 0, 0, 0]} fill="#f9c74f" /> 
                                                <Bar dataKey="medical" stackId="a" radius={[0, 0, 0, 0]} fill="#f9844a" />   
                                                <Bar  dataKey="groceries" stackId="a" radius={[0, 0, 0, 0]} fill="#90be6d" />   
                                                <Bar dataKey="transport" stackId="a" radius={[10, 10, 0, 0]} fill="#577590" />

                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
}
