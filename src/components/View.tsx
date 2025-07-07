import { MdClose } from "react-icons/md";
import { use, useEffect, useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { FaCar, FaDollarSign, FaEye, FaHome, FaShoppingBag, FaStethoscope, FaUtensils } from "react-icons/fa";
import { FaPencil, FaStreetView } from "react-icons/fa6";
import Select from 'react-select';
import TextareaAutosize from 'react-textarea-autosize';
import { deleteTransaction, setTransactions, updateTransaction } from "@/lib/features/transactionsSlice";
import UpdateTransaction from "./UpdateBudget";

type props = {
    closer: () => void,
}

interface CategoryIcons {
    [key: string]: React.ComponentType<{ className?: string; size?: number }>;
}

interface Transaction {
    description: string,
    amount: number,
    category: string,
    date: string,
    _id: string,
    createdAt: string, updatedAt: string,
    __v: number
}

interface SelectOption {
    value: string;
    label: string;
    icon?: React.ComponentType<{ className?: string; size?: number }>;
}

const ViewTransaction = ({ closer }: props) => {
    const getCategoryIcon = (category: string): React.ComponentType<{ className?: string; size?: number }> => {
        const icons: CategoryIcons = {
            food: FaUtensils,
            rent: FaHome,
            transport: FaCar,
            medical: FaStethoscope,
            groceries: FaShoppingBag,
            other: FaDollarSign
        };
        return icons[category] || icons.other;
    };

    const formatDate = (dateString: string): string => {
        const date: Date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    const formatAmount = (amount: number): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const categoryOptions: SelectOption[] = [
        { value: 'groceries', label: "Groceries", icon: FaShoppingBag },
        { value: 'medical', label: "Medical", icon: FaStethoscope },
        { value: 'food', label: "Food", icon: FaUtensils },
        { value: 'rent', label: "Rent", icon: FaHome },
        { value: "transport", label: "Transport", icon: FaCar },
    ];

    const transactions = useSelector((state: RootState) => state.transactions);
    const [editor, setEditor] = useState<boolean>(false);
    const [particular, setParticular] = useState<string>("");
    const [startDate, setStartDate] = useState(new Date());
    const [amount, setAmount] = useState<string>('');
    const [category, setCategory] = useState<SelectOption | null>(null);
    const [description, setDescription] = useState<string>('');
    const disp=useDispatch<AppDispatch>()

    useEffect(() => {
        const fetchIt = async () => {
            const resp = await fetch(`/api/paritcular?id=${particular}`)
            const data = await resp.json();
            if (data.success) {
                setDescription(data.transaction.description);
                setAmount(data.transaction.amount.toString());
                const selectedCategory = categoryOptions.find(opt => opt.value === data.transaction.category);
                setCategory(selectedCategory || null);
                setStartDate(new Date(data.transaction.date));
            }
        }
        if (editor) {
            fetchIt()
        }
    }, [editor])

   const customSelectStyles = {
    control: (provided: any, state: any) => ({
        ...provided,
        backgroundColor: '#6b7280',
        border: '1px solid #9ca3af',
        borderRadius: '8px',
        minHeight: '44px',
        display: 'flex',
        width:"100%",
        height:"100%",
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: state.isFocused ? '0 0 0 3px rgba(147, 197, 253, 0.3)' : 'none',
        borderColor: state.isFocused ? '#93c5fd' : '#9ca3af',
        '&:hover': {
            borderColor: '#93c5fd'
        }
    }),
    option: (provided: any, state: any) => ({
        ...provided,
        backgroundColor: state.isSelected
            ? '#3b82f6'
            : state.isFocused
            ? '#d1d5db'
            : '#6b7280',
        color: state.isSelected || state.isFocused ? '#111827' : '#f9fafb',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontWeight: 500
    }),
    menu: (provided: any) => ({
        ...provided,
        backgroundColor: '#6b7280',
        borderRadius: '8px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        border: '1px solid #9ca3af'
    }),
    singleValue: (provided: any) => ({
        ...provided,
        color: '#f9fafb',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontWeight: 500
    })
};


    const CustomOption = ({ innerProps, label, data }: any) => (
        <div {...innerProps} className="flex items-center gap-2 p-3 hover:bg-gray-50 cursor-pointer">
            {data.icon && <data.icon className="text-gray-600" size={16} />}
            <span>{label}</span>
        </div>
    );

    const CustomSingleValue = ({ children, data }: any) => (
        <div className="flex items-center gap-2">
            {data.icon && <data.icon className="text-gray-600" size={16} />}
            <span>{children}</span>
        </div>
    );

    return (
        <>
            <div className="bg-black/80 w-screen z-50 h-screen flex justify-center items-center bottom-[0.2%] fixed">
                <form onSubmit={async (e) => {
                    e.preventDefault();
                    if (!category || !amount) {
                        return;
                    }
                    const date = new Date(Date.UTC(2025, 6, 1, 9, 0, 0))
                    const resp = await fetch(`/api/transactions`, {
                        method: "POST", headers: { 'Content-Type': "Application/json" }
                        , body: JSON.stringify({
                            description,
                            amount: parseFloat(amount),
                            category: category.value,
                            date: date.toISOString()
                        })
                    });
                    const data = await resp.json();
                }} className="bg-white md:w-[50%] lg:w-[30%] sm:w-[75%] w-[75%] lg:- flex sm:flex-col lg:flex-row md:flex-col flex-col h-[75%] relative rounded-xl">
                    <MdClose onClick={() => { closer() }} className="absolute text-2xl text-black top-5 left-5 cursor-pointer" />
                    <div className="w-full bg-gray-500 rounded-xl flex pt-15 overflow-y-auto flex-col p-4 gap-1 h-full">
                        <h1 className="text-white flex items-center self-center j-center text-lg gap-1 font-bold">View and Edit your Transactions</h1>
                        {transactions.transactions.map((transaction: Transaction, index: number) => {
                            const IconComponent = getCategoryIcon(transaction.category);
                            return (
                                <div
                                    key={transaction._id}
                                    className="bg-white/10 backdrop-blur-sm rounded-xl p-3 lg:p-4 border border-white/20 hover:bg-white/20 transition-all duration-200"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 lg:gap-3 min-w-0 flex-1">
                                            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                                                <IconComponent className="text-white" size={14} />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-white font-medium text-xs lg:text-sm truncate">
                                                    {transaction.description}
                                                </p>
                                                <p className="text-white/70 text-xs capitalize truncate">
                                                    {transaction.category} • {formatDate(transaction.date)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right flex gap-4 ml-2">
                                            <p className="text-white font-semibold text-xs lg:text-sm">
                                                {formatAmount(transaction.amount)}
                                            </p>
                                            <FaPencil onClick={() => {
                                                setParticular(transaction._id);
                                                setEditor(true)
                                            }} className="hover:invert cursor-pointer"></FaPencil>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {editor &&
                        <div className="w-full rounded-2xl h-full bg-gray-500 absolute flex flex-col p-8 overflow-y-auto">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-800">Edit Transaction</h2>
                                <MdClose 
                                    onClick={() => { setEditor(false); setParticular("") }} 
                                    className="text-gray-900 hover:text-gray-700 text-2xl cursor-pointer transition-colors"
                                />
                            </div>
                            
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <TextareaAutosize
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Enter transaction description..."
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                                        minRows={2}
                                        maxRows={4}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Amount
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">$</span>
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            placeholder="0.00"
                                            step="0.01"
                                            min="0"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category
                                    </label>
                                    <Select
                                        value={category}
                                        onChange={(selectedOption) => setCategory(selectedOption)}
                                        options={categoryOptions}
                                        styles={customSelectStyles}
                                        components={{
                                            Option: CustomOption,
                                            SingleValue: CustomSingleValue
                                        }}
                                        placeholder="Select a category..."
                                        isSearchable={false}
                                        className="text-sm"
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            if (!category || !amount || !particular) return;
                                            
                                            const resp=await fetch(`/api/paritcular`, {
                                                method: "POST",
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({
                                                    description,
                                                    amount: parseFloat(amount),
                                                    category: category.value,
                                                    id:particular
                                                })
                                            });
                                            const data=await resp.json();
                                            disp(updateTransaction({transaction:data.transaction}));
                                            setEditor(false);
                                            setParticular("");
                                            setCategory(null);
                                            setAmount("");
                                            setDescription("");
                                        }}
                                        className=" bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors focus:outline-none "
                                    >
                                        Save 
                                    </button>
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            if (!category || !amount || !particular) return;
                                            
                                            const resp=await fetch(`/api/paritcular`, {
                                                method: "DELETE",
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({
                                                    description,
                                                    amount: parseFloat(amount),
                                                    category: category.value,
                                                    id:particular
                                                })
                                            });
                                            const data=await resp.json();
                                            disp(deleteTransaction({id:data.id}));
                                            setEditor(false);
                                            setParticular("");
                                            setCategory(null);
                                            setAmount("");
                                            setDescription("");
                                        }}
                                        className=" bg-red-500 cursor-pointer hover:bg-red-400 text-white font-medium py-3 px-6 rounded-lg transition-colors focus:outline-none "
                                    >
                                        Delete
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditor(false);
                                            setParticular("");
                                        }}
                                        className="px-6 py-3 border cursor-pointer border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                    >
                                        Cancel
                                    </button>
                                </div>
                                
                            </div>
                        </div>}
                </form>
            </div>
        </>
    )
}
export default ViewTransaction;