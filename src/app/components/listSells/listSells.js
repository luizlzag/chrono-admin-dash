"use client";
import React, { useState, useEffect } from 'react';
import { getAllSales } from '../../../axios/api';
import HeaderChrono from '../header/header';
import AddSaleModal from './AddSaleModal';

function ListSells() {
    const [sales, setSales] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchSales = async () => {
        try {
            const data = await getAllSales();
            setSales(data.sales);
        } catch (error) {
            console.error('Erro ao buscar vendas:', error);
        }
    };

    useEffect(() => {
        fetchSales();
    }, []);

    const handleModalToggle = () => {
        setIsModalOpen(!isModalOpen);
    };

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
                                <th className="py-2 px-4 border-b text-left font-semibold text-gray-700">Produto</th>
                                <th className="py-2 px-4 border-b text-left font-semibold text-gray-700">Academia</th>
                                <th className="py-2 px-4 border-b text-left font-semibold text-gray-700">Vendedor</th>
                                <th className="py-2 px-4 border-b text-left font-semibold text-gray-700">Quantidade</th>
                                <th className="py-2 px-4 border-b text-left font-semibold text-gray-700">Total</th>
                                <th className="py-2 px-4 border-b text-left font-semibold text-gray-700">Tipo de Pagamento</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sales.map((sale) => (
                                <tr key={sale.id} className="hover:bg-gray-100 transition-colors">
                                    <td className="py-2 px-4 border-b">
                                        <div className="flex items-center gap-2">
                                            <img 
                                                src={sale.product.imageUrl} 
                                                alt={sale.product.name} 
                                                className="w-12 h-12 object-cover rounded"
                                            />
                                            <div>
                                                <p className="font-semibold">{sale.product.name}</p>
                                                <p className="text-sm text-gray-500">Preço: R$ {sale.product.price}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        <p>{sale.gym.name}</p>
                                        <p className="text-sm text-gray-500">{sale.gym.city}, {sale.gym.state}</p>
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        <p>{sale.user.name}</p>
                                        <p className="text-sm text-gray-500">{sale.user.role}</p>
                                    </td>
                                    <td className="py-2 px-4 border-b">{sale.quantity}</td>
                                    <td className="py-2 px-4 border-b font-semibold">R$ {sale.total.toFixed(2)}</td>
                                    <td className="py-2 px-4 border-b">{sale.paymentType}</td> {/* Exibe o tipo de pagamento */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {isModalOpen && <AddSaleModal onClose={handleModalToggle} onSaleAdded={fetchSales} />}
        </div>
    );
}

export default ListSells;
