import React, { useState, useEffect } from 'react';
import { createSale, getAllGysm, getProducts } from '../../../axios/api';

function AddSaleModal({ onClose, onSaleAdded }) {
    const [gyms, setGyms] = useState([]);
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        userId: '',
        gymId: '',
        productId: '',
        quantity: 1,
        total: 0,
        paymentType: '' // Adiciona o campo paymentType ao formData
    });

    useEffect(() => {
        const fetchGyms = async () => {
            try {
                const gymData = await getAllGysm();
                setGyms(gymData.gyms);
            } catch (error) {
                console.error('Erro ao buscar academias:', error);
            }
        };

        const fetchProducts = async () => {
            try {
                const productData = await getProducts();
                setProducts(productData.products);
            } catch (error) {
                console.error('Erro ao buscar produtos:', error);
            }
        };

        fetchGyms();
        fetchProducts();
    }, []);

    const handleGymChange = (e) => {
        const gymId = e.target.value;
        setFormData({ ...formData, gymId });

        const selectedGym = gyms.find(gym => gym.id === parseInt(gymId));
        if (selectedGym) {
            setUsers(selectedGym.users);
        }
    };

    const handleProductChange = (e) => {
        const productId = e.target.value;
        setFormData({ ...formData, productId });

        const selectedProduct = products.find(product => product.id === parseInt(productId));
        if (selectedProduct) {
            setFormData((prevData) => ({
                ...prevData,
                productId,
                total: selectedProduct.price * prevData.quantity
            }));
        }
    };

    const handleQuantityChange = (e) => {
        const quantity = parseInt(e.target.value);
        const selectedProduct = products.find(product => product.id === parseInt(formData.productId));
        setFormData((prevData) => ({
            ...prevData,
            quantity,
            total: selectedProduct ? selectedProduct.price * quantity : 0
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.paymentType) {
            alert('Por favor, selecione um tipo de pagamento.');
            return;
        }
    
        try {
            await createSale(formData);
            onSaleAdded();
            onClose();
        } catch (error) {
            console.error('Erro ao criar nova venda:', error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Criar Nova Venda</h2>
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
                    {/* Campo para selecionar vendedor */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Vendedor</label>
                        <select 
                            name="userId" 
                            value={formData.userId} 
                            onChange={(e) => setFormData({ ...formData, userId: e.target.value })} 
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
                                    {product.name} (R$ {product.price})
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
                    {/* Campo para total */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Total</label>
                        <input 
                            type="text" 
                            value={`R$ ${formData.total.toFixed(2)}`} 
                            className="mt-1 p-2 border border-gray-300 rounded w-full bg-gray-100" 
                            readOnly 
                        />
                    </div>
                   {/* Campo para selecionar tipo de pagamento */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Tipo de Pagamento</label>
                        <select 
                            name="paymentType" 
                            value={formData.paymentType} 
                            onChange={(e) => setFormData({ ...formData, paymentType: e.target.value })} 
                            className="mt-1 p-2 border border-gray-300 rounded w-full" 
                            required
                        >
                            <option value="">Selecione o tipo de pagamento</option>
                            <option value="CASH">Dinheiro</option>
                            <option value="CREDIT_CARD">Cartão de Crédito</option>
                            <option value="DEBIT_CARD">Cartão de Débito</option>
                            <option value="PIX">PIX</option>
                        </select>
                    </div>
                    {/* Botões para cancelar e criar venda */}
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
                            Criar Venda
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddSaleModal;
