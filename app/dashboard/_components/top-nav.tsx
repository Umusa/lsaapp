"use client";

import { Bell, Search, Settings, HelpCircle, User, Menu, LogOut, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const TopNav = ({ onMenuClick }: { onMenuClick: () => void }) => {
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("user");
        router.push("/login");
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40 px-4 sm:px-8 flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
            <div className="flex items-center gap-6">
                <button 
                    onClick={onMenuClick}
                    className="lg:hidden p-2.5 -ml-2 text-slate-500 hover:bg-slate-50 rounded-2xl transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>
                
                <div className="flex flex-col">
                    <motion.div 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2"
                    >
                        <h2 className="text-xl font-black text-slate-800 tracking-tight leading-none">
                            Hello, {user?.username?.split('@')[0] || "Agent"}!
                        </h2>
                        <span className="text-xl">👋</span>
                    </motion.div>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-[10px] sm:text-xs font-black text-[var(--primary)] uppercase tracking-widest opacity-80">
                            {user?.organisation || "LSA ACADEMIC SYSTEM"}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative hidden md:block group">
                    <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-[var(--primary)] transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search students, records..." 
                        className="h-11 pl-11 pr-4 bg-slate-50 border border-slate-100 focus:bg-white focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5 rounded-2xl text-[13px] font-medium transition-all w-72 outline-none placeholder:text-slate-400"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <button className="w-11 h-11 rounded-2xl flex items-center justify-center text-slate-500 hover:text-[var(--primary)] hover:bg-[var(--primary-light)] transition-all relative group">
                        <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        <span className="absolute top-3 right-3 w-2 h-2 bg-[var(--accent)] rounded-full border-2 border-white shadow-[0_0_8px_var(--accent)]" />
                    </button>
                    <button className="w-11 h-11 rounded-2xl flex items-center justify-center text-slate-500 hover:text-[var(--primary)] hover:bg-[var(--primary-light)] transition-all">
                        <Sparkles className="w-5 h-5" />
                    </button>
                </div>

                <div className="h-8 w-px bg-slate-100 mx-1" />

                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-inner group relative overflow-hidden transition-all hover:border-[var(--primary)]/30">
                        <div className="absolute inset-0 bg-[var(--primary)] opacity-0 group-hover:opacity-[0.03] transition-opacity" />
                        <User className="w-5 h-5 text-slate-400 group-hover:text-[var(--primary)] transition-colors" />
                        
                        <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 px-1 hidden group-hover:block animate-in fade-in slide-in-from-top-2 duration-200">
                             <button 
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-600 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            >
                                <LogOut className="w-4 h-4" />
                                End Session
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopNav;
