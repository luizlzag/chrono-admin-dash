import React, { useState, useEffect } from 'react';
import { createSale, getAllGysm, getProducts, getProductStockInGym } from '../../../axios/api';

function AddSaleModal({ onClose, onSaleAdded }) {
    const [gyms, setGyms] = useState([]);
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [stockAvailable, setStockAvailable] = useState(null); // Estado para o estoque disponível
    const [isSubmitting, setIsSubmitting] = useState(false); // Estado para controlar o envio
    const [formData, setFormData] = useState({
        userId: '',
        gymId: '',
        productId: '',
        quantity: 1,
        total: 0,
        paymentType: ''
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

    useEffect(() => {
        const fetchStock = async () => {
            if (formData.productId && formData.gymId) {
                try {
                    const stockData = await getProductStockInGym(formData.productId, formData.gymId);
                    setStockAvailable(stockData.stock);
                } catch (error) {
                    console.error('Erro ao buscar estoque:', error);
                    if (error.response && error.response.status === 404) {
                        // Se for erro 404, significa que não há estoque para este produto na academia
                        setStockAvailable(0);
                    } else {
                        // Outros erros (por exemplo, erro de rede)
                        setStockAvailable(null);
                    }
                }
            } else {
                setStockAvailable(null);
            }
        };

        fetchStock();
    }, [formData.productId, formData.gymId]);

    const handleGymChange = (e) => {
        const gymId = e.target.value;
        setFormData({ ...formData, gymId, userId: '', productId: '', quantity: 1, total: 0 });
        setUsers([]);
        setStockAvailable(null);

        const selectedGym = gyms.find(gym => gym.id === parseInt(gymId));
        if (selectedGym) {
            setUsers(selectedGym.users);
        }
    };

    const handleProductChange = (e) => {
        const productId = e.target.value;
        setFormData({ ...formData, productId, quantity: 1, total: 0 });
        setStockAvailable(null);

        const selectedProduct = products.find(product => product.id === parseInt(productId));
        if (selectedProduct) {
            setFormData((prevData) => ({
                ...prevData,
                total: selectedProduct.price * prevData.quantity
            }));
        }
    };

    const handleQuantityChange = (e) => {
        let quantity = parseInt(e.target.value);

        if (stockAvailable !== null && quantity > stockAvailable) {
            alert(`A quantidade solicitada excede o estoque disponível (${stockAvailable}).`);
            quantity = stockAvailable;
        }

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

        if (stockAvailable !== null && formData.quantity > stockAvailable) {
            alert(`A quantidade solicitada excede o estoque disponível (${stockAvailable}).`);
            return;
        }

        setIsSubmitting(true);

        try {
            await createSale(formData);
            onSaleAdded();
            onClose();
        } catch (error) {
            console.error('Erro ao criar nova venda:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-20">
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
                    {/* Exibir estoque disponível */}
                    {stockAvailable !== null && (
                        <div className="mb-4">
                            <span className="text-sm text-gray-600">Estoque disponível: {stockAvailable}</span>
                        </div>
                    )}
                    {/* Mensagem de produto esgotado */}
                    {stockAvailable === 0 && (
                        <div className="mb-4 text-red-500">
                            Este produto não possui estoque nesta academia.
                        </div>
                    )}
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
                            max={stockAvailable !== null ? stockAvailable : undefined}
                            disabled={stockAvailable === 0 || stockAvailable === null}
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
                            disabled={stockAvailable === 0 || stockAvailable === null}
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
                            className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className={`bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded ${
                                isSubmitting || stockAvailable === 0 || stockAvailable === null ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            disabled={isSubmitting || stockAvailable === 0 || stockAvailable === null}
                        >
                            {isSubmitting ? 'Processando...' : 'Criar Venda'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddSaleModal;
