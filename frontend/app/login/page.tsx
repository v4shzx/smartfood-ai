"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  ArrowLeft, 
  Activity, 
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

export default function LoginPage() {
  const { t } = useI18n();
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 2000);
  };

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <div className="min-h-screen bg-transparent flex flex-row-reverse overflow-hidden font-sans transition-colors duration-500">
      {/* --- Right Side: Login Form --- */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 md:p-12 relative bg-white dark:bg-slate-950 transition-colors duration-500 border-l border-slate-200 dark:border-slate-800/50">
        {/* Back Link & Lang Switcher */}
        <div className="absolute top-8 left-8 lg:left-12 right-8 flex justify-between items-center">
          <Link href="/" className="group flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all duration-200">
            <div className="p-1.5 rounded-full border border-slate-200 dark:border-slate-800 group-hover:bg-slate-50 dark:group-hover:bg-slate-900 group-hover:shadow-sm transition-all">
              <ArrowLeft className="w-3.5 h-3.5" />
            </div>
            <span className="text-sm font-medium">{t.login.back}</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <LangSwitcher />
          </div>
        </div>

        <div className="w-full max-w-[400px]">
          {/* Mobile Header (Hidden on Desktop) */}
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-8 h-8 flex items-center justify-center">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">SmartFood AI</span>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">{t.login.welcome}</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">{t.login.subtitle}</p>
          </div>

          {/* Social Logins */}
          <div className="flex flex-col gap-3.5 mb-8">
            {/* Google Sign In */}
            <Button 
              variant="outline" 
              className="w-full h-12 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 group cursor-pointer shadow-sm hover:shadow-md active:scale-[0.98] text-slate-700 dark:text-slate-300 border font-semibold"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span className="text-sm font-semibold">{t.login.google}</span>
            </Button>

            {/* Apple Sign In */}
            <Button 
              variant="outline" 
              className="w-full h-12 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 group cursor-pointer shadow-sm hover:shadow-md active:scale-[0.98] text-slate-700 dark:text-slate-300 border font-semibold"
            >
              <svg className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.884-1.066 1.475-2.548 1.312-4.03-1.27.05-2.805.845-3.715 1.91-.819.95-1.533 2.455-1.339 3.913 1.416.103 2.858-.728 3.742-1.793z" />
              </svg>
              <span className="text-sm font-semibold">{t.login.apple}</span>
            </Button>

            {/* Microsoft Sign In */}
            <Button 
              variant="outline" 
              className="w-full h-12 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 group cursor-pointer shadow-sm hover:shadow-md active:scale-[0.98] text-slate-700 dark:text-slate-300 border font-semibold"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 23 23">
                <path fill="#f3f3f3" d="M0 0h23v23H0z" />
                <path fill="#f35325" d="M1 1h10v10H1z" />
                <path fill="#81bc06" d="M12 1h10v10H12z" />
                <path fill="#05a6f0" d="M1 12h10v10H1z" />
                <path fill="#ffba08" d="M12 12h10v10H12z" />
              </svg>
              <span className="text-sm font-semibold">{t.login.microsoft}</span>
            </Button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-950 px-4 text-slate-400 dark:text-slate-500 font-medium tracking-wider transition-colors duration-500">{t.login.or}</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
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

            <div className="flex items-center justify-between px-1">
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
              <Link href="#" className="text-xs font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors">
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
                  {t.login.signin}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400 font-medium">
            {t.login.no_account}{" "}
            <Link href="#" className="text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 font-bold transition-colors inline-flex items-center gap-1 group">
              {t.login.create}
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </p>

          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-wrap justify-center gap-x-6 gap-y-2">
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
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
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
