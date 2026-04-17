"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Bell, 
  Globe, 
  LogOut, 
  Camera,
  Settings,
  CreditCard,
  Key,
  X,
  Trash2,
  Plus,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

interface AccountViewProps {
  t: any;
  handleLogout: () => void;
  students: any[];
  mealPlans: any[];
}

export function AccountView({ t, handleLogout, students, mealPlans }: AccountViewProps) {
  const { lang } = useI18n();
  const [email, setEmail] = React.useState("admin@smartfood.ai");
  const [isEditingEmail, setIsEditingEmail] = React.useState(false);
  const [tempEmail, setTempEmail] = React.useState(email);

  const [isEditingPassword, setIsEditingPassword] = React.useState(false);
  const [passForm, setPassForm] = React.useState({
    current: "",
    new: "",
    confirm: ""
  });
  const [passError, setPassError] = React.useState<string | null>(null);

  const [isBillingLoading, setIsBillingLoading] = React.useState(false);
  const [billingStatus, setBillingStatus] = React.useState<'idle' | 'success'>('idle');

  const [cards, setCards] = React.useState<any[]>([]);

  React.useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
      const res = await fetch(`${apiUrl}/payments/`);
      if (res.ok) {
        const data = await res.json();
        setCards(data.map((c: any) => ({
          id: c.id,
          last4: c.last4,
          brand: c.brand,
          exp: `${c.exp_month}/${String(c.exp_year).slice(-2)}`,
          isPrimary: c.is_primary
        })));
      }
    } catch (error) {
      console.error("Error fetching cards:", error);
    }
  };

  const [isAddingCard, setIsAddingCard] = React.useState(false);
  const [newCardForm, setNewCardForm] = React.useState({
    number: "",
    holder: "",
    exp: "",
    cvc: ""
  });

  const handleSaveCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBillingLoading(true);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
      const [exp_month, exp_year] = (newCardForm.exp || "01/29").split('/').map(Number);
      const res = await fetch(`${apiUrl}/payments/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: "Visa",
          last4: newCardForm.number.slice(-4),
          exp_month: exp_month || 1,
          exp_year: exp_year ? (exp_year < 100 ? 2000 + exp_year : exp_year) : 2029,
          is_primary: cards.length === 0
        })
      });

      if (res.ok) {
        await fetchCards();
        setIsAddingCard(false);
        setNewCardForm({ number: "", holder: "", exp: "", cvc: "" });
      }
    } catch (error) {
      console.error("Error saving card:", error);
    } finally {
      setIsBillingLoading(false);
    }
  };

  const handleSetPrimary = async (id: string | number) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
      const res = await fetch(`${apiUrl}/payments/${id}/set-primary`, {
        method: 'PATCH'
      });
      if (res.ok) {
        fetchCards();
      }
    } catch (error) {
      console.error("Error setting primary card:", error);
    }
  };

  const handleRemoveCard = async (id: string | number) => {
    const card = cards.find(c => c.id === id);
    if (card?.isPrimary) {
      alert("No puedes eliminar la tarjeta principal");
      return;
    }
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
      const res = await fetch(`${apiUrl}/payments/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchCards();
      } else {
        const err = await res.json();
        alert(err.detail || "Error al eliminar la tarjeta");
      }
    } catch (error) {
      console.error("Error removing card:", error);
    }
  };

  const handleManageBilling = () => {
    setIsBillingLoading(true);
    // Simulate API call to generate Stripe Portal session
    setTimeout(() => {
      setIsBillingLoading(false);
      setBillingStatus('success');
      
      // Reset after 3 seconds
      setTimeout(() => setBillingStatus('idle'), 3000);
      
      // In a real app: window.location.href = portalUrl;
    }, 1500);
  };

  const handleSaveEmail = () => {
    setEmail(tempEmail);
    setIsEditingEmail(false);
  };

  const handleCancelEmail = () => {
    setTempEmail(email);
    setIsEditingEmail(false);
  };

  const handleSavePassword = () => {
    if (passForm.new !== passForm.confirm) {
      setPassError("Las contraseñas no coinciden");
      return;
    }
    if (passForm.new.length < 6) {
      setPassError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    // Simulation
    setPassError(null);
    setIsEditingPassword(false);
    setPassForm({ current: "", new: "", confirm: "" });
    alert("Contraseña actualizada correctamente");
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-none">{t.dashboard.account_title}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-3 font-normal text-lg">{t.dashboard.account_sub}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all shadow-sm active:scale-95"
          >
            <LogOut className="w-4 h-4" /> {t.dashboard.logout}
          </button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <User className="w-32 h-32 text-emerald-600" />
            </div>
            
            <div className="relative flex flex-col items-center text-center">
              <div className="relative group mb-6">
                <div className="w-32 h-32 rounded-[2.5rem] bg-linear-to-br from-emerald-500 to-emerald-600 p-[3px] shadow-2xl shadow-emerald-500/20">
                  <div className="w-full h-full rounded-[2.2rem] bg-white dark:bg-slate-950 flex items-center justify-center p-1 overflow-hidden">
                    <div className="w-full h-full rounded-[1.8rem] bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-3xl font-black">
                      AD
                    </div>
                  </div>
                </div>
                <button className="absolute bottom-1 right-1 w-10 h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center text-slate-500 hover:text-emerald-600 transition-all shadow-lg active:scale-90 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
                  <Camera className="w-5 h-5" />
                </button>
              </div>

              <h3 className="text-2xl font-black text-slate-900 dark:text-white">Admin User</h3>
              <div className="flex items-center gap-2 mt-1 text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest text-[10px]">
                <ShieldCheck className="w-3.5 h-3.5" /> Administrador Pro
              </div>

              <div className="w-full mt-8 pt-8 border-t border-slate-100 dark:border-slate-800/60 space-y-4">
                <div className="flex items-center gap-4 text-left">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/60 flex items-center justify-center text-slate-400 shrink-0">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Idioma</div>
                    <div className="text-sm font-normal text-slate-700 dark:text-slate-200">Español (México)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-emerald-600 to-teal-700 rounded-[2.5rem] p-8 text-white shadow-2xl overflow-hidden relative group">
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <CreditCard className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <h4 className="text-xl font-black mb-6">{t.dashboard.billing_title}</h4>
              
              <div className="space-y-4 mb-8">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[.25em] text-emerald-100/60 mb-1">{t.dashboard.sub_type}</div>
                  <div className="text-sm font-bold bg-white/10 w-fit px-3 py-1 rounded-lg">{t.dashboard.sub_pro}</div>
                </div>
                
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[.25em] text-emerald-100/60 mb-1">{t.dashboard.sub_status}</div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <div className="text-sm font-bold">{t.dashboard.sub_active}</div>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleManageBilling}
                disabled={isBillingLoading || billingStatus === 'success'}
                className={cn(
                  "w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-[0.15em] transition-all shadow-lg flex items-center justify-center gap-2 active:scale-[0.98]",
                  billingStatus === 'success' 
                    ? "bg-emerald-400 text-white" 
                    : "bg-white text-emerald-700 hover:bg-emerald-50 disabled:opacity-70"
                )}
              >
                {isBillingLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-emerald-700/30 border-t-emerald-700 rounded-full animate-spin" />
                    {lang === 'es' ? 'Procesando...' : (lang === 'fr' ? 'Traitement...' : 'Processing...')}
                  </>
                ) : billingStatus === 'success' ? (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    {lang === 'es' ? 'Portal Listo' : (lang === 'fr' ? 'Portail Prêt' : 'Portal Ready')}
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    {t.dashboard.manage_billing}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Settings Sections */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">{t.dashboard.security_title}</h3>
              <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-slate-400">
                <Key className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="w-full flex items-center justify-between p-5 rounded-[1.8rem] border border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-900/60 hover:border-emerald-500/30 transition-all text-left group">
                <div className="flex items-center gap-5 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Correo Electrónico</div>
                    {isEditingEmail ? (
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="email"
                          value={tempEmail}
                          onChange={(e) => setTempEmail(e.target.value)}
                          className="w-full bg-white dark:bg-slate-950 border border-emerald-500/30 rounded-xl px-3 py-2 text-sm font-normal outline-none shadow-inner"
                          autoFocus
                        />
                        <button onClick={handleSaveEmail} className="p-2 bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">
                          <ShieldCheck className="w-4 h-4" />
                        </button>
                        <button onClick={handleCancelEmail} className="p-2 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl active:scale-95 transition-all">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-sm font-normal text-slate-900 dark:text-white truncate">{email}</div>
                    )}
                  </div>
                </div>
                {!isEditingEmail && (
                  <button 
                    onClick={() => setIsEditingEmail(true)}
                    className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-emerald-500 transition-colors bg-slate-100 dark:bg-slate-800 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/10 px-4 py-2 rounded-xl"
                  >
                    {lang === 'es' ? 'Cambiar' : (lang === 'fr' ? 'Changer' : 'Change')}
                  </button>
                )}
              </div>

              <div className="w-full rounded-[1.8rem] border border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-900/60 transition-all text-left group overflow-hidden">
                <div className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-sm font-black text-slate-900 dark:text-white">Cambiar Contraseña</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">Actualizada hace 2 meses</div>
                    </div>
                  </div>
                  {!isEditingPassword && (
                    <button 
                      onClick={() => setIsEditingPassword(true)}
                      className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-emerald-500 transition-colors bg-slate-100 dark:bg-slate-800 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/10 px-4 py-2 rounded-xl"
                    >
                      {lang === 'es' ? 'Actualizar' : (lang === 'fr' ? 'Actualiser' : 'Update')}
                    </button>
                  )}
                </div>

                <AnimatePresence>
                  {isEditingPassword && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-5 pb-5 pt-0 border-t border-slate-100 dark:border-slate-800/50"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{t.dashboard.current_pass}</label>
                          <input 
                            type="password" 
                            value={passForm.current}
                            onChange={(e) => setPassForm({...passForm, current: e.target.value})}
                            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-normal outline-none focus:border-emerald-500/50 transition-colors"
                            placeholder="••••••••"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{t.dashboard.new_pass}</label>
                          <input 
                            type="password" 
                            value={passForm.new}
                            onChange={(e) => setPassForm({...passForm, new: e.target.value})}
                            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-normal outline-none focus:border-emerald-500/50 transition-colors"
                            placeholder="••••••••"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{t.dashboard.confirm_pass}</label>
                          <input 
                            type="password" 
                            value={passForm.confirm}
                            onChange={(e) => setPassForm({...passForm, confirm: e.target.value})}
                            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-normal outline-none focus:border-emerald-500/50 transition-colors"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>

                      {passError && (
                        <div className="mt-4 text-xs font-normal text-rose-500 bg-rose-50 dark:bg-rose-500/10 px-4 py-2 rounded-lg border border-rose-100 dark:border-rose-500/20">
                          {passError}
                        </div>
                      )}

                      <div className="flex items-center gap-3 mt-8">
                        <button 
                          onClick={handleSavePassword}
                          className="px-6 py-3 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 active:scale-95 transition-all"
                        >
                          {t.dashboard.save_pass}
                        </button>
                        <button 
                          onClick={() => {
                            setIsEditingPassword(false);
                            setPassError(null);
                          }}
                          className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all"
                        >
                          Cancelar
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button className="w-full flex items-center justify-between p-5 rounded-[1.8rem] border border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-900/60 hover:border-emerald-500/30 transition-all text-left group">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors">
                    <Bell className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-900 dark:text-white">{t.dashboard.notifications_title}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">{t.dashboard.notifications_sub}</div>
                  </div>
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-emerald-500 transition-colors">{lang === 'es' ? 'Configurar' : (lang === 'fr' ? 'Configurer' : 'Configure')}</div>
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">{t.dashboard.payment_methods_title}</h3>
              <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-slate-400">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-4">
              {cards.map((card) => (
                <div key={card.id} className={cn(
                  "flex items-center justify-between p-5 rounded-[1.8rem] border transition-all",
                  card.isPrimary 
                    ? "bg-emerald-50/30 dark:bg-emerald-500/5 border-emerald-500/20" 
                    : "bg-slate-50/40 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900/60"
                )}>
                  <div className="flex items-center gap-5">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl border flex items-center justify-center transition-colors",
                      card.isPrimary 
                        ? "bg-white dark:bg-slate-950 border-emerald-500/30 text-emerald-500" 
                        : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400"
                    )}>
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-slate-900 dark:text-white">{card.brand} •••• {card.last4}</span>
                        {card.isPrimary && (
                          <span className="text-[8px] font-black uppercase tracking-widest bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                            {t.dashboard.primary}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">{t.dashboard.expires}: {card.exp}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {!card.isPrimary && (
                      <button 
                        onClick={() => handleSetPrimary(card.id)}
                        className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-xl transition-all"
                        title={t.dashboard.primary}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}
                    <button 
                      onClick={() => handleRemoveCard(card.id)}
                      className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all"
                      title={t.dashboard.remove}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              <button 
                onClick={() => setIsAddingCard(true)}
                className="w-full flex items-center justify-center gap-3 p-5 rounded-[1.8rem] border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 hover:text-emerald-500 hover:border-emerald-500/30 transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/10 transition-colors">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">{t.dashboard.add_card}</span>
              </button>
            </div>
          </div>

          {/* Add Card Modal */}
          <AnimatePresence>
            {isAddingCard && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md"
              >
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-2xl overflow-hidden relative"
                >
                  <button 
                    onClick={() => setIsAddingCard(false)}
                    className="absolute top-6 right-6 p-2 text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">{t.dashboard.add_card}</h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">{t.dashboard.add_card_desc}</p>
                    </div>
                  </div>

                  <form onSubmit={handleSaveCard} className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{t.dashboard.card_holder}</label>
                      <input 
                        required
                        type="text" 
                        value={newCardForm.holder}
                        onChange={(e) => setNewCardForm({...newCardForm, holder: e.target.value})}
                        className="w-full bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-normal outline-none focus:border-emerald-500/50 transition-colors"
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{t.dashboard.card_number}</label>
                      <input 
                        required
                        type="text" 
                        maxLength={16}
                        value={newCardForm.number}
                        onChange={(e) => setNewCardForm({...newCardForm, number: e.target.value.replace(/\D/g, '')})}
                        className="w-full bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-normal outline-none focus:border-emerald-500/50 transition-colors"
                        placeholder="•••• •••• •••• ••••"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{t.dashboard.expires}</label>
                        <input 
                          required
                          type="text" 
                          placeholder="MM/YY"
                          maxLength={5}
                          value={newCardForm.exp}
                          onChange={(e) => setNewCardForm({...newCardForm, exp: e.target.value})}
                          className="w-full bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-normal outline-none focus:border-emerald-500/50 transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{t.dashboard.card_cvc}</label>
                        <input 
                          required
                          type="text" 
                          maxLength={3}
                          value={newCardForm.cvc}
                          onChange={(e) => setNewCardForm({...newCardForm, cvc: e.target.value.replace(/\D/g, '')})}
                          className="w-full bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-normal outline-none focus:border-emerald-500/50 transition-colors"
                          placeholder="123"
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex items-center gap-3">
                      <button 
                        type="submit"
                        disabled={isBillingLoading}
                        className="flex-1 py-3.5 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                      >
                        {isBillingLoading ? (
                          <>
                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            {lang === 'es' ? 'Guardando...' : (lang === 'fr' ? 'Enregistrement...' : 'Saving...')}
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4" />
                            {t.dashboard.save_card}
                          </>
                        )}
                      </button>
                      <button 
                        type="button"
                        onClick={() => setIsAddingCard(false)}
                        className="px-6 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all"
                      >
                        {lang === 'es' ? 'Cancelar' : (lang === 'fr' ? 'Annuler' : 'Cancel')}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Preferencia del Sistema</h3>
              <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-slate-400">
                <Settings className="w-4 h-4" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Modo Visual</div>
                <div className="flex gap-2">
                  <button className="flex-1 py-3 px-2 rounded-xl bg-white dark:bg-slate-950 border-2 border-emerald-600 text-[10px] font-black uppercase tracking-wider text-emerald-600">Automático</button>
                  <button className="flex-1 py-3 px-2 rounded-xl bg-white/20 border border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-400">Claro</button>
                  <button className="flex-1 py-3 px-2 rounded-xl bg-white/20 border border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-400">Oscuro</button>
                </div>
              </div>

              <div className="p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Unidades de Medida</div>
                <div className="flex gap-2">
                  <button className="flex-1 py-3 px-2 rounded-xl bg-white dark:bg-slate-950 border-2 border-emerald-600 text-[10px] font-black uppercase tracking-wider text-emerald-600">Sistema (kg)</button>
                  <button className="flex-1 py-3 px-2 rounded-xl bg-white/20 border border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-400">Imperial (lb)</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
