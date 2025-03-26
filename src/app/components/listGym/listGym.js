'use client'
import React, { useState, useEffect } from 'react'
import { getAllGysm, unblockGym } from '../../../axios/api'
import { MdLockOpen } from 'react-icons/md'
import HeaderChrono from '../header/header'
import AddGymModal from './AddGymModal'
import AddUserModal from './AddUserModal'

function ListGym() {
    const [gyms, setGyms] = useState([])
    const [isGymModalOpen, setIsGymModalOpen] = useState(false)
    const [isUserModalOpen, setIsUserModalOpen] = useState(false)

    const fetchGyms = async () => {
        const response = await getAllGysm()
        setGyms(response.gyms)
    }

    const unblockGymClick = async (gymId) => {
        await unblockGym(gymId)
    }

    useEffect(() => {
        fetchGyms()
    }, [])

    const toggleGymModal = () => {
        setIsGymModalOpen(!isGymModalOpen)
    }

    const toggleUserModal = () => {
        setIsUserModalOpen(!isUserModalOpen)
    }

    return (
        <div>
            <HeaderChrono />
            <div className="container mx-auto p-4 mt-20">
                <h1 className="text-2xl font-bold mb-4">Lista de Academias</h1>
                <div className="flex gap-4 mb-4">
                    <button
                        onClick={toggleGymModal}
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                        Cadastrar Nova Academia
                    </button>
                    <button
                        onClick={toggleUserModal}
                        className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                        Cadastrar Novo Usuário
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b text-left font-semibold text-gray-700">
                                    Nome da Academia
                                </th>
                                <th className="py-2 px-4 border-b text-left font-semibold text-gray-700">
                                    Endereço
                                </th>
                                <th className="py-2 px-4 border-b text-left font-semibold text-gray-700">
                                    Usuários
                                </th>
                                <th className="py-2 px-4 border-b text-left font-semibold text-gray-700">
                                    Status
                                </th>
                                <th className="py-2 px-4 border-b text-left font-semibold text-gray-700">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {gyms.map((gym) => (
                                <tr
                                    key={gym.id}
                                    className="hover:bg-gray-100 transition-colors"
                                >
                                    <td className="py-2 px-4 border-b">
                                        {gym.name}
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        {gym.street ? (
                                            <p>
                                                {gym.street}, {gym.number}{' '}
                                                {gym.complement &&
                                                    ` - ${gym.complement}`}
                                                <br />
                                                {gym.neighborhood}, {gym.city},{' '}
                                                {gym.state} - {gym.zipCode}
                                            </p>
                                        ) : (
                                            <p>Nenhum endereço cadastrado</p>
                                        )}
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        {gym.users.length > 0 ? (
                                            <ul>
                                                {gym.users.map((user) => (
                                                    <li key={user.id}>
                                                        {user.name} ({user.role}
                                                        )
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p>Sem usuários cadastrados</p>
                                        )}
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        {gym.blocked ? (
                                            <p>Bloqueado</p>
                                        ) : (
                                            <p>Ativo</p>
                                        )}
                                    </td>
                                    <td className="py-2 px-4 border-b cursor-pointer">
                                        <button
                                            type="button"
                                            name="UnblockUser"
                                            className="bg-green-500 p-2 rounded-md flex items-center justify-center w-8 h-8"
                                            onClick={() =>
                                                unblockGymClick(gym.id)
                                            }
                                        >
                                            <MdLockOpen className="text-white" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {isGymModalOpen && (
                <AddGymModal onClose={toggleGymModal} onGymAdded={fetchGyms} />
            )}
            {isUserModalOpen && (
                <AddUserModal
                    onClose={toggleUserModal}
                    onUserAdded={fetchGyms}
                    gyms={gyms}
                />
            )}
        </div>
    )
}

export default ListGym
