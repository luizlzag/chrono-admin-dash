import React, { useState } from 'react';
import { createGym } from '../../../axios/api';

function AddGymModal({ onClose, onGymAdded }) {
    const [formData, setFormData] = useState({
        name: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createGym(formData);
            onGymAdded(); // Atualiza a lista de academias
            onClose(); // Fecha o modal
        } catch (error) {
            console.error('Erro ao criar nova academia:', error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg w-full h-2/3 max-w-md overflow-x-auto">
                <h2 className="text-2xl font-bold mb-4">Cadastrar Nova Academia</h2>
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
                    {/* Campos adicionais para endereço */}
                    {['street', 'number', 'complement', 'neighborhood', 'city', 'state', 'zipCode', 'country'].map((field) => (
                        <div key={field} className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">{field}</label>
                            <input 
                                type="text" 
                                name={field} 
                                value={formData[field]} 
                                onChange={handleChange} 
                                className="mt-1 p-2 border border-gray-300 rounded w-full" 
                            />
                        </div>
                    ))}
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
                            Cadastrar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddGymModal;
