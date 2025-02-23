import React from "react";
import TransactionRow from "./TransactionRow";

function TransactionTable({ transactions, expandedTransactionId, setExpandedTransactionId, fetchTransactions }) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 shadow-lg rounded-lg">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Cliente</th>
                        <th className="py-2 px-4 border-b">Academia</th>
                        <th className="py-2 px-4 border-b">Valor</th>
                        <th className="py-2 px-4 border-b">Status</th>
                        <th className="py-2 px-4 border-b">Meio de pagamento</th>
                        <th className="py-2 px-4 border-b">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction) => (
                        <TransactionRow 
                            key={transaction.id} 
                            transaction={transaction} 
                            expanded={expandedTransactionId === transaction.id} 
                            setExpandedTransactionId={setExpandedTransactionId} 
                            fetchTransactions={fetchTransactions}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TransactionTable;
