import mongoose from "mongoose";
const BudgetSchema=new mongoose.Schema({
    budget:{
        type:Number,
        default:0
    },
    year:{
        type:Number,
        required:true
    },
    balance:{
        type:Number,default:0
    }
    ,month:{
        type:Number,required:true
    }
})
export default mongoose.models.Budget || mongoose.model("Budget",BudgetSchema);