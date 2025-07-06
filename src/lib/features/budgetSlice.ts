import { createSlice,PayloadAction } from "@reduxjs/toolkit";
interface BudgetState{
    budget:number,
    balance:number
}

const initialState:BudgetState={
    balance:0,
    budget:0
}

export const budgetSlice=createSlice({
    name:'Budget',
    initialState,
    reducers:{
        setBudget:(state,action:PayloadAction<BudgetState>)=>{
            state.budget=action.payload.budget;
            state.balance=action.payload.balance
        }
    }
})


export const {setBudget}=budgetSlice.actions;
export default budgetSlice.reducer