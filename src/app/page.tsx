    "use client";
import Balance from "@/components/Balance";
import Monthly from "@/components/Monthly";
import NewTransaction from "@/components/NewTransaction";
import Profile from "@/components/Profile";
import Transactions from "@/components/Transactions";
import UpdateTransaction from "@/components/UpdateBudget";
import { AnimatePresence,motion } from "framer-motion";
import { useState } from "react";
    export default function Page(){
        const [change,setChange]=useState<boolean>(false);
        const changeHandler=()=>{
            setChange((prev)=>!prev);
        }
        const [add,changeAdd]=useState<boolean>(false);
        return <>
            <>
            <div className="w-screen flex  flex-col sm:flex-col md:flex-row lg:flex-row relative justify-start bg-gray-200 items-center min-h-screen bg-gradient-to-br">
                        {change&&
                        <AnimatePresence>
                        <motion.div
                        className="w-screen h-screen absolute z-50"
                        initial={{opacity:0}}
                        animate={{opacity:1}}
                        transition={{duration:1,type:"spring"}}
                        >
                        <UpdateTransaction changeHandler={changeHandler}></UpdateTransaction>
                        </motion.div>
                        </AnimatePresence>
                        }
                        {add&&
                        <AnimatePresence>
                        <motion.div
                        className="w-screen h-screen absolute z-50"
                        initial={{opacity:0}}
                        animate={{opacity:1}}
                        transition={{duration:1,type:"spring"}}
                        >
                        <NewTransaction></NewTransaction>
                        </motion.div>
                        </AnimatePresence>
                        }
                    <div className="h-[10dvh] lg:h-[100dvh] md:h-[100dvh] w-full sm:w-full md:w-[60%] lg:w-[30%] p-5">
                        <Profile></Profile>
                    </div>
                    <div className="lg:w-[75%] w-full sm:h-[150dvh] lg:h-[100dvh] md:h-[100dvh] h-[150dvh]  overflow-y-auto ">
                        <div className="w-full flex flex-col gap-5 p-5 h-full">
                            <Monthly></Monthly>
                            <div className="h-[100dvh] sm:h-[100dvh] md:h-[100dvh] lg:h-[50dvh] py-3  w-full flex-col gap-3 flex lg:flex-row md:flex-col md:items-center md:justify-between md:gap-3 items-center lg:justify-around">
                            <Balance changeHandler={changeHandler}></Balance>
                            <Transactions></Transactions>
                        </div>  
                        </div>
                    </div>
            </div>
        </>
        </>
    }