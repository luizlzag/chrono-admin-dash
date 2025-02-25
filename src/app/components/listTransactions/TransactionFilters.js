import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import paymentMethodDictionary from "./paymentMethodsDictionary";
import "react-datepicker/dist/react-datepicker.css";

function TransactionFilters({ filters, setFilters, transactions }) {
    const [gyms, setGyms] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);

    useEffect(() => {
        if (transactions.length > 0) {
            const uniqueGyms = [...new Set(transactions.map((t) => t.gym.name))];
            const uniquePaymentMethods = [...new Set(transactions.map((t) => t.paymentMethod))];

            setGyms(uniqueGyms);
            setPaymentMethods(uniquePaymentMethods);
        }
    }, [transactions]);

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Data Inicial</label>
                <DatePicker
                    selected={filters.startDate}
                    onChange={(date) => handleFilterChange("startDate", date)}
                    className="p-2 border border-gray-300 rounded w-full"
                    placeholderText="Data inicial"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Data Final</label>
                <DatePicker
                    selected={filters.endDate}
                    onChange={(date) => handleFilterChange("endDate", date)}
                    className="p-2 border border-gray-300 rounded w-full"
                    placeholderText="Data final"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select onChange={(e) => handleFilterChange("status", e.target.value)} className="p-2 border border-gray-300 rounded w-full">
                    <option value="">Todos</option>
                    <option value="waiting_payment">Aguardando Pagamento</option>
                    <option value="paid">Pago</option>
                    <option value="canceled">Cancelado</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Academia</label>
                <select onChange={(e) => handleFilterChange("gym", e.target.value)} className="p-2 border border-gray-300 rounded w-full">
                    <option value="">Todas</option>
                    {gyms.map((gym, index) => (
                        <option key={index} value={gym}>{gym}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Meio de Pagamento</label>
                <select onChange={(e) => handleFilterChange("paymentMethod", e.target.value)} className="p-2 border border-gray-300 rounded w-full">
                    <option value="">Todos</option>
                    {paymentMethods.map((method, index) => (
                        <option key={index} value={method}>{paymentMethodDictionary[method]}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default TransactionFilters;
