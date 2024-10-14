"use client";
import React, { useState, useEffect } from 'react';
import { getAllStock } from '../../../axios/api';
import HeaderChrono from '../header/header';
import TransferStockModal from './TransferStockModal';

function ListStock() {
    const [stockData, setStockData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [gymFilter, setGymFilter] = useState('');
    const [productFilter, setProductFilter] = useState('');
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [selectedStock, setSelectedStock] = useState(null);

    const fetchData = async () => {
        try {
            const data = await getAllStock();
            setStockData(data.stock);
            setFilteredData(data.stock);
        } catch (error) {
            console.error('Erro ao buscar estoque:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const filtered = stockData.filter((item) => 
            (!gymFilter || item.gymName.toLowerCase().includes(gymFilter.toLowerCase())) &&
            (!productFilter || item.productName.toLowerCase().includes(productFilter.toLowerCase()))
        );
        setFilteredData(filtered);
    }, [gymFilter, productFilter, stockData]);

    const openTransferModal = (stockItem) => {
        setSelectedStock(stockItem);
        setIsTransferModalOpen(true);
    };

    const closeTransferModal = () => {
        setSelectedStock(null);
        setIsTransferModalOpen(false);
    };

    return (
        <div>
            <HeaderChrono />
            <div className="container mx-auto p-4 mt-20">
                <h1 className="text-2xl font-bold mb-4">Estoque por Academia</h1>
                
                <div className="flex gap-4 mb-4">
                    <input 
                        type="text" 
                        placeholder="Filtrar por Academia" 
                        value={gymFilter}
                        onChange={(e) => setGymFilter(e.target.value)}
                        className="p-2 border border-gray-300 rounded w-full"
                    />
                    <input 
                        type="text" 
                        placeholder="Filtrar por Produto" 
                        value={productFilter}
                        onChange={(e) => setProductFilter(e.target.value)}
                        className="p-2 border border-gray-300 rounded w-full"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b text-left font-semibold text-gray-700">Academia</th>
                                <th className="py-2 px-4 border-b text-left font-semibold text-gray-700">Produto</th>
                                <th className="py-2 px-4 border-b text-left font-semibold text-gray-700">Quantidade</th>
                                <th className="py-2 px-4 border-b text-left font-semibold text-gray-700">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-100 transition-colors">
                                    <td className="py-2 px-4 border-b">{item.gymName}</td>
                                    <td className="py-2 px-4 border-b">{item.productName}</td>
                                    <td className="py-2 px-4 border-b">{item.quantity}</td>
                                    <td className="py-2 px-4 border-b">
                                        <button 
                                            onClick={() => openTransferModal(item)} 
                                            className="bg-slate-900 hover:bg-slate-700 text-white py-1 px-3 ">
                                            Transferir
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {isTransferModalOpen && 
                <TransferStockModal 
                    stockItem={selectedStock} 
                    onClose={closeTransferModal} 
                    onTransferComplete={fetchData} 
                />
            }
        </div>
    );
}

export default ListStock;
