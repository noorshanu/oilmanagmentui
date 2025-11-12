"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Pagination } from "@/components/Pagination";

type Customer = {
  _id: string;
  customer_code?: string; customerCode?: string;
  company_name?: string; companyName?: string;
  contact_person?: string; contactPerson?: string;
  email?: string; phone?: string; city?: string; status?: string; credit_limit?: number; creditLimit?: number;
};

export default function CustomersPage() {
  const [items, setItems] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<any>({
    customer_code: "",
    company_name: "",
    contact_person: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    payment_terms: "",
    credit_limit: 0,
    status: "Active",
  });

  const load = async () => {
    setLoading(true); setError(null);
    try { const data = await api.get<any>(`/customers?page=${page}&limit=10`); const arr = Array.isArray(data) ? data : data.items; setItems(arr); if (!Array.isArray(data)) setPages(data.pages || 1);} finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [page]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Customers</h1>
      </div>
      <div className="flex items-center justify-between">
        <div />
        <button onClick={() => { setEditingId(null); setForm({ customer_code: "", company_name: "", contact_person: "", email: "", phone: "", address: "", city: "", country: "", payment_terms: "", credit_limit: 0, status: "Active" }); setShowForm(true); }} className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white">Add Customer</button>
      </div>
      {showForm && (
        <div className="rounded-lg border bg-white p-4">
          <h2 className="mb-2 text-lg font-semibold">{editingId ? 'Edit Customer' : 'Add Customer'}</h2>
          {error && <div className="mb-2 rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">{error}</div>}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className="block text-xs text-gray-600">Code</label>
              <input className="w-full rounded-md border px-3 py-2 text-sm" value={form.customer_code} onChange={(e) => setForm({ ...form, customer_code: e.target.value })} disabled={!!editingId} />
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
            <div>
              <label className="block text-xs text-gray-600">Credit Limit</label>
              <input type="number" className="w-full rounded-md border px-3 py-2 text-sm" value={form.credit_limit} onChange={(e) => setForm({ ...form, credit_limit: Number(e.target.value) })} />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => { setShowForm(false); setEditingId(null); }} className="rounded-md border px-4 py-2 text-sm">Cancel</button>
            <button onClick={async () => { try { if (editingId) await api.put(`/customers/${editingId}`, form); else await api.post(`/customers`, form); setShowForm(false); setEditingId(null); await load(); } catch (e: any) {} }} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white">{editingId ? 'Save' : 'Add'}</button>
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
              <th className="px-3 py-3">Credit Limit</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Added</th>
              <th className="px-3 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="px-3 py-6 text-center text-gray-500">Loading...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={8} className="px-3 py-6 text-center text-gray-500">No customers</td></tr>
            ) : items.map((c: any) => (
              <tr key={c._id} className="border-t hover:bg-gray-50">
                <td className="px-3 py-2">{c.customer_code ?? c.customerCode}</td>
                <td className="px-3 py-2">{c.company_name ?? c.companyName}</td>
                <td className="px-3 py-2">{c.contact_person ?? c.contactPerson ?? '-'}</td>
                <td className="px-3 py-2">{c.email ?? '-'}</td>
                <td className="px-3 py-2">{c.phone ?? '-'}</td>
                <td className="px-3 py-2">{c.city ?? '-'}</td>
                <td className="px-3 py-2">${Number(c.credit_limit ?? c.creditLimit ?? 0).toFixed(2)}</td>
                <td className="px-3 py-2"><span className="rounded bg-green-100 px-2 py-0.5 text-green-700">{c.status ?? 'Active'}</span></td>
                <td className="px-3 py-2">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '-'}</td>
                <td className="px-3 py-2">
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingId(c._id); setForm({ customer_code: c.customer_code ?? c.customerCode, company_name: c.company_name ?? c.companyName, contact_person: c.contact_person ?? c.contactPerson ?? '', email: c.email ?? '', phone: c.phone ?? '', address: c.address ?? '', city: c.city ?? '', country: c.country ?? '', payment_terms: c.payment_terms ?? c.paymentTerms ?? '', credit_limit: Number(c.credit_limit ?? c.creditLimit ?? 0), status: c.status ?? 'Active' }); setShowForm(true); }} className="rounded-md border px-2 py-1 text-xs">Edit</button>
                    <button onClick={async () => { if (!confirm('Delete customer?')) return; await api.del(`/customers/${c._id}`); await load(); }} className="rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white">Delete</button>
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


