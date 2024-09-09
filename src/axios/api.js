import axios from "axios";

// Criação da instância Axios com a URL base
const api = axios.create({
  baseURL: 'https://muay-thai-sales-api.vercel.app'
});

// Intercepta as requisições e adiciona o token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Pega o token do localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Adiciona o token no header Authorization
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Função de login que armazena o token no localStorage
export const login = async (email, password) => {
  try {
    const response = await axios.post('https://muay-thai-sales-api.vercel.app/auth/login', {
      email,
      password
    });
    
    const { token, user } = response.data;
    localStorage.setItem('user', JSON.stringify(user)); // Salva o usuário no localStorage
    localStorage.setItem('token', token); // Salva o token no localStorage
    return token;
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }
};

// Função para listar os produtos (requer autenticação)
export const getProducts = async () => {
  try {
    const response = await api.get('/products');
    return response.data; // Supondo que a API retorne um array de produtos no data
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    throw error;
  }
};


// Função para adicionar um novo produto com formatação correta para `price`
export const addProduct = async (newProduct) => {
  try {
    const response = await api.post('/products/create', {
      name: newProduct.name,
      price: parseFloat(newProduct.price), // Garante que o preço seja um float
      imageUrl: newProduct.imageUrl
    });
    
    return response.data; // Retorna a resposta da API
  } catch (error) {
    console.error('Erro ao adicionar novo produto:', error);
    throw error; // Propaga o erro
  }
};




// Função para atualizar um produto existente (requer autenticação)
export const updateProduct = async (id, updatedData) => {
  try {
    const response = await api.put(`/products/${id}`, updatedData);
    return response.data; // Supondo que a API retorne o produto atualizado no data
  } catch (error) {
    console.error(`Erro ao atualizar o produto com ID ${id}:`, error);
    throw error;
  }
};

// Função para obter o estoque de um produto em uma academia específica
export const getProductStockInGym = async (productId, gymId) => {
  try {
    const response = await api.get(`/stock/product/${productId}/gym/${gymId}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar estoque para produto ID ${productId} e academia ID ${gymId}:`, error);
    throw error;
  }
};

// Função para atualizar o estoque de um produto
// Função para atualizar o estoque de um produto
export const updateProductStock = async (productId, gymId, newStock) => {
  try {
    // Converte `newStock` para número inteiro
    const response = await api.put('/stock/update', {
      productId,
      gymId,
      newStock: parseInt(newStock, 10) // Garante que o estoque seja enviado como inteiro
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar estoque para produto ID ${productId}:`, error);
    throw error;
  }
};


// Função para transferir estoque de uma academia para outra
export const transferProductStock = async (productId, fromGymId, toGymId, quantity) => {
  try {
    const response = await api.post('/stock/transfer', {
      productId,
      fromGymId,
      toGymId,
      quantity
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao transferir estoque para o produto ${productId}:`, error);
    throw error;
  }
};
