"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MarketingPanel from "./marketing-panel";
import LoginForm from "./login-form";
import MobileNavbar from "./mobile-navbar";
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
        <div className="min-h-screen flex flex-col">
            {isLoading && <Loader />}
            <MobileNavbar />
            <div className="flex-1 grid lg:grid-cols-2">
                <div className="p-4 h-full">
                    <MarketingPanel />
                </div>

                <div className="flex flex-col items-center justify-center bg-white px-8 xl:px-32 py-12">
                    <LoginForm
                        onSubmit={handleSubmit}
                        isPending={isLoading}
                        schoolColor={schoolColor}
                        setSchoolColor={setSchoolColor}
                    />
                    <p className="text-center text-sm mt-8">
                        (C) 2025. LSA SCHOOL MANAGEMENT. All Rights Reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginClient;
