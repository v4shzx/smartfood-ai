"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Search, 
  Shield, 
  CreditCard, 
  ChevronRight, 
  ArrowLeft,
  Settings,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  X
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_URL}/admin/users`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSubscription = async (userId: string, tier: string) => {
    try {
      const res = await fetch(`${API_URL}/admin/users/${userId}/subscription`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      if (res.ok) {
        fetchUsers();
        setSelectedUser(null);
      }
    } catch (err) {
      console.error("Error updating subscription:", err);
    }
  };

  const filteredUsers = users.filter(u => 
    u.full_name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-6 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Link href="/login" className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-600">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-black tracking-tight uppercase">Panel de Control</h1>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Gestión de Usuarios y Suscripciones</p>
            </div>
          </div>

          <div className="relative group flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
            <input 
              type="text"
              placeholder="Buscar usuarios..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl py-3 pl-12 pr-4 text-sm outline-none transition-all placeholder:text-slate-300"
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 mt-12">
        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: "Total Usuarios", value: users.length, icon: <Users className="w-6 h-6" />, color: "bg-slate-900" },
            { label: "Plan Profesional", value: users.filter(u => u.subscription_tier === "profesional").length, icon: <Shield className="w-6 h-6" />, color: "bg-orange-500" },
            { label: "Plan Básico", value: users.filter(u => u.subscription_tier === "basico").length, icon: <CreditCard className="w-6 h-6" />, color: "bg-emerald-500" },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center justify-between"
            >
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{stat.label}</p>
                <div className="text-4xl font-black tracking-tighter text-slate-900">{stat.value}</div>
              </div>
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg", stat.color)}>
                {stat.icon}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Usuario</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Estado / Plan</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Registrado</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={4} className="px-8 py-8"><div className="h-4 bg-slate-50 rounded-full w-full" /></td>
                    </tr>
                  ))
                ) : filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-600 text-sm shadow-sm group-hover:scale-105 transition-transform">
                          {u.full_name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-black text-slate-900 group-hover:text-emerald-600 transition-colors">{u.full_name}</div>
                          <div className="text-xs text-slate-400 font-bold">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className={cn(
                        "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm",
                        u.subscription_tier === "profesional" ? "bg-orange-50 text-orange-600" : "bg-emerald-50 text-emerald-600"
                      )}>
                        {u.subscription_tier === "profesional" ? <Shield className="w-3 h-3" /> : <CreditCard className="w-3 h-3" />}
                        {u.subscription_tier}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm text-slate-500 font-bold">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-6">
                      <button 
                        onClick={() => setSelectedUser(u)}
                        className="p-3 bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white rounded-2xl transition-all active:scale-90"
                      >
                        <Settings className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Subscription Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/10 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden border border-slate-200 p-10"
            >
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-xl font-black uppercase tracking-tight">Gestionar Plan</h3>
                <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-10 p-6 bg-slate-50 rounded-[2rem]">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black">
                  {selectedUser.full_name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="font-black text-lg">{selectedUser.full_name}</div>
                  <div className="text-xs text-slate-400 font-bold">ID: {selectedUser.id}</div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Seleccionar Nuevo Nivel</p>
                {[
                  { id: "basico", label: "Plan Básico", desc: "Funciones esenciales limitadas", color: "hover:border-emerald-400" },
                  { id: "profesional", label: "Plan Profesional", desc: "SaaS Full Access + IA", color: "hover:border-orange-400" },
                  { id: "empresarial", label: "Plan Empresarial", desc: "Multi-sucursal Avanzado", color: "hover:border-blue-400" },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => updateSubscription(selectedUser.id, tier.id)}
                    className={cn(
                      "w-full text-left p-6 rounded-[2rem] border-2 border-slate-100 transition-all active:scale-[0.98] group",
                      tier.color,
                      selectedUser.subscription_tier === tier.id ? "bg-slate-50 border-slate-900" : "hover:bg-white hover:shadow-lg"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-black text-slate-900 uppercase text-xs tracking-widest">{tier.label}</div>
                        <div className="text-[10px] text-slate-400 font-bold mt-1">{tier.desc}</div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
