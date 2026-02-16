"use client";

import { useState } from "react";
import { X, Save, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditStudentModalProps {
    student: any;
    isOpen: boolean;
    onClose: () => void;
    onSave: (id: string, data: any) => Promise<void>;
}

export default function EditStudentModal({ student, isOpen, onClose, onSave }: EditStudentModalProps) {
    const [formData, setFormData] = useState<any>(student);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
        try {
            await onSave(student.cr69d_studentid, formData);
            onClose();
        } catch (err: any) {
            setError(err.message || "Failed to save changes");
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
            
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl relative z-10 flex flex-col animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[var(--primary-soft)] text-[var(--primary)] rounded-xl">
                            <Save className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-800 tracking-tight">Edit Student Record</h2>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">Update information for {student.cr69d_title}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                    {error && (
                        <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-sm flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p className="font-bold">{error}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField 
                            label="Student Full Name" 
                            name="cr69d_title" 
                            value={formData.cr69d_title} 
                            onChange={(v) => setFormData({...formData, cr69d_title: v})} 
                        />
                        <FormField 
                            label="Gender" 
                            name="cr69d_gender" 
                            value={formData.cr69d_gender} 
                            onChange={(v) => setFormData({...formData, cr69d_gender: v})} 
                        />
                        <FormField 
                            label="Guardian Name" 
                            name="cr69d_guardianname" 
                            value={formData.cr69d_guardianname} 
                            onChange={(v) => setFormData({...formData, cr69d_guardianname: v})} 
                        />
                        <FormField 
                            label="Guardian WhatsApp" 
                            name="cr69d_guardianwhatsapp" 
                            value={formData.cr69d_guardianwhatsapp} 
                            onChange={(v) => setFormData({...formData, cr69d_guardianwhatsapp: v})} 
                        />
                        <FormField 
                            label="Guardian Phone" 
                            name="cr69d_guardianphone" 
                            value={formData.cr69d_guardianphone} 
                            onChange={(v) => setFormData({...formData, cr69d_guardianphone: v})} 
                        />
                        <FormField 
                            label="Email Address" 
                            name="cr69d_emailaddress" 
                            value={formData.cr69d_emailaddress} 
                            onChange={(v) => setFormData({...formData, cr69d_emailaddress: v})} 
                        />
                         <div className="md:col-span-2">
                            <FormField 
                                label="Home Address" 
                                name="cr69d_address" 
                                value={formData.cr69d_address} 
                                onChange={(v) => setFormData({...formData, cr69d_address: v})} 
                                isTextArea
                            />
                        </div>
                    </div>
                </form>

                <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3 shrink-0">
                    <button 
                        type="button"
                        onClick={onClose} 
                        className="h-11 px-6 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className="h-11 px-8 bg-[var(--primary)] text-white text-sm font-black rounded-xl hover:bg-[var(--primary-hover)] transition-all shadow-lg shadow-primary/20 active:scale-[0.98] flex items-center gap-2"
                    >
                        {isSaving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/20 border-t-white animate-spin rounded-full" />
                                Saving Changes...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" /> Save Variations
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

function FormField({ label, name, value, onChange, isTextArea = false }: { 
    label: string, 
    name: string, 
    value: string, 
    onChange: (v: string) => void,
    isTextArea?: boolean
}) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
            {isTextArea ? (
                <textarea
                    value={value || ""}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full min-h-[100px] p-3 rounded-xl border border-slate-200 focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none bg-slate-50 transition-all text-sm font-bold text-slate-700"
                />
            ) : (
                <input
                    type="text"
                    value={value || ""}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none bg-slate-50 transition-all text-sm font-bold text-slate-700"
                />
            )}
        </div>
    );
}
