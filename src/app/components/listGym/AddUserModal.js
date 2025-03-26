import React, { useState } from 'react'
import { createUser } from '../../../axios/api'

function AddUserModal({ onClose, onUserAdded, gyms }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        gymId: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            // Converte gymId para Int antes de enviar
            const userData = {
                ...formData,
                gymId: parseInt(formData.gymId)
            }
            await createUser(userData)
            onUserAdded() // Atualiza a lista de academias
            onClose() // Fecha o modal
        } catch (error) {
            console.error('Erro ao criar novo usuário:', error)
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">
                    Cadastrar Novo Usuário
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Nome
                        </label>
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
                        <label className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Senha
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Academia
                        </label>
                        <select
                            name="gymId"
                            value={formData.gymId}
                            onChange={handleChange}
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                            required
                        >
                            <option value="">Selecione uma academia</option>
                            {gyms.map((gym) => (
                                <option key={gym.id} value={gym.id}>
                                    {gym.name}
                                </option>
                            ))}
                        </select>
                    </div>
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
                            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                        >
                            Cadastrar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddUserModal
