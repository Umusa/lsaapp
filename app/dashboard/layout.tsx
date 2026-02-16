"use client";

import { useState } from "react";
import Sidebar from "./_components/sidebar";
import TopNav from "./_components/top-nav";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [themeColor, setThemeColor] = useState("#2563eb"); // Default blue

  useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("school_theme");
      if (savedTheme) setThemeColor(savedTheme);
    }
  });

  return (
    <div className="min-h-screen bg-slate-50 flex" style={{ 
      // Inject theme colors as CSS variables
      ['--primary' as any]: themeColor,
      ['--primary-hover' as any]: `${themeColor}cc`, // 80% opacity for hover
      ['--primary-soft' as any]: `${themeColor}15`, // 10% opacity for background tint
    }}>
      <Sidebar 
        isOpen={isSidebarOpen} 
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <main className={cn(
        "flex-1 flex flex-col min-w-0 transition-all duration-300",
        isCollapsed ? "lg:ml-20" : "lg:ml-72"
      )}>
        <TopNav onMenuClick={() => setIsSidebarOpen(true)} />
        <div className="flex-1 overflow-x-hidden pt-4 px-4 sm:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
