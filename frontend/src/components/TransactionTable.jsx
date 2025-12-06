import React from 'react';
import {
    Calendar,
    User,
    Tag,
    CreditCard,
    MapPin,
    ChevronUp,
    ChevronDown,
    ArrowUpDown
} from 'lucide-react';

const statusStyles = {
    'Completed': { bg: 'bg-emerald-500/20', text: 'text-emerald-400', dot: 'status-completed' },
    'Pending': { bg: 'bg-amber-500/20', text: 'text-amber-400', dot: 'status-pending' },
    'Cancelled': { bg: 'bg-red-500/20', text: 'text-red-400', dot: 'status-cancelled' },
    'Returned': { bg: 'bg-blue-500/20', text: 'text-blue-400', dot: 'status-returned' },
};

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

function SortIcon({ field, currentSort }) {
    if (!currentSort || !currentSort.startsWith(field)) {
        return <ArrowUpDown className="w-4 h-4 text-surface-500" />;
    }
    return currentSort.endsWith('_desc')
        ? <ChevronDown className="w-4 h-4 text-primary-400" />
        : <ChevronUp className="w-4 h-4 text-primary-400" />;
}

function TableSkeleton() {
    return (
        <div className="animate-pulse">
            {[...Array(10)].map((_, i) => (
                <div key={i} className="flex gap-4 p-4 border-b border-surface-700/50">
                    <div className="skeleton h-4 w-16"></div>
                    <div className="skeleton h-4 w-24"></div>
                    <div className="skeleton h-4 flex-1"></div>
                    <div className="skeleton h-4 w-20"></div>
                    <div className="skeleton h-4 w-24"></div>
                    <div className="skeleton h-4 w-20"></div>
                </div>
            ))}
        </div>
    );
}

export default function TransactionTable({
    transactions = [],
    isLoading = false,
    sortBy = 'date_desc',
    onSortChange,
    onRowClick
}) {
    const handleSort = (field) => {
        if (!onSortChange) return;

        const currentField = sortBy?.split('_')[0];
        const currentDir = sortBy?.split('_')[1];

        if (currentField === field) {
            onSortChange(`${field}_${currentDir === 'desc' ? 'asc' : 'desc'}`);
        } else {
            onSortChange(`${field}_desc`);
        }
    };

    if (isLoading) {
        return (
            <div className="glass-card overflow-hidden">
                <TableSkeleton />
            </div>
        );
    }

    if (!transactions || transactions.length === 0) {
        return (
            <div className="glass-card p-12 text-center">
                <div className="text-surface-500 text-lg">No transactions found</div>
                <p className="text-surface-600 text-sm mt-2">Try adjusting your filters or search query</p>
            </div>
        );
    }

    return (
        <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-surface-700/50 bg-surface-800/50">
                            <th className="table-header">
                                <button
                                    onClick={() => handleSort('id')}
                                    className="flex items-center gap-1 hover:text-surface-200 transition-colors"
                                >
                                    ID
                                    <SortIcon field="id" currentSort={sortBy} />
                                </button>
                            </th>
                            <th className="table-header">
                                <button
                                    onClick={() => handleSort('date')}
                                    className="flex items-center gap-1 hover:text-surface-200 transition-colors"
                                >
                                    <Calendar className="w-3.5 h-3.5" />
                                    Date
                                    <SortIcon field="date" currentSort={sortBy} />
                                </button>
                            </th>
                            <th className="table-header">
                                <button
                                    onClick={() => handleSort('customer')}
                                    className="flex items-center gap-1 hover:text-surface-200 transition-colors"
                                >
                                    <User className="w-3.5 h-3.5" />
                                    Customer
                                    <SortIcon field="customer" currentSort={sortBy} />
                                </button>
                            </th>
                            <th className="table-header">
                                <span className="flex items-center gap-1">
                                    <Tag className="w-3.5 h-3.5" />
                                    Category
                                </span>
                            </th>
                            <th className="table-header">Tags</th>
                            <th className="table-header text-center">
                                <button
                                    onClick={() => handleSort('quantity')}
                                    className="flex items-center gap-1 mx-auto hover:text-surface-200 transition-colors"
                                >
                                    Qty
                                    <SortIcon field="quantity" currentSort={sortBy} />
                                </button>
                            </th>
                            <th className="table-header text-right">
                                <button
                                    onClick={() => handleSort('amount')}
                                    className="flex items-center gap-1 ml-auto hover:text-surface-200 transition-colors"
                                >
                                    Amount
                                    <SortIcon field="amount" currentSort={sortBy} />
                                </button>
                            </th>
                            <th className="table-header">
                                <span className="flex items-center gap-1">
                                    <CreditCard className="w-3.5 h-3.5" />
                                    Payment
                                </span>
                            </th>
                            <th className="table-header">Status</th>
                            <th className="table-header">
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5" />
                                    Region
                                </span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-700/30">
                        {transactions.map((transaction, idx) => (
                            <tr
                                key={transaction._id || transaction.transactionID}
                                className="transition-colors hover:bg-surface-700/20 animate-fade-in cursor-pointer"
                                style={{ animationDelay: `${idx * 20}ms` }}
                                onClick={() => onRowClick && onRowClick(transaction)}
                            >
                                <td className="table-cell">
                                    <span className="font-mono text-primary-400">
                                        #{transaction.transactionID}
                                    </span>
                                </td>
                                <td className="table-cell text-surface-400">
                                    {formatDate(transaction.date)}
                                </td>
                                <td className="table-cell">
                                    <div>
                                        <div className="font-medium text-surface-200">
                                            {transaction.customerName}
                                        </div>
                                        <div className="text-xs text-surface-500">
                                            {transaction.phone}
                                        </div>
                                    </div>
                                </td>
                                <td className="table-cell">
                                    <span className="px-2 py-1 text-xs font-medium rounded-md bg-surface-700/50 text-surface-300">
                                        {transaction.productCategory}
                                    </span>
                                </td>
                                <td className="table-cell">
                                    <div className="flex flex-wrap gap-1 max-w-[180px]">
                                        {transaction.tags?.slice(0, 3).map((tag, i) => (
                                            <span key={i} className="tag-pill">
                                                {tag}
                                            </span>
                                        ))}
                                        {transaction.tags?.length > 3 && (
                                            <span className="text-xs text-surface-500">
                                                +{transaction.tags.length - 3}
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="table-cell text-center">
                                    <span className="font-mono text-surface-300">
                                        {transaction.quantity}
                                    </span>
                                </td>
                                <td className="table-cell text-right">
                                    <span className="font-mono font-medium text-surface-200 font-tabular">
                                        {formatCurrency(transaction.finalAmount || transaction.amount)}
                                    </span>
                                </td>
                                <td className="table-cell text-surface-400">
                                    {transaction.paymentMethod}
                                </td>
                                <td className="table-cell">
                                    <div className="flex items-center gap-2">
                                        <span className={`status-dot ${statusStyles[transaction.status]?.dot || ''}`}></span>
                                        <span className={`text-xs font-medium ${statusStyles[transaction.status]?.text || 'text-surface-400'}`}>
                                            {transaction.status}
                                        </span>
                                    </div>
                                </td>
                                <td className="table-cell text-surface-400">
                                    {transaction.region}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
