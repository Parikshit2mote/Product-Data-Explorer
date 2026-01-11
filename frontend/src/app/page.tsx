
'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { Book, ChevronRight, Search, Loader2, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  const { data: navigations, isLoading, refetch } = useQuery({
    queryKey: ['navigation'],
    queryFn: async () => {
      const res = await api.get('/navigation');
      return res.data;
    },
  });

  const triggerSync = async () => {
    try {
      setSyncing(true);
      setSyncMessage('');
      await api.post('/navigation/scrape');
      setSyncMessage('Sync completed! Refreshing data...');
      setTimeout(() => {
        refetch();
        setSyncMessage('');
      }, 2000);
    } catch (error) {
      setSyncMessage('Sync failed. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-64 bg-slate-900 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-slate-900 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-900 p-8 md:p-16 text-white text-center">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <Book size={400} className="absolute -top-20 -left-20 rotate-12" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-2xl mx-auto space-y-6"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Explore Your Next <span className="text-emerald-400">Story</span>
          </h1>
          <p className="text-lg text-slate-200">
            Real-time scraped product data from World of Books.
            Navigate from headings to deep categories and detailed product insights.
          </p>
          <div className="flex flex-col items-center gap-3 pt-4">
            <button
              onClick={triggerSync}
              disabled={syncing}
              className="px-8 py-3 bg-white text-blue-900 font-bold rounded-full hover:bg-emerald-400 hover:text-emerald-950 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {syncing ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Syncing...
                </>
              ) : (
                'Trigger Sync'
              )}
            </button>
            {syncMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-emerald-400 text-sm font-medium"
              >
                <CheckCircle size={16} />
                {syncMessage}
              </motion.div>
            )}
          </div>
        </motion.div>
      </section>

      {/* Navigation Headings */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {navigations?.map((nav: any, index: number) => (
          <motion.div
            key={nav.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              href={`/categories`}
              className="group block p-6 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-blue-500/50 hover:bg-slate-900 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold group-hover:text-blue-400 transition-colors capitalize">
                    {nav.title}
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Explore categories under {nav.title}
                  </p>
                </div>
                <div className="p-3 bg-slate-800 rounded-xl group-hover:bg-blue-500 transition-colors">
                  <ChevronRight size={20} />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
