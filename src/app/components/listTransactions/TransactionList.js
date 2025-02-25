"use client";
import React, { useState, useEffect } from "react";
import { getTransactionsAdmin } from "../../../axios/api";
import HeaderChrono from "../header/header";
import TransactionFilters from "./TransactionFilters";
import TransactionTable from "./TransactionTable";

function TransactionList() {
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [filters, setFilters] = useState({ startDate: null, endDate: null, gym: "", status: "", paymentMethod: "" });
    const [expandedTransactionId, setExpandedTransactionId] = useState(null);

    useEffect(() => {
        fetchTransactions();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filters, transactions]);

    const fetchTransactions = async () => {
        try {
            const data = await getTransactionsAdmin();
            setTransactions(data);
            setFilteredTransactions(data);
        } catch (error) {
            console.error("Erro ao buscar transações:", error);
        }
    };

    const applyFilters = () => {
        const { startDate, endDate, gym, status, paymentMethod } = filters;
        const filtered = transactions.filter((transaction) => {
            const transactionDate = new Date(transaction.createdAt);
            return (
                (!startDate || transactionDate >= startDate) &&
                (!endDate || transactionDate <= endDate) &&
                (!gym || transaction.gym.name === gym) &&
                (!status || transaction.status === status) &&
                (!paymentMethod || transaction.paymentMethod === paymentMethod)
            );
        });
        setFilteredTransactions(filtered);
    };

    return (
        <div>
            <HeaderChrono />
            <div className="container mx-auto p-4 mt-20">
                <h1 className="text-2xl font-bold mb-4">Lista de Transações</h1>
                <TransactionFilters filters={filters} setFilters={setFilters} transactions={transactions} />
                <TransactionTable 
                    transactions={filteredTransactions} 
                    expandedTransactionId={expandedTransactionId} 
                    setExpandedTransactionId={setExpandedTransactionId} 
                    fetchTransactions={fetchTransactions}
                />
            </div>
        </div>
    );
}

export default TransactionList;
