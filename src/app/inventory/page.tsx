"use client";
import { useEffect, useMemo, useState } from "react";
import { api, API_BASE } from "@/lib/api";
import { Pagination } from "@/components/Pagination";

type Item = {
  _id: string;
  item_code?: string;
  itemCode?: string;
  item_name?: string;
  itemName?: string;
  category: string;
  item_type?: string;
  itemType?: string;
  quantity: number;
  unit: string;
  unit_price?: number;
  unitPrice?: number;
  location?: string | null;
};

export default function InventoryPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pages, setPages] = useState(1);
  const [files, setFiles] = useState<FileList | null>(null);

  // form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<any>({
    item_code: "",
    item_name: "",
    category: "",
    item_type: "Surplus",
    description: "",
    quantity: 0,
    unit: "pcs",
    unit_price: 0,
    location: "",
    condition: "Good",
    minimum_stock: 0,
  });

  const categories = ["", "Surplus Equipment", "Scrap Metal", "Tools", "Pipes", "Valves", "Other"];

  const [page, setPage] = useState(1);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams();
      if (search) qs.set("search", search);
      if (category) qs.set("category", category);
      qs.set('page', String(page));
      qs.set('limit', '10');
      const data = await api.get<any>(`/inventory?${qs.toString()}`);
      const arr = Array.isArray(data) ? data : data.items;
      setItems(arr);
      if (!Array.isArray(data)) setPages(data.pages || 1);
      // optional: manage total/pages if needed
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const rows = useMemo(() => items.map((it: any) => {
    const code = it.item_code ?? it.itemCode;
    const name = it.item_name ?? it.itemName;
    const type = it.item_type ?? it.itemType;
    const price = (it.unit_price ?? it.unitPrice) ?? 0;
    const total = (it.quantity || 0) * (price || 0);
    const added = it.createdAt ? new Date(it.createdAt).toLocaleDateString() : '-';
    return { id: it._id, code, name, cat: it.category, type, qty: it.quantity, unit: it.unit, price, total, loc: it.location ?? "-", added };
  }), [items]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Inventory</h1>
        <div className="flex gap-2">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="rounded-md border px-3 py-2 text-sm" />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-md border px-3 py-2 text-sm">
            {categories.map((c) => <option value={c} key={c}>{c || "All Categories"}</option>)}
          </select>
          <button onClick={load} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white">Apply</button>
          <button onClick={() => { setEditingId(null); setForm({ item_code: "", item_name: "", category: "", item_type: "Surplus", description: "", quantity: 0, unit: "pcs", unit_price: 0, location: "", condition: "Good", minimum_stock: 0 }); setShowForm(true); }} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white">Add Item</button>
        </div>
      </div>

      {showForm && (
        <div className="rounded-lg border bg-white p-4">
          <h2 className="mb-3 text-lg font-semibold">{editingId ? "Edit Item" : "Add Item"}</h2>
          {error && <div className="mb-3 rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">{error}</div>}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className="block text-xs text-gray-600">Item Code</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" value={form.item_code} onChange={(e) => setForm({ ...form, item_code: e.target.value })} disabled placeholder="Auto-generated (IN-#0001)" />
            </div>
            <div>
              <label className="block text-xs text-gray-600">Item Name</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" value={form.item_name} onChange={(e) => setForm({ ...form, item_name: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs text-gray-600">Category</label>
              <select className="w-full rounded-md border px-3 py-2 text-sm" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option value="">Select</option>
                {categories.filter(Boolean).map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-600">Type</label>
              <select className="w-full rounded-md border px-3 py-2 text-sm" value={form.item_type} onChange={(e) => setForm({ ...form, item_type: e.target.value })}>
                <option>Surplus</option>
                <option>Scrap</option>
                <option>New</option>
                <option>Refurbished</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-600">Quantity</label>
              <input type="number" className="w-full rounded-md border px-3 py-2 text-sm" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} />
            </div>
            <div>
              <label className="block text-xs text-gray-600">Unit</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs text-gray-600">Unit Price</label>
              <input type="number" className="w-full rounded-md border px-3 py-2 text-sm" value={form.unit_price} onChange={(e) => setForm({ ...form, unit_price: Number(e.target.value) })} />
            </div>
            <div>
              <label className="block text-xs text-gray-600">Minimum Stock</label>
              <input type="number" className="w-full rounded-md border px-3 py-2 text-sm" value={form.minimum_stock} onChange={(e) => setForm({ ...form, minimum_stock: Number(e.target.value) })} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-600">Location</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-600">Condition</label>
              <select className="w-full rounded-md border px-3 py-2 text-sm" value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })}>
                <option>Good</option>
                <option>Fair</option>
                <option>Poor</option>
                <option>Scrap</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-600">Description</label>
              <textarea className="w-full rounded-md border px-3 py-2 text-sm" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
          <div className="md:col-span-2">
            <label className="block text-xs text-gray-600">Photos</label>
            <div
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onDrop={(e) => {
                e.preventDefault(); e.stopPropagation();
                const dt = e.dataTransfer;
                if (dt?.files && dt.files.length) setFiles(dt.files);
              }}
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gradient-to-br from-white to-gray-50 p-6 text-center transition hover:shadow-sm"
              onClick={(e) => {
                const el = e.currentTarget.querySelector('input[type=file]') as HTMLInputElement | null;
                el?.click();
              }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">📷</div>
              <div className="text-sm font-medium text-gray-900">Drag and drop images here</div>
              <div className="text-xs text-gray-500">or click to browse (camera supported on mobile)</div>
              <input type="file" className="hidden" multiple accept="image/*" capture="environment" onChange={(e) => setFiles(e.target.files)} />
              {files && files.length > 0 && (
                <div className="mt-3 w-full">
                  <div className="mb-1 text-xs text-gray-600">{files.length} file(s) selected</div>
                  <div className="grid grid-cols-3 gap-2">
                    {Array.from(files)
                      .slice(0, 6)
                      .map((f, i) => (
                        <img
                          key={i}
                          src={URL.createObjectURL(f)}
                          className="h-20 w-full rounded-md object-cover ring-1 ring-gray-200"
                          alt=""
                          onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                        />
                      ))}
                  </div>
                </div>
              )}
            </div>
            <p className="mt-2 text-xs text-gray-500">You can also add more photos on the item page.</p>
          </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => { setShowForm(false); setEditingId(null); setError(null); }} className="rounded-md border px-4 py-2 text-sm">Cancel</button>
            <button onClick={async () => {
              try {
                setError(null);
                const payload: any = { ...form };
                if (!payload.item_code || payload.item_code.trim() === '') delete payload.item_code;
                if (editingId) {
                  await api.put(`/inventory/${editingId}`, payload);
                } else {
                  const created = await api.post<any>(`/inventory`, payload);
                  const newId = created?.id;
                  if (newId && files && files.length > 0) {
                    const fd = new FormData();
                    Array.from(files).forEach(f => fd.append('images', f));
                    await fetch(`${API_BASE}/inventory/${newId}/images`, { method: 'POST', body: fd });
                  }
                }
                setShowForm(false);
                setEditingId(null);
                await load();
              } catch (e: any) {
                setError(e.message);
              }
            }} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white">{editingId ? "Save Changes" : "Add Item"}</button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-indigo-600 text-left text-xs font-medium uppercase tracking-wider text-white">
            <tr>
              <th className="px-3 py-3">Item Code</th>
              <th className="px-3 py-3">Item Name</th>
              <th className="px-3 py-3">Category</th>
              <th className="px-3 py-3">Type</th>
              <th className="px-3 py-3">Quantity</th>
              <th className="px-3 py-3">Unit Price</th>
              <th className="px-3 py-3">Total Value</th>
              <th className="px-3 py-3">Location</th>
              <th className="px-3 py-3">Added</th>
              <th className="px-3 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} className="px-3 py-6 text-center text-gray-500">Loading...</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={9} className="px-3 py-6 text-center text-gray-500">No items found</td></tr>
            ) : rows.map((r) => (
              <tr key={r.id} className="border-t hover:bg-gray-50">
                <td className="px-3 py-2">{r.code}</td>
                <td className="px-3 py-2">{r.name}</td>
                <td className="px-3 py-2">{r.cat}</td>
                <td className="px-3 py-2"><span className="rounded bg-indigo-100 px-2 py-0.5 text-indigo-700">{r.type}</span></td>
                <td className="px-3 py-2">{r.qty} {r.unit}</td>
                <td className="px-3 py-2">${r.price?.toFixed(2)}</td>
                <td className="px-3 py-2">${r.total?.toFixed(2)}</td>
                <td className="px-3 py-2">{r.loc}</td>
                <td className="px-3 py-2">{r.added}</td>
                <td className="px-3 py-2">
                  <div className="flex gap-2">
                    <a href={`/inventory/${r.id}`} className="rounded-md border px-2 py-1 text-xs">View</a>
                    <button onClick={() => {
                      setEditingId(r.id);
                      setForm({
                        item_code: r.code,
                        item_name: r.name,
                        category: r.cat,
                        item_type: r.type,
                        description: '',
                        quantity: r.qty,
                        unit: r.unit,
                        unit_price: r.price,
                        location: r.loc === '-' ? '' : r.loc,
                        condition: 'Good',
                        minimum_stock: 0,
                      });
                      setShowForm(true);
                    }} className="rounded-md border px-2 py-1 text-xs">Edit</button>
                    <button onClick={async () => {
                      if (!confirm('Delete this item?')) return;
                      try { await api.del(`/inventory/${r.id}`); await load(); } catch (e: any) { alert(e.message); }
                    }} className="rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={page} pages={pages} onChange={(p) => { setPage(p); load(); }} />
    </div>
  );
}


