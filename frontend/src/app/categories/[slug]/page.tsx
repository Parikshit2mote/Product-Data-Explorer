
'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShoppingCart, ExternalLink, RefreshCw, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function CategoryDetailPage() {
    const { slug } = useParams();
    const [scraping, setScraping] = useState(false);

    const { data: category, isLoading: catLoading } = useQuery({
        queryKey: ['category', slug],
        queryFn: async () => {
            const res = await api.get(`/categories/${slug}`);
            return res.data;
        },
    });

    const { data: productsData, isLoading: prodLoading, refetch } = useQuery({
        queryKey: ['products', category?.id],
        queryFn: async () => {
            if (!category?.id) return { items: [] };
            const res = await api.get(`/products?categoryId=${category.id}`);
            return res.data;
        },
        enabled: !!category?.id,
    });

    const triggerScrape = async () => {
        try {
            setScraping(true);
            await api.post(`/categories/${slug}/scrape`);
            // Wait a moment then refetch
            setTimeout(() => {
                refetch();
                setScraping(false);
            }, 3000);
        } catch (error) {
            setScraping(false);
            alert('Scrape failed. Please try again.');
        }
    };

    if (catLoading || prodLoading) return <div className="text-center py-20">Loading products...</div>;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold capitalize">{category?.title || slug}</h1>
                    <p className="text-slate-400">Total products found: {productsData?.items?.length || 0}</p>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={triggerScrape}
                        disabled={scraping}
                        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-full text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {scraping ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                <span>Scraping...</span>
                            </>
                        ) : (
                            <>
                                <RefreshCw size={16} />
                                <span>On-Demand Scrape</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {productsData?.items?.map((product: any, idx: number) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="group bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-blue-500/50 transition-all flex flex-col"
                    >
                        <div className="aspect-[3/4] overflow-hidden relative">
                            <img
                                src={product.imageUrl || 'https://via.placeholder.com/300x400?text=No+Image'}
                                alt={product.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold text-emerald-400">
                                {product.currency} {product.price}
                            </div>
                        </div>
                        <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                            <h3 className="font-bold text-lg line-clamp-2 leading-snug">
                                {product.title}
                            </h3>
                            <div className="flex items-center justify-between gap-2">
                                <Link
                                    href={`/products/${product.id}`}
                                    className="flex-grow text-center text-sm font-bold bg-slate-800 hover:bg-slate-750 py-2.5 rounded-xl transition-colors"
                                >
                                    View Details
                                </Link>
                                <a
                                    href={product.sourceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2.5 bg-slate-800 hover:bg-slate-750 rounded-xl"
                                >
                                    <ExternalLink size={18} />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                ))}
                {productsData?.items?.length === 0 && (
                    <div className="col-span-full py-20 text-center text-slate-500">
                        No products found in this category. Try triggering a scrape.
                    </div>
                )}
            </div>
        </div>
    );
}
