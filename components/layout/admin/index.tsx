"use client";

import { useState, useMemo, useEffect } from "react";
import useGlobalStore from "@/stores";
import {
  SIDEBAR_GROUPS,
  SIDEBAR_FOOTER_ITEMS,
  getItem,
  Search,
} from "./sidebar-config";
import { Bell, ChevronsLeft, ChevronsRight, Moon, Sun } from "lucide-react";
import type { AdminView } from "@/types";

interface Props {
  children: React.ReactNode;
  badges?: Record<string, number | undefined>;
}

const SidebarHeader = ({
  collapsed,
  toggle,
}: {
  collapsed: boolean;
  toggle: () => void;
}) => (
  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
    {!collapsed && (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold text-sm">
          C
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            CompaniesCenter
          </span>
          <span className="text-[10px] uppercase tracking-wider text-blue-600 dark:text-blue-400 font-medium">
            Admin Console
          </span>
        </div>
      </div>
    )}
    <button
      type="button"
      onClick={toggle}
      className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
      aria-label="Toggle sidebar"
    >
      {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
    </button>
  </div>
);

const SidebarItem = ({
  active,
  collapsed,
  onClick,
  Icon,
  label,
  badge,
  danger,
}: {
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
  Icon: any;
  label: string;
  badge?: number;
  danger?: boolean;
}) => {
  const base =
    "group flex items-center w-full text-left text-sm transition-colors duration-150 rounded-md";
  const sizing = collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2 gap-3";
  const state = active
    ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-medium"
    : danger
    ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} ${sizing} ${state}`}
      title={collapsed ? label : undefined}
    >
      <Icon size={collapsed ? 18 : 16} className="shrink-0" />
      {!collapsed && <span className="flex-1 truncate">{label}</span>}
      {!collapsed && badge !== undefined && badge > 0 && (
        <span
          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
            active
              ? "bg-blue-600 text-white"
              : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
          }`}
        >
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </button>
  );
};

const Sidebar = ({
  collapsed,
  toggle,
  activeView,
  setActiveView,
  badges,
}: {
  collapsed: boolean;
  toggle: () => void;
  activeView: AdminView;
  setActiveView: (v: AdminView) => void;
  badges?: Record<string, number | undefined>;
}) => (
  <aside
    className={`shrink-0 transition-all duration-200 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col h-full ${
      collapsed ? "w-16" : "w-64"
    }`}
  >
    <SidebarHeader collapsed={collapsed} toggle={toggle} />
    <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-4 scrollbar-thin">
      {SIDEBAR_GROUPS.map((group) => (
        <div key={group.title}>
          {!collapsed && (
            <p className="px-3 mb-1.5 text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold">
              {group.title}
            </p>
          )}
          <div className="space-y-0.5">
            {group.items.map((item) => (
              <SidebarItem
                key={item.key}
                active={activeView === item.key}
                collapsed={collapsed}
                onClick={() => setActiveView(item.key)}
                Icon={item.icon}
                label={item.label}
                badge={item.badgeKey ? badges?.[item.badgeKey] : undefined}
              />
            ))}
          </div>
        </div>
      ))}
    </nav>
    <div className="border-t border-slate-100 dark:border-slate-800 p-2 space-y-0.5">
      {SIDEBAR_FOOTER_ITEMS.map((item) => (
        <SidebarItem
          key={item.key}
          active={false}
          collapsed={collapsed}
          onClick={() =>
            item.label === "Logout"
              ? useGlobalStore.getState().logout()
              : setActiveView(item.key)
          }
          Icon={item.icon}
          label={item.label}
          danger
        />
      ))}
    </div>
  </aside>
);

const TopBar = ({
  activeView,
  notifications,
  dark,
  toggleDark,
}: {
  activeView: AdminView;
  notifications?: number;
  dark: boolean;
  toggleDark: () => void;
}) => {
  const item = getItem(activeView);
  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center px-6 gap-4 shrink-0">
      <div className="flex flex-col min-w-0">
        <h1 className="text-lg font-semibold text-slate-900 dark:text-white truncate">
          {item?.label ?? "Dashboard"}
        </h1>
      </div>
      <div className="flex-1 max-w-xl hidden md:flex items-center bg-slate-50 dark:bg-slate-800/60 rounded-lg px-3 h-9 mx-4 border border-transparent focus-within:border-blue-300">
        <Search size={16} className="text-slate-400" />
        <input
          type="text"
          aria-label="Global search"
          placeholder="Search users, tasks, bookings…"
          className="bg-transparent ml-2 flex-1 outline-none text-sm text-slate-700 dark:text-slate-200"
        />
      </div>
      <div className="flex items-center gap-1 ml-auto">
        <button
          type="button"
          onClick={toggleDark}
          className="w-9 h-9 rounded-md flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Toggle theme"
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <button
          type="button"
          aria-label="Notifications"
          className="relative w-9 h-9 rounded-md flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Bell size={16} />
          {notifications !== undefined && notifications > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-semibold flex items-center justify-center">
              {notifications > 9 ? "9+" : notifications}
            </span>
          )}
        </button>
        <div className="ml-3 flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-slate-700">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-xs font-semibold flex items-center justify-center">
            JD
          </div>
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="text-xs font-semibold text-slate-900 dark:text-white">
              John Admin
            </span>
            <span className="text-[10px] text-slate-500">Super Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default function AdminDashboardLayout({ children, badges }: Props) {
  const { activeView, setActiveView, sidebarOpen, toggleSidebar } =
    useGlobalStore();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const view = (activeView as AdminView) ?? "dashboard";

  const totalNotifications = useMemo(
    () => Object.values(badges ?? {}).reduce((a: number, b) => a + (b ?? 0), 0),
    [badges]
  );

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950">
      <Sidebar
        collapsed={!sidebarOpen}
        toggle={toggleSidebar}
        activeView={view}
        setActiveView={(v) => setActiveView(v as any)}
        badges={badges}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          activeView={view}
          notifications={totalNotifications}
          dark={dark}
          toggleDark={() => setDark((d) => !d)}
        />
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-950">
          {children}
        </main>
      </div>
    </div>
  );
}
