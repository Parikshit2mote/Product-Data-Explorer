
import { Info, Code, Database, Globe, Server } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
                <h1 className="text-5xl font-extrabold">Product Explorer</h1>
                <p className="text-xl text-slate-400">A full-stack, production-minded scraping platform.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
                    <div className="p-3 bg-blue-500/10 text-blue-400 w-fit rounded-2xl">
                        <Globe size={32} />
                    </div>
                    <h3 className="text-2xl font-bold">Frontend Tech</h3>
                    <ul className="space-y-2 text-slate-400">
                        <li className="flex items-center space-x-2"><Code size={16} /> <span>Next.js 14 (App Router)</span></li>
                        <li className="flex items-center space-x-2"><Code size={16} /> <span>TypeScript</span></li>
                        <li className="flex items-center space-x-2"><Code size={16} /> <span>Tailwind CSS</span></li>
                        <li className="flex items-center space-x-2"><Code size={16} /> <span>TanStack Query (SWR replacement)</span></li>
                        <li className="flex items-center space-x-2"><Code size={16} /> <span>Framer Motion</span></li>
                    </ul>
                </div>

                <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
                    <div className="p-3 bg-emerald-500/10 text-emerald-400 w-fit rounded-2xl">
                        <Server size={32} />
                    </div>
                    <h3 className="text-2xl font-bold">Backend Tech</h3>
                    <ul className="space-y-2 text-slate-400">
                        <li className="flex items-center space-x-2"><Database size={16} /> <span>NestJS (Node + TS)</span></li>
                        <li className="flex items-center space-x-2"><Database size={16} /> <span>MongoDB + Prisma</span></li>
                        <li className="flex items-center space-x-2"><Database size={16} /> <span>Crawlee + Playwright</span></li>
                        <li className="flex items-center space-x-2"><Database size={16} /> <span>BullMQ (Redis) for Queueing</span></li>
                    </ul>
                </div>
            </div>

            <section className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
                <h2 className="text-3xl font-bold">Core Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <h4 className="font-bold text-blue-400">On-Demand Scraping</h4>
                        <p className="text-sm text-slate-400">Trigger real-time scrapes for categories or specific products to keep data fresh.</p>
                    </div>
                    <div className="space-y-2">
                        <h4 className="font-bold text-emerald-400">Async Queue Model</h4>
                        <p className="text-sm text-slate-400">Long-running scrapes are pushed to BullMQ workers, ensuring non-blocking API responses.</p>
                    </div>
                    <div className="space-y-2">
                        <h4 className="font-bold text-purple-400">Safe Caching</h4>
                        <p className="text-sm text-slate-400">Results are stored in MongoDB with last-scraped timestamps to prevent redundant requests.</p>
                    </div>
                    <div className="space-y-2">
                        <h4 className="font-bold text-yellow-400">Premium UX</h4>
                        <p className="text-sm text-slate-400">Responsive grid, skeleton loaders, and smooth transitions for a high-end feel.</p>
                    </div>
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold">Installation</h2>
                <pre className="p-6 bg-slate-950 rounded-2xl border border-slate-800 text-sm overflow-x-auto">
                    {`# Backend
cd backend
npm install
npx prisma generate
npm run start:dev

# Frontend
cd frontend
npm install
npm run dev`}
                </pre>
            </section>
        </div>
    );
}
