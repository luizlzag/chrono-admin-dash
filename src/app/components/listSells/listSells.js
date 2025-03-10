"use client";
import React, { useState, useEffect, useCallback } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getGroupedAdminTransactions } from '../../../axios/api';
import HeaderChrono from '../header/header';
import AddSaleModal from './AddSaleModal';
import Image from 'next/image';

function ListSells() {
    const [data, setData] = useState({ totalValue: 0, products: [], gyms: [], totalQuantity: 0, totalComission: 0 });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filteredSales, setFilteredSales] = useState([]);
    const [filterCriteria, setFilterCriteria] = useState({ startDate: null, endDate: null, gym: '', product: '' });

    const fetchSales = useCallback(async () => {
        try {
            const data = await getGroupedAdminTransactions(filterCriteria);
            if (!data) {
                setFilteredSales([]);
                setData({ totalValue: 0, products: [], gyms: [], totalQuantity: 0, totalComission: 0 });
                return;
            }
            setFilteredSales(data.data);
            setData(data);
        } catch (error) {
            console.error('Erro ao buscar vendas:', error);
        }
    }, [filterCriteria]);

    useEffect(() => {
        fetchSales();
    }, [fetchSales]);

    useEffect(() => {
        fetchSales(filterCriteria);
    }, [filterCriteria, fetchSales]);

    const handleModalToggle = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleFilterChange = (key, value) => {
        setFilterCriteria(prev => ({ ...prev, [key]: value }));
    };

    const setPeriodFilter = (period) => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        switch (period) {
            case 'currentMonth':
                setFilterCriteria(prev => ({ ...prev, startDate: startOfMonth, endDate: endOfMonth }));
                break;
            case 'lastMonth':
                setFilterCriteria(prev => ({ ...prev, startDate: startOfLastMonth, endDate: endOfLastMonth }));
                break;
            case 'all':
                setFilterCriteria(prev => ({ ...prev, startDate: null, endDate: null }));
                break;
            default:
                break;
        }
    };

    return (
        <div>
            <HeaderChrono />
            <div className="container mx-auto p-4 mt-20">
                <h1 className="text-2xl font-bold mb-4">Lista de Vendas</h1>
                {/* Filtros */}
                <div className="flex gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Data Inicial</label>
                        <DatePicker
                            selected={filterCriteria.startDate}
                            onChange={(date) => handleFilterChange('startDate', date)}
                            selectsStart
                            startDate={filterCriteria.startDate}
                            endDate={filterCriteria.endDate}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Data inicial"
                            className="p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Data Final</label>
                        <DatePicker
                            selected={filterCriteria.endDate}
                            onChange={(date) => handleFilterChange('endDate', date)}
                            selectsEnd
                            startDate={filterCriteria.startDate}
                            endDate={filterCriteria.endDate}
                            minDate={filterCriteria.startDate}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Data final"
                            className="p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Período</label>
                        <select
                            onChange={(e) => setPeriodFilter(e.target.value)}
                            className="p-2 border border-gray-300 rounded"
                        >
                            <option value="all">Todos</option>
                            <option value="currentMonth">Mês Atual</option>
                            <option value="lastMonth">Mês Passado</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Produto</label>
                        <select 
                            onChange={(e) => handleFilterChange('product', e.target.value)}
                            className="p-2 border border-gray-300 rounded"
                        >
                            <option value="">Todos</option>
                            {[...new Set(data.products?.map(item => item))].map((product) => (
                                <option key={product.id} value={product.id}>{product.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Academia</label>
                        <select 
                            onChange={(e) => handleFilterChange('gym', e.target.value)}
                            className="p-2 border border-gray-300 rounded"
                        >
                            <option value="">Todas</option>
                            {[...new Set(data.gyms?.map(item => item))].map((gym) => (
                                <option key={gym.id} value={gym.id}>{gym.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                {/* Tabela de Vendas */}
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b text-left font-semibold text-gray-700">Produto</th>
                                <th className="py-2 px-4 border-b text-left font-semibold text-gray-700">Quantidade</th>
                                <th className="py-2 px-4 border-b text-left font-semibold text-gray-700">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSales?.map((sale) => (
                                <tr key={sale.item_id} className="hover:bg-gray-100 transition-colors">
                                    <td className="py-2 px-4 border-b">
                                        <div className="flex items-center gap-2">
                                            <Image 
                                                src={sale.imageUrl} 
                                                alt={sale.name} 
                                                width={48}
                                                height={48}
                                                className="object-cover rounded"
                                            />
                                            <div>
                                                <p className="font-semibold">{sale.name}</p>
                                                <p className="text-sm text-gray-500">Total do produto: R$ {sale.total.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-2 px-4 border-b">{sale.quantity}</td>
                                    <td className="py-2 px-4 border-b font-semibold">R$ {sale.total.toFixed(2)}</td>
                                    <td className="py-2 px-4 border-b">
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Subtotal */}
                <div className="mt-4">
                    <p className="text-lg font-bold">Subtotal</p>
                    <p>Quantidade total: {data?.totalQuantity ?? 0}</p>
                    <p>Valor bruto: R$ {data?.totalValue ? data.totalValue.toFixed(2) : Number().toFixed(2)}</p>
                    <p>Comissão paga: R$ {data?.totalComission ? data.totalComission.toFixed(2) : Number().toFixed(2)}</p>
                    <p>Valor líquido R$ {data?.subTotal ? data.subTotal.toFixed(2) : data.totalValue.toFixed(2)}</p>
                </div>
            </div>
            {isModalOpen && <AddSaleModal onClose={handleModalToggle} onSaleAdded={fetchSales} />}
        </div>
    );
}

export default ListSells;
