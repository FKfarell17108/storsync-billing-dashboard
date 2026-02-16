"use client";

import { useEffect, useState } from "react";
import api, { getCached, setCache } from "@/lib/api";
import { Package } from "@/types";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { Modal } from "@/components/ui/Modal";

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPackage, setCurrentPackage] = useState<Partial<Package>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const data = await getCached<Package[]>("/packages");
      setPackages(data);
    } catch (error) {
      console.error("Failed to fetch packages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setCurrentPackage({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pkg: Package) => {
    setCurrentPackage(pkg);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this package?")) return;
    try {
      await api.delete(`/packages/${id}`);
      fetchPackages();
    } catch (error) {
      console.error("Failed to delete package:", error);
      alert("Failed to delete package");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (currentPackage.id) {
        await api.put(`/packages/${currentPackage.id}`, currentPackage);
      } else {
        await api.post("/packages", currentPackage);
      }
      setIsModalOpen(false);
      const fresh = await api.get<Package[]>("/packages");
      setCache("/packages", fresh.data);
      setPackages(fresh.data);
    } catch (error) {
      console.error("Failed to save package:", error);
      alert("Failed to save package");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-slate-800">Packages</h2>
        {isAdmin && (
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Package
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Speed</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Price</th>
              {isAdmin && <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {packages.map((pkg) => (
              <tr key={pkg.id} className="hover:bg-slate-50">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm font-medium text-slate-900">{pkg.name}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-slate-500">{pkg.speed}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-slate-500">{formatCurrency(Number(pkg.price))}</div>
                </td>
                {isAdmin && (
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => handleOpenEdit(pkg)}
                      className="mr-2 text-indigo-600 hover:text-indigo-900"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(pkg.id)}
                      className="text-rose-600 hover:text-rose-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {packages.length === 0 && (
              <tr>
                <td colSpan={isAdmin ? 4 : 3} className="px-6 py-4 text-center text-sm text-slate-500">
                  No packages found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentPackage.id ? "Edit Package" : "Add Package"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Name</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={currentPackage.name || ""}
              onChange={(e) => setCurrentPackage({ ...currentPackage, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Speed</label>
            <input
              type="text"
              required
              placeholder="e.g. 100 Mbps"
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={currentPackage.speed || ""}
              onChange={(e) => setCurrentPackage({ ...currentPackage, speed: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Price</label>
            <input
              type="number"
              required
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={currentPackage.price || ""}
              onChange={(e) => setCurrentPackage({ ...currentPackage, price: Number(e.target.value) })}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-70"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
