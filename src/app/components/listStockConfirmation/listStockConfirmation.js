"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import HeaderChrono from "../header/header";
import { MdDelete, MdCheck, MdBlock, MdSyncLock } from "react-icons/md";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { getStockConfirmations, validateonfirmation, invalidateConfirmation } from "@/axios/api";
import { Pagination, Select, DatePicker } from "antd";

const { RangePicker } = DatePicker;

function StockConfirmationList() {
    const [confirmations, setConfirmations] = useState([]);
    const [filteredConfirmations, setFilteredConfirmations] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const [gyms, setGyms] = useState([]);
    const [selectedGym, setSelectedGym] = useState(null);
    const [dateRange, setDateRange] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [fetched, setFetched] = useState(false)
    const pageSize = 10;

    useEffect(() => {
        const fetchConfirmations = async () => {
            try {
                const response = await getStockConfirmations();
                setConfirmations(response.data);
                extractGyms(response.data);
            } catch (error) {
                console.error("Erro ao buscar confirmações de estoque:", error);
            }
        };
        fetchConfirmations();
        setFetched(true);
    }, [fetched]);

    useEffect(() => {
        const applyFilters = () => {
            let filtered = confirmations;
            if (selectedGym) {
                filtered = filtered.filter((item) => item.gym.name === selectedGym);
            }
            if (dateRange) {
                filtered = filtered.filter((item) => {
                    const date = new Date(item.createdAt);
                    return date >= dateRange[0] && date <= dateRange[1];
                });
            }
            setFilteredConfirmations(filtered);
        };
        applyFilters();
    }, [confirmations, selectedGym, dateRange]);

    
    const extractGyms = (data) => {
        const gymNames = [...new Set(data.map((item) => item.gym.name))];
        setGyms(gymNames);
    };

    const toggleAccordion = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const invalidateConfirmationClick = async (id) => {
        await invalidateConfirmation(id)
        setFetched(false);
    };

    const validateConfirmationClick = async (id) => {
        await validateonfirmation(id)
        setFetched(false);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const paginatedData = filteredConfirmations.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const getStatusClass = (status) => {
        switch (status) {
            case 'Pendente':
                return 'bg-orange-100 text-orange-800';
            case 'Aguardando validação':
                return 'bg-yellow-200 text-yellow-900';
            case 'Válido':
                return 'bg-green-100 text-green-800';
            case 'Inválido':
                return 'bg-red-100 text-red-800';
            default:
                return '';
        }
    };
    
    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pendente':
                return <MdSyncLock className="inline-block mr-1" />;
            case 'Aguardando validação':
                return <MdSyncLock className="inline-block mr-1" />;
            case 'Válido':
                return <MdCheck className="inline-block mr-1" />;
            case 'Inválido':
                return <MdBlock className="inline-block mr-1" />;
            default:
                return null;
        }
    };

    return (
        <>
            <HeaderChrono />
            <div className="container mx-auto p-6 mt-16">
                <h1 className="text-3xl font-bold mb-6">Confirmações de Estoque</h1>
                <div className="flex gap-4 mb-6">
                    <Select
                        placeholder="Filtrar por academia"
                        className="w-1/3"
                        allowClear
                        onChange={setSelectedGym}
                    >
                        {gyms.map((gym) => (
                            <Select.Option key={gym} value={gym}>
                                {gym}
                            </Select.Option>
                        ))}
                    </Select>
                    <RangePicker onChange={setDateRange} className="w-1/3" />
                </div>
                <div className="bg-white shadow-md rounded-lg p-4">
                    {paginatedData.map((confirmation) => (
                        <div key={confirmation.id} className="border-b last:border-b-0 py-4">
                            <div
                                className="flex justify-between items-center cursor-pointer p-3 hover:bg-gray-100 rounded-lg"
                                onClick={() => toggleAccordion(confirmation.id)}
                            >
                                <div>
                                    <p className="font-semibold text-lg">{confirmation.gym.name}</p>
                                    {confirmation.status !== "Pendente" && (
                                        <p className="text-sm text-gray-500">Confirmado por: {confirmation.user.name} ({confirmation.user.role})</p>
                                    )}
                                    <p className="text-sm text-gray-500">
                                        Data de solicitação: {new Date(confirmation.createdAt).toLocaleDateString("pt-BR")}
                                    </p>
                                    <p className={`text-sm px-2 py-1 rounded ${getStatusClass(confirmation.status)}`}>
                                        {getStatusIcon(confirmation.status)} {confirmation.status}
                                    </p>
                                </div>
                                {expandedId === confirmation.id ? <IoIosArrowUp /> : <IoIosArrowDown />}
                            </div>
                            {expandedId === confirmation.id && (
                                <div className="p-4 border-t bg-gray-50 mt-2 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-3">Detalhes dos Produtos</h3>
                                    <ul className="space-y-3">
                                        {JSON.parse(confirmation.detail).map((product) => (
                                            <li key={product.id} className="flex items-center gap-4 p-3 bg-white rounded-md shadow">
                                                <Image
                                                    src={product.imageUrl || ""}
                                                    alt="Imagem do produto"
                                                    width={50}
                                                    height={50}
                                                    className="w-14 h-14 object-cover rounded-lg"
                                                />
                                                <div>
                                                    <p className="font-medium">{product.name}</p>
                                                    <p className="text-sm text-gray-500">Antes: {product.oldQuantity}</p>
                                                    <p className="text-sm text-gray-500">Agora: {product.newQuantity}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                    <button
                                        onClick={() => invalidateConfirmationClick(confirmation.id)}
                                        className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded flex items-center gap-2"
                                    >
                                        <MdDelete /> Invalidar Confirmação
                                    </button>
                                    <button
                                        onClick={() => validateConfirmationClick(confirmation.id)}
                                        className="mt-4 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded flex items-center gap-2"
                                    >
                                        <MdCheck /> Validar Confirmação
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                    <div className="mt-6 flex justify-center">
                        <Pagination
                            current={currentPage}
                            pageSize={pageSize}
                            total={filteredConfirmations.length}
                            onChange={handlePageChange}
                            showSizeChanger={false}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default StockConfirmationList;
