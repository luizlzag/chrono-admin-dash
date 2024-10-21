"use client";
import React, { useState, useEffect } from 'react';
import { updateSales, getAllGysm, getProducts } from '../../../axios/api'; // Ajuste as importações

function EditSaleModal({ sale, onClose, onSaleUpdated }) {
    const [gyms, setGyms] = useState([]);
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        userId: sale.userId,
        gymId: sale.gymId,
        productId: sale.productId,
        quantity: sale.quantity,
        total: sale.total,
        paymentType: sale.paymentType,
    });

    useEffect(() => {
        // Carrega academias e produtos
        const fetchGymsAndProducts = async () => {
            try {
                const gymData = await getAllGysm();
                setGyms(gymData.gyms);

                const productData = await getProducts();
                setProducts(productData.products);

                // Define usuários da academia selecionada
                const selectedGym = gymData.gyms.find(gym => gym.id === sale.gymId);
                if (selectedGym) setUsers(selectedGym.users);
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            }
        };
        fetchGymsAndProducts();
    }, [sale.gymId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleGymChange = (e) => {
        const gymId = parseInt(e.target.value, 10);
        setFormData({ ...formData, gymId });

        const selectedGym = gyms.find(gym => gym.id === gymId);
        if (selectedGym) setUsers(selectedGym.users);
    };

    const handleProductChange = (e) => {
        const productId = parseInt(e.target.value, 10);
        const selectedProduct = products.find(product => product.id === productId);

        setFormData(prevData => ({
            ...prevData,
            productId,
            total: selectedProduct ? selectedProduct.price * prevData.quantity : prevData.total,
        }));
    };

    const handleQuantityChange = (e) => {
        const quantity = parseInt(e.target.value, 10);
        const selectedProduct = products.find(product => product.id === formData.productId);

        setFormData(prevData => ({
            ...prevData,
            quantity,
            total: selectedProduct ? selectedProduct.price * quantity : prevData.total,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedData = {
                userId: parseInt(formData.userId, 10),
                gymId: parseInt(formData.gymId, 10),
                productId: parseInt(formData.productId, 10),
                quantity: parseInt(formData.quantity, 10),
                total: parseFloat(formData.total),
                paymentType: formData.paymentType,
            };
            await updateSales(sale.id, updatedData);
            onSaleUpdated(); // Atualiza a lista de vendas
            onClose(); // Fecha o modal
        } catch (error) {
            console.error('Erro ao atualizar venda:', error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-20">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Editar Venda</h2>
                <form onSubmit={handleSubmit}>
                    {/* Campo para selecionar academia */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Academia</label>
                        <select 
                            name="gymId" 
                            value={formData.gymId} 
                            onChange={handleGymChange} 
                            className="mt-1 p-2 border border-gray-300 rounded w-full" 
                            required
                        >
                            <option value="">Selecione uma academia</option>
                            {gyms.map(gym => (
                                <option key={gym.id} value={gym.id}>
                                    {gym.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Campo para selecionar usuário (vendedor) */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Vendedor</label>
                        <select 
                            name="userId" 
                            value={formData.userId} 
                            onChange={handleChange} 
                            className="mt-1 p-2 border border-gray-300 rounded w-full" 
                            required
                        >
                            <option value="">Selecione um vendedor</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.name} ({user.role})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Campo para selecionar produto */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Produto</label>
                        <select 
                            name="productId" 
                            value={formData.productId} 
                            onChange={handleProductChange} 
                            className="mt-1 p-2 border border-gray-300 rounded w-full" 
                            required
                        >
                            <option value="">Selecione um produto</option>
                            {products.map(product => (
                                <option key={product.id} value={product.id}>
                                    {product.name} - R$ {product.price.toFixed(2)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Campo para quantidade */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Quantidade</label>
                        <input 
                            type="number" 
                            name="quantity" 
                            value={formData.quantity} 
                            onChange={handleQuantityChange} 
                            className="mt-1 p-2 border border-gray-300 rounded w-full" 
                            required 
                            min="1"
                        />
                    </div>

                    {/* Campo para tipo de pagamento */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Tipo de Pagamento</label>
                        <select 
                            name="paymentType" 
                            value={formData.paymentType} 
                            onChange={handleChange} 
                            className="mt-1 p-2 border border-gray-300 rounded w-full" 
                            required
                        >
                            <option value="CASH">Dinheiro</option>
                            <option value="CREDIT_CARD">Cartão de Crédito</option>
                            <option value="DEBIT_CARD">Cartão de Débito</option>
                            <option value="PIX">PIX</option>
                        </select>
                    </div>

                    {/* Campo para o total (somente leitura) */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Total</label>
                        <input 
                            type="text" 
                            value={`R$ ${formData.total.toFixed(2)}`} 
                            className="mt-1 p-2 border border-gray-300 rounded w-full bg-gray-100" 
                            readOnly 
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

export default EditSaleModal;
