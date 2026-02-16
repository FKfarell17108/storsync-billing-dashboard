"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/login", { email, password });
      login(response.data);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-violet-50 via-purple-50 to-violet-100 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
        <h2 className="mb-3 text-center text-2xl font-semibold text-violet-800">
          Login
        </h2>

        <div className="mb-6 rounded-md border border-violet-100 bg-violet-50 px-3 py-2 text-xs text-slate-700">
          Admin:{" "}
          <span className="font-semibold text-violet-800">
            admin@example.com
          </span>{" "}
          /{" "}
          <span className="font-semibold text-violet-800">
            Admin123!
          </span>
          <br />
          User:{" "}
          <span className="font-semibold text-violet-800">
            user@example.com
          </span>{" "}
          /{" "}
          <span className="font-semibold text-violet-800">
            User123!
          </span>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm text-slate-700">
              Email
            </label>
            <input
              type="email"
              required
              className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-violet-600 focus:outline-none focus:ring-1 focus:ring-violet-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-700">
              Password
            </label>
            <input
              type="password"
              required
              className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-violet-600 focus:outline-none focus:ring-1 focus:ring-violet-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="text-center text-sm text-rose-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-md bg-violet-600 px-3 py-2 text-sm font-semibold text-white shadow-md hover:bg-violet-500 disabled:opacity-70"
          >
            {loading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
