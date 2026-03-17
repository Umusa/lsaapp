"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PasswordInput from "@/components/ui/password-input";

interface LoginFormProps {
    onSubmit: (data: any) => void;
    isPending: boolean;
    schoolColor?: string;
    setSchoolColor?: (color: string) => void;
}

const LoginForm = ({ onSubmit, isPending, schoolColor, setSchoolColor }: LoginFormProps) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ username, password, schoolColor });
    };

    return (
        <div className="w-full flex flex-col min-h-[350px]">
            <div className="mb-6 text-white">
                <h2 className="text-2xl font-bold mb-1">Sign In</h2>
                <p className="text-xs text-white/70">
                    Type your email and password to start.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 flex-1">
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-white uppercase tracking-wider ml-1">
                        Email Address
                    </label>
                    <Input
                        type="text"
                        placeholder="Enter your email"
                        disabled={isPending}
                        value={username}
                        className="h-10 px-4 rounded-xl bg-white border-transparent text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-white/20 transition-all font-medium text-sm"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                        required
                    />
                </div>
                
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-white uppercase tracking-wider ml-1">
                        Password
                    </label>
                    <PasswordInput
                        disabled={isPending}
                        value={password}
                        placeholder="Enter your password"
                        className="h-10 px-4 rounded-xl bg-white border-transparent text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-white/20 transition-all font-medium text-sm"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="pt-2">
                    <Button
                        type="submit"
                        className="w-full h-10 bg-white/90 hover:bg-white text-indigo-700 text-sm font-black rounded-xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 border-none"
                        disabled={isPending}
                    >
                        {isPending ? (
                            <div className="w-4 h-4 border-2 border-indigo-700/20 border-t-indigo-700 animate-spin rounded-full" />
                        ) : (
                            "Sign In"
                        )}
                    </Button>
                </div>
            </form>

            {/* NDPC Compliance Badge */}
            <div className="mt-auto flex justify-end items-center gap-2 pt-4">
                <div className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" />
                <span className="text-[8px] font-bold text-white tracking-wide">Secure Login</span>
            </div>
        </div>
    );
};

export default LoginForm;
