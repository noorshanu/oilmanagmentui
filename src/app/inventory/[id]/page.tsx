"use client";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { api, API_BASE } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";

type Item = any;

export default function InventoryDetail() {
  const params = useParams();
  const id = (params?.id as string) || "";
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true); setError(null);
    try { setItem(await api.get(`/inventory/${id}`)); } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [id]);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const fd = new FormData();
      Array.from(files).forEach(f => fd.append('images', f));
      const res = await fetch(`${API_BASE}/inventory/${id}/images`, { method: 'POST', body: fd });
      if (!res.ok) throw new Error(await res.text());
      await load();
      if (inputRef.current) inputRef.current.value = "";
    } catch (e: any) { setError(e.message); } finally { setUploading(false); }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!item) return <div>Not found</div>;

  const images: string[] = item.images || [];
  const qrUrl = `${API_BASE}/inventory/${id}/qr?base=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')}`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Item Details</h1>
        <Link href={`/inventory`} className="rounded-md border px-3 py-1.5 text-sm">Back</Link>
      </div>
      <div className="rounded-lg border bg-white p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <div className="text-sm text-gray-500">Item Code</div>
            <div className="font-medium">{item.item_code ?? item.itemCode}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Name</div>
            <div className="font-medium">{item.item_name ?? item.itemName}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Category</div>
            <div className="font-medium">{item.category}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Type</div>
            <div className="font-medium">{item.item_type ?? item.itemType}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Quantity</div>
            <div className="font-medium">{item.quantity} {item.unit}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Unit Price</div>
            <div className="font-medium">${Number(item.unit_price ?? item.unitPrice ?? 0).toFixed(2)}</div>
          </div>
          <div className="md:col-span-2">
            <div className="text-sm text-gray-500">Description</div>
            <div className="font-medium">{item.description || '-'}</div>
          </div>
        </div>
      </div>
      <div className="rounded-lg border bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Images</h2>
          <div className="flex items-center gap-2">
            <button onClick={() => inputRef.current?.click()} className="rounded-md border px-3 py-1.5 text-sm">Upload</button>
            <input ref={inputRef} type="file" multiple accept="image/*" capture="environment" onChange={onUpload} className="hidden" />
            {uploading && <span className="animate-pulse text-sm text-gray-600">Uploading...</span>}
          </div>
        </div>
        {images.length === 0 ? (
          <div className="text-sm text-gray-500">No images</div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {images.map((src) => {
              const base = API_BASE.replace(/\/api$/, "");
              const full = src.startsWith("http") ? src : `${base}${src}`;
              return (
                <div key={src} className="group relative overflow-hidden rounded-lg border bg-white shadow-sm transition hover:shadow-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */ }
                  <img src={full} alt="" className="h-48 w-full object-cover transition group-hover:scale-[1.02]" />
                </div>
            );})}
          </div>
        )}
      </div>
      <div className="rounded-lg border bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">QR Code</h2>
          <a href={qrUrl} download className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white">Download QR</a>
        </div>
        <div className="flex items-center gap-6">
          {/* eslint-disable-next-line @next/next/no-img-element */ }
          <img src={qrUrl} alt="QR" className="h-40 w-40 rounded border bg-white p-2" />
          <div className="text-sm text-gray-600">
            Scan to view this item at:<br/>
            <span className="font-mono">{typeof window !== 'undefined' ? `${window.location.origin}/inventory/${id}` : ''}</span>
          </div>
        </div>
      </div>
    </div>
  );
}


