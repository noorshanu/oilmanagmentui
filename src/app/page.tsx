import { api } from "@/lib/api";

type Stats = {
  total_inventory_value: number;
  low_stock_count: number;
  supplier_count: number;
  customer_count: number;
  pending_po_count: number;
  pending_so_count: number;
};

export default async function DashboardPage() {
  let stats: Stats = {
    total_inventory_value: 0,
    low_stock_count: 0,
    supplier_count: 0,
    customer_count: 0,
    pending_po_count: 0,
    pending_so_count: 0,
  };
  try {
    stats = await api.get<Stats>("/dashboard/stats");
  } catch {}

  const cards = [
    { title: "Total Inventory Value", value: `$${stats.total_inventory_value.toLocaleString()}` },
    { title: "Low Stock Items", value: stats.low_stock_count },
    { title: "Active Suppliers", value: stats.supplier_count },
    { title: "Active Customers", value: stats.customer_count },
    { title: "Pending POs", value: stats.pending_po_count },
    { title: "Pending SOs", value: stats.pending_so_count },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => (
          <div key={c.title} className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="text-sm text-gray-500">{c.title}</div>
            <div className="mt-1 text-2xl font-bold">{String(c.value)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

 
