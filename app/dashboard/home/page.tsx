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

const StatCard = ({ title, value, icon: Icon, trend, color, subtext, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="premium-card p-6 flex flex-col justify-between"
  >
    <div className="flex justify-between items-start">
      <div className={cn("p-3 rounded-2xl", color)}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      {trend && (
        <span className="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-widest">
          <ArrowUpRight className="w-3 h-3" /> {trend}
        </span>
      )}
    </div>
    <div className="mt-6">
      <h3 className="text-3xl font-black text-slate-800 tracking-tighter">{value}</h3>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{title}</p>
      {subtext && <p className="text-[10px] text-slate-400 mt-0.5 italic">{subtext}</p>}
    </div>
  </motion.div>
);

const DashboardHome = () => {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async (org: string) => {
    try {
      // Check cache first for instant load
      const cached = localStorage.getItem(`dashboard_stats_${org}`);
      if (cached) {
        setStats(JSON.parse(cached));
        setIsLoading(false);
      } else {
        setIsLoading(true);
      }

      const res = await fetch(`/api/dashboard/stats?org=${encodeURIComponent(org)}`);
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

  const pieData = useMemo(() => [
    { name: 'Male', value: stats?.genderRatio?.male || 0 },
    { name: 'Female', value: stats?.genderRatio?.female || 0 },
  ], [stats]);

  if (isLoading) return (
    <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
        <Loader />
        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">Syncing Academic Intelligence...</p>
    </div>
  );

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 pb-12 animate-in fade-in duration-1000">
      
      {/* Premium Hero Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative min-h-[420px] rounded-[2.5rem] overflow-hidden group shadow-2xl flex items-center"
      >
        <img 
          src="/images/school_dashboard_banner_1772536875991.png" 
          alt="School"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/70 to-transparent p-8 md:p-12 min-h-full flex flex-col justify-center">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="max-w-xl relative z-10"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs font-black text-white/80 uppercase tracking-[0.2em] bg-white/5 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
                        Academic Intelligence v2.0
                    </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4 leading-tight">
                    Unlocking <span className="text-indigo-400">Potential,</span><br className="hidden md:block" />Creating Leaders.
                </h1>
                <p className="text-slate-300 text-base md:text-lg font-medium mb-8 leading-relaxed opacity-80 decoration-indigo-500/30 underline-offset-4 underline">
                    {user?.organisation || "LSA School"} is currently managing <span className="text-white font-bold">{stats?.totalStudents || 0}</span> bright students across <span className="text-white font-bold">{stats?.levels?.length || 0}</span> grade levels.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                    <button className="h-14 px-8 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-600/30 flex items-center gap-3">
                        Launch Rapid Registration <ChevronRight className="w-4 h-4" />
                    </button>
                    <button onClick={() => fetchStats(user?.instuCode || user?.organisation)} className="h-14 w-14 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center text-white transition-all">
                        <RefreshCw className="w-5 h-5 transition-transform hover:rotate-180 duration-500" />
                    </button>
                </div>
            </motion.div>
        </div>
      </motion.div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
            title="Active Intelligence" 
            value={stats?.totalStudents || 0} 
            icon={Users} 
            trend="+12%" 
            color="bg-indigo-500 shadow-indigo-200 shadow-lg" 
            subtext={`${Math.round(stats?.activePercentage || 0)}% enrollment active`}
            delay={0.1}
        />
        <StatCard 
            title="Financial Liquidity" 
            value={`₦${(stats?.inactiveDebtSum || 0).toLocaleString()}`} 
            icon={CreditCard} 
            trend="-3%" 
            color="bg-emerald-500 shadow-emerald-200 shadow-lg" 
            subtext="Inactive accounts debt sum"
            delay={0.2}
        />
        <StatCard 
            title="Communications" 
            value={stats?.whatsappFilled || 0} 
            icon={MessageSquare} 
            trend="+5%" 
            color="bg-amber-500 shadow-amber-200 shadow-lg" 
            subtext="Verified WhatsApp connections"
            delay={0.3}
        />
        <StatCard 
            title="Logistics Reach" 
            value={stats?.busSubscribers || 0} 
            icon={Bus} 
            color="bg-rose-500 shadow-rose-200 shadow-lg" 
            subtext="Enrolled in transport services"
            delay={0.4}
        />
      </div>

      {/* Analytics Visualization Section */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Enrollment Distribution Chart */}
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="xl:col-span-8 premium-card p-8"
        >
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-indigo-500" /> Grade Distribution
                    </h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Student density per academic level</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-500" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Enrollment Count</span>
                </div>
            </div>
            
            <div className="h-[400px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats?.levels}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} 
                            interval={0}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                        />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                        <Tooltip 
                            cursor={{ fill: '#4F46E5', opacity: 0.05 }}
                            contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '12px' }}
                            labelStyle={{ fontWeight: 900, fontSize: '12px', marginBottom: '4px', color: '#1e293b' }}
                        />
                        <Bar 
                            dataKey="count" 
                            fill="#4F46E5" 
                            radius={[8, 8, 0, 0]} 
                            barSize={40}
                            animationBegin={1000}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>

        {/* Demographics & Insights */}
        <div className="xl:col-span-4 space-y-8">
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="premium-card p-8 flex flex-col items-center"
            >
                <div>
                    <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2 mb-1">
                        <PieChartIcon className="w-5 h-5 text-indigo-500" /> Demographics
                    </h3>
                </div>
                
                <div className="h-64 w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={8}
                                dataKey="value"
                                animationBegin={1500}
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-2xl font-black text-slate-800 leading-none">{stats?.totalStudents || 0}</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">Total</span>
                    </div>
                </div>

                <div className="flex gap-8 mt-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-indigo-500" />
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Male</p>
                            <p className="text-lg font-black text-slate-800">{(stats?.genderRatio?.male || 0)}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Female</p>
                            <p className="text-lg font-black text-slate-800">{(stats?.genderRatio?.female || 0)}</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Verification Status Card */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden group shadow-2xl"
            >
                <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/20 rounded-full -mr-20 -mt-20 blur-3xl transform group-hover:scale-110 transition-transform duration-700" />
                <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                            <ShieldCheck className="w-5 h-5 text-indigo-400" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-200">System Integrity</span>
                    </div>
                    <h4 className="text-2xl font-black tracking-tighter leading-tight">Data Health & <br/>Profile Completion</h4>
                    <div className="space-y-4">
                        <div className="flex justify-between items-end text-xs font-black uppercase tracking-wider text-slate-400">
                             <span>Profile Verification</span>
                             <span className="text-indigo-400">76%</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: '76%' }}
                                transition={{ duration: 1.5, delay: 1 }}
                                className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400" 
                            />
                        </div>
                        <p className="text-[10px] text-slate-400 italic">
                            {stats?.incompleteProfiles || 0} student profiles require attention for full digital verification.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
      </div>

    </div>
  );
};

export default DashboardHome;
