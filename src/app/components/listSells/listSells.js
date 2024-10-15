"use client";
import React, { useState, useEffect } from 'react';
import { getAllSales } from '../../../axios/api';
import HeaderChrono from '../header/header';
import AddSaleModal from './AddSaleModal';

function ListSells() {
    const [sales, setSales] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filteredSales, setFilteredSales] = useState([]);
    const [filterCriteria, setFilterCriteria] = useState({ date: '', gym: '', product: '' });

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

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    };

    const filterSales = () => {
        const { date, gym, product } = filterCriteria;
        const filtered = sales.filter(sale => {
            const saleDate = formatDate(sale.date);
            return (!date || saleDate === date) &&
                   (!gym || sale.gym.name === gym) &&
                   (!product || sale.product.name === product);
        });
        setFilteredSales(filtered);
    };

    const getUniqueValues = (key) => {
        const values = sales.map(sale => key === 'date' ? formatDate(sale[key]) : sale[key].name);
        return [...new Set(values)];
    };

    const handleFilterChange = (key, value) => {
        setFilterCriteria(prev => ({ ...prev, [key]: value }));
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
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b text-left font-semibold text-gray-700">
                                    Data 
                                    <select 
                                        onChange={(e) => handleFilterChange('date', e.target.value)}
                                        className="ml-2 p-1 border border-gray-300 rounded">
                                        <option value="">Todas</option>
                                        {getUniqueValues('date').map((date, index) => (
                                            <option key={index} value={date}>{date}</option>
                                        ))}
                                    </select>
                                </th>
                                <th className="py-2 px-4 border-b text-left font-semibold text-gray-700">
                                    Produto 
                                    <select 
                                        onChange={(e) => handleFilterChange('product', e.target.value)}
                                        className="ml-2 p-1 border border-gray-300 rounded">
                                        <option value="">Todos</option>
                                        {getUniqueValues('product').map((product, index) => (
                                            <option key={index} value={product}>{product}</option>
                                        ))}
                                    </select>
                                </th>
                                <th className="py-2 px-4 border-b text-left font-semibold text-gray-700">
                                    Academia 
                                    <select 
                                        onChange={(e) => handleFilterChange('gym', e.target.value)}
                                        className="ml-2 p-1 border border-gray-300 rounded">
                                        <option value="">Todas</option>
                                        {getUniqueValues('gym').map((gym, index) => (
                                            <option key={index} value={gym}>{gym}</option>
                                        ))}
                                    </select>
                                </th>
                                <th className="py-2 px-4 border-b text-left font-semibold text-gray-700">Vendedor</th>
                                <th className="py-2 px-4 border-b text-left font-semibold text-gray-700">Quantidade</th>
                                <th className="py-2 px-4 border-b text-left font-semibold text-gray-700">Total</th>
                                <th className="py-2 px-4 border-b text-left font-semibold text-gray-700">Tipo de Pagamento</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSales.map((sale) => (
                                <tr key={sale.id} className="hover:bg-gray-100 transition-colors">
                                    <td className="py-2 px-4 border-b">{formatDate(sale.date)}</td>
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
        </div>
    );
}

export default ListSells;
