"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Percent, 
  Wallet, 
  GraduationCap, 
  Package, 
  ArrowDownRight, 
  BarChart3, 
  PieChart, 
  ClipboardList, 
  Settings, 
  Store, 
  UserCircle, 
  School, 
  Key,
  LogOut,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  BookOpen,
  Calendar,
  MessageSquare,
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import NovaLogo from "@/components/ui/nova-logo";
import { motion, AnimatePresence } from "framer-motion";

const menuGroups = [
  {
    title: "Intelligence",
    items: [
      { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard/home" },
      { name: "Student Registry", icon: Users, href: "/dashboard/students" },
      { name: "Academic Staff", icon: GraduationCap, href: "/dashboard/teachers" },
    ]
  },
  {
    title: "Management",
    items: [
      { name: "Financial Hub", icon: Wallet, href: "/dashboard/finance" },
      { name: "Attendance Hub", icon: ClipboardList, href: "/dashboard/attendance" },
      { name: "Library Portal", icon: School, href: "/dashboard/library" },
    ]
  },
  {
    title: "Communication",
    items: [
      { name: "Message Center", icon: MessageSquare, href: "/dashboard/message" },
      { name: "Global Notices", icon: Bell, href: "/dashboard/notice" },
      { name: "School Calendar", icon: Calendar, href: "/dashboard/calendar" },
    ]
  },
  {
    title: "Settings",
    items: [
      { name: "System Config", icon: Settings, href: "/dashboard/settings" },
      { name: "Admin Profile", icon: UserCircle, href: "/dashboard/profile" },
    ]
  }
];

const Sidebar = ({ isOpen, isCollapsed, onToggleCollapse, onClose }: { 
  isOpen: boolean; 
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onClose: () => void 
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isCollapsed ? 88 : 288 }}
      className={cn(
        "h-screen bg-white flex flex-col border-r border-slate-200/60 shadow-[4px_0_24px_rgba(0,0,0,0.02)] fixed top-0 z-50 transition-all lg:left-0",
        isOpen ? "left-0" : "-left-80"
      )}
    >
      {/* Decorative Accents */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary)]/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-[var(--secondary)]/5 rounded-full -ml-16 -mb-16 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className={cn(
        "p-6 flex items-center border-b border-slate-50 relative z-10 min-h-[80px]",
        isCollapsed ? "justify-center" : "justify-between"
      )}>
        <div className="flex items-center gap-3">
          <NovaLogo 
            size="sm" 
            onlyBadge={isCollapsed}
            className={cn(
              "transition-all duration-300",
              isCollapsed ? "items-center" : "items-start"
            )} 
          />
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <span className="text-sm font-black text-slate-800 tracking-tight leading-none">LSA PORTAL</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Next Generation</span>
            </motion.div>
          )}
        </div>
        
        {!isCollapsed && (
          <button 
            onClick={onToggleCollapse}
            className="p-1.5 text-slate-400 hover:text-[var(--primary)] hover:bg-[var(--primary-light)] rounded-xl transition-all"
          >
            <ChevronsLeft className="w-5 h-5" />
          </button>
        )}
      </div>

      {isCollapsed && (
        <div className="py-4 flex justify-center border-b border-slate-50 relative z-10">
          <button 
            onClick={onToggleCollapse}
            className="p-1.5 text-slate-400 hover:text-[var(--primary)] hover:bg-[var(--primary-light)] rounded-xl transition-all"
          >
            <ChevronsRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-6 space-y-8 relative z-10">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="space-y-3">
            {!isCollapsed && (
              <h3 className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] animate-in fade-in duration-500">
                {group.title}
              </h3>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all group relative",
                      isActive 
                        ? "bg-[var(--primary-light)] text-[var(--primary)] shadow-[0_4px_12px_rgba(79,70,229,0.08)]" 
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                    )}
                  >
                    <item.icon className={cn(
                      "w-5 h-5 transition-transform duration-300 group-hover:scale-110 shrink-0",
                      isActive ? "text-[var(--primary)]" : "text-slate-400 group-hover:text-slate-600"
                    )} />
                    {!isCollapsed && (
                      <motion.span 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-[13.5px] font-semibold tracking-tight"
                      >
                        {item.name}
                      </motion.span>
                    )}
                    {isActive && (
                      <motion.div 
                        layoutId="activeIndicator"
                        className="absolute right-2 w-1.5 h-1.5 bg-[var(--primary)] rounded-full" 
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Profile */}
      <div className="p-4 mt-auto border-t border-slate-50 bg-slate-50/30 relative z-10">
        <div 
          className={cn(
            "flex items-center gap-3 p-2 rounded-2xl bg-white border border-slate-100/50 shadow-sm hover:shadow-md transition-all cursor-pointer group leading-none",
            isCollapsed && "justify-center"
          )}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center text-white font-black text-sm shadow-sm shrink-0">
            {user?.username?.charAt(0).toUpperCase() || "A"}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate">{user?.username || "Admin"}</p>
              <p className="text-[10px] text-[var(--primary)] font-black uppercase tracking-wider mt-0.5">
                {user?.role || "Manager"}
              </p>
            </div>
          )}
          {!isCollapsed && (
            <button onClick={handleLogout} className="p-1 text-slate-300 hover:text-red-500 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E2E8F0;
          border-radius: 10px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: #CBD5E1;
        }
      `}</style>
    </motion.aside>
  );
};

export default Sidebar;
