import { setBudget } from "@/lib/features/budgetSlice";
import { AppDispatch } from "@/lib/store";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
type Props = {
  changeHandler: () => void;
};
export default function UpdateTransaction({changeHandler}:Props){
    const [currentBudget, setCurrentBudget] = useState(0);
    const [newBudget, setNewBudget] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const dispatch=useDispatch<AppDispatch>();
    useEffect(() => {
    const fetchBudget = async () => {
      try {
        const date = new Date();
        const response = await fetch(`/api/budget?year=${date.getFullYear()}&month=${date.getMonth()+1}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch budget');
        }
        
        const data = await response.json();
        setCurrentBudget(data.budget[0]?.budget || 0);
      } catch (err) {
        setError('Failed to load current budget');
        console.error('Error fetching budget:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBudget();
  }, []);
    
    if (loading) {
    return (
    <div className="w-screen h-screen flex justify-center items-center absolute z-50 bg-gray-500/50">
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
    );
  }

    return (
    <div className="w-screen h-screen flex justify-center items-center absolute z-50 bg-gray-500/50">
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-100">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Update Budget</h2>
        <div className="text-sm text-gray-600">
          Current Budget: <span className="font-medium text-green-600">${currentBudget.toLocaleString()}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
            New Budget Amount
          </label>
          <div className="relative flex justify-around gap-3 items-center">
            <span className=" text-gray-500 font-bold text-2xl">$</span>
            <input
              type="text"
              id="budget"
                value={newBudget === "" ? "" : newBudget.toString()}
              placeholder="Enter new budget"
               onChange={(e) => {
                    const val = (e.target.value);
                    if (val === "" || /^[0-9]*\.?[0-9]*$/.test(val)) {
                    setNewBudget(val);
                    }
                }}
              className="w-full pl-8 pr-4 py-3 outline-0 bg-gray-200 font-bold  transition-colors text-gray-900 placeholder-gray-500"
              required
            />
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded px-3 py-2">
            {error}
          </div>
        )}

        <button
          type="button"
          disabled={!newBudget}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={async()=>{
            const ne=Number(newBudget);
            if(ne<0||ne==0){
                setError("Not allowed to update the budget <0 or =0");
                return;
            }
            setLoading(true);
            const date=new Date;
            const resp=await fetch("/api/budget",{method:"POST",headers:{'Content-Type':'Application/json'},
                body:JSON.stringify({
                    year:date.getFullYear(),
                    month:date.getMonth()+1,newBudget:ne
                })
            });
            const data=await resp.json();
            if(data.budget){
              dispatch(setBudget({balance:data.budget.balance,budget:data.budget.budget}));
            }
            setLoading(false);
            changeHandler();
          }}
        >
          Update Budget
        </button>
      </div>
    </div>
    </div>
    )
}