"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminDashboardLayout from "@/components/layout/admin";
import useGlobalStore from "@/stores";
import { useAdminLiveUpdates } from "@/hooks/useAdminLiveUpdates";
import { getMyAdminUser } from "@/axios/admin";
import DashboardView from "@/screens/admin/dashboard-view";
import { UsersView } from "@/screens/admin/views/UsersView";
import { ProvidersView } from "@/screens/admin/views/ProvidersView";
import { ClientsView } from "@/screens/admin/views/ClientsView";
import { TasksView } from "@/screens/admin/views/TasksView";
import { SupportView } from "@/screens/admin/views/SupportView";
import { DisputesView } from "@/screens/admin/views/DisputesView";
import { FraudView } from "@/screens/admin/views/FraudView";
import { FeatureFlagsView } from "@/screens/admin/views/FeatureFlagsView";
import { AuditView } from "@/screens/admin/views/AuditView";
import { RolesView } from "@/screens/admin/views/RolesView";
import { SubscriptionsView } from "@/screens/admin/views/SubscriptionsView";
import { SystemHealthView } from "@/screens/admin/views/SystemHealthView";
import { ModerationView } from "@/screens/admin/views/ModerationView";
import { PlaceholderView } from "@/screens/admin/views/PlaceholderView";
import {
  CalendarCheck,
  FolderKanban,
  MessageSquare,
  CreditCard,
  Wallet,
  Banknote,
  ShieldCheck,
  Star,
  FileBarChart2,
  BellRing,
  Megaphone,
  LineChart,
  KeyRound,
  Settings,
  Cable,
  Plug,
  FileText,
} from "lucide-react";
import {
  getTicketStats,
  getDisputeStats,
  getFraudStats,
  getModerationStats,
  getDashboardOverview,
} from "@/axios/admin";

const AdminDashboard = () => {
  const router = useRouter();
  const { activeView } = useGlobalStore();
  const [badges, setBadges] = useState<Record<string, number | undefined>>({});
  const [authState, setAuthState] = useState<"checking" | "ok" | "denied">(
    "checking",
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const me = await getMyAdminUser();
        if (cancelled) return;
        if (me && (me as any).adminUser) {
          setAuthState("ok");
        } else {
          setAuthState("denied");
          router.replace("/signin?next=/admin");
        }
      } catch {
        if (cancelled) return;
        setAuthState("denied");
        router.replace("/signin?next=/admin");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const refreshBadges = useCallback(async (scopes?: Set<string>) => {
    const want = (s: string) => !scopes || scopes.has(s);
    const [t, d, f, m, o] = await Promise.allSettled([
      want("tickets") ? getTicketStats() : Promise.resolve(null),
      want("disputes") ? getDisputeStats() : Promise.resolve(null),
      want("fraud") ? getFraudStats() : Promise.resolve(null),
      want("moderation") ? getModerationStats() : Promise.resolve(null),
      want("tasks") || want("dashboard")
        ? getDashboardOverview()
        : Promise.resolve(null),
    ]);
    setBadges((prev) => ({
      ...prev,
      ...(want("tickets") && {
        openTickets:
          t.status === "fulfilled" && t.value
            ? (t.value as any).openTickets
            : prev.openTickets,
      }),
      ...(want("disputes") && {
        openDisputes:
          d.status === "fulfilled" && d.value
            ? (d.value as any).open + (d.value as any).underReview
            : prev.openDisputes,
      }),
      ...(want("fraud") && {
        fraudAlerts:
          f.status === "fulfilled" && f.value
            ? (f.value as any).openAlerts
            : prev.fraudAlerts,
      }),
      ...(want("moderation") && {
        moderationQueue:
          m.status === "fulfilled" && m.value
            ? (m.value as any).queued
            : prev.moderationQueue,
      }),
      ...((want("tasks") || want("dashboard")) && {
        openTasks:
          o.status === "fulfilled" && o.value
            ? (o.value as any).kpis?.openTasks
            : prev.openTasks,
      }),
    }));
  }, []);

  useEffect(() => {
    if (authState !== "ok") return;
    void refreshBadges();
  }, [authState, refreshBadges]);

  useAdminLiveUpdates(
    useCallback(
      (payload) => {
        if (authState !== "ok") return;
        void refreshBadges(new Set([payload.scope]));
      },
      [authState, refreshBadges],
    ),
  );

  if (authState === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 text-sm">
        Verifying access…
      </div>
    );
  }

  if (authState === "denied") {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 text-sm">
        Redirecting to sign in…
      </div>
    );
  }

  return (
    <AdminDashboardLayout badges={badges}>
      {renderView(activeView as any)}
    </AdminDashboardLayout>
  );
};

function renderView(view: string) {
  switch (view) {
    case "dashboard":
      return <DashboardView />;
    case "users":
      return <UsersView />;
    case "support":
      return <SupportView />;
    case "disputes":
      return <DisputesView />;
    case "fraud":
      return <FraudView />;
    case "feature_flags":
      return <FeatureFlagsView />;
    case "audit":
      return <AuditView />;
    case "roles":
      return <RolesView />;
    case "subscriptions":
      return <SubscriptionsView />;
    case "system_health":
      return <SystemHealthView />;
    case "moderation":
      return <ModerationView />;

    case "providers":
      return <ProvidersView />;
    case "clients":
      return <ClientsView />;
    case "tasks":
      return <TasksView />;
    case "bookings":
      return (
        <PlaceholderView
          title="Bookings"
          description="Review and resolve bookings between clients and providers."
          icon={CalendarCheck}
        />
      );
    case "projects":
      return (
        <PlaceholderView
          title="Projects"
          description="Long-running multi-milestone engagements between clients and providers."
          icon={FolderKanban}
        />
      );
    case "messages":
      return (
        <PlaceholderView
          title="Messages"
          description="Search direct messages for moderation or support context."
          icon={MessageSquare}
        />
      );
    case "payments":
      return (
        <PlaceholderView
          title="Payments"
          description="Payments are processed off-platform; this view tracks reconciliation only."
          icon={CreditCard}
        />
      );
    case "wallets":
      return <PlaceholderView title="Wallets" description="Wallet balances and transactions." icon={Wallet} />;
    case "withdrawals":
      return (
        <PlaceholderView
          title="Withdrawals"
          description="Approve, reject and audit provider withdrawal requests."
          icon={Banknote}
        />
      );
    case "escrow":
      return (
        <PlaceholderView
          title="Escrow"
          description="Monitor escrow balances and release of milestone funds."
          icon={ShieldCheck}
        />
      );
    case "reviews":
      return <PlaceholderView title="Reviews" description="Moderate platform reviews." icon={Star} />;
    case "reports":
      return (
        <PlaceholderView
          title="Reports"
          description="User-generated reports and abuse complaints."
          icon={FileBarChart2}
        />
      );
    case "notifications":
      return (
        <PlaceholderView
          title="Notifications"
          description="Send and audit platform notifications (email, SMS, push, in-app)."
          icon={BellRing}
        />
      );
    case "marketing":
      return (
        <PlaceholderView
          title="Marketing"
          description="Campaigns, banners, promotions and referral programs."
          icon={Megaphone}
        />
      );
    case "analytics":
      return (
        <PlaceholderView
          title="Analytics"
          description="Deep-dive metrics on growth, conversion, retention and LTV."
          icon={LineChart}
        />
      );
    case "compliance":
      return (
        <PlaceholderView
          title="Compliance"
          description="KYC reviews, sanctions screening and regulatory reporting."
          icon={KeyRound}
        />
      );
    case "cms":
      return (
        <PlaceholderView
          title="CMS"
          description="Homepage, categories, FAQs, help center, ToS and marketing banners."
          icon={FileText}
        />
      );
    case "settings":
      return (
        <PlaceholderView title="Settings" description="Platform-wide configuration." icon={Settings} />
      );
    case "api":
      return (
        <PlaceholderView title="API Management" description="API keys, rate limits, webhooks." icon={Cable} />
      );
    case "integrations":
      return (
        <PlaceholderView
          title="Integrations"
          description="Third-party integrations and webhooks."
          icon={Plug}
        />
      );
    default:
      return <DashboardView />;
  }
}

export default AdminDashboard;
