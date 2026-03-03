"use client";

import { useEffect, useState, use } from "react";
import { 
    ArrowLeft, 
    MoreHorizontal,
    Edit,
    Trash2,
    Calendar,
    Mail,
    Phone,
    MapPin,
    CreditCard,
    ArrowUpRight,
    RefreshCw,
    Plus,
    Clock,
    UserCircle,
    ShieldCheck,
    Zap,
    ChevronRight,
    MessageSquare,
    IdCard,
    Stethoscope,
    Activity,
    Briefcase,
    TrendingUp,
    Smartphone,
    Bell,
    CheckCircle2,
    GraduationCap
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "@/components/ui/loader";
import { cn } from "@/lib/utils";
import EditStudentModal from "../../_components/edit-student-modal";

const DetailSection = ({ title, icon: Icon, children, delay }: any) => (
    <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="premium-card overflow-hidden"
    >
        <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
                <Icon className="w-4 h-4 text-indigo-600" />
            </div>
            <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em]">{title}</h3>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {children}
        </div>
    </motion.section>
);

const DetailItem = ({ label, value, icon: Icon }: { label: string, value?: string, icon?: any }) => (
    <div className="space-y-1.5 group">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1 group-hover:text-indigo-400 transition-colors">{label}</p>
        <div className="h-11 px-4 bg-slate-50 border border-slate-100/80 rounded-2xl flex items-center justify-between group-hover:bg-white group-hover:border-indigo-100 group-hover:shadow-sm transition-all">
            <p className="text-[12px] font-bold text-slate-700 truncate">{value || "—"}</p>
            {Icon && <Icon className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-400 transition-colors" />}
        </div>
    </div>
);

export default function StudentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const id = decodeURIComponent(resolvedParams.id);
    const router = useRouter();
    const [student, setStudent] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("Profile Overview");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            const org = parsedUser.instuCode || parsedUser.organisation;
            fetchStudent(org);
        }
    }, [id]);

    const fetchStudent = async (org: string) => {
        try {
            setIsLoading(true);
            const res = await fetch(`/api/students?org=${encodeURIComponent(org)}`);
            const data = await res.json();
            const found = (data.students || []).find((s: any) => 
                String(s.cr69d_studentid || '').trim() === String(id).trim()
            );
            setStudent(found);
        } catch (err) {
            console.error("Failed to fetch student details:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this student record? This action is permanent.")) return;
        
        try {
            const res = await fetch(`/api/students/crud?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                router.push('/dashboard/students');
            } else {
                const data = await res.json();
                throw new Error(data.error);
            }
        } catch (err: any) {
            alert("Error: " + err.message);
        }
    };

    const handleSave = async (studentId: string, data: any) => {
        const res = await fetch('/api/students/crud', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: studentId, data })
        });
        
        if (!res.ok) throw new Error("Update failed");
        setStudent(data);
    };

    if (isLoading) return (
        <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
            <Loader />
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] font-sans">Accessing Secure Personnel Archive...</p>
        </div>
    );

    if (!student) return (
        <div className="h-[60vh] flex flex-col items-center justify-center text-slate-400">
            <UserCircle className="w-20 h-20 mb-4 opacity-10" />
            <p className="font-black text-xs uppercase tracking-widest">Scholar Profile Not Found</p>
            <button onClick={() => router.back()} className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs">Return to Registry</button>
        </div>
    );

    const balance = parseFloat(String(student.cr69d_totaloutstanding || '0').replace(/[^0-9.-]+/g, '')) || 0;
    const isCredit = balance <= 0;

    return (
        <div className="p-4 sm:p-8 space-y-8 animate-in fade-in duration-500 pb-20">
            
            {/* Context Navigation & System Info */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => router.push('/dashboard/students')}
                        className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all shadow-sm group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div className="space-y-1">
                        <h1 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] leading-none">Scholar Intelligence</h1>
                        <p className="text-xl font-extrabold text-slate-800 tracking-tight leading-none">
                            {student.cr69d_title}
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-xl border border-emerald-100">
                        System Sync Active
                    </div>
                    <div className="px-4 py-2 bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl border border-slate-100">
                        {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                </div>
            </div>

            {/* Premium Profile Hero */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/40 p-10 relative overflow-hidden"
            >
                {/* Decorative background gradients */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full -mr-48 -mt-48 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full -ml-32 -mb-32 blur-3xl pointer-events-none" />

                <div className="flex flex-col lg:flex-row gap-12 items-start lg:items-center relative z-10">
                    <div className="relative group self-center lg:self-auto">
                        <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-indigo-50 to-indigo-100 p-1.5 ring-4 ring-indigo-50/50 shadow-inner group-hover:scale-105 transition-transform duration-500">
                             <div className="w-full h-full rounded-[2.2rem] bg-white flex items-center justify-center text-indigo-600 font-black text-3xl shadow-sm overflow-hidden">
                                {student.cr69d_title?.charAt(0).toUpperCase()}
                             </div>
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg border-4 border-white">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="flex-1 text-center lg:text-left space-y-4">
                        <div className="space-y-1">
                            <h2 className="text-4xl font-black text-slate-800 tracking-tighter leading-none mb-4">{student.cr69d_title}</h2>
                            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 text-slate-400 font-black text-[10px] uppercase tracking-[0.1em]">
                                <span className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                    <IdCard className="w-3.5 h-3.5" /> ID: {student.cr69d_studentid}
                                </span>
                                <span className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                    <GraduationCap className="w-3.5 h-3.5" /> {student.cr69d_level || "Unknown Grade"}
                                </span>
                                <span className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                    <Clock className="w-3.5 h-3.5" /> {student.cr69d_age || "0"} YEARS
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-auto grid grid-cols-2 gap-4 lg:flex lg:gap-8">
                        <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex flex-col items-center justify-center min-w-[160px]">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Account State</p>
                            <div className={cn(
                                "flex items-center gap-2 text-xl font-black tracking-tighter",
                                isCredit ? "text-emerald-600" : "text-rose-600"
                            )}>
                                ₦{Math.abs(balance).toLocaleString()}
                                {isCredit ? <CheckCircle2 className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                            </div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                {isCredit ? "Credit Balance" : "Total Arrears"}
                            </p>
                        </div>
                        <div className="bg-indigo-600 p-6 rounded-[2rem] shadow-xl shadow-indigo-500/30 flex flex-col items-center justify-center min-w-[160px] text-white group cursor-pointer hover:bg-indigo-500 transition-colors">
                            <Zap className="w-5 h-5 mb-2 text-indigo-200 group-hover:scale-125 transition-transform" />
                            <p className="text-xl font-black tracking-tighter">76%</p>
                            <p className="text-[9px] font-black text-indigo-200 uppercase tracking-widest mt-1">Academic Rank</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Navigation Tabs */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-2">
                    {["Profile Overview", "Academic History", "Financial Ledger", "Message Logs"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "h-11 px-6 rounded-2xl text-[11px] font-black transition-all whitespace-nowrap uppercase tracking-widest",
                                activeTab === tab 
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-4 ring-indigo-50" 
                                    : "text-slate-400 hover:text-slate-800 hover:bg-white"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <button 
                         onClick={() => setIsEditModalOpen(true)}
                        className="w-12 h-12 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 transition-all flex items-center justify-center shadow-sm"
                    >
                        <Edit className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={handleDelete}
                        className="w-12 h-12 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-rose-600 transition-all flex items-center justify-center shadow-sm"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                    <div className="h-8 w-px bg-slate-100 mx-1" />
                    <button className="h-12 px-6 bg-slate-900 text-white text-[10px] font-black rounded-2xl flex items-center gap-3 hover:opacity-90 transition-all shadow-xl shadow-slate-900/20 uppercase tracking-widest whitespace-nowrap">
                        Initiate Financial Order <ArrowUpRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Main Data Sections */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                
                {/* Left Column: Core Data */}
                <div className="xl:col-span-8 space-y-8">
                    <DetailSection title="Scholastic Profile" icon={GraduationCap} delay={0.1}>
                        <DetailItem label="Full Enrollment Name" value={student.cr69d_title} />
                        <DetailItem label="System Identifier" value={student.cr69d_studentid} icon={IdCard} />
                        <DetailItem label="Authorized Level" value={student.cr69d_level} icon={ShieldCheck} />
                        <DetailItem label="Legacy Reference" value={student.cr69d_legacyregno} />
                        <DetailItem label="Registry Date" value={student.cr69d_datejoined ? new Date(student.cr69d_datejoined).toLocaleDateString() : 'N/A'} icon={Calendar} />
                        <DetailItem label="Gender Registry" value={student.cr69d_gender} />
                    </DetailSection>

                    <DetailSection title="Personnel Contact & Logistics" icon={Mail} delay={0.2}>
                        <DetailItem label="Registered Email" value={student.cr69d_emailaddress} icon={Mail} />
                        <DetailItem label="WhatsApp Command Number" value={student.cr69d_guardianwhatsapp} icon={MessageSquare} />
                        <DetailItem label="Emergency Voice Line" value={student.cr69d_guardianphone} icon={Phone} />
                        <DetailItem label="Guardian Authority" value={student.cr69d_guardianname} icon={UserCircle} />
                        <DetailItem label="Residential Coordinate" value={student.cr69d_address} icon={MapPin} />
                        <DetailItem label="Contact Protocol" value={student.cr69d_contactmethod} />
                    </DetailSection>

                    <DetailSection title="Institutional Metadata" icon={Activity} delay={0.3}>
                        <DetailItem label="Medication Protocol" value={student.cr69d_medication} icon={Stethoscope} />
                        <DetailItem label="Apparel Specifications" value={student.cr69d_sportweartype} />
                        <DetailItem label="Enrolled Session" value={student.cr69d_sessionjoined} />
                        <DetailItem label="Entry Term" value={student.cr69d_termjoined} />
                    </DetailSection>
                </div>

                {/* Right Column: Insights & Quick Actions */}
                <div className="xl:col-span-4 space-y-8">
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-500/40 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                        
                        <div className="relative z-10 space-y-6">
                            <h4 className="text-2xl font-black tracking-tight leading-tight">Financial<br/>Excellence Hub</h4>
                            <div className="p-5 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-100">Ledger Health</span>
                                    <span className="text-xs font-black text-white px-2 py-0.5 bg-indigo-500/50 rounded-lg border border-white/10">Stable</span>
                                </div>
                                <p className="text-2xl font-black text-white tracking-tighter">₦{Math.abs(balance).toLocaleString()}</p>
                                <p className="text-[9px] font-black text-indigo-200 uppercase tracking-widest mt-1">Pending Clearance</p>
                            </div>
                            
                            <div className="space-y-3">
                                <button className="w-full h-12 bg-white text-indigo-600 font-black text-[11px] uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-all shadow-lg active:scale-95">
                                    Generate Invoice <ChevronRight className="w-4 h-4" />
                                </button>
                                <button className="w-full h-12 bg-indigo-500/30 text-white font-black text-[11px] uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 hover:bg-indigo-500/50 border border-indigo-400/20 transition-all active:scale-95">
                                    Access Ledger History
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    <div className="premium-card p-8 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-50 rounded-xl">
                                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                            </div>
                            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Active Permissions</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="flex items-center gap-3">
                                    <Smartphone className="w-4 h-4 text-slate-400" />
                                    <span className="text-[11px] font-black text-slate-600 uppercase tracking-tight">Portal Access</span>
                                </div>
                                <div className="w-8 h-4 bg-emerald-500 rounded-full relative">
                                    <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow-sm" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="flex items-center gap-3">
                                    <Bell className="w-4 h-4 text-slate-400" />
                                    <span className="text-[11px] font-black text-slate-600 uppercase tracking-tight">SMS Alerts</span>
                                </div>
                                <div className="w-8 h-4 bg-emerald-500 rounded-full relative">
                                    <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow-sm" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isEditModalOpen && (
                <EditStudentModal 
                    student={student}
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
}
