"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import MarketingPanel from "./marketing-panel";
import LoginForm from "./login-form";
import Loader from "@/components/ui/loader";
import NovaLogo from "@/components/ui/nova-logo";

const LoginClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [schoolColor, setSchoolColor] = useState("#4f46e5"); // Indigo for Education
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Login failed");
      }

      console.log("Login successful:", result);
      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.setItem("school_theme", data.schoolColor || "#4f46e5");
      router.push("/dashboard/home");
    } catch (error: any) {
      console.error("Login error:", error);
      alert(error.message || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

    return (
        <div className="min-h-screen relative flex items-center justify-center bg-[#f8fafc] font-sans p-4">
            {isLoading && <Loader />}
            
            {/* Top Left Floating Brand Box */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute top-8 left-8 z-30 hidden lg:block"
            >
                <div className="bg-white p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col items-center gap-1.5">
                    <NovaLogo size="sm" onlyBadge />
                    <span className="text-[9px] font-black text-slate-900 tracking-[0.2em] uppercase">LSA</span>
                </div>
            </motion.div>

            {/* Main Content Container */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 w-full max-w-3xl grid lg:grid-cols-[1.1fr_1fr] bg-white rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden min-h-[400px] border border-slate-100"
            >
                {/* Left Side: Marketing/Branding (White) */}
                <MarketingPanel />

                {/* Right Side: Login Sidebar (Purple) */}
                <div className="relative flex flex-col items-center justify-center p-8 lg:p-10 bg-indigo-600">
                    {/* Background Subtle Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-600/90 to-blue-700 pointer-events-none" />
                    
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="relative z-10 w-full"
                    >
                        <LoginForm
                            onSubmit={handleSubmit}
                            isPending={isLoading}
                            schoolColor={schoolColor}
                            setSchoolColor={setSchoolColor}
                        />
                    </motion.div>
                    
                    <div className="mt-auto pt-8 relative z-10">
                         <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                             
                         </div>
                    </div>
                </div>
            </motion.div>

            {/* Footer Text */}
            <div className="absolute bottom-6 w-full text-center">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    Build 3.260.113 Education Hub | Secured by UMUSA DIGITAL
                </p>
            </div>
        </div>
    );
};

export default LoginClient;
