"use client";
import { api } from "@/lib/api";
import { Pagination } from "@/components/Pagination";
import { useEffect, useState } from "react";

type PO = { po_number?: string; poNumber?: string; supplierName?: string; orderDate?: string; expectedDelivery?: string; status?: string; totalAmount?: number };

export default function POPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const load = async () => { setLoading(true); try { const r = await api.get<any>(`/purchase-orders?page=${page}&limit=10&q=${encodeURIComponent(q)}&status=${status}&start_date=${start}&end_date=${end}`); const arr = Array.isArray(r) ? r : r.items; setData(arr); if (!Array.isArray(r)) setPages(r.pages || 1);} finally { setLoading(false); } };
  useEffect(() => { load(); }, [page]);

  const receive = async (poId: string) => {
    if (!confirm('Mark PO as received?')) return;
    await api.post(`/purchase-orders/${poId}/receive`, {});
    await load();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Purchase Orders</h1>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div className="flex items-end gap-2">
          <div>
            <label className="block text-xs text-gray-600">Search</label>
            <input value={q} onChange={(e)=>setQ(e.target.value)} className="rounded-md border px-2 py-1 text-sm" placeholder="PO number..." />
          </div>
          <div>
            <label className="block text-xs text-gray-600">Status</label>
            <select value={status} onChange={(e)=>setStatus(e.target.value)} className="rounded-md border px-2 py-1 text-sm">
              <option value="">All</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600">Start</label>
            <input type="date" value={start} onChange={(e)=>setStart(e.target.value)} className="rounded-md border px-2 py-1 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-600">End</label>
            <input type="date" value={end} onChange={(e)=>setEnd(e.target.value)} className="rounded-md border px-2 py-1 text-sm" />
          </div>
          <button onClick={()=>{ setPage(1); load(); }} className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white">Apply</button>
        </div>
        <div className="flex gap-2">
          <a href="/api/purchase-orders/export.csv" className="rounded-md border px-3 py-1.5 text-sm">Export CSV</a>
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border bg-white mt-2">
        <table className="w-full text-sm">
          <thead className="bg-indigo-600 text-left text-xs font-medium uppercase tracking-wider text-white">
            <tr>
              <th className="px-3 py-3">PO Number</th>
              <th className="px-3 py-3">Supplier</th>
              <th className="px-3 py-3">Order Date</th>
              <th className="px-3 py-3">Expected Delivery</th>
              <th className="px-3 py-3">Total</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Added</th>
              <th className="px-3 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="px-3 py-6 text-center text-gray-500">Loading...</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={7} className="px-3 py-6 text-center text-gray-500">No purchase orders</td></tr>
            ) : data.map((o: any, idx) => (
              <tr key={idx} className="border-t hover:bg-gray-50">
                <td className="px-3 py-2">{o.po_number ?? o.poNumber}</td>
                <td className="px-3 py-2">{o.supplierName ?? '-'}</td>
                <td className="px-3 py-2">{o.orderDate ? new Date(o.orderDate).toLocaleDateString() : '-'}</td>
                <td className="px-3 py-2">{o.expectedDelivery ? new Date(o.expectedDelivery).toLocaleDateString() : '-'}</td>
                <td className="px-3 py-2">${Number(o.totalAmount ?? 0).toFixed(2)}</td>
                <td className="px-3 py-2"><span className="rounded bg-amber-100 px-2 py-0.5 text-amber-700">{o.status ?? 'Pending'}</span></td>
                <td className="px-3 py-2">{o.createdAt ? new Date(o.createdAt as any).toLocaleDateString() : '-'}</td>
                <td className="px-3 py-2">
                  {(o.status === 'Pending') && (
                    <button onClick={() => receive(o._id)} className="rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white">Receive</button>
                  )}
                  <button onClick={async () => { if (!confirm('Delete PO?')) return; await api.del(`/purchase-orders/${o._id}`); await load(); }} className="ml-2 rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white">Delete</button>
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


