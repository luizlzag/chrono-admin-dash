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
      costPrice: parseFloat(newProduct.costPrice), // Garante que o custo seja um float
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
    return response.data;
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

export const updateProductStock = async (productId, newStock) => {
  try {
    // Recupera o objeto user do localStorage e faz o parse para JSON
    const user = JSON.parse(localStorage.getItem('user'));

    // Verifica se user e gymId estão disponíveis
    if (!user || !user.gymId) {
      throw new Error('gymId não encontrado no localStorage.');
    }

    // Converte newStock para inteiro e faz a requisição
    const response = await api.put('/stock/update', {
      productId,
      gymId: parseInt(user.gymId, 10), // Usa o gymId do objeto user
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


// Funçao que retorna todos os estoques de todas as academias
export const getAllStock = async () => {
  try {
    const response = await api.get('/stock/all');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar estoque:', error);
    throw error;
  }
};

export const getAllGysm = async () => {
  try {
    const response = await api.get('/gyms');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar estoque:', error);
    throw error;
  }
};

export const createGym = async (newGym) => {
  try {
    const response = await api.post('/gyms/create', {
      name: newGym.name,
      street: newGym.street,
      number: newGym.number,
      complement: newGym.complement,
      neighborhood: newGym.neighborhood,
      city: newGym.city,
      state: newGym.state,
      zipCode: newGym.zipCode,
      country: newGym.country
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao criar nova academia:', error);
    throw error;
  }
}


export const createUser = async (newUser) => {
  try {
    const response = await api.post('/auth/register', {
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      gymId: newUser.gymId
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao criar novo usuário:', error);
    throw error;
  }
};

export const getAllSales = async () => {
  try {
    const response = await api.get('/sales');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar vendas:', error);
    throw error;
  }
};

export const createSale = async (newSale) => {
  try {
    const response = await api.post('/sales/create', {
      userId: newSale.userId,
      gymId: newSale.gymId,
      productId: newSale.productId,
      quantity: newSale.quantity,
      total: newSale.total,
      paymentType: newSale.paymentType // Inclui o tipo de pagamento na requisição
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao criar nova venda:', error);
    throw error;
  }
};

export const getAllComissions = async () => {
  try {
    const response = await api.get('/commissions/1');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar comissões:', error);
    throw error;
  }
}


// Função para atualizar uma venda existente
export const updateSales = async (saleId, updatedData) => {
  try {
    const response = await api.put(`/sales/${saleId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Erro ao editar venda:', error);
    throw error; // Lança o erro para ser tratado no componente
  }
};
