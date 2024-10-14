"use client";
import React, { useState, useEffect } from 'react';
import { getProducts } from '../../../axios/api'; 
import AddProductModal from './AddProductModal'; // Importa o modal
import EditProductModal from './EditProductModal';
import HeaderChrono from '../header/header';

function ListCadastro() {
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const loadProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data.products); 
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
        }
    };
    
    useEffect(() => {
        loadProducts();
    }, []);
    const handleModalToggle = () => {
        setIsModalOpen(!isModalOpen);
    };

    const openEditModal = (product) => {
        setSelectedProduct(product);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setSelectedProduct(null);
        setIsEditModalOpen(false);
    };

    return (
        <div className="container mx-auto p-4 pt-20">
            <HeaderChrono/> 
            <button 
                onClick={handleModalToggle} 
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg mb-4 transition-colors duration-200">
                Adicionar Novo Produto
            </button>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b text-left font-semibold text-gray-700">Imagem</th>
                            <th className="py-2 px-4 border-b text-left font-semibold text-gray-700">Nome</th>
                            <th className="py-2 px-4 border-b text-left font-semibold text-gray-700">Preço</th>
                            <th className="py-2 px-4 border-b text-left font-semibold text-gray-700">Custo</th>
                            <th className="py-2 px-4 border-b text-left font-semibold text-gray-700">Estoque</th>
                            <th className="py-2 px-4 border-b text-left font-semibold text-gray-700">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-100 transition-colors">
                                <td className="py-2 px-4 border-b">
                                    <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded" />
                                </td>
                                <td className="py-2 px-4 border-b">{product.name}</td>
                                <td className="py-2 px-4 border-b">R$ {product.price}</td>
                                <td className="py-2 px-4 border-b">R$ {product.costPrice}</td>
                                <td className="py-2 px-4 border-b">{product.stock}</td>
                                <td className="py-2 px-4 border-b">
                                    <div className="flex gap-2">
                                    <button 
                                        onClick={() => openEditModal(product)}
                                        className="bg-gray-800 hover:bg-gray-600 text-white py-1 px-2 rounded transition-colors duration-200">
                                        Editar
                                    </button>
                                    
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && <AddProductModal onClose={handleModalToggle} onProductAdded={loadProducts} />}
            {isEditModalOpen && 
                <EditProductModal 
                    product={selectedProduct} 
                    onClose={closeEditModal} 
                    onProductUpdated={loadProducts} 
                />
            }
        </div>
    );
}

export default ListCadastro;
