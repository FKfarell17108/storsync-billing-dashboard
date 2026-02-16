import axios from 'axios';

// Default to localhost:8000 if env var is not set
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

console.log('API Base URL:', baseURL);

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false,
});

// Add a request interceptor to attach the token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;
    const method = error.config?.method?.toUpperCase();
    const msg = error.response?.data?.message || error.message;
    console.error(`API Error: [${method} ${url}] ${status || ''} ${msg || ''}`);
    return Promise.reject(error);
  }
);

const responseCache = new Map<string, { ts: number; data: any }>();
export async function getCached<T = any>(url: string, ttlMs = 30000): Promise<T> {
  const now = Date.now();
  const key = url;
  const hit = responseCache.get(key);
  if (hit && now - hit.ts < ttlMs) {
    return hit.data as T;
  }
  const res = await api.get<T>(url);
  responseCache.set(key, { ts: now, data: res.data });
  return res.data as T;
}

export function setCache(url: string, data: any) {
  responseCache.set(url, { ts: Date.now(), data });
}

export default api;
