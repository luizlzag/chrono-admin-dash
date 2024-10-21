"use client";
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getAllSales } from '../../../axios/api';
import HeaderChrono from '../header/header';
import AddSaleModal from './AddSaleModal';
import EditSaleModal from './EditSaleModal';
import { CiEdit } from "react-icons/ci";

function ListSells() {
    const [sales, setSales] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filteredSales, setFilteredSales] = useState([]);
    const [filterCriteria, setFilterCriteria] = useState({ startDate: null, endDate: null, gym: '', product: '' });
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedSale, setSelectedSale] = useState(null);

    const fetchSales = async () => {
        try {
            const data = await getAllSales();
            setSales(data.sales);
            setFilteredSales(data.sales);
        } catch (error) {
            console.error('Erro ao buscar vendas:', error);
        }
    };

    useEffect(() => {
        fetchSales();
    }, []);

    useEffect(() => {
        filterSales();
    }, [filterCriteria]);

    const handleModalToggle = () => {
        setIsModalOpen(!isModalOpen);
    };

    const filterSales = () => {
        const { startDate, endDate, gym, product } = filterCriteria;
        const filtered = sales.filter(sale => {
            const saleDate = new Date(sale.date);
            return ((!startDate || saleDate >= startDate) &&
                    (!endDate || saleDate <= new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59)) &&
                    (!gym || sale.gym.name === gym) &&
                    (!product || sale.product.name === product));
        });
        setFilteredSales(filtered);
    };

    const handleFilterChange = (key, value) => {
        setFilterCriteria(prev => ({ ...prev, [key]: value }));
    };

    const handleEditModalOpen = (sale) => {
        setSelectedSale(sale);
        setIsEditModalOpen(true);
    };

    const handleEditModalClose = () => {
        setIsEditModalOpen(false);
        setSelectedSale(null);
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

    const subtotalAmount = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
    const subtotalQuantity = filteredSales.reduce((sum, sale) => sum + sale.quantity, 0);

    return (
        <div>
            <HeaderChrono />
            <div className="container mx-auto p-4 mt-20">
                <h1 className="text-2xl font-bold mb-4">Lista de Vendas</h1>
                <button 
                    onClick={handleModalToggle} 
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg mb-4 transition-colors duration-200">
                    Criar Nova Venda
                </button>
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
                    <div className="flex gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Produto</label>
                        <select 
                            onChange={(e) => handleFilterChange('product', e.target.value)}
                            className="p-2 border border-gray-300 rounded"
                        >
                            <option value="">Todos</option>
                            {[...new Set(sales.map(sale => sale.product.name))].map((product, index) => (
                                <option key={index} value={product}>{product}</option>
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
                            {[...new Set(sales.map(sale => sale.gym.name))].map((gym, index) => (
                                <option key={index} value={gym}>{gym}</option>
                            ))}
                        </select>
                    </div>
                </div>
                </div>
               
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b text-left font-semibold text-gray-700">Data</th>
                                <th className="py-2 px-4 border-b text-left font-semibold text-gray-700">Produto</th>
                                <th className="py-2 px-4 border-b text-left font-semibold text-gray-700">Academia</th>
                                <th className="py-2 px-4 border-b text-left font-semibold text-gray-700">Vendedor</th>
                                <th className="py-2 px-4 border-b text-left font-semibold text-gray-700">Quantidade</th>
                                <th className="py-2 px-4 border-b text-left font-semibold text-gray-700">Total</th>
                                <th className="py-2 px-4 border-b text-left font-semibold text-gray-700">Tipo de Pagamento</th>
                                <th className="py-2 px-4 border-b text-left font-semibold text-gray-700">Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSales.map((sale) => (
                                <tr key={sale.id} className="hover:bg-gray-100 transition-colors">
                                    <td className="py-2 px-4 border-b">{new Date(sale.date).toLocaleDateString('pt-BR')}</td>
                                    <td className="py-2 px-4 border-b">
                                        <div className="flex items-center gap-2">
                                            <img 
                                                src={sale.product.imageUrl} 
                                                alt={sale.product.name} 
                                                className="w-12 h-12 object-cover rounded"
                                            />
                                            <div>
                                                <p className="font-semibold">{sale.product.name}</p>
                                                <p className="text-sm text-gray-500">Preço Unitário: R$ {sale.product.price.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-2 px-4 border-b">{sale.gym.name}</td>
                                    <td className="py-2 px-4 border-b">
                                        <p>{sale.user.name}</p>
                                        <p className="text-sm text-gray-500">{sale.user.role}</p>
                                    </td>
                                    <td className="py-2 px-4 border-b">{sale.quantity}</td>
                                    <td className="py-2 px-4 border-b font-semibold">R$ {sale.total.toFixed(2)}</td>
                                    <td className="py-2 px-4 border-b">{sale.paymentType}</td>
                                    <td className="py-2 px-4 border-b">
                                        <button 
                                            onClick={() => handleEditModalOpen(sale)} 
                                            className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-2 rounded">
                                            <CiEdit />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-4">
                    <p className="text-lg font-bold">Subtotal</p>
                    <p>Total Quantidade: {subtotalQuantity}</p>
                    <p>Total Valor: R$ {subtotalAmount.toFixed(2)}</p>
                </div>
            </div>
            {isModalOpen && <AddSaleModal onClose={handleModalToggle} onSaleAdded={fetchSales} />}
            {isEditModalOpen && <EditSaleModal sale={selectedSale} onClose={handleEditModalClose} onSaleUpdated={fetchSales} />}
        </div>
    );
}

export default ListSells;
