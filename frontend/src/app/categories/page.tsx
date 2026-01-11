
'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Layers, RefreshCcw } from 'lucide-react';

export default function CategoriesPage() {
    const { data: categories, isLoading, refetch } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const res = await api.get('/categories');
            return res.data;
        },
    });

    if (isLoading) return <div className="text-center py-20">Loading categories...</div>;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Categories</h1>
                <button
                    onClick={() => refetch()}
                    className="flex items-center space-x-2 text-sm bg-slate-800 px-4 py-2 rounded-lg hover:bg-slate-700"
                >
                    <RefreshCcw size={16} />
                    <span>Refresh List</span>
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {categories?.map((cat: any) => (
                    <Link key={cat.id} href={`/categories/${cat.slug}`}>
                        <div className="aspect-square bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center justify-center p-4 hover:border-emerald-500/50 transition-all text-center">
                            <Layers className="text-emerald-400 mb-2" size={32} />
                            <span className="font-medium text-sm">{cat.title}</span>
                            <span className="text-xs text-slate-500 mt-1">{cat.productCount} Items</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
