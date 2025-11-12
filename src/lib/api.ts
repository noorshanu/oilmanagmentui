export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000/api';

function authHeaders() {
  if (typeof window === 'undefined') return {} as HeadersInit;
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  get: async <T>(path: string) => handle<T>(await fetch(`${API_BASE}${path}`, { cache: 'no-store', headers: { ...authHeaders() } })),
  post: async <T>(path: string, body: any) => handle<T>(await fetch(`${API_BASE}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(body) })),
  put: async <T>(path: string, body: any) => handle<T>(await fetch(`${API_BASE}${path}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(body) })),
  del: async <T>(path: string) => handle<T>(await fetch(`${API_BASE}${path}`, { method: 'DELETE', headers: { ...authHeaders() } })),
};


