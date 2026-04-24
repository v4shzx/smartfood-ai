"use client";

import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Mail, 
  Lock, 
  User,
  ArrowRight, 
  ArrowLeft, 
  Shield, 
  Sparkles,
  ChevronRight,
  Eye,
  EyeOff,
  Moon,
  Sun
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n, LangSwitcher } from "@/lib/i18n";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

import { useRouter } from "next/navigation";

// ─── Theme Toggle ─────────────────────────────────────────────────────────────

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-9 h-9" />;

  const isDark = resolvedTheme === "dark";
  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800/40 bg-white/60 dark:bg-slate-900/60 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm backdrop-blur-sm"
    >
      {isDark
        ? <Sun  className="w-4 h-4 text-amber-400" />
        : <Moon className="w-4 h-4 text-slate-600" />}
    </button>
  );
}

import { API_URL } from "@/lib/api-config";

export default function LoginPage() {
  const { t } = useI18n();
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [isRegistering, setIsRegistering] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("comedordm@gmail.com");
  const [password, setPassword] = useState("123456");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const demoUsers = [
    { id: "u_demo", name: "Admin Empresarial", email: "comedordm@gmail.com", pass: "123456" },
    { id: "u_demo_basico", name: "Admin Básico", email: "demo_basico@smartfood.ai", pass: "123456" },
  ];

  const handleSelectDemo = (user: typeof demoUsers[0]) => {
    setEmail(user.email);
    setPassword(user.pass);
  };

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const endpoint = isRegistering ? "register" : "login";
      const body = isRegistering 
        ? { email, password, full_name: fullName }
        : { email, password };

      const response = await fetch(`${API_URL}/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || `Error al ${isRegistering ? 'crear cuenta' : 'iniciar sesión'}`);
      }

      // Success: Save Session
      localStorage.setItem("smartfood_user_id", data.user_id);
      localStorage.setItem("smartfood_user_name", data.full_name);
      localStorage.setItem("smartfood_user_role", data.role || "user");
      localStorage.setItem("smartfood_subscription_tier", data.subscription_tier || "basico");
      
      // MASTER PANEL Redirection logic
      if (data.subscription_tier === "administrador") {
        router.push("/admin/users");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <div className="min-h-screen bg-transparent flex flex-row-reverse overflow-hidden font-sans transition-colors duration-500">
      {/* --- Right Side: Login Form --- */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-5 pb-8 pt-24 sm:px-6 sm:pb-10 sm:pt-28 md:px-10 md:pb-12 md:pt-32 relative bg-white dark:bg-slate-950 transition-colors duration-500 border-l border-slate-200 dark:border-slate-800/50">
        {/* Back Link & Lang Switcher */}
        <div className="absolute top-5 left-5 right-5 sm:top-6 sm:left-6 sm:right-6 lg:top-8 lg:left-12 lg:right-8 flex justify-between items-center gap-3">
          <Link href="/" className="group flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all duration-200">
            <div className="p-1.5 rounded-full border border-slate-200 dark:border-slate-800 group-hover:bg-slate-50 dark:group-hover:bg-slate-900 group-hover:shadow-sm transition-all">
              <ArrowLeft className="w-3.5 h-3.5" />
            </div>
            <span className="text-sm font-medium">{t.login.back}</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <LangSwitcher />
          </div>
        </div>

        <div className="w-full max-w-[400px]">
          {/* Mobile Header (Hidden on Desktop) */}
          <div className="lg:hidden flex items-center gap-2 mb-8 sm:mb-10">
            <div className="w-8 h-8 flex items-center justify-center">
              <Image src="/logo.png" alt="Logo" width={32} height={32} className="w-full h-full object-contain" priority />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">SmartFood AI</span>
          </div>

          <div className="mb-8 sm:mb-10 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
              {isRegistering ? t.login.welcome_new : t.login.welcome}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              {isRegistering ? t.login.subtitle_new : t.login.subtitle}
            </p>
          </div>

          {/* Social Logins (Hidden temporarily as requested)
          <div className="flex flex-col gap-3.5 mb-8">
            <Button variant="outline" ...>Google</Button>
            <Button variant="outline" ...>Apple</Button>
            <Button variant="outline" ...>Microsoft</Button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-950 px-4 text-slate-400 dark:text-slate-500 font-medium tracking-wider transition-colors duration-500">{t.login.or}</span>
            </div>
          </div>
          */}

          {/* Demo Selector */}
          {!isRegistering && (
            <div className="mb-6 sm:mb-8 space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Accesos Rápidos Demo</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {demoUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => handleSelectDemo(u)}
                    className={cn(
                      "text-left p-3.5 rounded-2xl border transition-all active:scale-[0.98] cursor-pointer",
                      email === u.email 
                        ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500/40 shadow-sm" 
                        : "bg-slate-50/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:border-emerald-500/20"
                    )}
                  >
                    <div className="text-[11px] font-black text-slate-900 dark:text-white truncate">{u.name}</div>
                    <div className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">Auto-rellenar</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {isRegistering && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">{t.login.name_label}</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-emerald-500 transition-colors">
                    <User className="w-4.5 h-4.5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-11 pr-4 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 shadow-sm"
                    placeholder={t.login.name_placeholder}
                  />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">{t.login.email_label}</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-emerald-500 transition-colors">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-11 pr-4 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 shadow-sm"
                  placeholder={t.login.email_placeholder}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="px-1">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.login.password_label}</label>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-emerald-500 transition-colors">
                  <Lock className="w-4.5 h-4.5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-11 pr-12 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 shadow-sm"
                  placeholder={t.login.password_placeholder}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4.5 h-4.5" />
                  ) : (
                    <Eye className="w-4.5 h-4.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3 px-1 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <input 
                  id="remember" 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-emerald-600 focus:ring-emerald-500" 
                />
                <label htmlFor="remember" className="text-sm text-slate-500 dark:text-slate-400 font-medium cursor-pointer">
                  {t.login.remember}
                </label>
              </div>
              <Link href="#" className="self-start sm:self-auto text-xs font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors">
                {t.login.forgot}
              </Link>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isRegistering ? t.login.signup : t.login.signin}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          {/* Footer */}
          <p className="mt-6 sm:mt-8 text-center text-sm text-slate-500 dark:text-slate-400 font-medium">
            {isRegistering ? t.login.has_account : t.login.no_account}{" "}
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 font-bold transition-colors inline-flex items-center gap-1 group"
            >
              {isRegistering ? t.login.login_now : t.login.create}
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </p>

          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-wrap justify-center gap-x-5 gap-y-2">
            <Link href="#" className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">{t.login.terms}</Link>
            <Link href="#" className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">{t.login.privacy}</Link>
            <Link href="#" className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">{t.login.security}</Link>
          </div>
        </div>
      </div>

      {/* --- Left Side: Visual Panel --- */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-50 dark:bg-black items-center justify-center p-12 overflow-hidden transition-colors duration-500">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div 
            className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full" 
            style={{ background: "radial-gradient(circle at center, rgba(5, 150, 105, 0.15), transparent 70%)" }}
          />
          <div 
            className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full" 
            style={{ background: "radial-gradient(circle at center, rgba(13, 148, 136, 0.15), transparent 70%)" }}
          />
          <div 
            className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full" 
            style={{ background: "radial-gradient(circle at center, rgba(148, 163, 184, 0.25), transparent 70%)" }}
          />
        </div>

        {/* Animated Flickering Grid Pattern */}
        <FlickeringGrid 
          className="absolute inset-0 z-0 size-full"
          squareSize={4}
          gridGap={6}
          color={isDark ? "#334155" : "#cbd5e1"}
          maxOpacity={isDark ? 0.3 : 0.2}
          flickerChance={0.1}
        />

        <div className="relative z-10 w-full max-w-lg">
          {/* Logo & Branding */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-12 h-12 flex items-center justify-center">
              <Image src="/logo.png" alt="Logo" width={48} height={48} className="w-full h-full object-contain" />
            </div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">SmartFood AI</span>
          </motion.div>

          {/* Tagline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl font-bold text-slate-900 dark:text-white leading-tight mb-4"
          >
            {t.login.tagline}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-500 dark:text-slate-400 text-lg mb-12 max-w-md font-medium"
          >
            {t.login.description}
          </motion.p>

          {/* Visual Mockup: Glassmorphism Dashboard Element */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
              {/* Header of card */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                  </div>
                  <div className="h-4 w-32 bg-slate-200 dark:bg-white/10 rounded-full" />
                </div>
                <div className="h-4 w-12 bg-slate-200 dark:bg-white/10 rounded-full" />
              </div>

              {/* Fake Graph Lines */}
              <div className="space-y-4 mb-8">
                <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full relative overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "70%" }}
                    transition={{ duration: 1.5, delay: 1 }}
                    className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500"
                  />
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full relative overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "45%" }}
                    transition={{ duration: 1.5, delay: 1.2 }}
                    className="absolute inset-0 bg-gradient-to-r from-teal-500 to-lime-500"
                  />
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full relative overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "90%" }}
                    transition={{ duration: 1.5, delay: 1.4 }}
                    className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-600"
                  />
                </div>
              </div>

              {/* Circular Metric */}
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-100 dark:text-white/5" />
                    <motion.circle 
                      cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" 
                      className="text-emerald-500"
                      strokeDasharray="125.6"
                      initial={{ strokeDashoffset: 125.6 }}
                      animate={{ strokeDashoffset: 40 }}
                      transition={{ duration: 2, delay: 1 }}
                    />
                  </svg>
                  <span className="absolute text-[10px] font-bold text-white">82%</span>
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-24 bg-white/10 rounded-full" />
                  <div className="h-2 w-16 bg-white/5 rounded-full" />
                </div>
              </div>
              
              {/* Floating Decorative Elements */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 right-[-10px] w-12 h-12 bg-emerald-600/30 rounded-full blur-xl" 
              />
            </div>

            {/* Sub-card floating */}
            <motion.div 
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-6 -right-6 bg-emerald-600/90 backdrop-blur-md p-4 rounded-xl shadow-xl border border-white/20 z-20"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-[10px] text-emerald-100 font-medium">{t.login.security}</div>
                  <div className="text-xs text-white font-bold">Encrypted 256-bit</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
