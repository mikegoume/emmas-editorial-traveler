"use client";

import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Item {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

interface Props {
  table: string;
  items: Item[];
  label: string;
}

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
}

export default function SimpleCrudPage({ table, items, label }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const [editing, setEditing] = useState<Item | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", description: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function openCreate() {
    setForm({ name: "", slug: "", description: "" });
    setEditing(null);
    setCreating(true);
  }

  function openEdit(item: Item) {
    setForm({
      name: item.name,
      slug: item.slug,
      description: item.description ?? "",
    });
    setEditing(item);
    setCreating(false);
  }

  function closeForm() {
    setCreating(false);
    setEditing(null);
    setError(null);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description || null,
    };

    const { error: dbErr } = editing
      ? await supabase.from(table).update(payload).eq("id", editing.id)
      : await supabase.from(table).insert(payload);

    if (dbErr) {
      setError(dbErr.message);
      setSaving(false);
      return;
    }
    closeForm();
    router.refresh();
  }

  async function handleDelete(item: Item) {
    if (!confirm(`Delete "${item.name}"? This cannot be undone.`)) return;
    await supabase.from(table).delete().eq("id", item.id);
    router.refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-headline text-3xl font-bold text-on-background">
            {label}
          </h1>
          <p className="text-outline font-body text-sm mt-1">
            {items.length} total
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-secondary text-on-secondary px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-secondary-dim transition-colors"
        >
          <span className="material-symbols-outlined text-base">add</span>
          New {label.slice(0, -1).toLowerCase()}
        </button>
      </div>

      {/* Form */}
      {(creating || editing) && (
        <div className="bg-surface-container-lowest border border-secondary/20 rounded-lg p-6 mb-6 space-y-4">
          <h2 className="font-headline font-bold text-on-surface">
            {editing ? `Edit: ${editing.name}` : `New ${label.slice(0, -1)}`}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-label block">
                Name *
              </label>
              <input
                value={form.name}
                onChange={(e) => {
                  setForm((f) => ({
                    ...f,
                    name: e.target.value,
                    slug: editing ? f.slug : slugify(e.target.value),
                  }));
                }}
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-label block">
                Slug *
              </label>
              <input
                value={form.slug}
                onChange={(e) =>
                  setForm((f) => ({ ...f, slug: e.target.value }))
                }
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-3 py-2 text-sm font-mono text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
            <div className="col-span-2 space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-label block">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                rows={2}
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-3 py-2 text-sm text-on-surface resize-none focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
          </div>
          {error && (
            <p className="text-xs text-error">{error}</p>
          )}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving || !form.name || !form.slug}
              className="bg-secondary text-on-secondary px-5 py-2 rounded-lg font-bold text-sm hover:bg-secondary-dim transition-colors disabled:opacity-50"
            >
              {saving ? "Saving…" : editing ? "Save" : "Create"}
            </button>
            <button
              onClick={closeForm}
              className="px-5 py-2 rounded-lg font-bold text-sm text-on-surface-variant hover:bg-surface-container-low transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-center py-16 bg-surface-container-low rounded-lg">
          <p className="text-outline font-body italic">None yet.</p>
        </div>
      ) : (
        <div className="bg-surface-container-lowest border border-outline-variant/15 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface-container-low border-b border-outline-variant/15">
              <tr>
                <th className="text-left px-4 py-3 font-label text-xs uppercase tracking-widest text-outline">
                  Name
                </th>
                <th className="text-left px-4 py-3 font-label text-xs uppercase tracking-widest text-outline hidden md:table-cell">
                  Slug
                </th>
                <th className="text-left px-4 py-3 font-label text-xs uppercase tracking-widest text-outline hidden lg:table-cell">
                  Description
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-surface-container-low/50">
                  <td className="px-4 py-3 font-medium text-on-surface">
                    {item.name}
                  </td>
                  <td className="px-4 py-3 text-outline font-mono text-xs hidden md:table-cell">
                    {item.slug}
                  </td>
                  <td className="px-4 py-3 text-on-surface-variant text-xs hidden lg:table-cell max-w-xs truncate">
                    {item.description ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <button
                      onClick={() => openEdit(item)}
                      className="text-secondary text-xs font-bold hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="text-error text-xs font-bold hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
