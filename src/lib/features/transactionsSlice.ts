import { createSlice,PayloadAction} from "@reduxjs/toolkit";

interface transaction{
    description:string,
    amount:number,
    category:string,
    date:string,
    _id:string,
    createdAt:string,updatedAt:string,
    __v:number
}

type pspk={
    transactions:transaction[]
}

const initialState:pspk={
    transactions:[]
}

const transactionSlice=createSlice({
    name:'Transactions',
    initialState,
    reducers:{
        setTransactions:(state,action:PayloadAction<{transactions:transaction[]}>)=>{
            state.transactions=action.payload.transactions
    },
    updateTransaction:(state,action:PayloadAction<{transaction:transaction}>)=>{
        const ind=state.transactions.findIndex(item=>item._id===action.payload.transaction._id);
        if(ind!=-1)
        state.transactions[ind]=action.payload.transaction
    },
    deleteTransaction:(state,action:PayloadAction<{id:string}>)=>{
        state.transactions=state.transactions.filter((ele)=>{
            return ele._id!=action.payload.id
        })
    },
    addTransaction:(state,action:PayloadAction<{transaction:transaction}>)=>{
        console.log(action.payload)
        state.transactions.unshift(action.payload.transaction)
    }
}
})

export const {setTransactions,updateTransaction,deleteTransaction,addTransaction} = transactionSlice.actions;
export default transactionSlice