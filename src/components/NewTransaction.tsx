
import { MdClose, MdPadding } from "react-icons/md";
import DatePicker from "react-datepicker";
import { useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import TextareaAutosize from 'react-textarea-autosize';
import Select from 'react-select';
type props={
    closer:()=>void,
}
const NewTransaction=({closer}:props)=>{
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
                        setAmount("");
                        setCategory("");
                        setDescription("");
                        closer()
                }} className="bg-white w-[75%] flex sm:flex-col lg:flex-row md:flex-col flex-col h-[75%]  relative rounded">
                    <MdClose onClick={()=>{closer()}} className="absolute text-2xl text-black top-5 left-5 cursor-pointer"/>
                    <div className="w-[100%] lg:w-[50%]  h-[25%] md:h-[25%] lg:h-[100%]  flex justify-center items-center">
                        <div className="flex flex-col gap-3 justify-center items-center">
                        <h1 className="text-gray-700 text-2xl">NEW TRANSACTION</h1>
                        <div className="flex justify-center items-center gap-2">
                        <h1 className="text-black text-4xl">$</h1>
                        <input
                            type="text"
                            className="rounded outline-0 w-1/2 bg-gray-400 p-2 text-4xl"
                            value={amount}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val === "" || /^[0-9]*\.?[0-9]*$/.test(val)) {
                                setAmount(val);
                                }
                            }}
                            />
                        </div>
                        </div>
                    </div>
                    <div className="w-[100%] lg:w-[50%] h-[75%] md:h-[75%] lg:h-[100%] relative flex flex-col justify-center gap-5 items-center bg-gray-400">
                            <div className="w-[75%] flex flex-col justify-center items-start gap-2">
                            <h1 className='text-gray-800 text-xl'>Category</h1>
                        <Select
                            styles={styles}
                            isClearable
                            placeholder="Select Category"
                            options={options}
                            onChange={(option) => setCategory(option?.value || null)}
                            className="w-[100%] cursor-pointer text-black"
                            />

                            </div>
                            <div className="w-[75%] flex flex-col justify-center items-start gap-2">
                            <h1 className='text-gray-800 text-xl'>Date of Transaction</h1>
                            <div className="relative">
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date as Date)}
                                className="p-2 rounded text-black bg-white font-bold outline-0"
                            />
                            </div>
                            </div>
                            <div className="w-[75%] flex flex-col justify-center items-start gap-2">
                            <h1 className='text-gray-800 text-xl'>Description</h1>
                            <TextareaAutosize
                                className='w-[75%] bg-white outline-0 text-gray-800 rounded p-2'
                                minRows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                />

                                                        </div>
                            <div className="w-[75%] flex flex-col justify-center items-start gap-2">
                            <div className="w-[100%] p-2 flex  flex-col justify-center items-center gap-2">
                            <button className='tracking-wider absolute bottom-10 cursor-pointer text-white font-extrabold text-2xl bg-black px-5 p-3 rounded-xl'>Save</button>
                            </div>
                            </div>
                    </div>
                </form>
            </div>
        </>
    )
}
export default NewTransaction;