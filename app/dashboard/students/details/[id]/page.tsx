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
    UserCircle
} from "lucide-react";
import { useRouter } from "next/navigation";
import Loader from "@/components/ui/loader";
import { cn } from "@/lib/utils";
import EditStudentModal from "../../_components/edit-student-modal";

export default function StudentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const id = decodeURIComponent(resolvedParams.id);
    const router = useRouter();
    const [student, setStudent] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("Details");
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
            // Robust matching: trim and stringify to avoid type/space issues
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
        if (!confirm("Are you sure you want to delete this student record? This action is permanent and will clear the row in Google Sheets.")) return;
        
        try {
            const res = await fetch(`/api/students/crud?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                alert("Student deleted successfully");
                router.push('/dashboard/students');
            } else {
                const data = await res.json();
                throw new Error(data.error);
            }
        } catch (err: any) {
            alert("Error deleting student: " + err.message);
        }
    };

    const handleSave = async (studentId: string, data: any) => {
        const res = await fetch('/api/students/crud', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: studentId, data })
        });
        
        if (!res.ok) {
            const result = await res.json();
            throw new Error(result.error || "Update failed");
        }
        
        // Refresh local data
        setStudent(data);
    };

    if (isLoading) return <Loader />;
    if (!student) return (
        <div className="h-[400px] flex flex-col items-center justify-center text-slate-400">
            <UserCircle className="w-16 h-16 mb-4 opacity-20" />
            <p className="font-bold">Student not found</p>
            <button onClick={() => router.back()} className="mt-4 text-blue-600 font-bold hover:underline">Go Back</button>
        </div>
    );

    const balance = parseFloat(String(student.cr69d_totaloutstanding || '0').replace(/[^0-9.-]+/g, '')) || 0;
    const isCredit = balance <= 0;

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-12">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-100 shadow-sm shrink-0">
                <button 
                    onClick={() => router.back()}
                    className="p-2 text-slate-400 hover:text-slate-600 bg-slate-50 border border-slate-200 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                </button>
                <h1 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Student Detail View</h1>
                <div className="flex items-center gap-2 pr-2">
                    <p className="text-[10px] font-bold text-slate-400">Support ({student.cr69d_instucode || "LSA"})</p>
                    <p className="text-[10px] font-bold text-blue-500">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                </div>
            </div>

            {/* Profile Header Card */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6">
                    <div className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-full ring-1",
                        isCredit ? "bg-emerald-50 text-emerald-600 ring-emerald-100" : "bg-rose-50 text-rose-600 ring-rose-100"
                    )}>
                        <div className={cn("w-2 h-2 rounded-full", isCredit ? "bg-emerald-500" : "bg-rose-500")} />
                        <span className="text-[11px] font-black uppercase tracking-wider">{isCredit ? 'Credit' : 'Debit'}</span>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-2xl bg-slate-100 border-2 border-rose-500 p-1 shrink-0 relative overflow-hidden">
                            <div className="w-full h-full rounded-xl bg-slate-200 flex items-center justify-center text-slate-400">
                                <UserCircle className="w-16 h-16" />
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none mb-2">{student.cr69d_title}</h2>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                            <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-tight">
                                <span className="text-slate-900">{student.cr69d_studentid}</span>
                                <span className="text-slate-300">|</span>
                                <span>{student.cr69d_legacyregno || "N/A"}</span>
                            </div>
                            <div className="flex items-center gap-1 text-slate-400 font-bold text-xs">
                                <span>{student.cr69d_gender}</span>
                                <span className="text-slate-200">•</span>
                                <span>{student.cr69d_age || "0"} years</span>
                            </div>
                        </div>
                        <p className="mt-3 text-[13px] font-bold text-blue-600 uppercase tracking-widest">{student.cr69d_level}</p>
                    </div>

                    <div className="flex gap-12 text-slate-400">
                        <div className="text-center">
                            <p className="text-[10px] font-black uppercase tracking-widest mb-1">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '20' })} 08:40 PM</p>
                            <div className="flex items-center justify-center gap-1 text-slate-900">
                                <span className="font-extrabold text-lg">₦{Math.abs(balance).toLocaleString()}</span>
                                <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">
                                {isCredit ? 'In credit' : 'Total Outstanding'}
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-1.5 text-slate-900">
                                <span className="font-extrabold text-lg">In 0 day(s)</span>
                                <Clock className="w-4 h-4 text-blue-500" />
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1 text-right">
                                Next Payment Due
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs & Actions */}
            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
                <div className="flex items-center gap-1 overflow-x-auto pb-2 xl:pb-0 no-scrollbar max-w-full">
                    {["Details", "Transaction", "Items purchased", "Discounts", "Messages", "Siblings", "Attendance log", "Activities", "Pendings"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "h-9 px-4 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap whitespace-nowrap ring-1 ring-transparent",
                                activeTab === tab 
                                    ? "bg-[var(--primary-soft)] text-[var(--primary)] ring-[var(--primary)]" 
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <button className="h-9 px-4 bg-slate-50 border border-slate-200 text-slate-500 text-[10px] font-black rounded-lg flex items-center gap-2 hover:bg-slate-100 transition-all uppercase tracking-tighter">
                        Connect to Portal <RefreshCw className="w-3 h-3" />
                    </button>
                    <button className="h-9 px-4 bg-slate-900 text-white text-[10px] font-black rounded-lg flex items-center gap-2 hover:bg-slate-800 transition-all uppercase tracking-tighter">
                        Initiate a discount request <ArrowUpRight className="w-3 h-3" />
                    </button>
                    <button className="h-9 px-4 bg-[var(--primary)] text-white text-[10px] font-black rounded-lg flex items-center gap-2 hover:bg-[var(--primary-hover)] transition-all shadow-lg shadow-primary/20 uppercase tracking-tighter">
                        Make payment <Plus className="w-3 h-3" />
                    </button>
                    <button 
                        onClick={() => setIsEditModalOpen(true)}
                        className="p-2 border border-slate-200 text-slate-400 hover:text-[var(--primary)] hover:border-[var(--primary)] rounded-lg transition-all"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={handleDelete}
                        className="p-2 border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-300 rounded-lg transition-all"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => student && fetchStudent(student.cr69d_instucode)} className="p-2 border border-slate-200 text-slate-400 hover:text-slate-600 rounded-lg">
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Main Content Sections */}
            {/* ... section code ... */}

            {isEditModalOpen && (
                <EditStudentModal 
                    student={student}
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={handleSave}
                />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Main Details */}
                <div className="lg:col-span-1 space-y-6">
                    <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden pb-6">
                        <div className="h-10 px-6 flex items-center bg-slate-100/50 border-b border-slate-100 mb-6">
                            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Main Details</h3>
                        </div>
                        <div className="px-6 space-y-5">
                            <DetailItem label="Registration Number" value={student.cr69d_studentid} />
                            <DetailItem label="Legacy Registration Number" value={student.cr69d_legacyregno} />
                            <DetailItem label="FederationID" value={student.cr69d_federationid} />
                            <DetailItem label="Level" value={student.cr69d_level} />
                            <DetailItem label="DOB" value={student.cr69d_dob ? new Date(student.cr69d_dob).toLocaleDateString() : undefined} />
                            <DetailItem label="Gender" value={student.cr69d_gender} />
                        </div>
                    </section>
                </div>

                {/* Right Area: Guardian & Other Details */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden pb-6">
                            <div className="h-10 px-6 flex items-center bg-slate-100/50 border-b border-slate-100 mb-6">
                                <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Guardian Details</h3>
                            </div>
                            <div className="px-6 space-y-5">
                                <DetailItem label="GuardianName" value={student.cr69d_guardianname} />
                                <DetailItem label="Email_Address" value={student.cr69d_emailaddress} />
                                <DetailItem label="WhatsApp Number" value={student.cr69d_guardianwhatsapp} />
                                <DetailItem label="Contact_Number" value={student.cr69d_guardianphone} />
                                <DetailItem label="Address" value={student.cr69d_address} />
                            </div>
                        </section>

                        <div className="space-y-8">
                            <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden pb-6">
                                <div className="h-10 px-6 flex items-center bg-slate-100/50 border-b border-slate-100 mb-6">
                                    <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Other Details</h3>
                                </div>
                                <div className="px-6 space-y-5">
                                    <DetailItem label="Medication_information" value={student.cr69d_medication} />
                                    <DetailItem label="SportWearType" value={student.cr69d_sportweartype} />
                                    <DetailItem label="PreferredMethodofContact" value={student.cr69d_contactmethod} />
                                    <DetailItem label="Date Joined" value={student.cr69d_datejoined ? new Date(student.cr69d_datejoined).toLocaleDateString() : undefined} />
                                    <DetailItem label="Status Discount" value={student.cr69d_statusdiscount} />
                                    <DetailItem label="Discount Valid till" value={student.cr69d_discountvalidtill} />
                                    <DetailItem label="SessionJoined" value={student.cr69d_sessionjoined} />
                                    <DetailItem label="Term Joined" value={student.cr69d_termjoined} />
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DetailItem({ label, value }: { label: string, value?: string }) {
    return (
        <div className="space-y-1.5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter ml-0.5">{label}</p>
            <div className="h-10 px-3 bg-slate-50 border border-slate-100/50 rounded-lg flex items-center">
                <p className="text-[11px] font-bold text-slate-600 truncate">{value || "—"}</p>
            </div>
        </div>
    );
}
