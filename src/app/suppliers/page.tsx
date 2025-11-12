"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Pagination } from "@/components/Pagination";

type Supplier = {
  _id: string;
  supplier_code?: string; supplierCode?: string;
  company_name?: string; companyName?: string;
  contact_person?: string; contactPerson?: string;
  email?: string; phone?: string; city?: string; status?: string;
};

export default function SuppliersPage() {
  const [items, setItems] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<any>({
    supplier_code: "",
    company_name: "",
    contact_person: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    payment_terms: "",
    status: "Active",
  });

  const load = async () => {
    setLoading(true); setError(null);
    try { 
      const data = await api.get<any>(`/suppliers?page=${page}&limit=10`);
      const arr = Array.isArray(data) ? data : data.items;
      setItems(arr);
      if (!Array.isArray(data)) setPages(data.pages || 1);
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  useEffect(() => { load(); }, [page]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Suppliers</h1>
      </div>
      <div className="flex items-center justify-between">
        <div />
        <button onClick={() => { setEditingId(null); setForm({ supplier_code: "", company_name: "", contact_person: "", email: "", phone: "", address: "", city: "", country: "", payment_terms: "", status: "Active" }); setShowForm(true); }} className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white">Add Supplier</button>
      </div>
      {showForm && (
        <div className="rounded-lg border bg-white p-4">
          <h2 className="mb-2 text-lg font-semibold">{editingId ? 'Edit Supplier' : 'Add Supplier'}</h2>
          {error && <div className="mb-2 rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">{error}</div>}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className="block text-xs text-gray-600">Code</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" value={form.supplier_code} onChange={(e) => setForm({ ...form, supplier_code: e.target.value })} disabled placeholder="Auto-generated (S-#00001)" />
            </div>
            <div>
              <label className="block text-xs text-gray-600">Company</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs text-gray-600">Contact</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" value={form.contact_person} onChange={(e) => setForm({ ...form, contact_person: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs text-gray-600">Email</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs text-gray-600">Phone</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs text-gray-600">City</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-600">Address</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs text-gray-600">Country</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs text-gray-600">Payment Terms</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" value={form.payment_terms} onChange={(e) => setForm({ ...form, payment_terms: e.target.value })} />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => { setShowForm(false); setEditingId(null); }} className="rounded-md border px-4 py-2 text-sm">Cancel</button>
            <button onClick={async () => {
              try {
                const payload: any = { ...form };
                if (!payload.supplier_code || payload.supplier_code.trim() === '') delete payload.supplier_code;
                if (editingId) await api.put(`/suppliers/${editingId}`, payload); else await api.post(`/suppliers`, payload);
                setShowForm(false); setEditingId(null); await load();
              } catch (e: any) { setError(e.message); }
            }} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white">{editingId ? 'Save' : 'Add'}</button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-indigo-600 text-left text-xs font-medium uppercase tracking-wider text-white">
            <tr>
              <th className="px-3 py-3">Code</th>
              <th className="px-3 py-3">Company</th>
              <th className="px-3 py-3">Contact</th>
              <th className="px-3 py-3">Email</th>
              <th className="px-3 py-3">Phone</th>
              <th className="px-3 py-3">City</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Added</th>
              <th className="px-3 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="px-3 py-6 text-center text-gray-500">Loading...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={8} className="px-3 py-6 text-center text-gray-500">No suppliers</td></tr>
            ) : items.map((s: any) => (
              <tr key={s._id} className="border-t hover:bg-gray-50">
                <td className="px-3 py-2">{s.supplier_code ?? s.supplierCode}</td>
                <td className="px-3 py-2">{s.company_name ?? s.companyName}</td>
                <td className="px-3 py-2">{s.contact_person ?? s.contactPerson ?? '-'}</td>
                <td className="px-3 py-2">{s.email ?? '-'}</td>
                <td className="px-3 py-2">{s.phone ?? '-'}</td>
                <td className="px-3 py-2">{s.city ?? '-'}</td>
                <td className="px-3 py-2"><span className="rounded bg-green-100 px-2 py-0.5 text-green-700">{s.status ?? 'Active'}</span></td>
                <td className="px-3 py-2">{s.createdAt ? new Date(s.createdAt).toLocaleDateString() : '-'}</td>
                <td className="px-3 py-2">
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingId(s._id); setForm({ supplier_code: s.supplier_code ?? s.supplierCode, company_name: s.company_name ?? s.companyName, contact_person: s.contact_person ?? s.contactPerson ?? '', email: s.email ?? '', phone: s.phone ?? '', address: s.address ?? '', city: s.city ?? '', country: s.country ?? '', payment_terms: s.payment_terms ?? s.paymentTerms ?? '', status: s.status ?? 'Active' }); setShowForm(true); }} className="rounded-md border px-2 py-1 text-xs">Edit</button>
                    <button onClick={async () => { if (!confirm('Delete supplier?')) return; await api.del(`/suppliers/${s._id}`); await load(); }} className="rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={page} pages={pages} onChange={setPage} />
    </div>
  );
}


