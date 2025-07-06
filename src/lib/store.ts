import { configureStore } from "@reduxjs/toolkit";
import budgetReducer from "@/lib/features/budgetSlice"
import transactionSlice from "./features/transactionsSlice";

export const store=configureStore({
    reducer:{
        budget:budgetReducer,
        transactions:transactionSlice.reducer
    }
})

export type RootState=ReturnType<typeof store.getState>;
export type AppDispatch=typeof store.dispatch;