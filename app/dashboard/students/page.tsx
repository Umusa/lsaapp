"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import StudentModal from "./_components/student-modal";

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
            <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--primary-light)] rounded-full -mr-12 -mt-12 transition-transform duration-500 group-hover:scale-150 group-hover:bg-[var(--primary)]/10" />
            
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--card-bg)] shadow-sm flex items-center justify-center text-[var(--primary)] border border-[var(--border-color)] group-hover:border-[var(--primary)] transition-colors">
                        <GraduationCap className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-2xl font-black text-foreground tracking-tighter">{level.count}</span>
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
                    {level.photos && level.photos.length > 0 ? (
                        level.photos.slice(0, 3).map((photo: string, i: number) => (
                            <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                                <img src={photo} alt="" className="w-full h-full object-cover" />
                            </div>
                        ))
                    ) : (
                        [1, 2, 3].map((i) => (
                            <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                                <Users className="w-3 h-3 text-slate-400" />
                            </div>
                        ))
                    )}
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

import { Suspense } from "react";

function StudentsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialSearch = searchParams.get('search') || "";
    
    const [students, setStudents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [selectedLevel, setSelectedLevel] = useState("All Levels");
    const [showDebtors, setShowDebtors] = useState(false);
    const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUserData(parsedUser);
            const org = parsedUser.instuCode || parsedUser.organisation;
            fetchStudents(org);
        }
    }, [initialSearch]);

    const fetchStudents = async (org: string, force = false) => {
        try {
            // Check client-side cache first for instant load
            const cacheKey = `students_cache_${org}`;
            if (!force) {
                const cachedData = localStorage.getItem(cacheKey);
                if (cachedData) {
                    setStudents(JSON.parse(cachedData));
                    setIsLoading(false);
                } else {
                    setIsLoading(true);
                }
            } else {
                setIsLoading(true);
            }

            const res = await fetch(`/api/students?org=${encodeURIComponent(org)}&refresh=${force}`);
            const data = await res.json();
            
            if (data.students) {
                setStudents(data.students);
                localStorage.setItem(cacheKey, JSON.stringify(data.students));
            }
        } catch (err) {
            console.error("Failed to fetch students:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEnroll = async (id: string | null, data: any) => {
        const org = userData.instuCode || userData.organisation;
        const res = await fetch('/api/students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...data, cr69d_instucode: org })
        });
        
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Enrollment failed");
        }
        
        // Refresh data with force true
        fetchStudents(org, true);
    };

    const studentsByLevel = students.reduce((acc: any, student: any) => {
        const level = student.cr69d_level || "Unknown Level";
        if (!acc[level]) {
            acc[level] = {
                name: level,
                category: student.cr69d_section || "Academic Section",
                count: 0,
                hasDebtors: false,
                photos: []
            };
        }
        acc[level].count++;
        if (student.cr69d_photo && acc[level].photos.length < 5) {
            acc[level].photos.push(student.cr69d_photo);
        }
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
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Finding student records...</p>
        </div>
    );

    return (
        <div className="p-4 sm:p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header with Stats Overlay */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-foreground tracking-tighter">All Students</h1>
                    <p className="text-[10px] font-black text-[var(--primary)] uppercase tracking-[0.2em] opacity-80 decoration-[var(--primary)]/30 underline-offset-4 underline">
                        School Records • {students.length} Total Students
                    </p>
                </div>
                
                <div className="flex items-center gap-3">
                    <button className="h-12 px-6 bg-[var(--card-bg)] border border-[var(--border-color)] text-slate-600 text-xs font-black rounded-2xl flex items-center gap-2 hover:bg-[var(--background)] transition-all shadow-sm">
                        <FileDown className="w-4 h-4" /> Save Records
                    </button>
                    <button 
                        onClick={() => setIsEnrollModalOpen(true)}
                        className="h-12 px-6 bg-[var(--primary)] text-white text-xs font-black rounded-2xl flex items-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-[var(--primary)]/20"
                    >
                        <Plus className="w-4 h-4" /> Add New Student
                    </button>
                </div>
            </div>

            {/* Quick Insights Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="premium-card p-6 bg-[var(--primary-light)] border-[var(--primary)]/10 shadow-none flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--primary)] flex items-center justify-center text-white shadow-lg">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-[var(--primary)] uppercase tracking-widest leading-none">All Students</p>
                        <p className="text-2xl font-black text-foreground tracking-tight">{students.length}</p>
                    </div>
                </div>
                <div className="premium-card p-6 bg-[var(--success-light)] border-[var(--success)]/10 shadow-none flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--success)] flex items-center justify-center text-white shadow-lg">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-[var(--success)] uppercase tracking-widest leading-none">Number of Classes</p>
                        <p className="text-2xl font-black text-foreground tracking-tight">{Object.keys(studentsByLevel).length}</p>
                    </div>
                </div>
                <div className="premium-card p-6 bg-[var(--secondary-light)] border-[var(--secondary)]/10 shadow-none flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--secondary)] flex items-center justify-center text-white shadow-lg">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-[var(--secondary)] uppercase tracking-widest leading-none">Attendance</p>
                        <p className="text-2xl font-black text-foreground tracking-tight">84%</p>
                    </div>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="premium-card p-4 flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-1 group">
                    <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-[var(--primary)] transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Filter by class or grade..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-11 pl-11 pr-4 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-xs font-bold focus:bg-[var(--card-bg)] focus:border-[var(--primary)]/30 transition-all outline-none"
                    />
                </div>
                
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setShowDebtors(!showDebtors)}
                        className={cn(
                            "h-11 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                            showDebtors ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30" : "bg-[var(--background)] text-slate-400 border border-[var(--border-color)]"
                        )}
                    >
                        <Filter className="w-4 h-4" /> Only Students with Fees
                    </button>
                    
                    <div className="h-11 px-4 bg-[var(--background)] border border-[var(--border-color)] rounded-xl flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Current Year 2025/26</span>
                    </div>

                    <button 
                        onClick={() => {
                            setSearchQuery("");
                            setSelectedLevel("All Levels");
                            setShowDebtors(false);
                            const org = userData?.instuCode || userData?.organisation;
                            if (org) fetchStudents(org, true);
                        }}
                        className="h-11 px-4 bg-[var(--background)] hover:bg-[var(--primary-light)] text-slate-400 hover:text-[var(--primary)] border border-[var(--border-color)] rounded-xl flex items-center justify-center gap-2 transition-all font-black text-[10px] uppercase tracking-widest"
                        title="Force refresh registry"
                    >
                        <RotateCcw className="w-4 h-4" />
                        <span>Update Current State</span>
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                    {levelsArray.length === 0 ? (
                        <div className="col-span-full py-32 flex flex-col items-center gap-4">
                            <div className="w-24 h-24 bg-[var(--background)] rounded-[2.5rem] flex items-center justify-center">
                                <Search className="w-10 h-10 text-slate-200" />
                            </div>
                            <p className="text-slate-400 font-black text-xs uppercase tracking-widest">No students found</p>
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
                <div className="px-6 py-3 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl shadow-sm text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                        Showing {levelsArray.length} Classes • {userData?.organisation || "LSA"} Secure System
                    </p>
                </div>
            </div>

            {isEnrollModalOpen && (
                <StudentModal 
                    org={userData?.instuCode || userData?.organisation}
                    isOpen={isEnrollModalOpen}
                    onClose={() => setIsEnrollModalOpen(false)}
                    onSave={handleEnroll}
                    availableClasses={Object.values(studentsByLevel).map((l: any) => ({ name: l.name, count: l.count })).sort((a, b) => a.name.localeCompare(b.name))}
                />
            )}
        </div>
    );
}

export default function StudentsPage() {
    return (
        <Suspense fallback={
            <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
                <Loader />
                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Preparing students page...</p>
            </div>
        }>
            <StudentsContent />
        </Suspense>
    );
}
