'use client'
import React, { useState, useEffect } from 'react'
import { transferProductStock, getAllGysm } from '../../../axios/api'

function TransferStockModal({ stockItem, onClose, onTransferComplete }) {
    const [toGymId, setToGymId] = useState('')
    const [quantity, setQuantity] = useState('')
    const [gyms, setGyms] = useState([])

    useEffect(() => {
        const fetchGyms = async () => {
            try {
                const response = await getAllGysm()
                setGyms(response.gyms) // Armazena a lista de academias no estado
            } catch (error) {
                console.error('Erro ao buscar academias:', error)
            }
        }
        fetchGyms()
    }, [])

    const handleTransfer = async (e) => {
        e.preventDefault()
        try {
            await transferProductStock(
                stockItem.productId,
                stockItem.gymId,
                parseInt(toGymId),
                parseInt(quantity)
            )
            onTransferComplete()
            onClose()
        } catch (error) {
            console.error('Erro ao transferir estoque:', error)
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Transferir Estoque</h2>
                <form onSubmit={handleTransfer}>
                    <p className="mb-4">Produto: {stockItem.productName}</p>
                    <p className="mb-4">
                        Academia de Origem: {stockItem.gymName}
                    </p>
                    <p className="mb-4">
                        Estoque Disponível: {stockItem.quantity}
                    </p>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Academia de Destino
                        </label>
                        <select
                            value={toGymId}
                            onChange={(e) => setToGymId(e.target.value)}
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                            required
                        >
                            <option value="">Selecione uma academia</option>
                            {gyms
                                .filter((gym) => gym.id !== stockItem.gymId) // Exclui a academia de origem
                                .map((gym) => (
                                    <option key={gym.id} value={gym.id}>
                                        {gym.name}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Quantidade
                        </label>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                            required
                            min="1"
                            max={stockItem.quantity}
                        />
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
                            Transferir
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default TransferStockModal
