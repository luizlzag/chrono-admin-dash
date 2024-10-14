import React from 'react';
import Link from 'next/link';

function HeaderChrono() {
    return (  
        <div className="fixed top-0 left-0 right-0 w-full bg-black">  
            <div className="flex items-center gap-5 text-white my-3 mx-3 cursor-pointer">
               
                <Link href="/pages/Home">
                    <p className="hover:text-gray-300">Produtos</p>
                </Link>
                <Link href="/pages/Stock">
                    <p className="hover:text-gray-300">Estoque</p>
                </Link>
                <Link href="/pages/Gym">
                    <p className="hover:text-gray-300">Academia</p>
                </Link>

                <Link href="/pages/Sell">
                    <p className="hover:text-gray-300">Vendas</p>
                </Link>
            </div>
        </div>
    );
}

export default HeaderChrono;
