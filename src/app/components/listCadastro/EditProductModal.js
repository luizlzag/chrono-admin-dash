"use client";
import React, { useState } from 'react';
import { updateProduct } from '../../../axios/api';

function EditProductModal({ product, onClose, onProductUpdated }) {
    const [formData, setFormData] = useState({
        name: product.name,
        price: product.price,
        costPrice: product.costPrice,
        stock: product.stock
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Converte price e costPrice para Float
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
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Estoque</label>
                        <input 
                            type="number" 
                            name="stock" 
                            value={formData.stock} 
                            onChange={handleChange} 
                            className="mt-1 p-2 border border-gray-300 rounded w-full" 
                            required 
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded">
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded">
                            Salvar Alterações
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditProductModal;
