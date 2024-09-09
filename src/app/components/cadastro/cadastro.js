"use client";
import { useState, useEffect } from 'react';
import { getProducts, updateProduct, updateProductStock, addProduct, transferProductStock } from '../../../axios/api'; 
import { useRouter } from 'next/navigation';

const CadastroProdutos = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null); 
  const [newProduct, setNewProduct] = useState({ name: '', price: '', imageUrl: '' }); 
  const [newStock, setNewStock] = useState(''); 
  const [transferData, setTransferData] = useState({ productId: '', fromGymId: '', toGymId: '', quantity: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter(); 

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

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Atualiza o produto
      await updateProduct(editingProduct.id, editingProduct);
      // Atualiza o estoque somente ao salvar
      if (newStock) {
        await updateProductStock(editingProduct.id, 1, newStock); 
      }
      setEditingProduct(null);
      await loadProducts(); 
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      setError('Erro ao atualizar o produto');
    } finally {
      setLoading(false);
    }
  };

  // Função para lidar com o envio de novo produto
  const handleNewProductSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 
    try {
      if (!newProduct.name || !newProduct.price || !newProduct.imageUrl) {
        setError('Todos os campos são obrigatórios.');
        setLoading(false);
        return;
      }
      const priceAsFloat = parseFloat(newProduct.price);
      if (isNaN(priceAsFloat) || priceAsFloat <= 0) {
        setError('O preço deve ser um número válido e maior que zero.');
        setLoading(false);
        return;
      }
      const createdProduct = await addProduct({
        name: newProduct.name,
        price: priceAsFloat,
        imageUrl: newProduct.imageUrl
      });
      setNewProduct({ name: '', price: '', imageUrl: '' });
      setError('');
      setLoading(false);
      await loadProducts();
    } catch (error) {
      console.error('Erro ao adicionar novo produto:', error);
      setError('Erro ao adicionar o produto. Tente novamente.');
      setLoading(false);
    }
  };

  // Função para lidar com a transferência de estoque
  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    const { productId, fromGymId, toGymId, quantity } = transferData;
    
    // Validações básicas
    if (!productId || !fromGymId || !toGymId || !quantity) {
      setError('Todos os campos são obrigatórios.');
      setLoading(false);
      return;
    }

    if (fromGymId === toGymId) {
      setError('As academias de origem e destino devem ser diferentes.');
      setLoading(false);
      return;
    }

    try {
      // Chama a função de API para transferir o estoque
      const response = await transferProductStock(
        parseInt(productId),
        parseInt(fromGymId),
        parseInt(toGymId),
        parseInt(quantity)
      );
      setSuccess('Transferência realizada com sucesso!');
      setTransferData({ productId: '', fromGymId: '', toGymId: '', quantity: '' }); // Limpa os campos do formulário
    } catch (error) {
      setError('Erro ao transferir o estoque. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Cadastro de Produtos</h1>

      {error && (
        <div className="mb-4 p-2 bg-red-200 text-red-800 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-2 bg-green-200 text-green-800 rounded">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl mb-2">Novo Produto</h2>
          <form onSubmit={handleNewProductSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700">Nome do Produto</label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Preço</label>
              <input
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">URL da Imagem</label>
              <input
                type="text"
                value={newProduct.imageUrl}
                onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className={`w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${loading && 'opacity-50 cursor-not-allowed'}`}
              disabled={loading}
            >
              {loading ? 'Adicionando...' : 'Adicionar Produto'}
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-xl mb-2">Produtos Cadastrados</h2>
          <ul>
            {products.map((product) => (
              <li key={product.id} className="p-4 bg-gray-100 rounded mb-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-5">
                    <img src={product.imageUrl} alt={product.name} className="w-24 h-24 object-cover mb-2 rounded-full" />
                    <div>
                      <p className="font-bold">{product.name}</p>
                      <p>Preço: R$ {product.price}</p>
                      <p>Estoque Atual: {product.stock}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setEditingProduct(product);
                      setNewStock(product.stock); 
                    }}
                    className="text-blue-500 underline"
                  >
                    Editar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Editar Produto</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700">Nome do Produto</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Preço</label>
                <input
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">URL da Imagem</label>
                <input
                  type="text"
                  value={editingProduct.imageUrl}
                  onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Estoque</label>
                <input
                  type="number"
                  value={newStock} 
                  onChange={(e) => setNewStock(e.target.value)} 
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`p-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${loading && 'opacity-50 cursor-not-allowed'}`}
                  disabled={loading}
                >
                  {loading ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Formulário de Transferência de Estoque */}
      <div className="mt-8">
        <h2 className="text-xl mb-2">Transferência de Estoque</h2>
        <form onSubmit={handleTransferSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Produto</label>
            <select
              value={transferData.productId}
              onChange={(e) => setTransferData({ ...transferData, productId: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Selecione um produto</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700">Academia de Origem (ID)</label>
            <input
              type="number"
              value={transferData.fromGymId}
              onChange={(e) => setTransferData({ ...transferData, fromGymId: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Academia de Destino (ID)</label>
            <input
              type="number"
              value={transferData.toGymId}
              onChange={(e) => setTransferData({ ...transferData, toGymId: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Quantidade a Transferir</label>
            <input
              type="number"
              value={transferData.quantity}
              onChange={(e) => setTransferData({ ...transferData, quantity: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${loading && 'opacity-50 cursor-not-allowed'}`}
            disabled={loading}
          >
            {loading ? 'Transferindo...' : 'Transferir Estoque'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CadastroProdutos;
