    "use client";
import Balance from "@/components/Balance";
import Monthly from "@/components/Monthly";
import Profile from "@/components/Profile";
    import {BarChart,ResponsiveContainer,Bar,XAxis,YAxis,CartesianGrid,Tooltip,Legend,PieChart,Pie,Sector,Cell} from "recharts"
    export default function Page(){
        const spendingData = [
    { name: 'JAN', food: 300, medical: 120, groceries: 250, transport: 80, rent: 800, other: 150 },
    { name: 'FEB', food: 280, medical: 90, groceries: 230, transport: 75, rent: 800, other: 120 },
    { name: 'MAR', food: 350, medical: 150, groceries: 260, transport: 85, rent: 800, other: 100 },
    { name: 'APR', food: 300, medical: 100, groceries: 240, transport: 70, rent: 800, other: 180 },
    { name: 'MAY', food: 400, medical: 200, groceries: 300, transport: 90, rent: 800, other: 130 },
    { name: 'JUN', food: 320, medical: 110, groceries: 220, transport: 60, rent: 800, other: 140 },
    { name: 'JUL', food: 1000, medical: 300, groceries: 0, transport: 200, rent: 0, other: 1000 },
    ];
        const budget=2500;
        const date=new Date();
        const spent=Object.entries(spendingData[date.getMonth()]).filter(([key])=>(key!=="name" )).reduce((total,[key,value])=>total+value,0);
        const data=Object.entries(spendingData[date.getMonth()]).filter(([key])=>(key!=="name" )).map(([key,value])=>({name:key,value:value}));
        const COLORS = [
    "#ea580c",
    "#2563eb",
    "#059669",
    "#9333ea",
    "#dc2626",
    "#334155"
    ];

    const transactions = [
  { description: "Lunch at Subway", amount: 12.99, category: "food" },
  { description: "Weekly groceries - Walmart", amount: 85.75, category: "groceries" },
  { description: "Uber ride to office", amount: 14.50, category: "transport" },
  { description: "Monthly rent payment", amount: 800.00, category: "rent" },
  { description: "Prescription medicines", amount: 45.30, category: "medical" },
  { description: "Coffee with friends", amount: 6.20, category: "food" },
  { description: "Electricity bill", amount: 120.00, category: "other" },
  { description: "Refilled pantry items", amount: 58.40, category: "groceries" },
  { description: "Train ticket to hometown", amount: 90.00, category: "transport" },
  { description: "Doctor consultation", amount: 75.00, category: "medical" },
  { description: "Amazon purchase (books)", amount: 39.99, category: "other" },
  { description: "Dinner - Pizza Hut", amount: 24.50, category: "food" }
];


        return <>
            <>
            <div className="w-screen flex flex-col sm:flex-col md:flex-row lg:flex-row relative justify-start bg-gray-200 items-center min-h-screen bg-gradient-to-br">
                    <div className="h-[10dvh] lg:h-[100dvh] md:h-[100dvh] w-full sm:w-full md:w-[60%] lg:w-[30%] p-5">
                        <Profile></Profile>
                    </div>
                    <div className="lg:w-[75%] w-full sm:h-[150dvh] lg:h-[100dvh] md:h-[100dvh] h-[150dvh]  overflow-y-auto ">
                        <div className="w-full flex flex-col gap-5 p-5 h-full">
                            <Monthly spendingData={spendingData}></Monthly>
                            <div className="h-[100dvh] sm:h-[100dvh] md:h-[100dvh] lg:h-[50dvh] py-3  w-full flex-col gap-3 flex lg:flex-row md:flex-col md:items-center md:justify-between md:gap-3 items-center lg:justify-around">
                            <Balance></Balance>
                            <div className="flex lg:w-[40%] h-[50dvh] md:h-[95%] sm:h-[95%] w-full border border-gray-400/50 bg-gray-300 rounded-2xl">
                            </div>
                        </div>  
                        </div>
                    </div>
            </div>
        </>
        </>
    }