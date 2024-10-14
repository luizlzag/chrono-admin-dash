"use client";
import React, { useState, useEffect } from 'react';
import { getAllComissions } from '../../../axios/api';
import HeaderChrono from '../header/header';

function ListComission() {
    const [commissions, setCommissions] = useState([]);
    const [users, setUsers] = useState({});

    // Busca comissões e mapeia usuários
    const fetchCommissions = async () => {
        try {
            const commissionData = await getAllComissions();
            setCommissions(commissionData.commissions);
            
            // Mapeia usuários únicos dos dados de comissões
            const uniqueUserIds = [...new Set(commissionData.commissions.map(c => c.userId))];

            // Opcional: Faça uma requisição para buscar os nomes dos usuários
            // Aqui assumimos que `getUserById` é uma função que retorna o nome do usuário dado um ID
            const userData = {}; 
            await Promise.all(uniqueUserIds.map(async (userId) => {
                // Aqui está o exemplo básico com um nome fictício.
                // No caso real, substituir por uma função que busca o usuário
                userData[userId] = `Usuário ${userId}`; // Substitua para buscar o nome real
            }));

            setUsers(userData);

        } catch (error) {
            console.error('Erro ao buscar comissões:', error);
        }
    };

    useEffect(() => {
        fetchCommissions();
    }, []);

    return (
        <div>
            <HeaderChrono />
            <div className="container mx-auto p-4 mt-20">
                <h1 className="text-2xl font-bold mb-4">Lista de Comissões</h1>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b text-left font-semibold text-gray-700">Usuário</th>
                                <th className="py-2 px-4 border-b text-left font-semibold text-gray-700">Valor</th>
                                <th className="py-2 px-4 border-b text-left font-semibold text-gray-700">Tipo</th>
                                <th className="py-2 px-4 border-b text-left font-semibold text-gray-700">Descrição</th>
                            </tr>
                        </thead>
                        <tbody>
                            {commissions.map((commission) => (
                                <tr key={commission.id} className="hover:bg-gray-100 transition-colors">
                                    <td className="py-2 px-4 border-b">
                                        {users[commission.userId] || 'Carregando...'}
                                    </td>
                                    <td className="py-2 px-4 border-b font-semibold">
                                        R$ {commission.amount.toFixed(2)}
                                    </td>
                                    <td className="py-2 px-4 border-b capitalize">
                                        {commission.type}
                                    </td>
                                    <td className="py-2 px-4 border-b">{commission.description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ListComission;
