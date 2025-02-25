import React from "react";
import Image from "next/image";
import statusDictionary from "./statusDictionary";
import paymentMethodDictionary from "./paymentMethodsDictionary";
import { updateTransaction } from "@/axios/api";

function TransactionRow({ transaction, expanded, setExpandedTransactionId, fetchTransactions  }) {
    const toggleExpand = () => {
        setExpandedTransactionId(expanded ? null : transaction.id);
    };

    const handleUpdateStatus = async (status) => {
        try {
            await updateTransaction(transaction.id, { status });
            fetchTransactions();
        } catch (error) {
            alert("Erro ao atualizar a transação!" + error);
        }
    };

    return (
        <>
            <tr className="hover:bg-gray-100 transition-colors cursor-pointer" onClick={toggleExpand}>
                <td className="py-2 px-4 border-b">{transaction.customerName}</td>
                <td className="py-2 px-4 border-b">{transaction.gym.name}</td>
                <td className="py-2 px-4 border-b">R$ {transaction.totalAmount}</td>
                <td className="py-2 px-4 border-b">{statusDictionary[transaction.status]}</td>
                <td className="py-2 px-4 border-b">{paymentMethodDictionary[transaction.paymentMethod]}</td>
                <td className="py-2 px-4 border-b">
                    {transaction.status === "waiting_payment" && (
                        <button 
                            onClick={() => handleUpdateStatus("paid")}
                            className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                        >
                            Recebido
                        </button>
                    )}
                    {transaction.status === "paid" && (
                        <button 
                            onClick={() => handleUpdateStatus("paid")} // Mudar para o novo status
                            className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                        >
                            Comissão paga
                        </button>
                    )}
                </td>
            </tr>
            {expanded && (
                <tr>
                    <td colSpan="5" className="bg-gray-50 p-4 border-b">
                        <h3 className="text-lg font-semibold">Detalhes da Transação</h3>
                        <p><strong>Método de Pagamento:</strong> {transaction.paymentMethod}</p>
                        <p><strong>Data:</strong> {new Date(transaction.createdAt).toLocaleDateString("pt-BR")}</p>

                        <h4 className="mt-3 font-semibold">Itens Comprados</h4>
                        <div className="space-y-3">
                            {transaction.cart.map((item) => (
                                <>
                                    <Image src={item.imageUrl} alt={item.name} width={48} height={48} className="object-cover rounded" />
                                    <div>
                                        <p className="font-semibold">{item.name}</p>
                                        <p>Qtd: {item.quantity} | Preço: R$ {item.price.toFixed(2)}</p>
                                    </div>
                                </>
                            ))}
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
}

export default TransactionRow;
