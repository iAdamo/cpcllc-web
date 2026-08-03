"use client";

import { useEffect, useState } from "react";
import {
  Boxes,
  Plus,
  Pencil,
  Trash2,
  Tag,
  Loader2,
  X,
  FolderPlus,
} from "lucide-react";
import {
  listCatalogue,
  createCategory,
  updateCategory,
  deleteCategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  type AdminCategory,
  type AdminSubcategory,
} from "@/axios/catalogue";
import {
  CATALOGUE_ICON_NAMES,
  resolveCatalogueIcon,
} from "@/lib/lucideIcons";

// Pull the human-readable backend message off a normalized axios error.
function errMsg(e: any, fallback: string): string {
  return (
    e?.appError?.message ||
    e?.response?.data?.message ||
    e?.message ||
    fallback
  );
}

type CategoryForm = { name: string; description: string };
type SubForm = {
  name: string;
  description: string;
  icon: string;
  iconColor: string;
  tags: string;
};

const emptyCategory: CategoryForm = { name: "", description: "" };
const emptySub: SubForm = {
  name: "",
  description: "",
  icon: "",
  iconColor: "",
  tags: "",
};

export function CatalogueView() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Category modal
  const [catOpen, setCatOpen] = useState(false);
  const [catEditing, setCatEditing] = useState<AdminCategory | null>(null);
  const [catForm, setCatForm] = useState<CategoryForm>(emptyCategory);

  // Subcategory modal
  const [subOpen, setSubOpen] = useState(false);
  const [subEditing, setSubEditing] = useState<AdminSubcategory | null>(null);
  const [subCategoryId, setSubCategoryId] = useState<string>("");
  const [subForm, setSubForm] = useState<SubForm>(emptySub);

  const [saving, setSaving] = useState(false);

  const refresh = async () => {
    try {
      setCategories(await listCatalogue());
    } catch (e) {
      setError(errMsg(e, "Failed to load the catalogue"));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    refresh();
  }, []);

  // ── Category actions ────────────────────────────────────────────────────
  const openNewCategory = () => {
    setCatEditing(null);
    setCatForm(emptyCategory);
    setError(null);
    setCatOpen(true);
  };
  const openEditCategory = (c: AdminCategory) => {
    setCatEditing(c);
    setCatForm({ name: c.name, description: c.description ?? "" });
    setError(null);
    setCatOpen(true);
  };
  const saveCategory = async () => {
    if (!catForm.name.trim()) return setError("Category name is required");
    setSaving(true);
    setError(null);
    try {
      const payload = {
        name: catForm.name.trim(),
        description: catForm.description.trim() || undefined,
      };
      if (catEditing) await updateCategory(catEditing._id, payload);
      else await createCategory(payload);
      setCatOpen(false);
      await refresh();
    } catch (e) {
      setError(errMsg(e, "Failed to save the category"));
    } finally {
      setSaving(false);
    }
  };
  const removeCategory = async (c: AdminCategory) => {
    if (!confirm(`Delete category "${c.name}"?`)) return;
    try {
      await deleteCategory(c._id);
      await refresh();
    } catch (e) {
      alert(errMsg(e, "Failed to delete the category"));
    }
  };

  // ── Subcategory actions ─────────────────────────────────────────────────
  const openNewSub = (categoryId: string) => {
    setSubEditing(null);
    setSubCategoryId(categoryId);
    setSubForm(emptySub);
    setError(null);
    setSubOpen(true);
  };
  const openEditSub = (categoryId: string, s: AdminSubcategory) => {
    setSubEditing(s);
    setSubCategoryId(categoryId);
    setSubForm({
      name: s.name,
      description: s.description ?? "",
      icon: s.icon ?? "",
      iconColor: s.iconColor ?? "",
      tags: (s.tags ?? []).join(", "),
    });
    setError(null);
    setSubOpen(true);
  };
  const saveSub = async () => {
    if (!subForm.name.trim()) return setError("Subcategory name is required");
    setSaving(true);
    setError(null);
    try {
      const payload = {
        name: subForm.name.trim(),
        categoryId: subCategoryId,
        description: subForm.description.trim() || undefined,
        icon: subForm.icon.trim() || undefined,
        iconColor: subForm.iconColor.trim() || undefined,
        tags: subForm.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };
      if (subEditing) await updateSubcategory(subEditing._id, payload);
      else await createSubcategory(payload);
      setSubOpen(false);
      await refresh();
    } catch (e) {
      setError(errMsg(e, "Failed to save the subcategory"));
    } finally {
      setSaving(false);
    }
  };
  const removeSub = async (s: AdminSubcategory) => {
    if (!confirm(`Delete subcategory "${s.name}"?`)) return;
    try {
      await deleteSubcategory(s._id);
      await refresh();
    } catch (e) {
      alert(errMsg(e, "Failed to delete the subcategory"));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 flex items-center justify-center">
            <Boxes size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              Service Catalogue
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Manage the categories and subcategories shown across the app and
              website.
            </p>
          </div>
        </div>
        <button
          onClick={openNewCategory}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
        >
          <Plus size={16} /> New category
        </button>
      </div>

      {loading && (
        <p className="px-5 py-10 text-center text-slate-400 text-sm">Loading…</p>
      )}
      {!loading && categories.length === 0 && (
        <div className="px-5 py-12 text-center text-slate-400 text-sm border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
          No categories yet. Create your first one.
        </div>
      )}

      {/* Category cards */}
      <div className="space-y-4">
        {categories.map((c) => (
          <div
            key={c._id}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden"
          >
            <div className="px-5 py-4 flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-base font-semibold text-slate-900 dark:text-white">
                    {c.name}
                  </p>
                  <span className="text-xs text-slate-400">
                    {c.subcategories?.length ?? 0} subcategor
                    {(c.subcategories?.length ?? 0) === 1 ? "y" : "ies"}
                  </span>
                </div>
                {c.description && (
                  <p className="text-sm text-slate-500 mt-0.5">{c.description}</p>
                )}
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => openNewSub(c._id)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200"
                >
                  <FolderPlus size={13} /> Subcategory
                </button>
                <button
                  onClick={() => openEditCategory(c)}
                  aria-label="Edit category"
                  className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => removeCategory(c)}
                  aria-label="Delete category"
                  className="p-1.5 rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            {/* Subcategories */}
            <div className="p-4">
              {(c.subcategories?.length ?? 0) === 0 ? (
                <p className="text-xs text-slate-400 px-1 py-2">
                  No subcategories yet.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {c.subcategories.map((s) => (
                    <div
                      key={s._id}
                      className="group flex items-start gap-2.5 p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-slate-200"
                    >
                      <span
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                        style={{ backgroundColor: s.iconColor || "#64748b" }}
                        title={s.icon || ""}
                      >
                        {(() => {
                          const Ic = resolveCatalogueIcon(s.icon);
                          return Ic ? (
                            <Ic size={16} />
                          ) : (
                            <span className="text-xs font-bold">
                              {s.name.slice(0, 2).toUpperCase()}
                            </span>
                          );
                        })()}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                          {s.name}
                        </p>
                        {s.description && (
                          <p className="text-xs text-slate-500 truncate">
                            {s.description}
                          </p>
                        )}
                        {(s.tags?.length ?? 0) > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {s.tags!.slice(0, 4).map((t) => (
                              <span
                                key={t}
                                className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500"
                              >
                                <Tag size={9} /> {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditSub(c._id, s)}
                          aria-label="Edit subcategory"
                          className="p-1 rounded text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => removeSub(s)}
                          aria-label="Delete subcategory"
                          className="p-1 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Category modal */}
      {catOpen && (
        <Modal
          title={catEditing ? "Edit category" : "New category"}
          onClose={() => setCatOpen(false)}
        >
          <Field label="Name">
            <input
              autoFocus
              value={catForm.name}
              onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
              className={inputClass}
              placeholder="e.g. Plumbing"
            />
          </Field>
          <Field label="Description (optional)">
            <textarea
              value={catForm.description}
              onChange={(e) =>
                setCatForm({ ...catForm, description: e.target.value })
              }
              className={`${inputClass} resize-none h-20`}
              placeholder="Short description shown to users"
            />
          </Field>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <ModalActions
            saving={saving}
            onCancel={() => setCatOpen(false)}
            onSave={saveCategory}
          />
        </Modal>
      )}

      {/* Subcategory modal */}
      {subOpen && (
        <Modal
          title={subEditing ? "Edit subcategory" : "New subcategory"}
          onClose={() => setSubOpen(false)}
        >
          <Field label="Name">
            <input
              autoFocus
              value={subForm.name}
              onChange={(e) => setSubForm({ ...subForm, name: e.target.value })}
              className={inputClass}
              placeholder="e.g. Leak repair"
            />
          </Field>
          <Field label="Description (optional)">
            <textarea
              value={subForm.description}
              onChange={(e) =>
                setSubForm({ ...subForm, description: e.target.value })
              }
              className={`${inputClass} resize-none h-16`}
            />
          </Field>
          <Field label="Icon color">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={/^#[0-9a-fA-F]{6}$/.test(subForm.iconColor) ? subForm.iconColor : "#2563eb"}
                onChange={(e) =>
                  setSubForm({ ...subForm, iconColor: e.target.value })
                }
                className="w-9 h-9 rounded border border-slate-200 dark:border-slate-700 bg-transparent p-0.5 cursor-pointer"
              />
              <input
                value={subForm.iconColor}
                onChange={(e) =>
                  setSubForm({ ...subForm, iconColor: e.target.value })
                }
                className={inputClass}
                placeholder="#2563eb"
              />
            </div>
          </Field>
          <Field label="Icon">
            <IconPicker
              value={subForm.icon}
              color={/^#[0-9a-fA-F]{6}$/.test(subForm.iconColor) ? subForm.iconColor : "#2563eb"}
              onPick={(name) => setSubForm({ ...subForm, icon: name })}
            />
          </Field>
          <Field label="Tags (comma-separated)">
            <input
              value={subForm.tags}
              onChange={(e) => setSubForm({ ...subForm, tags: e.target.value })}
              className={inputClass}
              placeholder="pipe, drain, faucet"
            />
          </Field>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <ModalActions
            saving={saving}
            onCancel={() => setSubOpen(false)}
            onSave={saveSub}
          />
        </Modal>
      )}
    </div>
  );
}

// ── Small building blocks ───────────────────────────────────────────────────

const inputClass =
  "w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-medium text-slate-500">{label}</span>
      {children}
    </label>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-[70] bg-black/40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-800">
          <p className="font-semibold text-slate-900 dark:text-white">{title}</p>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-5 space-y-4">{children}</div>
      </div>
    </div>
  );
}

function IconPicker({
  value,
  color,
  onPick,
}: {
  value: string;
  color: string;
  onPick: (name: string) => void;
}) {
  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-2 max-h-40 overflow-y-auto">
      <div className="grid grid-cols-8 gap-1.5">
        {value && (
          <button
            type="button"
            onClick={() => onPick("")}
            title="No icon"
            className="w-8 h-8 rounded-md flex items-center justify-center text-[10px] text-slate-400 border border-dashed border-slate-300 dark:border-slate-600 hover:border-red-400 hover:text-red-500"
          >
            ✕
          </button>
        )}
        {CATALOGUE_ICON_NAMES.map((name) => {
          const Ic = resolveCatalogueIcon(name)!;
          const selected = value === name;
          return (
            <button
              key={name}
              type="button"
              title={name}
              onClick={() => onPick(name)}
              className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${
                selected
                  ? "ring-2 ring-blue-500 text-white"
                  : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
              style={selected ? { backgroundColor: color } : undefined}
            >
              <Ic size={16} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ModalActions({
  saving,
  onCancel,
  onSave,
}: {
  saving: boolean;
  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <div className="flex justify-end gap-2 pt-1">
      <button
        onClick={onCancel}
        disabled={saving}
        className="px-4 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        Cancel
      </button>
      <button
        onClick={onSave}
        disabled={saving}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium disabled:opacity-50"
      >
        {saving && <Loader2 size={15} className="animate-spin" />}
        Save
      </button>
    </div>
  );
}
