"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import MarketingPanel from "./marketing-panel";
import LoginForm from "./login-form";
import Loader from "@/components/ui/loader";

const LoginClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [schoolColor, setSchoolColor] = useState("#2563eb");
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
      // Store user data and theme for the dashboard
      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.setItem("school_theme", data.schoolColor || "#2563eb");
      router.push("/dashboard/home");
    } catch (error: any) {
      console.error("Login error:", error);
      alert(error.message || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden font-sans">
            {isLoading && <Loader />}
            
            {/* Immersive Background */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105" 
                    style={{ backgroundImage: "url('/images/premium_login_bg.png')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-900/60 to-indigo-950/80 backdrop-blur-[2px]" />
                
                {/* Floating Particles */}
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            y: [0, -100, 0],
                            x: [0, i % 2 === 0 ? 50 : -50, 0],
                            opacity: [0.1, 0.3, 0.1],
                        }}
                        transition={{
                            duration: 15 + i * 2,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        className="absolute rounded-full bg-blue-500/20 blur-3xl"
                        style={{
                            width: `${200 + i * 100}px`,
                            height: `${200 + i * 100}px`,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                        }}
                    />
                ))}
            </div>

            {/* Content Container */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 w-full max-w-6xl mx-4 grid lg:grid-cols-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[40px] shadow-2xl overflow-hidden"
            >
                {/* Left Side: Marketing/Branding */}
                <div className="h-full">
                    <MarketingPanel />
                </div>

                {/* Right Side: Login Form */}
                <div className="flex flex-col items-center justify-center p-8 lg:p-16 xl:p-24 bg-white/5">
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="w-full"
                    >
                        <LoginForm
                            onSubmit={handleSubmit}
                            isPending={isLoading}
                            schoolColor={schoolColor}
                            setSchoolColor={setSchoolColor}
                        />
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="mt-12 text-center"
                    >
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">
                            © 2025 LSA Institutional Intelligence Hub
                        </p>
                    </motion.div>
                </div>
            </motion.div>

            {/* Subtle decorative elements */}
            <div className="absolute top-12 left-12 z-20 hidden lg:block">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                        <div className="w-4 h-4 rounded-full bg-indigo-500 animate-pulse" />
                    </div>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest opacity-60">System Online</span>
                </div>
            </div>
        </div>
    );
};

export default LoginClient;
