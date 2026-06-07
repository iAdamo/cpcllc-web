import {
  LayoutDashboard,
  Users,
  UserCog,
  Building2,
  ListTodo,
  CalendarCheck,
  FolderKanban,
  MessageSquare,
  CreditCard,
  Wallet,
  Banknote,
  ShieldCheck,
  AlertOctagon,
  Star,
  FileBarChart2,
  ShieldAlert,
  LifeBuoy,
  BellRing,
  Megaphone,
  LineChart,
  Search,
  Activity,
  Flag,
  FileText,
  Settings,
  KeyRound,
  ClipboardList,
  Cable,
  Plug,
  type LucideIcon,
  LogOut,
  Receipt,
} from "lucide-react";
import type { AdminView } from "@/types";

export interface SidebarItem {
  key: AdminView;
  label: string;
  icon: LucideIcon;
  badgeKey?: string;
}

export interface SidebarGroup {
  title: string;
  items: SidebarItem[];
}

export const SIDEBAR_GROUPS: SidebarGroup[] = [
  {
    title: "Overview",
    items: [
      { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { key: "analytics", label: "Analytics", icon: LineChart },
    ],
  },
  {
    title: "Marketplace",
    items: [
      { key: "users", label: "Users", icon: Users },
      { key: "providers", label: "Service Providers", icon: Building2 },
      { key: "clients", label: "Clients", icon: UserCog },
      { key: "tasks", label: "Tasks", icon: ListTodo, badgeKey: "openTasks" },
      { key: "bookings", label: "Bookings", icon: CalendarCheck },
      { key: "projects", label: "Projects", icon: FolderKanban },
      { key: "reviews", label: "Reviews", icon: Star },
      { key: "messages", label: "Messages", icon: MessageSquare },
    ],
  },
  {
    title: "Trust & Safety",
    items: [
      { key: "disputes", label: "Disputes", icon: AlertOctagon, badgeKey: "openDisputes" },
      { key: "moderation", label: "Moderation", icon: ShieldCheck, badgeKey: "moderationQueue" },
      { key: "reports", label: "Reports", icon: FileBarChart2 },
      { key: "fraud", label: "Fraud Detection", icon: ShieldAlert, badgeKey: "fraudAlerts" },
      { key: "compliance", label: "Compliance", icon: KeyRound },
    ],
  },
  {
    title: "Finance",
    items: [
      { key: "subscriptions", label: "Subscriptions", icon: Receipt },
      { key: "payments", label: "Payments", icon: CreditCard },
      { key: "wallets", label: "Wallets", icon: Wallet },
      { key: "withdrawals", label: "Withdrawals", icon: Banknote },
      { key: "escrow", label: "Escrow", icon: ShieldCheck },
    ],
  },
  {
    title: "Support",
    items: [
      { key: "support", label: "Support Tickets", icon: LifeBuoy, badgeKey: "openTickets" },
      { key: "notifications", label: "Notifications", icon: BellRing },
    ],
  },
  {
    title: "Growth",
    items: [
      { key: "marketing", label: "Marketing", icon: Megaphone },
      { key: "cms", label: "CMS", icon: FileText },
    ],
  },
  {
    title: "System",
    items: [
      { key: "system_health", label: "System Health", icon: Activity },
      { key: "feature_flags", label: "Feature Flags", icon: Flag },
      { key: "roles", label: "Roles & Permissions", icon: UserCog },
      { key: "audit", label: "Audit Logs", icon: ClipboardList },
      { key: "api", label: "API Management", icon: Cable },
      { key: "integrations", label: "Integrations", icon: Plug },
      { key: "settings", label: "Settings", icon: Settings },
    ],
  },
];

export const SIDEBAR_FOOTER_ITEMS: SidebarItem[] = [
  { key: "logout", label: "Logout", icon: LogOut },
];

export const ALL_ITEMS: SidebarItem[] = SIDEBAR_GROUPS.flatMap((g) => g.items);

export function getItem(view: AdminView): SidebarItem | undefined {
  return ALL_ITEMS.find((i) => i.key === view) ?? SIDEBAR_FOOTER_ITEMS.find((i) => i.key === view);
}

export { Search };
