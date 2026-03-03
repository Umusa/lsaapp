"use client";

import { useEffect, useState, use } from "react";
import { 
    ArrowLeft, 
    Search, 
    FileDown, 
    MoreHorizontal,
    UserPlus,
    Filter,
    ChevronDown,
    Calendar,
    Mail,
    Phone,
    CreditCard,
    CheckCircle2,
    XCircle,
    GraduationCap,
    Clock,
    Users
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "@/components/ui/loader";
import { cn } from "@/lib/utils";

export default function LevelStudentsPage({ params }: { params: Promise<{ level: string }> }) {
    const resolvedParams = use(params);
    const level = decodeURIComponent(resolvedParams.level);
    const router = useRouter();
    const [students, setStudents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState("");

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
            // Check cache for instant load
            const cacheKey = `students_level_${level}_${org}`;
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
                setStudents(JSON.parse(cached));
                setIsLoading(false);
            } else {
                setIsLoading(true);
            }

            const res = await fetch(`/api/students?org=${encodeURIComponent(org)}`);
            const data = await res.json();
            const levelStudents = (data.students || []).filter((s: any) => s.cr69d_level === level);
            
            setStudents(levelStudents);
            localStorage.setItem(cacheKey, JSON.stringify(levelStudents));
        } catch (err) {
            console.error("Failed to fetch students:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredStudents = students.filter(student => 
        student.cr69d_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.cr69d_emailaddress?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) return (
        <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
            <Loader />
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Downloading Class Registry...</p>
        </div>
    );

    return (
        <div className="p-4 sm:p-8 space-y-8 animate-in fade-in duration-500">
            {/* Context Navigation */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => router.push('/dashboard/students')}
                        className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all shadow-sm group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-black text-slate-800 tracking-tighter">{level}</h1>
                            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-lg">
                                Academic Year 2025/26
                            </span>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            Registry Database • {students.length} Total Scholars Registered
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <button className="h-12 px-6 bg-white border border-slate-100 text-slate-600 text-xs font-black rounded-2xl flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
                        <FileDown className="w-4 h-4" /> Export Level
                    </button>
                    <button className="h-12 px-6 bg-indigo-600 text-white text-xs font-black rounded-2xl flex items-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-indigo-600/20">
                        <UserPlus className="w-4 h-4" /> Register Student
                    </button>
                </div>
            </div>

            {/* Premium Table Content */}
            <div className="premium-card overflow-hidden">
                <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="relative w-full md:max-w-md group">
                        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-600 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search by scholar name, email, or ID..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-11 pl-11 pr-4 bg-white border border-slate-100 rounded-xl text-xs font-bold focus:border-indigo-600/30 transition-all outline-none"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <Clock className="w-4 h-4" />
                            Last Sync: Just Now
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-50">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Scholar Profile</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Contact Info</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">System Status</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] text-right">Account Balance</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] text-right">Management</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-32 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center">
                                                <Users className="w-10 h-10 text-slate-200" />
                                            </div>
                                            <p className="text-slate-400 font-black text-xs uppercase tracking-widest">No scholars matching your query</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredStudents.map((student, i) => {
                                    const balance = parseFloat(String(student.cr69d_totaloutstanding || '0').replace(/[^0-9.-]+/g, '')) || 0;
                                    const isActive = String(student.cr69d_studentactive).toLowerCase() === 'true';

                                    return (
                                        <motion.tr 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.03 }}
                                            key={i} 
                                            className="group hover:bg-[var(--primary-light)]/30 transition-colors"
                                        >
                                            <td className="px-8 py-5 cursor-pointer" onClick={() => router.push(`/dashboard/students/details/${student.cr69d_studentid}`)}>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center text-indigo-600 font-black text-xs shadow-sm ring-1 ring-indigo-200/50 group-hover:scale-105 transition-transform">
                                                        {(student.cr69d_title || 'S').charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-slate-800 tracking-tight leading-none mb-1 group-hover:text-indigo-600 transition-colors">
                                                            {student.cr69d_title || 'Unknown Scholar'}
                                                        </p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                                            {student.cr69d_gender || 'Unspecified Gender'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex flex-col gap-1.5">
                                                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600">
                                                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                                                        {student.cr69d_emailaddress || 'No email registered'}
                                                    </div>
                                                    {student.cr69d_phonenumber && (
                                                        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600">
                                                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                                                            {student.cr69d_phonenumber}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className={cn(
                                                    "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border",
                                                    isActive 
                                                        ? "bg-emerald-50 border-emerald-100 text-emerald-600" 
                                                        : "bg-slate-50 border-slate-100 text-slate-400"
                                                )}>
                                                    {isActive ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <XCircle className="w-3.5 h-3.5" />}
                                                    <span className="text-[10px] font-black uppercase tracking-widest ring-emerald-400">
                                                        {isActive ? 'Verified Active' : 'Suspended'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex flex-col items-end">
                                                    <p className={cn(
                                                        "text-base font-black tracking-tighter",
                                                        balance > 0 ? "text-rose-600" : "text-emerald-600"
                                                    )}>
                                                        ₦{balance.toLocaleString()}
                                                    </p>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                                                        {balance > 0 ? "Outstanding Debt" : "Clear Account"}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-indigo-600 flex items-center justify-center transition-all border border-slate-100">
                                                        <CreditCard className="w-4 h-4" />
                                                    </button>
                                                    <button className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-indigo-600 flex items-center justify-center transition-all border border-slate-100">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-6 bg-slate-50/30 border-t border-slate-50 flex items-center justify-between">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                         Live Synchronization with {userData?.organisation || "Institutional"} Database
                    </p>
                    <div className="flex items-center gap-4">
                        <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">
                            Request Batch Update
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
