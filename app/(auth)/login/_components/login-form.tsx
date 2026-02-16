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

const LoginForm = ({ onSubmit, isPending, schoolColor, setSchoolColor }: LoginFormProps) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ username, password, schoolColor });
    };

    return (
        <div className="w-full max-w-md mx-auto px-4 sm:px-0">
            
            <div className="relative z-10">
                <div className="space-y-2 mb-10 text-center sm:text-left">
                    <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Login to your Account</h2>
                    <p className="text-slate-500 font-medium">
                        Been a minute! Welcome Back...
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2.5">
                        <label className="text-sm font-bold text-slate-700 ml-0.5">Username *</label>
                        <Input
                            type="text"
                            placeholder="Enter your username"
                            disabled={isPending}
                            value={username}
                            className="h-12 border-slate-200 focus:border-blue-500 transition-all bg-slate-50 shadow-sm"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="space-y-2.5">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-bold text-slate-700 ml-0.5">Password *</label>
                        </div>
                        <PasswordInput
                            disabled={isPending}
                            value={password}
                            className="h-12 border-slate-200 focus:border-blue-500 transition-all bg-slate-50 shadow-sm"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                            required
                        />
                    </div>


                    <div className="flex items-center justify-between py-1">
                        <div className="flex items-center space-x-3">
                            <Checkbox id="remember" className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                            <label
                                htmlFor="remember"
                                className="text-sm font-medium text-slate-600 cursor-pointer select-none"
                            >
                                Keep me logged in
                            </label>
                        </div>
                        <Link
                            href="/forgot-password"
                            className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-14 text-base font-bold bg-[#0047FF] hover:bg-[#003DCB] shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all rounded-xl mt-4 text-white"
                        disabled={isPending}
                    >
                        {isPending ? (
                            <span className="flex items-center gap-2">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                                Signing you in...
                            </span>
                        ) : "Sign In to Dashboard"}
                    </Button>
                </form>

                <div className="mt-10 p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex flex-col items-center gap-2">
                    <p className="text-sm font-medium text-slate-600">Having problems logging in?</p>
                    <Link href="#" className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        Chat with our support team
                    </Link>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-[15px] font-medium text-slate-500">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/register"
                            className="text-blue-600 hover:text-blue-700 font-bold ml-1"
                        >
                            Create your account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
