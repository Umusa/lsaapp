"use client";

import { useState, useEffect, useRef } from "react";
import { X, Save, AlertCircle, UserPlus, CheckCircle2, Camera, UploadCloud, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface StudentModalProps {
    org: string; 
    student?: any; 
    isOpen: boolean;
    onClose: () => void;
    onSave: (id: string | null, data: any) => Promise<void>;
    availableClasses?: { name: string, count: number }[];
}

export default function StudentModal({ org, student, isOpen, onClose, onSave, availableClasses = [] }: StudentModalProps) {
    const isEdit = !!student;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState<any>({
        cr69d_title: "",
        cr69d_gender: "",
        cr69d_guardianname: "",
        cr69d_guardianwhatsapp: "",
        cr69d_guardianphone: "",
        cr69d_emailaddress: "",
        cr69d_address: "",
        cr69d_studentid: "",
        cr69d_level: "",
        cr69d_age: "",
        cr69d_photo: "",
    });
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (student && isOpen) {
            setFormData({ ...student, cr69d_photo: student.cr69d_photo || "" });
        } else if (isOpen) {
            setFormData({
                cr69d_title: "",
                cr69d_gender: "",
                cr69d_guardianname: "",
                cr69d_guardianwhatsapp: "",
                cr69d_guardianphone: "",
                cr69d_emailaddress: "",
                cr69d_address: "",
                cr69d_studentid: "",
                cr69d_level: "",
                cr69d_age: "",
                cr69d_photo: "",
            });
        }
    }, [student, isOpen]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData({ ...formData, cr69d_photo: reader.result as string });
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);

        try {
            if (!formData.cr69d_title?.trim()) throw new Error("Full name is required.");
            if (!formData.cr69d_studentid?.trim()) throw new Error("Student ID is required.");
            if (!formData.cr69d_level) throw new Error("Please select a class.");

            const finalData = {
                ...formData,
                cr69d_instucode: org,
                cr69d_studentactive: isEdit ? (formData.cr69d_studentactive ?? "true") : "true",
            };

            await onSave(isEdit ? student.cr69d_studentid : null, finalData);
            onClose();
        } catch (err: any) {
            setError(err.message || "Failed to save. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" 
                        onClick={onClose} 
                    />
                    
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-white rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl relative z-10 flex flex-col border border-slate-100"
                    >
                        <div className="p-6 lg:p-8 flex items-center justify-between shrink-0 border-b border-slate-50">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                                    {isEdit ? <Save className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">
                                        {isEdit ? "Update Student" : "Add New Student"}
                                    </h2>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Org: {org}</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-900 transition-all"><X /></button>
                        </div>

                        {error && (
                            <div className="px-6 lg:px-8 mt-4">
                                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-[13px] flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    <p className="font-bold">{error}</p>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8">
                            <div className="flex flex-col items-center pb-4 border-b border-slate-50">
                                <div className="relative group">
                                    <div className="w-32 h-32 rounded-[40px] bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden">
                                        {formData.cr69d_photo ? <img src={formData.cr69d_photo} className="w-full h-full object-cover" /> : <Camera className="text-slate-300" />}
                                    </div>
                                    <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute -bottom-2 -right-2 p-3 bg-indigo-600 text-white rounded-2xl shadow-xl"><UploadCloud size={16}/></button>
                                </div>
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <FormField label="Student Full Name *" value={formData.cr69d_title} onChange={(v) => setFormData({...formData, cr69d_title: v})} />
                                <FormField label="Student ID *" value={formData.cr69d_studentid} onChange={(v) => setFormData({...formData, cr69d_studentid: v})} disabled={isEdit} />
                                
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Class/Grade *</label>
                                    <select
                                        value={formData.cr69d_level || ""}
                                        onChange={(e) => setFormData({...formData, cr69d_level: e.target.value})}
                                        className="w-full h-12 px-4 rounded-2xl border border-slate-200 bg-white font-bold text-sm outline-none focus:border-indigo-500"
                                    >
                                        <option value="" disabled>Select Class</option>
                                        {availableClasses.map((opt: any) => (
                                            <option key={opt.name} value={opt.name}>{opt.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <FormField label="Parent Name" value={formData.cr69d_guardianname} onChange={(v) => setFormData({...formData, cr69d_guardianname: v})} />
                                <FormField label="Email" value={formData.cr69d_emailaddress} onChange={(v) => setFormData({...formData, cr69d_emailaddress: v})} />
                                <FormField label="Age" value={formData.cr69d_age} onChange={(v) => setFormData({...formData, cr69d_age: v})} />
                                <FormField label="WhatsApp" value={formData.cr69d_guardianwhatsapp} onChange={(v) => setFormData({...formData, cr69d_guardianwhatsapp: v})} />
                            </div>
                        </form>

                        <div className="p-6 lg:p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                            <button type="button" onClick={onClose} className="font-bold text-slate-500">Cancel</button>
                            <button 
                                type="submit" 
                                disabled={isSaving}
                                className="h-12 px-10 bg-indigo-600 text-white font-black rounded-2xl disabled:opacity-50"
                            >
                                {isSaving ? "Saving..." : (isEdit ? "Update" : "Register")}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

// --- RESTORED FORMFIELD COMPONENT ---
function FormField({ label, placeholder, value, onChange, disabled = false }: { 
    label: string, 
    placeholder?: string,
    value: string, 
    onChange: (v: string) => void,
    disabled?: boolean
}) {
    return (
        <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">{label}</label>
            <input
                type="text"
                value={value || ""}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="w-full h-12 px-4 rounded-2xl border border-slate-200 focus:border-indigo-500 outline-none bg-white transition-all text-sm font-bold text-slate-900 disabled:bg-slate-50"
            />
        </div>
    );
}