"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Lock,
  Bell,
  Shield,
  Trash2,
  ChevronRight,
  Camera,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Loader2,
  Building2,
  Globe,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
} from "lucide-react";
import useGlobalStore from "@/stores";

// ── Types ─────────────────────────────────────────────────────────────────────

type SectionId = "profile" | "account" | "notifications" | "privacy";

interface SectionLink {
  id: SectionId;
  label: string;
  icon: React.ReactNode;
  providerOnly?: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const inputBase =
  "w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed";

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-black text-gray-900 dark:text-white">
        {title}
      </h2>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {description}
        </p>
      )}
    </div>
  );
}

function FieldLabel({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide"
    >
      {children}
    </label>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 space-y-4">
      {children}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="w-full flex items-center justify-between gap-4 py-1 group"
    >
      <div className="text-left min-w-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">
          {label}
        </p>
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">
            {description}
          </p>
        )}
      </div>
      <div
        className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors ${
          checked ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
        }`}
      >
        <motion.span
          layout
          className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
          animate={{ left: checked ? "calc(100% - 1.375rem)" : "0.125rem" }}
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
        />
      </div>
    </button>
  );
}

// ── Profile Section ───────────────────────────────────────────────────────────

function ProfileSection() {
  const { user, updateUserProfile } = useGlobalStore();
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [phone, setPhone] = useState(user?.phoneNumber ?? "");
  const [location, setLocation] = useState(user?.homeAddress ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const avatarSrc =
    avatarPreview ||
    (typeof user?.profilePicture === "object"
      ? user?.profilePicture?.url
      : user?.profilePicture) ||
    null;

  const pickAvatar = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setAvatarFile(f);
    setAvatarPreview(URL.createObjectURL(f));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("firstName", firstName.trim());
      fd.append("lastName", lastName.trim());
      if (phone.trim()) fd.append("phoneNumber", phone.trim());
      if (location.trim()) fd.append("homeAddress", location.trim());
      if (avatarFile) fd.append("profilePicture", avatarFile);
      await updateUserProfile("Client", fd);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // error handled by store
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <SectionHeading
        title="Profile"
        description="Update your public profile information."
      />

      {/* Avatar */}
      <Card>
        <div className="flex items-center gap-4">
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-violet-100 dark:from-blue-950/40 dark:to-violet-950/40 overflow-hidden">
              {avatarSrc ? (
                <Image
                  src={avatarSrc}
                  alt="Avatar"
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User size={24} className="text-blue-400" />
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-md transition-colors"
              aria-label="Change photo"
            >
              <Camera size={13} />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              title="Upload photo"
              onChange={pickAvatar}
            />
          </div>
          <div>
            <p className="font-bold text-gray-900 dark:text-white text-sm">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {user?.email}
            </p>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline mt-1"
            >
              Change photo
            </button>
          </div>
        </div>
      </Card>

      {/* Name */}
      <Card>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <FieldLabel htmlFor="firstName">First name</FieldLabel>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={inputBase}
              placeholder="First name"
            />
          </div>
          <div>
            <FieldLabel htmlFor="lastName">Last name</FieldLabel>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={inputBase}
              placeholder="Last name"
            />
          </div>
        </div>

        <div>
          <FieldLabel htmlFor="settingsPhone">Phone number</FieldLabel>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
              <Phone size={13} className="text-gray-400" />
            </div>
            <input
              id="settingsPhone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`${inputBase} pl-8`}
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>

        <div>
          <FieldLabel htmlFor="settingsLocation">Home address</FieldLabel>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
              <MapPin size={13} className="text-gray-400" />
            </div>
            <input
              id="settingsLocation"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={`${inputBase} pl-8`}
              placeholder="City, State"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold transition-colors"
        >
          {saving ? (
            <Loader2 size={14} className="animate-spin" />
          ) : saved ? (
            <Check size={14} />
          ) : null}
          {saving ? "Saving…" : saved ? "Saved" : "Save changes"}
        </button>
      </Card>
    </div>
  );
}

// ── Account Section ───────────────────────────────────────────────────────────

function AccountSection() {
  const { user } = useGlobalStore();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);

  const handleChangePassword = async () => {
    setPwError("");
    if (newPw.length < 8) {
      setPwError("New password must be at least 8 characters.");
      return;
    }
    if (newPw !== confirmPw) {
      setPwError("Passwords don't match.");
      return;
    }
    setPwSaving(true);
    try {
      // await changePassword(currentPw, newPw) — wire up when API is ready
      await new Promise((r) => setTimeout(r, 900));
      setPwSaved(true);
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
      setTimeout(() => setPwSaved(false), 2500);
    } catch {
      setPwError("Failed to change password. Check your current password.");
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <SectionHeading
        title="Account"
        description="Manage your login credentials and account details."
      />

      {/* Email (read-only) */}
      <Card>
        <div>
          <FieldLabel>Email address</FieldLabel>
          <div className="flex items-center gap-3 h-11 px-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
            <Mail size={13} className="text-gray-400 flex-shrink-0" />
            <span className="text-sm text-gray-600 dark:text-gray-400 flex-1 truncate">
              {user?.email}
            </span>
            {user?.isEmailVerified && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full flex-shrink-0">
                <Check size={9} />
                Verified
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">
            Contact support to change your email address.
          </p>
        </div>
      </Card>

      {/* Password */}
      <Card>
        <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">
          Change password
        </p>

        {[
          {
            id: "currentPw",
            label: "Current password",
            val: currentPw,
            set: setCurrentPw,
            show: showCurrent,
            toggle: () => setShowCurrent((v) => !v),
          },
          {
            id: "newPw",
            label: "New password",
            val: newPw,
            set: setNewPw,
            show: showNew,
            toggle: () => setShowNew((v) => !v),
          },
          {
            id: "confirmPw",
            label: "Confirm new password",
            val: confirmPw,
            set: setConfirmPw,
            show: showConfirm,
            toggle: () => setShowConfirm((v) => !v),
          },
        ].map(({ id, label, val, set, show, toggle }) => (
          <div key={id}>
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            <div className="relative">
              <input
                id={id}
                type={show ? "text" : "password"}
                value={val}
                onChange={(e) => set(e.target.value)}
                className={`${inputBase} pr-10`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={toggle}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label={show ? "Hide" : "Show"}
              >
                {show ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
        ))}

        <AnimatePresence>
          {pwError && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1.5 text-xs text-red-500"
            >
              <AlertCircle size={11} />
              {pwError}
            </motion.p>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={handleChangePassword}
          disabled={pwSaving || !currentPw || !newPw || !confirmPw}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold transition-colors"
        >
          {pwSaving ? (
            <Loader2 size={14} className="animate-spin" />
          ) : pwSaved ? (
            <Check size={14} />
          ) : null}
          {pwSaving
            ? "Updating…"
            : pwSaved
            ? "Password updated"
            : "Update password"}
        </button>
      </Card>

      {/* Account control */}
      <Card>
        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
          Account control
        </p>

        <Link
          href="/settings/account-control/deletion"
          className="flex items-center gap-4 py-1 group"
        >
          <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
            <Shield size={16} className="text-gray-600 dark:text-gray-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Deactivation and Deletion
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Deactivate or permanently delete your account
            </p>
          </div>
          <ChevronRight
            size={15}
            className="text-gray-400 flex-shrink-0 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors"
          />
        </Link>
      </Card>
    </div>
  );
}

// ── Notifications Section ─────────────────────────────────────────────────────

function NotificationsSection() {
  const [prefs, setPrefs] = useState({
    taskUpdates: true,
    newProposals: true,
    messages: true,
    marketing: false,
    weeklyDigest: true,
    smsAlerts: false,
  });

  const toggle = (key: keyof typeof prefs) =>
    setPrefs((p) => ({ ...p, [key]: !p[key] }));

  return (
    <div className="space-y-4">
      <SectionHeading
        title="Notifications"
        description="Choose what you want to be notified about."
      />

      <Card>
        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
          Activity
        </p>
        <Toggle
          checked={prefs.taskUpdates}
          onChange={() => toggle("taskUpdates")}
          label="Task updates"
          description="When a task status changes or you receive an update"
        />
        <div className="border-t border-gray-100 dark:border-gray-800" />
        <Toggle
          checked={prefs.newProposals}
          onChange={() => toggle("newProposals")}
          label="New proposals"
          description="When a provider submits a proposal on your task"
        />
        <div className="border-t border-gray-100 dark:border-gray-800" />
        <Toggle
          checked={prefs.messages}
          onChange={() => toggle("messages")}
          label="Messages"
          description="New messages and conversation replies"
        />
      </Card>

      <Card>
        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
          Marketing
        </p>
        <Toggle
          checked={prefs.marketing}
          onChange={() => toggle("marketing")}
          label="Promotional emails"
          description="Offers, tips, and product announcements"
        />
        <div className="border-t border-gray-100 dark:border-gray-800" />
        <Toggle
          checked={prefs.weeklyDigest}
          onChange={() => toggle("weeklyDigest")}
          label="Weekly digest"
          description="A weekly summary of activity and recommendations"
        />
      </Card>

      <Card>
        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
          Channels
        </p>
        <Toggle
          checked={prefs.smsAlerts}
          onChange={() => toggle("smsAlerts")}
          label="SMS alerts"
          description="Critical alerts via text message"
        />
      </Card>

      <button
        type="button"
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors"
      >
        Save preferences
      </button>
    </div>
  );
}

// ── Privacy Section ───────────────────────────────────────────────────────────

function PrivacySection() {
  const { user } = useGlobalStore();
  const isProvider = user?.activeRole === "Provider";

  const [prefs, setPrefs] = useState({
    profilePublic: true,
    showEmail: false,
    showPhone: false,
    allowIndexing: true,
    twoFactor: false,
  });

  const toggle = (key: keyof typeof prefs) =>
    setPrefs((p) => ({ ...p, [key]: !p[key] }));

  return (
    <div className="space-y-4">
      <SectionHeading
        title="Privacy & Security"
        description="Control who can see your information and how your account is secured."
      />

      <Card>
        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
          Visibility
        </p>
        <Toggle
          checked={prefs.profilePublic}
          onChange={() => toggle("profilePublic")}
          label="Public profile"
          description={
            isProvider
              ? "Allow clients to discover your business profile"
              : "Allow providers to see your profile"
          }
        />
        <div className="border-t border-gray-100 dark:border-gray-800" />
        <Toggle
          checked={prefs.showEmail}
          onChange={() => toggle("showEmail")}
          label="Show email address"
          description="Display your email on your public profile"
        />
        <div className="border-t border-gray-100 dark:border-gray-800" />
        <Toggle
          checked={prefs.showPhone}
          onChange={() => toggle("showPhone")}
          label="Show phone number"
          description="Display your phone number on your public profile"
        />
        {isProvider && (
          <>
            <div className="border-t border-gray-100 dark:border-gray-800" />
            <Toggle
              checked={prefs.allowIndexing}
              onChange={() => toggle("allowIndexing")}
              label="Search engine indexing"
              description="Allow your business to appear in search engine results"
            />
          </>
        )}
      </Card>

      <Card>
        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
          Security
        </p>
        <Toggle
          checked={prefs.twoFactor}
          onChange={() => toggle("twoFactor")}
          label="Two-factor authentication"
          description="Add an extra layer of security to your account"
        />

        <div className="border-t border-gray-100 dark:border-gray-800" />

        <div className="flex items-center justify-between py-1">
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Active sessions
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Manage devices currently signed in
            </p>
          </div>
          <button
            type="button"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex-shrink-0"
          >
            View
          </button>
        </div>
      </Card>

      <button
        type="button"
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors"
      >
        Save preferences
      </button>
    </div>
  );
}

// ── Main Settings Page ────────────────────────────────────────────────────────

const NAV: SectionLink[] = [
  { id: "profile", label: "Profile", icon: <User size={16} /> },
  { id: "account", label: "Account", icon: <Lock size={16} /> },
  {
    id: "notifications",
    label: "Notifications",
    icon: <Bell size={16} />,
  },
  { id: "privacy", label: "Privacy & Security", icon: <Shield size={16} /> },
];

export default function SettingsPage() {
  const { user } = useGlobalStore();
  const [active, setActive] = useState<SectionId>("profile");
  const isProvider = user?.activeRole === "Provider";

  const visibleNav = NAV.filter((n) => !n.providerOnly || isProvider);

  const SECTION_MAP: Record<SectionId, React.ReactNode> = {
    profile: <ProfileSection />,
    account: <AccountSection />,
    notifications: <NotificationsSection />,
    privacy: <PrivacySection />,
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Manage your account preferences and information.
          </p>
        </div>

        <div className="flex gap-6 items-start">
          {/* ── Sidebar ──────────────────────────────────────────────── */}
          <aside className="hidden md:block w-52 flex-shrink-0 sticky top-24">
            <nav className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
              {/* User chip */}
              <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-100 to-violet-100 dark:from-blue-950/40 dark:to-violet-950/40 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {user?.profilePicture ? (
                    <Image
                      src={
                        typeof user.profilePicture === "object"
                          ? (user.profilePicture as any).url
                          : user.profilePicture
                      }
                      alt="Avatar"
                      width={36}
                      height={36}
                      className="object-cover"
                    />
                  ) : (
                    <User size={15} className="text-blue-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                      isProvider
                        ? "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                    }`}
                  >
                    {isProvider ? "Provider" : "Client"}
                  </span>
                </div>
              </div>

              <div className="py-2">
                {visibleNav.map((item) => {
                  const isActive = active === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActive(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold transition-colors text-left ${
                        isActive
                          ? "bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </nav>
          </aside>

          {/* ── Mobile nav tabs ───────────────────────────────────────── */}
          <div className="md:hidden flex gap-1.5 overflow-x-auto pb-1 w-full scrollbar-hide">
            {visibleNav.map((item) => {
              const isActive = active === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActive(item.id)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
                    isActive
                      ? "bg-blue-600 border-transparent text-white"
                      : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* ── Content ──────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
              >
                {SECTION_MAP[active]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
