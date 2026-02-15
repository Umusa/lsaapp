"use client";

import { useEffect, useState } from "react";
import { 
  Users, 
  UserCheck, 
  Briefcase, 
  CreditCard, 
  MessageSquare, 
  Mail, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus,
  RefreshCw,
  Search,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

const CircularProgress = ({ percentage, color, label, centerText, subText }: any) => {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-28 h-28 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="56"
            cy="56"
            r={radius}
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            className="text-slate-100"
          />
          <circle
            cx="56"
            cy="56"
            r={radius}
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            className={cn("transition-all duration-1000", color)}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-lg font-extrabold text-slate-800 leading-none">{centerText}</span>
          {subText && <span className="text-[9px] text-slate-400 font-bold uppercase mt-1">{subText}</span>}
        </div>
      </div>
      <p className="mt-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">{label}</p>
    </div>
  );
};

const DashboardHome = () => {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async (org: string) => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/dashboard/stats?org=${encodeURIComponent(org)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchStats(parsedUser.organisation);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50/50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <p className="text-slate-500 font-bold animate-pulse text-sm tracking-widest uppercase">Fetching Live Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 animate-in fade-in duration-700">
      
      {/* Hero Welcome Section */}
      <div className="relative min-h-[12rem] sm:h-48 w-full rounded-2xl overflow-hidden bg-gradient-to-r from-blue-900 to-[#101827] shadow-xl">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-blue-500/20 to-transparent skew-x-12" />
        
        <div className="relative h-full p-6 sm:p-8 flex flex-col justify-center max-w-2xl">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-300 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest rounded-full mb-3 sm:mb-4 w-fit">
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
            Live Dashboard Active
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            Welcome Back, <span className="text-blue-400">{user?.username?.split('@')[0] || "Agent"}</span>!
          </h1>
          <p className="text-sm sm:text-base text-slate-300/80 font-medium line-clamp-2">
            Manage your school with ease. Today at {user?.organisation || "LSA School"}.
          </p>
        </div>

        {/* Floating Action Buttons */}
        <div className="hidden sm:flex absolute bottom-6 right-8 gap-3">
          <button 
            onClick={() => user && fetchStats(user.organisation)}
            className="h-10 px-4 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl backdrop-blur-md transition-all flex items-center gap-2 border border-white/10"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
          <button className="h-10 px-6 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20">
            <Plus className="w-3.5 h-3.5" /> New Registration
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
            <CircularProgress percentage={stats?.activePercentage || 0} color="text-emerald-500" centerText={`${Math.round(stats?.activePercentage || 0)}%`} label="Active" />
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
            <CircularProgress percentage={50} color="text-pink-500" centerText={`${stats?.genderRatio?.male || 0}/${stats?.genderRatio?.female || 0}`} label="Gender" />
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
            <CircularProgress percentage={(stats?.clearedBalanceCount / stats?.totalStudents) * 100 || 0} color="text-blue-600" centerText={`${stats?.clearedBalanceCount || 0}/${stats?.totalDebtors || 0}`} label="Cleared" />
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
            <CircularProgress percentage={0} color="text-slate-300" centerText="-" label="Payment" />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
        
        {/* Left Stats Section */}
        <div className="xl:col-span-2 space-y-6 sm:space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-100">
                <div className="space-y-1">
                    <p className="text-2xl sm:text-3xl font-extrabold text-slate-800">{stats?.clearedBalanceCount || 0}</p>
                    <p className="text-[9px] sm:text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-tight">Total students with <br className="hidden sm:block"/>cleared balance</p>
                </div>
                <div className="space-y-1">
                    <p className="text-2xl sm:text-3xl font-extrabold text-emerald-500">{stats?.creditBalanceCount || 0}</p>
                    <p className="text-[9px] sm:text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-tight">Total students with <br className="hidden sm:block"/>credit balances</p>
                </div>
                <div className="space-y-1">
                    <p className="text-2xl sm:text-3xl font-extrabold text-orange-500">{stats?.totalDebtors || 0}</p>
                    <p className="text-[9px] sm:text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-tight">Total debtors</p>
                </div>
                <div className="col-span-full pt-4 border-t border-slate-50">
                    <p className="text-[9px] sm:text-[10px] text-slate-400 font-medium italic">{stats?.incompleteProfiles || 0} students with incomplete profiles</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center border-4 border-emerald-400">
                        <p className="text-xl font-bold text-slate-800">{stats?.whatsappFilled || 0}</p>
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase text-center tracking-wider">Student with whatsapp <br/>number filled</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center border-4 border-blue-400">
                        <p className="text-xl font-bold text-slate-800">{stats?.emailsFilled || 0}</p>
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase text-center tracking-wider">Student with emails <br/>filled</p>
                </div>
                <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100 shadow-sm flex flex-col items-center gap-4 relative overflow-hidden">
                    <div className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                    <div className="w-16 h-16 rounded-full bg-rose-600 flex items-center justify-center text-white border-4 border-rose-200">
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-bold">{stats?.totalStudents - (stats?.totalStudents * (stats?.activePercentage / 100)) || 0}</span>
                            <span className="text-[9px] font-bold">N</span>
                        </div>
                    </div>
                    <p className="text-[11px] text-rose-800 font-extrabold uppercase text-center tracking-wider">Inactive Students</p>
                </div>
            </div>
        </div>

        {/* Right Info Section */}
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
                        <Search className="w-4 h-4 text-blue-500" /> Quick Filter
                    </h3>
                </div>
                
                <div className="space-y-6 flex-1">
                    <div>
                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-3">Sections</p>
                        <div className="h-px bg-slate-100 w-full" />
                    </div>

                    <div>
                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-4">Levels</p>
                        <div className="space-y-4">
                            {[
                                { name: "External", count: 91 },
                                { name: "Reading Readiness 1", count: 46 },
                                { name: "Basic 2", count: 34 },
                                { name: "Reading Readiness 2", count: 32 },
                                { name: "Basic 1", count: 31 },
                                { name: "Basic 3", count: 30 },
                            ].map((level, i) => (
                                <div key={i} className="group cursor-pointer">
                                    <div className="flex justify-between items-center text-xs mb-1.5">
                                        <span className="text-slate-600 group-hover:text-blue-600 font-medium transition-colors">{level.name}</span>
                                        <span className="text-slate-400 font-bold">({level.count})</span>
                                    </div>
                                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-emerald-500 transition-all duration-1000" 
                                            style={{ width: `${(level.count / 100) * 100}%` }} 
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>

      </div>

    </div>
  );
};

export default DashboardHome;
