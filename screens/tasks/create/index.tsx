"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Calendar,
  DollarSign,
  Eye,
  ImagePlus,
  Loader2,
  MapPin,
  Shield,
  User,
  X,
  Zap,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { createJob } from "@/axios/service";
import { Category } from "@/types";

// ── Types ────────────────────────────────────────────────────────────────────

type Urgency = "Normal" | "Urgent" | "Immediate";
type Visibility = "Public" | "Verified_Only";

interface FormErrors {
  title?: string;
  description?: string;
  budget?: string;
  subcategoryId?: string;
  deadline?: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function todayString(): string {
  return new Date().toISOString().split("T")[0];
}

function formatPreviewBudget(n: number | string): string {
  const num = typeof n === "string" ? parseFloat(n) : n;
  if (!num || isNaN(num)) return "$—";
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `$${(num / 1000).toFixed(0)}K`;
  return `$${num.toLocaleString()}`;
}

function deadlineLabel(d: string): string {
  if (!d) return "No deadline";
  const days = Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
  if (days < 0) return "Expired";
  if (days === 0) return "Due today";
  return `${days}d left`;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function FieldLabel({
  children,
  htmlFor,
  required,
}: {
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide"
    >
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
      <AlertCircle size={10} />
      {message}
    </p>
  );
}

const inputBase =
  "w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";

const inputError = "border-red-400 dark:border-red-600 focus:ring-red-500";

// ── Preview Card ──────────────────────────────────────────────────────────────

interface PreviewCardProps {
  title: string;
  budget: string;
  urgency: Urgency;
  deadline: string;
  categoryName: string;
  subcategoryName: string;
  visibility: Visibility;
  anonymous: boolean;
  negotiable: boolean;
}

function PreviewCard({
  title,
  budget,
  urgency,
  deadline,
  categoryName,
  subcategoryName,
  visibility,
  anonymous,
  negotiable,
}: PreviewCardProps) {
  const URGENCY_COLOR: Record<Urgency, string> = {
    Normal: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
    Urgent:
      "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
    Immediate: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
  };

  const VISIBILITY_ICON: Record<Visibility, React.ReactNode> = {
    Public: <Eye size={10} />,
    Verified_Only: <Shield size={10} />,
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-950/40 dark:to-violet-950/40 flex items-center justify-center flex-shrink-0">
          <Briefcase size={18} className="text-blue-500 dark:text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 dark:text-white text-sm leading-snug line-clamp-2">
            {title || "Your task title"}
          </p>
          {subcategoryName && (
            <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">
              {subcategoryName}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="text-lg font-black text-gray-900 dark:text-white">
          {formatPreviewBudget(budget)}
          {negotiable && (
            <span className="ml-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 align-middle">
              NEG
            </span>
          )}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {urgency !== "Normal" && (
          <span
            className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${URGENCY_COLOR[urgency]}`}
          >
            <Zap size={9} />
            {urgency}
          </span>
        )}
        {deadline && (
          <span className="flex items-center gap-1 text-[10px] font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full">
            <Calendar size={9} />
            {deadlineLabel(deadline)}
          </span>
        )}
        <span className="flex items-center gap-1 text-[10px] font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full">
          {VISIBILITY_ICON[visibility]}
          {visibility}
        </span>
        {anonymous && (
          <span className="flex items-center gap-1 text-[10px] font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full">
            <User size={9} />
            Anonymous
          </span>
        )}
      </div>

      {categoryName && (
        <p className="text-[11px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
          <MapPin size={9} />
          {categoryName}
        </p>
      )}

      <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
          This is a live preview of how your task will appear to providers.
        </p>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function CreateTaskPage() {
  const router = useRouter();
  const { data: categoriesData } = useCategories();
  const categories: Category[] = categoriesData ?? [];

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("");
  const [budget, setBudget] = useState("");
  const [negotiable, setNegotiable] = useState(false);
  const [urgency, setUrgency] = useState<Urgency>("Normal");
  const [deadline, setDeadline] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("Public");
  const [locationInput, setLocationInput] = useState("");
  const [anonymous, setAnonymous] = useState(false);

  // Images
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // UI state
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Derived
  const selectedCategory = categories.find((c) => c._id === selectedCategoryId);
  const subcategories = selectedCategory?.subcategories ?? [];
  const selectedSubcategory = subcategories.find(
    (s) => s._id === selectedSubcategoryId
  );

  // ── Image handlers ──────────────────────────────────────────────────────────

  const addImages = useCallback((incoming: FileList | File[]) => {
    const arr = Array.from(incoming).filter((f) => f.type.startsWith("image/"));
    setImageFiles((prev) => {
      const combined = [...prev, ...arr].slice(0, 5);
      const newPreviews = combined.map((f) => URL.createObjectURL(f));
      setImagePreviews(newPreviews);
      return combined;
    });
  }, []);

  const removeImage = useCallback(
    (idx: number) => {
      URL.revokeObjectURL(imagePreviews[idx]);
      setImageFiles((prev) => prev.filter((_, i) => i !== idx));
      setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
    },
    [imagePreviews]
  );

  // ── Validation ──────────────────────────────────────────────────────────────

  function validate(): boolean {
    const newErrors: FormErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    else if (title.length > 80)
      newErrors.title = "Title must be 80 characters or fewer";

    if (!description.trim()) newErrors.description = "Description is required";
    else if (description.trim().length < 20)
      newErrors.description = "Description must be at least 20 characters";
    else if (description.length > 800)
      newErrors.description = "Description must be 800 characters or fewer";

    if (!budget || isNaN(Number(budget)) || Number(budget) <= 0)
      newErrors.budget = "A valid budget is required";

    if (!selectedSubcategoryId)
      newErrors.subcategoryId = "Please select a category and subcategory";

    if (deadline && new Date(deadline).getTime() < Date.now())
      newErrors.deadline = "Deadline must be in the future";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // ── Submit ──────────────────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    setIsLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", title.trim());
      fd.append("description", description.trim());
      fd.append("budget", budget);
      fd.append("negotiable", String(negotiable));
      fd.append("urgency", urgency);
      if (deadline) fd.append("deadline", deadline);
      fd.append("visibility", visibility);
      if (locationInput.trim()) {
        fd.append(
          "location",
          JSON.stringify({ address: { city: locationInput.trim() } })
        );
      }
      fd.append("anonymous", String(anonymous));
      fd.append("subcategoryId", selectedSubcategoryId);
      imageFiles.forEach((file) => fd.append("media", file));

      await createJob(fd);
      setSubmitted(true);
      setTimeout(() => {
        router.push("/task");
      }, 1500);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      setSubmitError(message);
    } finally {
      setIsLoading(false);
    }
  }

  // ── Urgency config ──────────────────────────────────────────────────────────

  const urgencyOptions: {
    value: Urgency;
    label: string;
    activeClass: string;
  }[] = [
    {
      value: "Normal",
      label: "Normal",
      activeClass: "bg-gray-700 text-white dark:bg-gray-300 dark:text-gray-900",
    },
    {
      value: "Urgent",
      label: "Urgent",
      activeClass: "bg-amber-500 text-white",
    },
    {
      value: "Immediate",
      label: "Immediate",
      activeClass: "bg-red-500 text-white",
    },
  ];

  const visibilityOptions: {
    value: Visibility;
    label: string;
    icon: React.ReactNode;
  }[] = [
    { value: "Public", label: "Public", icon: <Eye size={13} /> },
    { value: "Verified_Only", label: "Verified Only", icon: <Shield size={13} /> },
  ];

  // ── Success state ───────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-10 text-center max-w-sm w-full"
        >
          <div className="w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-950/40 flex items-center justify-center mx-auto mb-5">
            <CheckCircle
              size={32}
              className="text-green-600 dark:text-green-400"
            />
          </div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2">
            Task Posted!
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Your task is live. Providers can now find and apply to it.
          </p>
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors"
          >
            View my tasks
          </Link>
          <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
            Redirecting you automatically…
          </p>
        </motion.div>
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">
            Post a Task
          </h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Describe what you need and get matched with the right providers.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid lg:grid-cols-3 gap-6 items-start">
            {/* ── Left: form ─────────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="lg:col-span-2 space-y-5"
            >
              {/* Title */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
                <FieldLabel htmlFor="title" required>
                  Title
                </FieldLabel>
                <input
                  id="title"
                  type="text"
                  maxLength={80}
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title)
                      setErrors((p) => ({ ...p, title: undefined }));
                  }}
                  placeholder="e.g. Need a plumber to fix leaking pipes"
                  className={`${inputBase} ${errors.title ? inputError : ""}`}
                />
                <div className="flex items-center justify-between mt-1.5">
                  <FieldError message={errors.title} />
                  <span
                    className={`text-[11px] tabular-nums ml-auto ${
                      title.length > 72
                        ? "text-amber-500"
                        : "text-gray-400 dark:text-gray-500"
                    }`}
                  >
                    {title.length}/80
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
                <FieldLabel htmlFor="description" required>
                  Description
                </FieldLabel>
                <textarea
                  id="description"
                  maxLength={800}
                  rows={5}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (errors.description)
                      setErrors((p) => ({ ...p, description: undefined }));
                  }}
                  placeholder="Describe the task in detail — what needs to be done, any specific requirements, materials needed, etc."
                  className={`${inputBase} resize-none ${
                    errors.description ? inputError : ""
                  }`}
                />
                <div className="flex items-center justify-between mt-1.5">
                  <FieldError message={errors.description} />
                  <span
                    className={`text-[11px] tabular-nums ml-auto ${
                      description.length > 750
                        ? "text-amber-500"
                        : "text-gray-400 dark:text-gray-500"
                    }`}
                  >
                    {description.length}/800
                  </span>
                </div>
              </div>

              {/* Category / Subcategory */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 space-y-4">
                <div>
                  <FieldLabel htmlFor="category" required>
                    Category
                  </FieldLabel>
                  <select
                    id="category"
                    title="Category"
                    value={selectedCategoryId}
                    onChange={(e) => {
                      setSelectedCategoryId(e.target.value);
                      setSelectedSubcategoryId("");
                      if (errors.subcategoryId)
                        setErrors((p) => ({ ...p, subcategoryId: undefined }));
                    }}
                    className={`${inputBase} ${
                      errors.subcategoryId ? inputError : ""
                    }`}
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <FieldLabel htmlFor="subcategory" required>
                    Subcategory
                  </FieldLabel>
                  <select
                    id="subcategory"
                    title="Subcategory"
                    value={selectedSubcategoryId}
                    onChange={(e) => {
                      setSelectedSubcategoryId(e.target.value);
                      if (errors.subcategoryId)
                        setErrors((p) => ({ ...p, subcategoryId: undefined }));
                    }}
                    disabled={!selectedCategoryId}
                    className={`${inputBase} disabled:opacity-50 disabled:cursor-not-allowed ${
                      errors.subcategoryId ? inputError : ""
                    }`}
                  >
                    <option value="">
                      {selectedCategoryId
                        ? "Select a subcategory"
                        : "Select a category first"}
                    </option>
                    {subcategories.map((sub) => (
                      <option key={sub._id} value={sub._id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                  <FieldError message={errors.subcategoryId} />
                </div>
              </div>

              {/* Budget & Negotiable */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
                <div className="flex items-end gap-4">
                  <div className="flex-1">
                    <FieldLabel htmlFor="budget" required>
                      Budget
                    </FieldLabel>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                        <DollarSign
                          size={14}
                          className="text-gray-400 dark:text-gray-500"
                        />
                      </div>
                      <input
                        id="budget"
                        type="number"
                        min={0}
                        step="0.01"
                        value={budget}
                        onChange={(e) => {
                          setBudget(e.target.value);
                          if (errors.budget)
                            setErrors((p) => ({ ...p, budget: undefined }));
                        }}
                        placeholder="0.00"
                        className={`${inputBase} pl-8 ${
                          errors.budget ? inputError : ""
                        }`}
                      />
                    </div>
                    <FieldError message={errors.budget} />
                  </div>

                  <div className="flex-shrink-0 pb-px">
                    <button
                      type="button"
                      onClick={() => setNegotiable((v) => !v)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                        negotiable
                          ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400"
                          : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          negotiable
                            ? "border-emerald-500 bg-emerald-500"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      >
                        {negotiable && (
                          <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </span>
                      Negotiable
                    </button>
                  </div>
                </div>
              </div>

              {/* Urgency */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
                <FieldLabel>Urgency</FieldLabel>
                <div className="flex gap-2">
                  {urgencyOptions.map(({ value, label, activeClass }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setUrgency(value)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                        urgency === value
                          ? `${activeClass} border-transparent shadow-sm`
                          : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Deadline */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
                <FieldLabel htmlFor="deadline">Deadline</FieldLabel>
                <input
                  id="deadline"
                  type="date"
                  placeholder="No deadline"
                  min={todayString()}
                  value={deadline}
                  onChange={(e) => {
                    setDeadline(e.target.value);
                    if (errors.deadline)
                      setErrors((p) => ({ ...p, deadline: undefined }));
                  }}
                  className={`${inputBase} ${
                    errors.deadline ? inputError : ""
                  }`}
                />
                <FieldError message={errors.deadline} />
              </div>

              {/* Visibility */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
                <FieldLabel>Visibility</FieldLabel>
                <div className="flex gap-2">
                  {visibilityOptions.map(({ value, label, icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setVisibility(value)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                        visibility === value
                          ? "bg-blue-600 border-transparent text-white shadow-sm"
                          : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      {icon}
                      <span className="hidden sm:inline">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
                <FieldLabel htmlFor="location">Location (optional)</FieldLabel>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <MapPin
                      size={14}
                      className="text-gray-400 dark:text-gray-500"
                    />
                  </div>
                  <input
                    id="location"
                    type="text"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    placeholder="City or address"
                    className={`${inputBase} pl-8`}
                  />
                </div>
              </div>

              {/* Images */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
                <div className="flex items-center justify-between mb-3">
                  <FieldLabel>Images (optional)</FieldLabel>
                  <span
                    className={`text-[11px] font-bold tabular-nums ${
                      imageFiles.length >= 5
                        ? "text-amber-500"
                        : "text-gray-400 dark:text-gray-500"
                    }`}
                  >
                    {imageFiles.length}/5
                  </span>
                </div>

                {imageFiles.length < 5 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 rounded-xl py-5 text-sm font-semibold text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 transition-all"
                  >
                    <ImagePlus size={18} />
                    Add images
                  </button>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  title="Upload images"
                  onChange={(e) => e.target.files && addImages(e.target.files)}
                />

                <AnimatePresence>
                  {imagePreviews.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-3"
                    >
                      {imagePreviews.map((src, i) => (
                        <motion.div
                          key={src}
                          layout
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 group"
                        >
                          <Image
                            src={src}
                            alt={`Preview ${i + 1}`}
                            fill
                            sizes="96px"
                            className="object-cover"
                          />
                          <button
                            type="button"
                            aria-label={`Remove image ${i + 1}`}
                            onClick={() => removeImage(i)}
                            className="absolute top-1 right-1 w-5 h-5 bg-black/60 hover:bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <X size={10} strokeWidth={2.5} />
                          </button>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Anonymous toggle */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
                <button
                  type="button"
                  onClick={() => setAnonymous((v) => !v)}
                  className="w-full flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                        anonymous
                          ? "bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
                      }`}
                    >
                      <User size={16} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        Post anonymously
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        Hides your name from providers
                      </p>
                    </div>
                  </div>
                  <div
                    className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
                      anonymous ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  >
                    <motion.span
                      layout
                      className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
                      animate={{
                        left: anonymous ? "calc(100% - 1.375rem)" : "0.125rem",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  </div>
                </button>
              </div>

              {/* Error banner */}
              <AnimatePresence>
                {submitError && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-2xl text-sm text-red-700 dark:text-red-400"
                  >
                    <AlertCircle size={16} className="flex-shrink-0" />
                    {submitError}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-black text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-blue-500/30 transition-all active:scale-[0.99]"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Posting…
                  </>
                ) : (
                  "Post Task"
                )}
              </button>
            </motion.div>

            {/* ── Right: preview ──────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1 sticky top-24 space-y-4"
            >
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide px-1">
                Live Preview
              </p>
              <PreviewCard
                title={title}
                budget={budget}
                urgency={urgency}
                deadline={deadline}
                categoryName={selectedCategory?.name ?? ""}
                subcategoryName={selectedSubcategory?.name ?? ""}
                visibility={visibility}
                anonymous={anonymous}
                negotiable={negotiable}
              />

              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 text-xs text-gray-400 dark:text-gray-500 space-y-1.5">
                <p className="font-bold text-gray-700 dark:text-gray-300 text-[11px] uppercase tracking-wide mb-2">
                  Tips for better responses
                </p>
                <p>• Be specific about what you need done</p>
                <p>• Mention your preferred timeline</p>
                <p>• Include any special requirements</p>
                <p>• Add photos to get more accurate quotes</p>
              </div>
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  );
}
