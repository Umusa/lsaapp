"use client";

import { useEffect, useState, use } from "react";
import { 
    ArrowLeft, 
    Search, 
    FileDown, 
    MoreHorizontal,
    UserPlus,
    Filter,
    ChevronDown
} from "lucide-react";
import { useRouter } from "next/navigation";
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
            setIsLoading(true);
            const res = await fetch(`/api/students?org=${encodeURIComponent(org)}`);
            const data = await res.json();
            // Filter only students for this level
            const levelStudents = (data.students || []).filter((s: any) => s.cr69d_level === level);
            setStudents(levelStudents);
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

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] bg-[#F8FAFC]">
            {/* Header */}
            <header className="h-20 bg-white border-b border-slate-100 px-8 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => router.push('/dashboard/students')}
                        className="p-2 -ml-2 text-slate-400 hover:text-slate-600 bg-slate-50 border border-slate-200 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div>
                        <h1 className="text-xl font-black text-slate-800 tracking-tight">{level}</h1>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Student Database • {students.length} Records
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <button className="h-10 px-4 bg-white border border-slate-200 text-slate-700 text-[11px] font-black rounded-xl flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
                        <FileDown className="w-4 h-4" /> Export
                    </button>
                    <button className="h-10 px-4 bg-[#2563eb] text-white text-[11px] font-black rounded-xl flex items-center gap-2 hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20">
                        <UserPlus className="w-4 h-4" /> Add Student
                    </button>
                </div>
            </header>

            {/* Main Table Area */}
            <main className="flex-1 p-6 overflow-hidden flex flex-col">
                <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col flex-1 overflow-hidden">
                    {/* Table Toolbar */}
                    <div className="p-4 border-b border-slate-50 flex items-center justify-between gap-4 shrink-0">
                        <div className="flex-1 max-w-md relative">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input 
                                type="text" 
                                placeholder="Filter by name or email..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-10 pl-10 pr-4 bg-slate-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="h-10 px-4 bg-slate-50 text-slate-600 text-[11px] font-bold rounded-xl flex items-center gap-2 hover:bg-slate-100 transition-all">
                                <Filter className="w-3.5 h-3.5" /> Filters
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="flex-1 overflow-y-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="sticky top-0 z-20 bg-white/80 backdrop-blur-md">
                                <tr className="border-b border-slate-50">
                                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Student Name</th>
                                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Gender</th>
                                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Status</th>
                                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap text-right">Balance</th>
                                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 px-4">
                                {filteredStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-32 text-center text-slate-400 font-bold text-sm">
                                            No students found in this level.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredStudents.map((student, i) => {
                                        const balance = parseFloat(String(student.cr69d_wallectbalance || '0').replace(/[^0-9.-]+/g, '')) || 0;
                                        const isActive = String(student.cr69d_studentactive).toLowerCase() === 'true';

                                        return (
                                            <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                                                <td className="px-8 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs shadow-sm ring-1 ring-blue-100">
                                                            {(student.cr69d_title || 'S').charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-black text-slate-800 truncate leading-none mb-1">
                                                                {student.cr69d_title || 'Unknown Student'}
                                                            </p>
                                                            <p className="text-[10px] text-slate-400 font-bold truncate">
                                                                {student.cr69d_emailaddress || 'no-email@school.com'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-4">
                                                    <span className="text-[10px] font-black px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg uppercase tracking-tight">
                                                        {student.cr69d_gender || 'Unspecified'}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className={cn(
                                                            "w-1.5 h-1.5 rounded-full",
                                                            isActive ? "bg-emerald-500 shadow-sm shadow-emerald-500/50" : "bg-slate-300"
                                                        )} />
                                                        <span className={cn(
                                                            "text-[10px] font-black uppercase tracking-widest",
                                                            isActive ? "text-emerald-600" : "text-slate-400"
                                                        )}>
                                                            {isActive ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-4 text-right">
                                                    <p className={cn(
                                                        "text-sm font-black",
                                                        balance > 0 ? "text-rose-600" : "text-emerald-600"
                                                    )}>
                                                        ₦{balance.toLocaleString()}
                                                    </p>
                                                </td>
                                                <td className="px-8 py-4 text-right">
                                                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                                        <MoreHorizontal className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Footer */}
                    <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between shrink-0">
                        <p className="text-[11px] font-bold text-slate-400 italic">
                            Data synced from live Google Sheets
                        </p>
                        <div className="flex items-center gap-4">
                             <p className="text-[11px] font-bold text-slate-800">
                                Support ({userData?.organisation || "School"})
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

