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
import StudentModal from "../_components/student-modal";
import { Edit2, Trash2 } from "lucide-react";

export default function LevelStudentsPage({ params }: { params: Promise<{ level: string }> }) {
    const resolvedParams = use(params);
    const level = decodeURIComponent(resolvedParams.level);
    const router = useRouter();
    const [students, setStudents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUserData(parsedUser);
            const org = parsedUser.instuCode || parsedUser.organisation;
            fetchStudents(org);
        }
    }, []);

    const fetchStudents = async (org: string, force = false) => {
        try {
            // Check cache for instant load
            const cacheKey = `students_level_${level}_${org}`;
            if (!force) {
                const cached = localStorage.getItem(cacheKey);
                if (cached) {
                    setStudents(JSON.parse(cached));
                    setIsLoading(false);
                } else {
                    setIsLoading(true);
                }
            } else {
                setIsLoading(true);
            }

            const res = await fetch(`/api/students?org=${encodeURIComponent(org)}&refresh=${force}`);
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

    const handleSave = async (id: string | null, data: any) => {
        const org = userData.instuCode || userData.organisation;
        const url = id ? '/api/students/crud' : '/api/students';
        const method = id ? 'PATCH' : 'POST';
        
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(id ? { id, data } : { ...data, cr69d_instucode: org })
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Operation failed");
        }

        fetchStudents(org, true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this student record?")) return;
        
        try {
            const res = await fetch(`/api/students/crud?id=${id}`, { method: 'DELETE' });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error);
            }
            const org = userData.instuCode || userData.organisation;
            fetchStudents(org);
        } catch (err: any) {
            alert("Error: " + err.message);
        }
    };

    const filteredStudents = students.filter(student => 
        student.cr69d_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.cr69d_emailaddress?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) return (
        <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
            <Loader />
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Loading class list...</p>
        </div>
    );

    return (
        <div className="p-4 sm:p-8 space-y-8 animate-in fade-in duration-500">
            {/* Context Navigation */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => router.push('/dashboard/students')}
                        className="w-12 h-12 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] flex items-center justify-center text-slate-400 hover:text-[var(--primary)] transition-all shadow-sm group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-black text-foreground tracking-tighter">{level}</h1>
                            <span className="px-3 py-1 bg-[var(--primary-light)] text-[var(--primary)] text-[10px] font-black uppercase tracking-widest rounded-lg">
                                Current Year 2025/26
                            </span>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            Student List • {students.length} Total Students
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <button className="h-12 px-6 bg-[var(--card-bg)] border border-[var(--border-color)] text-slate-600 text-xs font-black rounded-2xl flex items-center gap-2 hover:bg-[var(--background)] transition-all shadow-sm">
                        <FileDown className="w-4 h-4" /> Save Class List
                    </button>
                    <button 
                        onClick={() => {
                            setSelectedStudent(null);
                            setIsModalOpen(true);
                        }}
                        className="h-12 px-6 bg-[var(--primary)] text-white text-xs font-black rounded-2xl flex items-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-[var(--primary)]/20"
                    >
                        <UserPlus className="w-4 h-4" /> Add Student
                    </button>
                </div>
            </div>

            {/* Premium Table Content */}
            <div className="premium-card overflow-hidden">
                <div className="p-6 border-b border-[var(--border-color)] bg-[var(--background)] flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="relative w-full md:max-w-md group">
                        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-[var(--primary)] transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Find a student..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-11 pl-11 pr-4 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl text-xs font-bold focus:border-[var(--primary)]/30 transition-all outline-none"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <Clock className="w-4 h-4" />
                            Connected: Just Now
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[var(--border-color)]">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Student Name</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Contact Info</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] text-right">Fees Owed</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-color)]">
                            {filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-32 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-20 h-20 bg-[var(--background)] rounded-[2rem] flex items-center justify-center">
                                                <Users className="w-10 h-10 text-slate-200" />
                                            </div>
                                            <p className="text-slate-400 font-black text-xs uppercase tracking-widest">No students found</p>
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
                                                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[var(--primary-light)] to-[var(--primary)]/20 flex items-center justify-center text-[var(--primary)] font-black text-xs shadow-sm ring-1 ring-[var(--primary)]/10 group-hover:scale-105 transition-transform overflow-hidden">
                                                        {student.cr69d_photo ? (
                                                            <img src={student.cr69d_photo} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            (student.cr69d_title || 'S').charAt(0).toUpperCase()
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-foreground tracking-tight leading-none mb-1 group-hover:text-[var(--primary)] transition-colors">
                                                            {student.cr69d_title || 'Unknown Student'}
                                                        </p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                                            {student.cr69d_gender || 'Not set'}
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
                                                        ? "bg-emerald-50/50 border-emerald-100/50 text-emerald-600" 
                                                        : "bg-slate-50/50 border-slate-100/50 text-slate-400"
                                                )}>
                                                    {isActive ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <XCircle className="w-3.5 h-3.5" />}
                                                    <span className="text-[10px] font-black uppercase tracking-widest ring-emerald-400">
                                                        {isActive ? 'Active' : 'Not Active'}
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
                                                        {balance > 0 ? "Still Owed" : "All Paid"}
                                                    </p>
                                                </div>
                                            </td>
                                                 <td className="px-8 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button 
                                                        onClick={() => {
                                                            setSelectedStudent(student);
                                                            setIsModalOpen(true);
                                                        }}
                                                        className="w-10 h-10 rounded-xl bg-[var(--background)] hover:bg-[var(--primary-light)] text-slate-400 hover:text-[var(--primary)] flex items-center justify-center transition-all border border-[var(--border-color)]"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(student.cr69d_studentid)}
                                                        className="w-10 h-10 rounded-xl bg-[var(--background)] hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-all border border-[var(--border-color)]"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
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

                <div className="p-6 bg-[var(--background)] border-t border-[var(--border-color)] flex items-center justify-between">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                         Connected to {userData?.organisation || "School"} Database
                    </p>
                    <div className="flex items-center gap-4">
                        <button className="text-[10px] font-black text-[var(--primary)] uppercase tracking-widest hover:underline">
                            Update All
                        </button>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <StudentModal 
                    org={userData?.instuCode || userData?.organisation}
                    student={selectedStudent}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                    availableClasses={Object.values(
                        students.reduce((acc: Record<string, { name: string, count: number }>, s: any) => {
                            const l = s.cr69d_level || "Unknown";
                            if (!acc[l]) acc[l] = { name: l, count: 0 };
                            acc[l].count++;
                            return acc;
                        }, {} as Record<string, { name: string, count: number }>)
                    ).sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name))}
                />
            )}
        </div>
    );
}
