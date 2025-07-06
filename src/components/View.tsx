import { MdClose} from "react-icons/md";
import { useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
type props={
    closer:()=>void,
}
const ViewTransaction=({closer}:props)=>{
    const options=[
        {value:'groceries',label:"Groceries"},
        {value:'medical',label:"Medical"},
        {value:'food',label:"Food"},
        {value:'rent',label:"Rent"},
        {value:"transport",label:"Transport"},
    ];
    const styles={
        control:(base:any)=>{
            return {
                ...base,
                backgroundColor:"white",
                padding:"5px"
            }
        },
        singleValue:(base:any)=>{
            return {
                ...base,
                color:"black",
                fontWeight:"bold",
                letterSpacing: '0.02em',
            }
        }
    }
    const [startDate, setStartDate] = useState(new Date());
    const [amount, setAmount] = useState<string>('');
    const [category, setCategory] = useState<string | null>(null);
    const [description, setDescription] = useState<string>('');
    return (
        <>
            <div className="bg-black/80  w-screen z-50 h-screen flex justify-center items-center bottom-[0.2%] fixed">
                <form onSubmit={async(e)=>{
                        e.preventDefault();
                        if(!category||!amount){
                            return;
                        }
                        const date = new Date(Date.UTC(2025, 6, 1, 9, 0, 0))
                        const resp=await fetch(`/api/transactions`,{method:"POST",headers:{'Content-Type':"Application/json"}
                            ,body:JSON.stringify({
                                description,
                                amount:parseFloat(amount),
                                category,
                                date:date.toISOString()
                            })});
                        const data=await resp.json();
                }} className="bg-white w-[75%] flex sm:flex-col lg:flex-row md:flex-col flex-col h-[75%]  relative rounded">
                    <MdClose onClick={()=>{closer()}} className="absolute text-2xl text-black top-5 left-5 cursor-pointer"/>
                    <div className="w-[100%] lg:w-[50%]  h-[25%] md:h-[25%] lg:h-[100%]  flex justify-center items-center">
                        
                    </div>
                    <div className="w-[100%] lg:w-[50%] h-[75%] md:h-[75%] lg:h-[100%] relative flex flex-col justify-center gap-5 items-center bg-gray-400">
                           
                    </div>
                </form>
            </div>
        </>
    )
}
export default ViewTransaction;