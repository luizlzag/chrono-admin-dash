'use client'
import React, { useState, useEffect } from 'react'
import { getTransactionsAdmin } from '../../../axios/api'
import HeaderChrono from '../header/header'
import TransactionFilters from './TransactionFilters'
import TransactionTable from './TransactionTable'
import { MdArrowBack, MdArrowForward } from 'react-icons/md'

function TransactionList() {
    const [transactions, setTransactions] = useState([])
    const [filteredTransactions, setFilteredTransactions] = useState([])
    const [filters, setFilters] = useState({
        startDate: null,
        endDate: null,
        gym: '',
        status: '',
        paymentMethod: ''
    })
    const [expandedTransactionId, setExpandedTransactionId] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(10)

    useEffect(() => {
        fetchTransactions()
    }, [])

    useEffect(() => {
        applyFilters()
    }, [filters, transactions])

    const fetchTransactions = async () => {
        try {
            const data = await getTransactionsAdmin()
            setTransactions(data)
            setFilteredTransactions(data)
        } catch (error) {
            console.error('Erro ao buscar transações:', error)
        }
    }

    const applyFilters = () => {
        const { startDate, endDate, gym, status, paymentMethod } = filters
        const filtered = transactions.filter((transaction) => {
            const transactionDate = new Date(transaction.createdAt)
            return (
                (!startDate || transactionDate >= startDate) &&
                (!endDate || transactionDate <= endDate) &&
                (!gym || transaction.gym.name === gym) &&
                (!status || transaction.status === status) &&
                (!paymentMethod || transaction.paymentMethod === paymentMethod)
            )
        })
        setFilteredTransactions(filtered)
        setCurrentPage(1)
    }

    const changeIndex = (index) => {
        if (
            index < 1 ||
            index > Math.ceil(filteredTransactions.length / itemsPerPage)
        ) {
            return
        }
        setCurrentPage(index)
    }

    const paginatedTransactions = filteredTransactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    return (
        <div>
            <HeaderChrono />
            <div className="container mx-auto p-4 mt-20">
                <h1 className="text-2xl font-bold mb-4">Lista de Transações</h1>
                <TransactionFilters
                    filters={filters}
                    setFilters={setFilters}
                    transactions={transactions}
                />
                <TransactionTable
                    transactions={paginatedTransactions}
                    expandedTransactionId={expandedTransactionId}
                    setExpandedTransactionId={setExpandedTransactionId}
                    fetchTransactions={fetchTransactions}
                />
                <div className="flex justify-center mt-4">
                    <button>
                        <MdArrowBack
                            onClick={() => changeIndex(currentPage - 1)}
                        />
                    </button>
                    {Array.from(
                        {
                            length: Math.ceil(
                                filteredTransactions.length / itemsPerPage
                            )
                        },
                        (_, index) => (
                            <button
                                key={index}
                                className={`mx-1 px-3 py-1 border rounded ${
                                    currentPage === index + 1
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200'
                                }`}
                                onClick={() => setCurrentPage(index + 1)}
                            >
                                {index + 1}
                            </button>
                        )
                    )}
                    <button>
                        <MdArrowForward
                            onClick={() => changeIndex(currentPage + 1)}
                        />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TransactionList
