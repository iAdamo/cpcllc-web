"use client";

import { useEffect, useState } from "react";
import AdminDashboardLayout from "@/components/layout/admin";
import useGlobalStore from "@/stores";
import DashboardView from "@/screens/admin/dashboard-view";
import { UsersView } from "@/screens/admin/views/UsersView";
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
  Building2,
  UserCog,
  ListTodo,
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
  const { activeView } = useGlobalStore();
  const [badges, setBadges] = useState<Record<string, number | undefined>>({});

  useEffect(() => {
    let mounted = true;
    (async () => {
      const [t, d, f, m, o] = await Promise.allSettled([
        getTicketStats(),
        getDisputeStats(),
        getFraudStats(),
        getModerationStats(),
        getDashboardOverview(),
      ]);
      if (!mounted) return;
      setBadges({
        openTickets: t.status === "fulfilled" ? (t.value as any).openTickets : undefined,
        openDisputes:
          d.status === "fulfilled" ? (d.value as any).open + (d.value as any).underReview : undefined,
        fraudAlerts: f.status === "fulfilled" ? (f.value as any).openAlerts : undefined,
        moderationQueue: m.status === "fulfilled" ? (m.value as any).queued : undefined,
        openTasks: o.status === "fulfilled" ? (o.value as any).kpis?.openTasks : undefined,
      });
    })();
    return () => {
      mounted = false;
    };
  }, []);

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
      return (
        <PlaceholderView
          title="Service Providers"
          description="Verify, suspend, feature, blacklist and review KYC for service providers."
          icon={Building2}
          features={[
            "Portfolio, services and certifications",
            "Jobs, ratings and reviews",
            "Earnings & withdrawal requests",
            "KYC, compliance documents and background verification",
            "Provider, performance and risk scores",
          ]}
        />
      );
    case "clients":
      return (
        <PlaceholderView
          title="Clients"
          description="Full client profiles with risk score, support history and admin notes."
          icon={UserCog}
          features={[
            "Identity & verification",
            "Tasks posted & payment history",
            "Reviews, reports and risk score",
            "Suspend, ban, verify and add admin notes",
          ]}
        />
      );
    case "tasks":
      return (
        <PlaceholderView
          title="Tasks"
          description="Approve, reject, feature, promote, archive or escalate marketplace tasks."
          icon={ListTodo}
          features={[
            "Filter by status, category, location, budget, urgency",
            "Approve, reject, archive, feature, promote",
            "Escalate to compliance or moderation",
            "View task timeline and audit trail",
          ]}
        />
      );
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
