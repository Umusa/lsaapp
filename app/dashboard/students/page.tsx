"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
    Search, 
    Plus, 
    FileDown, 
    Calendar, 
    ChevronDown, 
    RotateCcw,
    LayoutGrid,
    Users,
    ArrowLeft,
    Filter,
    GraduationCap,
    TrendingUp,
    Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "@/components/ui/loader";
import { cn } from "@/lib/utils";

const LevelCard = ({ level, delay }: any) => {
    const router = useRouter();
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay }}
            onClick={() => router.push(`/dashboard/students/${encodeURIComponent(level.name)}`)}
            className="premium-card p-6 cursor-pointer group relative overflow-hidden flex flex-col justify-between min-h-[160px]"
        >
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full -mr-12 -mt-12 transition-transform duration-500 group-hover:scale-150 group-hover:bg-indigo-100/50" />
            
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-indigo-600 border border-slate-100 group-hover:border-indigo-200 transition-colors">
                        <GraduationCap className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-2xl font-black text-slate-800 tracking-tighter">{level.count}</span>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Students</span>
                    </div>
                </div>
                
                <h3 className="text-lg font-black text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">
                    {level.name}
                </h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
                    {level.category || "General Academic"}
                </p>
            </div>

            <div className="relative z-10 mt-4 flex items-center justify-between">
                <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                            <Users className="w-3 h-3 text-slate-400" />
                        </div>
                    ))}
                    <div className="w-6 h-6 rounded-full border-2 border-white bg-indigo-50 flex items-center justify-center text-[8px] font-black text-indigo-600">
                        +
                    </div>
                </div>
                {level.hasDebtors && (
                    <span className="h-5 px-2 bg-rose-50 text-rose-600 text-[9px] font-black rounded-lg flex items-center gap-1 uppercase tracking-tighter">
                         Financial Alert
                    </span>
                )}
            </div>
        </motion.div>
    );
};

export default function StudentsPage() {
    const router = useRouter();
    const [students, setStudents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedLevel, setSelectedLevel] = useState("All Levels");
    const [showDebtors, setShowDebtors] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUserData(parsedUser);
            const org = parsedUser.instuCode || parsedUser.organisation;
            fetchStudents(org);
        }
    }, []);

    const fetchStudents = async (org: string) => {
        try {
            // Check client-side cache first for instant load
            const cachedData = localStorage.getItem(`students_cache_${org}`);
            if (cachedData) {
                setStudents(JSON.parse(cachedData));
                setIsLoading(false);
            } else {
                setIsLoading(true);
            }

            const res = await fetch(`/api/students?org=${encodeURIComponent(org)}`);
            const data = await res.json();
            
            if (data.students) {
                setStudents(data.students);
                localStorage.setItem(`students_cache_${org}`, JSON.stringify(data.students));
            }
        } catch (err) {
            console.error("Failed to fetch students:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const studentsByLevel = students.reduce((acc: any, student: any) => {
        const level = student.cr69d_level || "Unknown Level";
        if (!acc[level]) {
            acc[level] = {
                name: level,
                category: student.cr69d_section || "Academic Section",
                count: 0,
                hasDebtors: false
            };
        }
        acc[level].count++;
        const balance = parseFloat(String(student.cr69d_totaloutstanding || '0').replace(/[^0-9.-]+/g, '')) || 0;
        if (balance > 1) acc[level].hasDebtors = true;
        return acc;
    }, {});

    const levelsArray = Object.values(studentsByLevel).filter((level: any) => {
        const matchesName = level.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLevel = selectedLevel === "All Levels" || level.name === selectedLevel;
        const matchesDebtors = !showDebtors || level.hasDebtors;
        return matchesName && matchesLevel && matchesDebtors;
    });

    if (isLoading) return (
        <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
            <Loader />
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Mapping Student Database...</p>
        </div>
    );

    return (
        <div className="p-4 sm:p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header with Stats Overlay */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-slate-800 tracking-tighter">Student Registry</h1>
                    <p className="text-[10px] font-black text-[var(--primary)] uppercase tracking-[0.2em] opacity-80 decoration-indigo-500/30 underline-offset-4 underline">
                        Institutional Intelligence Hub • {students.length} Total Scholars
                    </p>
                </div>
                
                <div className="flex items-center gap-3">
                    <button className="h-12 px-6 bg-white border border-slate-100 text-slate-600 text-xs font-black rounded-2xl flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
                        <FileDown className="w-4 h-4" /> Export DB
                    </button>
                    <button className="h-12 px-6 bg-[var(--primary)] text-white text-xs font-black rounded-2xl flex items-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-indigo-500/20">
                        <Plus className="w-4 h-4" /> Enroll New
                    </button>
                </div>
            </div>

            {/* Quick Insights Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="premium-card p-6 bg-indigo-50/50 border-indigo-100 shadow-none flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest leading-none">Total Capacity</p>
                        <p className="text-2xl font-black text-slate-800 tracking-tight">{students.length}</p>
                    </div>
                </div>
                <div className="premium-card p-6 bg-emerald-50/50 border-emerald-100 shadow-none flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none">Active Sections</p>
                        <p className="text-2xl font-black text-slate-800 tracking-tight">{Object.keys(studentsByLevel).length}</p>
                    </div>
                </div>
                <div className="premium-card p-6 bg-amber-50/50 border-amber-100 shadow-none flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-600 flex items-center justify-center text-white shadow-lg">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest leading-none">Engagement</p>
                        <p className="text-2xl font-black text-slate-800 tracking-tight">84%</p>
                    </div>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="premium-card p-4 flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-1 group">
                    <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-600 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Filter by section or grade..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-11 pl-11 pr-4 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold focus:bg-white focus:border-indigo-600/30 transition-all outline-none"
                    />
                </div>
                
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setShowDebtors(!showDebtors)}
                        className={cn(
                            "h-11 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                            showDebtors ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30" : "bg-slate-50 text-slate-400 border border-slate-100"
                        )}
                    >
                        <Filter className="w-4 h-4" /> Financial Alerts Only
                    </button>
                    
                    <div className="h-11 px-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Academic Year 2025/26</span>
                    </div>

                    <button 
                        onClick={() => {
                            setSearchQuery("");
                            setSelectedLevel("All Levels");
                            setShowDebtors(false);
                        }}
                        className="w-11 h-11 bg-slate-50 hover:bg-slate-100 text-slate-400 border border-slate-100 rounded-xl flex items-center justify-center transition-all"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                    {levelsArray.length === 0 ? (
                        <div className="col-span-full py-32 flex flex-col items-center gap-4">
                            <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center">
                                <Search className="w-10 h-10 text-slate-200" />
                            </div>
                            <p className="text-slate-400 font-black text-xs uppercase tracking-widest">No matching registry sections found</p>
                        </div>
                    ) : (
                        levelsArray.map((level: any, i) => (
                            <LevelCard key={level.name} level={level} delay={i * 0.05} />
                        ))
                    )}
                </AnimatePresence>
            </div>
            
            {/* Footer Insights */}
            <div className="flex justify-center pt-12 pb-6">
                <div className="px-6 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                        Showing {levelsArray.length} Academic Sections • {userData?.organisation || "LSA"} Secure Cloud
                    </p>
                </div>
            </div>
        </div>
    );
}
