import { useEffect, useState } from "react";
import { 
    FaUtensils, 
    FaHome, 
    FaCar, 
    FaFilm, 
    FaShoppingBag, 
    FaLightbulb, 
    FaStethoscope, 
    FaBook, 
    FaDollarSign,
    FaEye,
    FaPlus,
    FaEdit,
} from 'react-icons/fa';

import { CiCircleMore } from "react-icons/ci";

interface Transaction {
    _id: string;
    description: string;
    amount: number;
    category: string;
    date: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface TransactionResponse {
    success: boolean;
    transactions: Transaction[];
}

interface ProfileProps {
    onViewAllTransactions?: () => void;
    onAddTransaction?: () => void;
    onEditTransaction?: () => void;
}

type CategoryType = 'food' | 'rent' | 'transport' | 'medical' | 'groceries' | 'other';

interface CategoryIcons {
    [key: string]: React.ComponentType<{ className?: string; size?: number }>;
}

export default function Profile({ onViewAllTransactions, onAddTransaction, onEditTransaction }: ProfileProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const date: Date = new Date();

    useEffect(() => {
        const fetchTrans = async ()=> {
            try {
                const resp: Response = await fetch(`/api/transactions?year=${date.getFullYear()}&month=${date.getMonth()+1}`);
                const data: TransactionResponse = await resp.json();
                setTransactions(data.transactions || []);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTrans();
    }, []);

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

    const displayTransactions: Transaction[] = transactions.slice(0, 4);

    return (
        <div className="w-full h-full flex flex-col bg-gray-500 rounded-2xl overflow-hidden">
            <div className="w-full flex justify-between lg:justify-center md:justify-center sm:justify-between px-5 lg:px-0 md:px-0 sm:px-5 h-[100%] items-center sm:h-[100%] md:h-[30%] lg:h-[30%] ">
                <CiCircleMore className="text-3xl font-extrabold sm:block block lg:hidden md:hidden "/>
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-24 md:h-24 lg:w-32 lg:h-32 bg-gray-800  rounded-full overflow-hidden shadow-2xl">
                    <img src={"/bb.svg"} className="w-full h-full object-contain" alt="Profile" />
                </div>
            </div>
            
            <div className="hidden md:flex w-full flex-1 rounded-2xl rounded-t-none bg-gradient-to-br from-purple-400 via-pink-500/50 to-blue-400 p-4 lg:p-6 flex-col min-h-0">
                <div className="flex justify-between items-center mb-4 lg:mb-6">
                    <h3 className="text-white text-lg lg:text-xl font-semibold">Recent Transactions</h3>
                    <button
                        onClick={onViewAllTransactions}
                        className="text-white text-sm bg-white/20 hover:bg-white/30 px-3 py-2 lg:px-4 lg:py-2 rounded-lg transition-all duration-200 backdrop-blur-sm flex items-center gap-2 font-medium"
                    >
                        <FaEye size={14} />
                        <span className="hidden lg:inline">View All</span>
                        <span className="lg:hidden">All</span>
                    </button>
                </div>

                {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-white/70 text-sm">Loading transactions...</div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col min-h-0">
                        <div className="flex-1 overflow-y-auto mb-4 pr-1">
                            {displayTransactions.length > 0 ? (
                                <div className="space-y-3">
                                    {displayTransactions.map((transaction: Transaction, index: number) => {
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
                                                    <div className="text-right flex-shrink-0 ml-2">
                                                        <p className="text-white font-semibold text-xs lg:text-sm">
                                                            {formatAmount(transaction.amount)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="flex-1 flex items-center justify-center">
                                    <div className="text-white/70 text-sm">No transactions found</div>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-2 lg:gap-3 mt-auto">
                            <button
                                onClick={onAddTransaction}
                                className="flex-1 bg-white/20 hover:bg-white/30 text-white px-3 py-2 lg:px-4 lg:py-3 rounded-lg transition-all duration-200 backdrop-blur-sm flex items-center justify-center gap-2 font-medium text-sm"
                            >
                                <FaPlus size={12} />
                                <span className="hidden lg:inline">Add Transaction</span>
                                <span className="lg:hidden">Add</span>
                            </button>
                            <button
                                onClick={onEditTransaction}
                                className="flex-1 bg-white/20 hover:bg-white/30 text-white px-3 py-2 lg:px-4 lg:py-3 rounded-lg transition-all duration-200 backdrop-blur-sm flex items-center justify-center gap-2 font-medium text-sm"
                            >
                                <FaEdit size={12} />
                                <span className="hidden lg:inline">Edit Transaction</span>
                                <span className="lg:hidden">Edit</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}