"use client";

import { useEffect, useState } from "react";
import { Search, UserPlus, FileDown, MoreHorizontal, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StudentsPage() {
    const [students, setStudents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const org = JSON.parse(storedUser).organisation;
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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-50/50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                    <p className="text-slate-500 font-bold animate-pulse text-sm tracking-widest uppercase">Loading Student Roster...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Student Management</h1>
                    <p className="text-slate-500 text-sm font-medium">Viewing {students.length} students from your organization</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="h-10 px-4 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-slate-50 transition-all">
                        <FileDown className="w-4 h-4" /> Export CSV
                    </button>
                    <button className="h-10 px-6 bg-blue-600 text-white text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20">
                        <UserPlus className="w-4 h-4" /> Add Student
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                        type="text" 
                        placeholder="Search by name, ID or email..." 
                        className="w-full h-11 pl-10 pr-4 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 rounded-xl text-sm transition-all outline-none"
                    />
                </div>
                <select className="h-11 px-4 bg-slate-50 border-transparent rounded-xl text-sm font-bold text-slate-600 outline-none w-full sm:w-48">
                    <option>All Sections</option>
                </select>
                <select className="h-11 px-4 bg-slate-50 border-transparent rounded-xl text-sm font-bold text-slate-600 outline-none w-full sm:w-48">
                    <option>All Levels</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom duration-500">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Student Name</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Gender</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Balance</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {students.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center">
                                        <p className="text-slate-400 font-bold text-sm">No student records found for this organization.</p>
                                    </td>
                                </tr>
                            ) : (
                                students.map((student, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                                                    {(student.cr69d_title || student.cr69d_name || 'S').charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800">{student.cr69d_title || 'Unknown Student'}</p>
                                                    <p className="text-[10px] text-slate-500 font-medium">{student.cr69d_email || 'No email registered'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded-full uppercase tracking-tighter">
                                                {student.cr69d_gender || '-'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest",
                                                String(student.cr69d_status).toLowerCase() === 'active' || student.cr69d_status === '1'
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : "bg-slate-100 text-slate-500"
                                            )}>
                                                {student.cr69d_status || 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-sm font-bold ${parseFloat(String(student.cr69d_balance || '0').replace(/[^0-9.-]+/g, '')) > 0 ? 'text-orange-600' : 'text-emerald-600'}`}>
                                                ₦{parseFloat(String(student.cr69d_balance || '0').replace(/[^0-9.-]+/g, '')).toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
