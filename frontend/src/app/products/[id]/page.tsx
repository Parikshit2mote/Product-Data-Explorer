
'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useParams } from 'next/navigation';
import { Star, MessageSquare, Info, RefreshCw, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ProductDetailPage() {
    const { id } = useParams();

    const { data: product, isLoading, refetch } = useQuery({
        queryKey: ['product', id],
        queryFn: async () => {
            const res = await api.get(`/products/${id}`);
            return res.data;
        },
    });

    const triggerScrape = async () => {
        await api.post(`/products/${id}/scrape`);
        alert('Deep scrape triggered! Details will be updated shortly.');
    };

    if (isLoading) return <div className="text-center py-20">Loading product details...</div>;
    if (!product) return <div className="text-center py-20">Product not found</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-12">
            <Link href="/categories" className="inline-flex items-center text-slate-400 hover:text-white transition-colors">
                <ChevronLeft size={20} className="mr-1" />
                Back to Explorer
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Left: Image Card */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sticky top-24 h-fit"
                >
                    <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-full rounded-2xl shadow-2xl"
                    />
                </motion.div>

                {/* Right: Info */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-8"
                >
                    <div className="space-y-4">
                        <h1 className="text-4xl font-extrabold leading-tight">{product.title}</h1>
                        <div className="flex items-center space-x-6">
                            <div className="text-3xl font-bold text-emerald-400">
                                {product.currency} {product.price}
                            </div>
                            <div className="flex items-center text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
                                <Star size={18} className="fill-current mr-2" />
                                <span className="font-bold">{product.detail?.ratingsAvg || 'N/A'}</span>
                            </div>
                            <div className="flex items-center text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                                <MessageSquare size={18} className="mr-2" />
                                <span className="font-bold">{product.detail?.reviewsCount || 0} Reviews</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex space-x-4">
                        <a
                            href={product.sourceUrl}
                            target="_blank"
                            className="flex-grow text-center bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-blue-900/20"
                        >
                            View on World of Books
                        </a>
                        <button
                            onClick={triggerScrape}
                            className="p-4 bg-slate-800 hover:bg-slate-700 rounded-2xl transition-all"
                            title="Refresh from Source"
                        >
                            <RefreshCw size={24} />
                        </button>
                    </div>

                    <div className="border-t border-slate-800 pt-8 space-y-4">
                        <div className="flex items-center space-x-2 text-slate-400">
                            <Info size={18} />
                            <h2 className="text-lg font-bold text-white uppercase tracking-wider">Description</h2>
                        </div>
                        <div
                            className="text-slate-300 leading-relaxed space-y-4"
                            dangerouslySetInnerHTML={{ __html: product.detail?.description || 'No description available yet. Trigger a scrape to fetch more info.' }}
                        />
                    </div>

                    {/* Specs / Metadata */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
                            <span className="text-xs text-slate-500 block uppercase mb-1">Source ID</span>
                            <span className="font-medium">{product.sourceId}</span>
                        </div>
                        <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
                            <span className="text-xs text-slate-500 block uppercase mb-1">Last Updated</span>
                            <span className="font-medium text-sm">
                                {product.lastScrapedAt ? new Date(product.lastScrapedAt).toLocaleDateString() : 'Never'}
                            </span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Reviews Section Placeholder */}
            <section className="space-y-6">
                <h2 className="text-2xl font-bold">User Reviews</h2>
                {product.reviews?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {product.reviews.map((review: any) => (
                            <div key={review.id} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="font-bold">{review.author || 'Anonymous'}</div>
                                    <div className="flex text-yellow-500">
                                        {Array.from({ length: review.rating || 5 }).map((_, i) => <Star key={i} size={14} className="fill-current" />)}
                                    </div>
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed">{review.text}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-slate-500">No reviews found for this product.</p>
                )}
            </section>
        </div>
    );
}
