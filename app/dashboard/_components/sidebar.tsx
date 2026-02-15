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
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const menuGroups = [
  {
    title: "Main navigation",
    items: [
      { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard/home" },
      { name: "Students", icon: Users, href: "/dashboard/students" },
      { name: "Discount Mgt", icon: Percent, href: "/dashboard/discounts" },
    ]
  },
  {
    title: "Financials",
    items: [
      { name: "Payment Studio", icon: Wallet, href: "/dashboard/payments" },
      { name: "Fees Studio", icon: GraduationCap, href: "/dashboard/fees" },
      { name: "Collectables", icon: Package, href: "/dashboard/collectables" },
      { name: "Expenses", icon: ArrowDownRight, href: "/dashboard/expenses" },
    ]
  },
  {
    title: "Reports",
    items: [
      { name: "Main report", icon: BarChart3, href: "/dashboard/reports/main" },
      { name: "Item report", icon: PieChart, href: "/dashboard/reports/items" },
      { name: "Collectable Report", icon: ClipboardList, href: "/dashboard/reports/collectables" },
    ]
  },
  {
    title: "Settings",
    items: [
      { name: "Configurations", icon: Settings, href: "/dashboard/settings" },
      { name: "Stores", icon: Store, href: "/dashboard/stores" },
      { name: "Users", icon: Users, href: "/dashboard/users" },
      { name: "School profile", icon: School, href: "/dashboard/profile" },
      { name: "Change password", icon: Key, href: "/dashboard/password" },
    ]
  }
];

const Sidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
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
    <aside className={cn(
      "w-72 h-screen bg-[#1E293B] text-slate-300 flex flex-col border-r border-slate-800 shadow-2xl fixed top-0 z-50 transition-all duration-300 lg:left-0",
      isOpen ? "left-0" : "-left-72"
    )}>
      {/* Logo Area */}
      <div className="p-6 flex items-center justify-between border-b border-slate-800/50">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <School className="text-white w-6 h-6" />
            </div>
            <div>
            <h1 className="text-white font-bold text-lg tracking-tight">LSA SCHOOL</h1>
            <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Management</p>
            </div>
        </div>
        <button 
          onClick={onClose}
          className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
        >
          <ChevronRight className="w-6 h-6 rotate-180" />
        </button>
      </div>

      {/* Nav Items */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-8">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="space-y-2">
            <h3 className="px-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">{group.title}</h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all group relative",
                      isActive 
                        ? "bg-blue-600/10 text-blue-400 font-semibold" 
                        : "hover:bg-slate-800 hover:text-white"
                    )}
                  >
                    <item.icon className={cn(
                      "w-[18px] h-[18px] transition-colors",
                      isActive ? "text-blue-400" : "text-slate-500 group-hover:text-blue-400"
                    )} />
                    <span className="text-[13.5px]">{item.name}</span>
                    {isActive && (
                      <div className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* User Profile Footer */}
      <div className="p-4 mt-auto border-t border-slate-800 bg-slate-900/50">
        <div 
          onClick={handleLogout}
          className="flex items-center gap-3 p-2 rounded-xl bg-slate-800/40 hover:bg-slate-800 transition-colors cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold text-sm border border-blue-500/20">
            {user?.username?.charAt(0).toUpperCase() || "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">{user?.username || "Agent"}</p>
            <p className="text-[10px] text-slate-500 font-medium truncate uppercase tracking-tighter">
              {user?.role || "Administrator"}
            </p>
          </div>
          <LogOut className="w-4 h-4 text-slate-500 group-hover:text-red-400 transition-colors" />
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
          background: #334155;
          border-radius: 10px;
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
