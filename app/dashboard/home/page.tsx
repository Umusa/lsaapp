"use client";

import { useEffect, useState, useMemo } from "react";
import { 
  Users, 
  RefreshCw,
  Search,
  ArrowUpRight,
  TrendingUp,
  CreditCard,
  GraduationCap,
  MessageSquare,
  Bus,
  Smartphone,
  ShieldCheck,
  Zap,
  ChevronRight,
  PieChart as PieChartIcon
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Loader from "@/components/ui/loader";

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EC4899', '#6366F1'];

const CircularProgress = ({ percentage, label, sublabel, color, size = 120 }: any) => {
  const radius = size * 0.4;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-slate-100"
          />
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            className={color}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-black text-slate-800">{Math.round(percentage)}%</span>
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{sublabel}</span>
        </div>
      </div>
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
    </div>
  );
};

const MetricItem = ({ label, value, sublabel, color }: any) => (
  <div className="space-y-1">
    <h3 className="text-3xl font-black text-slate-800 tracking-tighter">{value}</h3>
    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">{label}</p>
    {sublabel && <p className="text-[8px] text-slate-400 opacity-70 italic">{sublabel}</p>}
  </div>
);

const DashboardHome = () => {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async (org: string, force = false) => {
    try {
      if (!force) {
        const cached = localStorage.getItem(`dashboard_stats_${org}`);
        if (cached) {
          setStats(JSON.parse(cached));
          setIsLoading(false);
        } else {
          setIsLoading(true);
        }
      } else {
        setIsLoading(true);
      }

      const res = await fetch(`/api/dashboard/stats?org=${encodeURIComponent(org)}${force ? '&refresh=true' : ''}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setStats(data);
      localStorage.setItem(`dashboard_stats_${org}`, JSON.stringify(data));
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
      const filterId = parsedUser.instuCode || parsedUser.organisation;
      fetchStats(filterId);
    }
  }, []);

  if (isLoading) return (
    <div className="h-[80vh] flex flex-col items-center justify-center gap-4 text-center">
        <Loader />
        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">Getting your school data ready...</p>
    </div>
  );

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 pb-12 animate-in fade-in duration-700">
      
      {/* Top Banner Section */}
      <div className="relative h-[140px] rounded-[2rem] overflow-hidden group shadow-xl">
        <img 
          src="/images/school_dashboard_banner_1772536875991.png" 
          alt="School Dashboard"
          className="absolute inset-0 w-full h-full object-cover grayscale-[20%] opacity-90 transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 to-transparent p-6 flex flex-col justify-center">
            <div className="flex justify-between items-center">
                <div className="text-white">
                    <h1 className="text-2xl font-black tracking-tighter mb-0.5">Welcome back,</h1>
                    <h2 className="text-3xl font-black tracking-tighter opacity-95">{user?.name || "Member"}!</h2>
                    <button 
                        onClick={() => fetchStats(user?.instuCode || user?.organisation, true)}
                        className="mt-2 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 transition-colors px-3 py-1.5 rounded-lg border border-white/20"
                    >
                        <RefreshCw className={cn("w-3 h-3", isLoading && "animate-spin")} />
                        Refresh Current State
                    </button>
                </div>
                <div className="text-right text-white/95">
                    <p className="text-[10px] font-black uppercase tracking-widest leading-none drop-shadow-md">
                        {user?.organisation?.toUpperCase() || "LSA ACADEMY"}
                    </p>
                    <p className="text-[9px] font-bold opacity-80 mt-1">{user?.location || "Kaduna, Nigeria"}</p>
                    <div className="mt-3 flex items-center justify-end gap-2 text-[8px] font-black uppercase tracking-widest bg-emerald-500/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-emerald-500/30">
                        <ShieldCheck className="w-3 h-3" /> Secure Access Active
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Main Content Areas */}
        <div className="xl:col-span-9 space-y-6">
            
            {/* Row 1: Key Charts */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="premium-card p-6 flex items-center justify-center min-h-[180px]">
                    <CircularProgress 
                        percentage={stats?.activePercentage || 0} 
                        label="Students in School" 
                        sublabel="Active"
                        color="text-emerald-500"
                    />
                </div>
                <div className="premium-card p-6 flex flex-col items-center justify-center min-h-[180px]">
                    <div className="flex items-end gap-1 mb-2">
                        <span className="text-2xl font-black text-foreground">{stats?.genderRatio?.male}/{stats?.genderRatio?.female}</span>
                    </div>
                    <CircularProgress 
                        percentage={stats?.totalStudents ? (stats.genderRatio.male / stats.totalStudents) * 100 : 0} 
                        label="Boys vs Girls" 
                        sublabel="Male"
                        color="text-indigo-500"
                    />
                </div>
                <div className="premium-card p-6 flex items-center justify-center min-h-[180px]">
                    <CircularProgress 
                        percentage={stats?.clearedVsDebtors?.cleared / stats?.totalStudents * 100} 
                        label="Account Status" 
                        sublabel="Paid"
                        color="text-teal-600"
                    />
                </div>
                <div className="premium-card p-6 flex items-center justify-center min-h-[180px]">
                    <CircularProgress 
                        percentage={stats?.paymentRatio || 0} 
                        label="Payment Progress" 
                        sublabel="Owed"
                        color="text-rose-500"
                    />
                </div>
            </div>

            {/* Row 2: Metrics List */}
            <div className="premium-card p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                <MetricItem label="Fully Paid" value={stats?.clearedBalanceCount || 0} sublabel="Students who have paid everything" />
                <MetricItem label="Overpaid" value={stats?.creditBalanceCount || 0} sublabel="Students who paid extra money" />
                <MetricItem label="Still Owed" value={stats?.totalDebtors || 0} color="text-rose-600" />
                <MetricItem label="Total Records" value={stats?.totalStudents || 0} sublabel="All students in storage" />
            </div>

            {/* Row 3: Financial Visuals & Profile Health */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Owing vs Paid Bar Chart */}
                <div className="premium-card p-8 min-h-[300px]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] leading-none">Money Overview (Fees)</h3>
                    </div>
                    <div className="flex h-40 gap-4 items-end mt-8">
                        <div className="flex-1 flex flex-col items-center gap-2">
                            <motion.div 
                                initial={{ height: 0 }} animate={{ height: '100%' }}
                                className="w-full bg-[var(--primary-light)] rounded-xl relative overflow-hidden flex items-end justify-center"
                            >
                                <div className="absolute inset-0 bg-[var(--primary)] opacity-10" />
                                <span className="text-[10px] font-black text-[var(--primary)] mb-2 drop-shadow-sm">₦{stats?.totalOwing?.toLocaleString()}</span>
                            </motion.div>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Owed</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center gap-2">
                            <motion.div 
                                initial={{ height: 0 }} animate={{ height: '30%' }}
                                className="w-full bg-[var(--sidebar-bg)] rounded-xl border border-[var(--border-color)] flex items-end justify-center"
                            >
                                <span className="text-[10px] font-black text-foreground mb-2">₦{stats?.totalPaid?.toLocaleString()}</span>
                            </motion.div>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Paid</span>
                        </div>
                    </div>
                </div>

                {/* Profile Completion */}
                <div className="premium-card p-8 flex flex-col gap-6">
                    <p className="text-[11px] font-bold text-slate-400 italic">Profile Check: {stats?.incompleteProfiles} students need more info</p>
                    <div className="flex justify-around items-center flex-1">
                        <CircularProgress 
                            percentage={stats?.totalStudents ? (stats.whatsappFilled / stats.totalStudents) * 100 : 0} 
                            label="Has WhatsApp" 
                            sublabel={stats?.whatsappFilled}
                            size={100}
                            color="text-emerald-500"
                        />
                        <CircularProgress 
                            percentage={stats?.totalStudents ? (stats.emailsFilled / stats.totalStudents) * 100 : 0} 
                            label="Has Email" 
                            sublabel={stats?.emailsFilled}
                            size={100}
                            color="text-indigo-500"
                        />
                    </div>
                </div>
            </div>

            {/* Inactive Debt Overlay (Small Card) */}
            <div className="premium-card p-6 bg-[var(--secondary-light)] border-[var(--secondary)] flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--secondary)] flex items-center justify-center text-white shadow-lg">
                        <Zap className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-foreground tracking-tighter">₦{(stats?.inactiveDebtSum || 0).toLocaleString()}</p>
                        <p className="text-[10px] font-black text-[var(--secondary)] uppercase tracking-widest">Money Owed by Old Students</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[var(--secondary)] animate-pulse" />
                    <span className="text-[9px] font-black text-slate-400 uppercase">Alert</span>
                </div>
            </div>
        </div>

        {/* Side Lists: Sections & Levels */}
        <div className="xl:col-span-3 space-y-6">
            <div className="premium-card p-6 h-full flex flex-col max-h-[800px]">
                <div className="space-y-6 flex-1 overflow-hidden flex flex-col">
                    <div>
                        <h3 className="text-[11px] font-black text-[var(--primary)] uppercase tracking-widest mb-4 border-b border-[var(--border-color)] pb-2">Class Groups</h3>
                        <div className="space-y-3 overflow-y-auto max-h-[220px] pr-2 custom-scrollbar">
                            {stats?.sections?.map((item: any, i: number) => (
                                <div key={i} className="flex justify-between items-center group cursor-pointer hover:translate-x-1 transition-transform">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                                        <p className="text-[11px] font-bold text-foreground opacity-80 group-hover:text-[var(--primary)] transition-colors">{item.name}</p>
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400">({item.count})</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col overflow-hidden">
                        <h3 className="text-[11px] font-black text-[var(--secondary)] uppercase tracking-widest mb-4 border-b border-[var(--border-color)] pb-2 mt-4">Grade Levels</h3>
                        <div className="space-y-2 overflow-y-auto pr-2 custom-scrollbar grid grid-cols-2 gap-x-4">
                            {stats?.levels?.map((item: any, i: number) => (
                                <div key={i} className="flex justify-between items-center group py-1.5 border-b border-[var(--border-color)]/30 hover:bg-[var(--primary-light)] px-1 rounded-lg transition-all">
                                    <p className="text-[10px] font-bold text-foreground opacity-80 truncate max-w-[80px]">{item.name}</p>
                                    <span className="text-[9px] font-black text-slate-400">({item.count})</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                
                <div className="mt-8 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        <span>Connection Active</span>
                        <span>v2.5.0</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
