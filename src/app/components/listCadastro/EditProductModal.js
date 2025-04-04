"use client";
import React, { useState } from 'react';
import { updateProduct, updateProductStock } from '../../../axios/api';

function EditProductModal({ product, onClose, onProductUpdated }) {
    const [formData, setFormData] = useState({
        name: product.name,
        price: product.price,
        costPrice: product.costPrice,
        stock: product.stock,
    });
    const [newStock, setNewStock] = useState(product.stock); // Novo estado para o estoque separado

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleStockChange = (e) => {
        setNewStock(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedData = {
                ...formData,
                price: parseFloat(formData.price),
                costPrice: parseFloat(formData.costPrice),
            };
            await updateProduct(product.id, updatedData);
            onProductUpdated(); // Atualiza a lista de produtos
            onClose(); // Fecha o modal
        } catch (error) {
            console.error('Erro ao atualizar produto:', error);
        }
    };

    const handleStockUpdate = async () => {
        try {
            await updateProductStock(
                parseInt(product.id, 10), 
               
                parseInt(newStock, 10)
            );
            onProductUpdated(); // Atualiza a lista de produtos
            onClose(); // Fecha o modal
        } catch (error) {
            console.error('Erro ao atualizar estoque:', error);
        }
    };
    

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Editar Produto</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Nome</label>
                        <input 
                            type="text" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleChange} 
                            className="mt-1 p-2 border border-gray-300 rounded w-full" 
                            required 
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Preço</label>
                        <input 
                            type="number" 
                            name="price" 
                            value={formData.price} 
                            onChange={handleChange} 
                            className="mt-1 p-2 border border-gray-300 rounded w-full" 
                            required 
                            step="0.01"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Custo</label>
                        <input 
                            type="number" 
                            name="costPrice" 
                            value={formData.costPrice} 
                            onChange={handleChange} 
                            className="mt-1 p-2 border border-gray-300 rounded w-full" 
                            required 
                            step="0.01"
                        />
                    </div>
                    {/* Campo separado para atualizar estoque */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Estoque Atualizado</label>
                        <input 
                            type="number" 
                            name="newStock" 
                            value={newStock} 
                            onChange={handleStockChange} 
                            className="mt-1 p-2 border border-gray-300 rounded w-full" 
                            required 
                        />
                    </div>
                    <div className="flex justify-between gap-2">
                        <button 
                            type="button" 
                            onClick={handleStockUpdate} 
                            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
                            Atualizar Estoque
                        </button>
                        <button 
                            type="submit" 
                            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded">
                            Salvar Alterações do Produto
                        </button>
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded">
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditProductModal;
