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
    }
}
})

export const {setTransactions} = transactionSlice.actions;
export default transactionSlice