"use client";

import { Bell, Search, Settings, HelpCircle, User, Menu, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
        <header className="h-20 bg-white border-b border-slate-200 sticky top-0 z-40 px-4 sm:px-8 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
                <button 
                    onClick={onMenuClick}
                    className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>
                
                <div className="flex flex-col">
                    <h2 className="text-lg sm:text-xl font-extrabold text-slate-800 tracking-tight leading-tight">
                        Welcome, {user?.username?.split('@')[0] || "Agent"}!
                    </h2>
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest truncate max-w-[120px] sm:max-w-none">
                            {user?.organisation || "Delda Quest Model Schools"}
                        </span>
                        <span className="hidden sm:block h-1 w-1 rounded-full bg-slate-300" />
                        <span className="hidden md:block text-[10px] text-blue-600 font-bold uppercase tracking-widest">Confidentiality Agreement in place</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative hidden md:block">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                        type="text" 
                        placeholder="Search dashboard..." 
                        className="h-10 pl-10 pr-4 bg-slate-100 border-transparent focus:bg-white focus:border-blue-500 rounded-full text-sm transition-all w-64 outline-none"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                    </button>
                    <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors">
                        <HelpCircle className="w-5 h-5" />
                    </button>
                </div>

                <div className="h-8 w-px bg-slate-200 mx-2" />

                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:flex flex-col items-end">
                        <p className="text-sm font-bold text-slate-800 leading-none">Agent ({user?.role || "Admin"})</p>
                        <p className="text-[10px] text-slate-500 font-medium leading-none mt-1">
                            {user?.organisation?.split(' ')[0] || "LSA"} School
                        </p>
                    </div>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center shadow-inner group relative">
                        <User className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
                        <button 
                            onClick={handleLogout}
                            className="absolute -bottom-12 right-0 bg-white border border-slate-200 rounded-lg shadow-lg py-2 px-4 text-xs font-bold text-red-600 whitespace-nowrap hidden group-hover:block hover:bg-red-50 transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <LogOut className="w-3 h-3" />
                                Sign Out
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopNav;
