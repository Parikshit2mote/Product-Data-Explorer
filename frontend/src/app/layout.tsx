import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/providers/query-provider";

export const metadata: Metadata = {
  title: "Product Data Explorer | World of Books",
  description: "Advanced product exploration platform for World of Books",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`bg-slate-950 text-slate-50 min-h-screen font-sans`}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
              <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                  WOB Explorer
                </div>
                <nav className="hidden md:flex space-x-8 text-sm font-medium">
                  <a href="/" className="hover:text-blue-400 transition-colors">Home</a>
                  <a href="/categories" className="hover:text-blue-400 transition-colors">Categories</a>
                  <a href="/about" className="hover:text-blue-400 transition-colors">About</a>
                </nav>
              </div>
            </header>
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <footer className="border-t border-slate-800 py-8 bg-slate-900/50">
              <div className="container mx-auto px-4 text-center text-sm text-slate-400">
                &copy; 2026 Product Data Explorer. Crafted with performance in mind.
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
