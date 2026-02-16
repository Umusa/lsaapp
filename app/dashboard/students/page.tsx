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
    ArrowLeft
} from "lucide-react";
import Loader from "@/components/ui/loader";
import { cn } from "@/lib/utils";

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
            setIsLoading(true);
            const res = await fetch(`/api/students?org=${encodeURIComponent(org)}`);
            const data = await res.json();
            setStudents(data.students || []);
        } catch (err) {
            console.error("Failed to fetch students:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Group students by level
    const studentsByLevel = students.reduce((acc: any, student: any) => {
        const level = student.cr69d_level || "Unknown Level";
        if (!acc[level]) {
            acc[level] = {
                name: level,
                category: student.cr69d_section || "General", // Assuming section/category logic
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

    return (
        <div className="flex h-[calc(100vh-64px)] bg-[#F8FAFC]">
            {/* Sidebar Filters */}
            <div className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col gap-6 overflow-y-auto">
                <div className="flex items-center gap-2 text-[#2563eb] mb-2">
                    <Search className="w-5 h-5" />
                    <span className="font-bold text-lg">Search</span>
                </div>

                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Search Name</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-10 px-3 bg-slate-50 border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                placeholder="..."
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Select Level</label>
                        <div className="relative">
                            <select 
                                value={selectedLevel}
                                onChange={(e) => setSelectedLevel(e.target.value)}
                                className="w-full h-10 px-3 bg-slate-50 border-none rounded-lg text-sm outline-none appearance-none cursor-pointer"
                            >
                                <option>All Levels</option>
                                {Object.keys(studentsByLevel).map(lvl => (
                                    <option key={lvl} value={lvl}>{lvl}</option>
                                ))}
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Start Date</label>
                            <div className="h-10 px-2 bg-slate-50 rounded-lg flex items-center justify-between text-[10px] text-slate-600">
                                <span>Jan 25, 2011</span>
                                <Calendar className="w-3 h-3 text-slate-400" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">End Date</label>
                            <div className="h-10 px-2 bg-slate-50 rounded-lg flex items-center justify-between text-[10px] text-slate-600">
                                <span>Feb 15, 2026</span>
                                <Calendar className="w-3 h-3 text-slate-400" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 pt-2">
                        <p className="text-[12px] font-black text-slate-800 uppercase tracking-tighter">Status</p>
                        <div className="relative">
                            <select className="w-full h-10 px-3 bg-slate-50 border-none rounded-lg text-sm outline-none appearance-none cursor-pointer text-slate-400 italic">
                                <option>Select status</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>

                    <div className="space-y-4 pt-2">
                        <div className="flex items-center justify-between group">
                            <div className="flex items-center gap-2">
                                <span className="text-[11px] font-bold text-slate-600">Debtors</span>
                                <div className="w-2 h-2 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
                            </div>
                            <button 
                                onClick={() => setShowDebtors(!showDebtors)}
                                className={cn(
                                    "w-10 h-5 rounded-full transition-all relative flex items-center px-1",
                                    showDebtors ? "bg-blue-600" : "bg-slate-200"
                                )}
                            >
                                <div className={cn(
                                    "w-3 h-3 bg-white rounded-full transition-all shadow-sm",
                                    showDebtors ? "translate-x-5" : "translate-x-0"
                                )} />
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-400">Show debtors only</span>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <span className="text-[11px] font-bold text-slate-600">Filter by due date</span>
                            <button className="w-10 h-5 bg-slate-200 rounded-full relative flex items-center px-1">
                                <div className="w-3 h-3 bg-white rounded-full shadow-sm" />
                            </button>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">Due date filter disabled</span>
                    </div>
                </div>

                <div className="mt-auto flex justify-center pt-8">
                    <button 
                        onClick={() => {
                            setSearchQuery("");
                            setSelectedLevel("All Levels");
                            setShowDebtors(false);
                        }}
                        className="p-3 text-[#2563eb] bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
                    >
                        <RotateCcw className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-20 bg-white border-b border-slate-100 px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button className="p-2 -ml-2 text-slate-400 hover:text-slate-600 bg-slate-50 border border-slate-200 rounded-lg">
                            <ArrowLeft className="w-4 h-4" />
                        </button>
                        <h1 className="text-xl font-black text-slate-800 tracking-tight">Student List</h1>
                    </div>
                    
                    <div className="flex flex-col items-end">
                        <p className="text-[12px] font-bold text-slate-800">
                            Support ({userData?.organisation || "School"})
                        </p>
                        <p className="text-[11px] text-blue-600 font-bold">15 Feb 2026</p>
                    </div>
                </header>

                <main className="flex-1 p-6 overflow-y-auto">
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col h-full min-h-[600px]">
                        {/* Toolbar */}
                        <div className="p-4 border-b border-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors">
                                    <Plus className="w-5 h-5" />
                                </button>
                                <div className="h-6 w-[1px] bg-slate-100 mx-2" />
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <button className="h-10 px-6 bg-[#F8FAFC] border border-slate-100 text-[#1E293B] text-[11px] font-black rounded-xl flex items-center gap-2 hover:bg-white transition-all shadow-sm">
                                    <FileDown className="w-4 h-4" /> Download (CSV)
                                </button>
                                <button className="w-10 h-10 rounded-xl bg-[#2563eb] text-white flex items-center justify-center shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition-all">
                                    <Search className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Grid */}
                        <div className="flex-1 p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-max">
                                {levelsArray.length === 0 ? (
                                    <div className="col-span-full py-32 flex flex-col items-center gap-4">
                                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                                            <Users className="w-10 h-10 text-slate-200" />
                                        </div>
                                        <p className="text-slate-400 font-bold text-sm">No sections found matching your filters.</p>
                                    </div>
                                ) : (
                                    levelsArray.map((level: any, i) => (
                                        <div 
                                            key={i} 
                                            onClick={() => router.push(`/dashboard/students/${encodeURIComponent(level.name)}`)}
                                            className="group relative h-[100px] bg-blue-50/30 rounded-2xl border border-blue-100/50 p-5 flex items-center justify-between transition-all hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 cursor-pointer overflow-hidden"
                                        >
                                            <div className="absolute inset-0 opacity-[0.2] group-hover:opacity-[0.3] transition-opacity pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #2563eb 1px, transparent 0)', backgroundSize: '20px 20px' }} />
                                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            
                                            <div className="relative z-10 flex flex-col min-w-0">
                                                <h3 className="text-[15px] font-extrabold text-[#1E293B] truncate leading-tight mb-1 group-hover:text-blue-700 transition-colors">{level.name}</h3>
                                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{level.category}</p>
                                            </div>

                                            <div className="relative z-10 flex items-center gap-3">
                                                {level.hasDebtors && (
                                                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                                )}
                                                <div className="w-10 h-10 rounded-full bg-[#E2E8F0]/30 group-hover:bg-[var(--primary)] group-hover:text-white flex items-center justify-center text-[#475569] font-black text-sm transition-all shadow-inner">
                                                    {level.count}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

