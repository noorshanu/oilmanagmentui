"use client";
export function Pagination({ page, pages, onChange }: { page: number; pages: number; onChange: (p: number) => void }) {
  if (pages <= 1) return null;
  const prev = () => onChange(Math.max(1, page - 1));
  const next = () => onChange(Math.min(pages, page + 1));
  return (
    <div className="flex items-center justify-end gap-2 text-sm">
      <button onClick={prev} disabled={page <= 1} className="rounded-md border px-3 py-1 disabled:opacity-50">Prev</button>
      <span className="text-gray-600">Page {page} of {pages}</span>
      <button onClick={next} disabled={page >= pages} className="rounded-md border px-3 py-1 disabled:opacity-50">Next</button>
    </div>
  );
}


