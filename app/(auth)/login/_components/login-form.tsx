"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import PasswordInput from "@/components/ui/password-input";
import { cn } from "@/lib/utils";

interface LoginFormProps {
    onSubmit: (data: any) => void;
    isPending: boolean;
    schoolColor?: string;
    setSchoolColor?: (color: string) => void;
}

import NovaLogo from "@/components/ui/nova-logo";

const LoginForm = ({ onSubmit, isPending, schoolColor, setSchoolColor }: LoginFormProps) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ username, password, schoolColor });
    };

    return (
        <div className="w-full">
            <div className="lg:hidden mb-12 flex justify-center">
                 <div className="p-3 bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20">
                    <NovaLogo size="sm" />
                 </div>
            </div>
            <div className="mb-12">
                <h2 className="text-4xl font-black text-white tracking-tighter mb-3">
                    Scholar Access
                </h2>
                <div className="flex items-center gap-2">
                    <div className="h-[2px] w-8 bg-blue-500 rounded-full" />
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">
                        Authenticated Environment
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/50 uppercase tracking-widest ml-1">
                        Principal Username
                    </label>
                    <div className="relative group">
                        <Input
                            type="text"
                            placeholder="username@lsascholars"
                            disabled={isPending}
                            value={username}
                            className="h-14 px-6 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all font-bold text-sm"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                            required
                        />
                        <div className="absolute inset-0 rounded-2xl bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                </div>
                
                <div className="space-y-2">
                    <div className="flex justify-between items-center ml-1">
                        <label className="text-[10px] font-black text-white/50 uppercase tracking-widest">
                            Secure Credentials
                        </label>
                    </div>
                    <PasswordInput
                        disabled={isPending}
                        value={password}
                        className="h-14 px-6 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all font-bold text-sm"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-3 group cursor-pointer">
                        <Checkbox id="remember" className="w-5 h-5 rounded-lg border-white/20 bg-white/5 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 transition-all" />
                        <label
                            htmlFor="remember"
                            className="text-[11px] font-bold text-white/60 cursor-pointer select-none group-hover:text-white transition-colors"
                        >
                            Trust this device
                        </label>
                    </div>
                    <Link
                        href="/forgot-password"
                        className="text-[11px] font-black text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest"
                    >
                        Recovery Access
                    </Link>
                </div>

                <Button
                    type="submit"
                    className="w-full h-16 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-black rounded-2xl shadow-xl shadow-blue-900/40 active:scale-[0.98] transition-all flex items-center justify-center gap-3 border border-white/10"
                    disabled={isPending}
                >
                    {isPending ? (
                        <>
                            <div className="w-5 h-5 border-3 border-white/20 border-t-white animate-spin rounded-full" />
                            <span>Authenticating Identity...</span>
                        </>
                    ) : (
                        <>
                            <span>Authorize Entry</span>
                            <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor font-bold">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </div>
                        </>
                    )}
                </Button>
            </form>

            <div className="mt-12 pt-12 border-t border-white/5 flex flex-col items-center gap-6">
                <p className="text-[11px] font-bold text-white/40">
                    Proprietary Secure Gateway. Unauthorized access is monitored.
                </p>
                <div className="flex items-center gap-8">
                    <Link href="#" className="opacity-30 hover:opacity-100 transition-opacity">
                        <div className="w-5 h-5 border-2 border-white rounded" />
                    </Link>
                    <Link href="#" className="opacity-30 hover:opacity-100 transition-opacity">
                        <div className="w-5 h-5 border-2 border-white rounded-full" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
