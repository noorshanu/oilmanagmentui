import { api, API_BASE } from "@/lib/api";
import Link from "next/link";
import { Suspense } from "react";

async function InventoryValue() {
  const rows = await api.get<any[]>("/reports/inventory-value").catch(() => []);
  return (
    <div className="overflow-hidden rounded-lg border bg-white">
      <table className="w-full text-sm">
        <thead className="bg-indigo-600 text-left text-xs font-medium uppercase tracking-wider text-white">
          <tr>
            <th className="px-3 py-3">Item Code</th>
            <th className="px-3 py-3">Item Name</th>
            <th className="px-3 py-3">Category</th>
            <th className="px-3 py-3">Type</th>
            <th className="px-3 py-3">Qty</th>
            <th className="px-3 py-3">Unit</th>
            <th className="px-3 py-3">Unit Price</th>
            <th className="px-3 py-3">Total Value</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={8} className="px-3 py-6 text-center text-gray-500">No data</td></tr>
          ) : rows.map((r, i) => (
            <tr key={i} className="border-t">
              <td className="px-3 py-2">{r.item_code}</td>
              <td className="px-3 py-2">{r.item_name}</td>
              <td className="px-3 py-2">{r.category}</td>
              <td className="px-3 py-2">{r.item_type}</td>
              <td className="px-3 py-2">{r.quantity}</td>
              <td className="px-3 py-2">{r.unit}</td>
              <td className="px-3 py-2">${Number(r.unit_price ?? 0).toFixed(2)}</td>
              <td className="px-3 py-2">${Number(r.total_value ?? 0).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

async function LowStock() {
  const rows = await api.get<any[]>("/reports/low-stock").catch(() => []);
  return (
    <div className="overflow-hidden rounded-lg border bg-white">
      <table className="w-full text-sm">
        <thead className="bg-indigo-600 text-left text-xs font-medium uppercase tracking-wider text-white">
          <tr>
            <th className="px-3 py-3">Item Code</th>
            <th className="px-3 py-3">Item Name</th>
            <th className="px-3 py-3">Category</th>
            <th className="px-3 py-3">Qty</th>
            <th className="px-3 py-3">Min Stock</th>
            <th className="px-3 py-3">Unit</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={6} className="px-3 py-6 text-center text-gray-500">No data</td></tr>
          ) : rows.map((r, i) => (
            <tr key={i} className="border-t">
              <td className="px-3 py-2">{r.item_code}</td>
              <td className="px-3 py-2">{r.item_name}</td>
              <td className="px-3 py-2">{r.category}</td>
              <td className="px-3 py-2">{r.quantity}</td>
              <td className="px-3 py-2">{r.minimum_stock}</td>
              <td className="px-3 py-2">{r.unit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

async function SalesSummary({ start, end }: { start?: string; end?: string }) {
  const qs = new URLSearchParams();
  if (start && end) { qs.set('start_date', start); qs.set('end_date', end); }
  const rows = await api.get<any[]>(`/reports/sales-summary${qs.toString() ? `?${qs.toString()}` : ''}`).catch(() => []);
  return (
    <div className="overflow-hidden rounded-lg border bg-white">
      <table className="w-full text-sm">
        <thead className="bg-indigo-600 text-left text-xs font-medium uppercase tracking-wider text-white">
          <tr>
            <th className="px-3 py-3">SO Number</th>
            <th className="px-3 py-3">Date</th>
            <th className="px-3 py-3">Customer</th>
            <th className="px-3 py-3">Total</th>
            <th className="px-3 py-3">Paid</th>
            <th className="px-3 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={6} className="px-3 py-6 text-center text-gray-500">No data</td></tr>
          ) : rows.map((r, i) => (
            <tr key={i} className="border-t">
              <td className="px-3 py-2">{r.so_number}</td>
              <td className="px-3 py-2">{r.order_date ? new Date(r.order_date).toLocaleDateString() : '-'}</td>
              <td className="px-3 py-2">{r.company_name}</td>
              <td className="px-3 py-2">${Number(r.total_amount ?? 0).toFixed(2)}</td>
              <td className="px-3 py-2">${Number(r.paid_amount ?? 0).toFixed(2)}</td>
              <td className="px-3 py-2"><span className="rounded bg-amber-100 px-2 py-0.5 text-amber-700">{r.status ?? 'Pending'}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function ReportsPage(
  { searchParams }: { searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }
) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const startParam = resolvedSearchParams?.start;
  const endParam = resolvedSearchParams?.end;
  const start = Array.isArray(startParam) ? (startParam[0] ?? '') : (startParam ?? '');
  const end = Array.isArray(endParam) ? (endParam[0] ?? '') : (endParam ?? '');
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Reports</h1>
      <div className="space-y-10">
        <section>
          <h2 className="mb-2 text-lg font-semibold">Inventory Value Report</h2>
          <div className="mb-2 flex justify-between">
            <div />
            <Link href={`${API_BASE}/reports/export-inventory`} className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white">Export Excel</Link>
          </div>
          {await InventoryValue()}
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold">Low Stock Report</h2>
          {await LowStock()}
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold">Sales Summary</h2>
          <form className="mb-3 flex items-end gap-2" action="/reports" method="get">
            <div>
              <label className="block text-xs text-gray-600">Start</label>
              <input type="date" name="start" defaultValue={start} className="rounded-md border px-2 py-1 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-600">End</label>
              <input type="date" name="end" defaultValue={end} className="rounded-md border px-2 py-1 text-sm" />
            </div>
            <button className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white">Apply</button>
          </form>
          {await SalesSummary({ start, end })}
        </section>
      </div>
    </div>
  );
}


