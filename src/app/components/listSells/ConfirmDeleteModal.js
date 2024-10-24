import React from 'react';

function ConfirmDeleteModal({ onClose, onConfirm, sale }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-sm">
                <h2 className="text-xl font-bold mb-4">Confirmar Exclusão</h2>
                <p>Tem certeza de que deseja excluir a venda do produto <strong>{sale.product.name}</strong>?</p>
                <div className="flex justify-end gap-2 mt-4">
                    <button 
                        onClick={onClose} 
                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded">
                        Cancelar
                    </button>
                    <button 
                        onClick={() => onConfirm(sale.id)} 
                        className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDeleteModal;
