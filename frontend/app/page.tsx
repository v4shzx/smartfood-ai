"use client";

import React, { useState, useContext, createContext, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, LineChart, Activity, Bot, Zap, ChevronRight, Menu, X,
  Star, CheckCircle2, Salad, Flame, ArrowUpRight, Cpu, Database,
  ShieldCheck, Target, CloudCog, Globe, ChevronDown,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";

// ─── i18n ─────────────────────────────────────────────────────────────────────

type Lang = "es" | "en" | "fr";

const LANGUAGES: { code: Lang; label: string; flag: string }[] = [
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
];

const T = {
  es: {
    nav: { features: "Características", platform: "Plataforma", testimonials: "Testimonios", pricing: "Precios", login: "Iniciar sesión", cta: "Comenzar" },
    badge: "V2.0: Modelos IA más potentes y rápidos",
    h1: "Optimiza tu nutrición con datos inteligentes.",
    hero_p: "SmartFood AI analiza tus hábitos, predice tu consumo y genera recomendaciones altamente precisas adaptadas a tus objetivos metabólicos.",
    try: "Probar SmartFood AI",
    demo: "Ver Demo",
    integrations: "Impulsado por pipelines modernos de Salud e IA",
    feat_title: "Inteligencia en cada comida.",
    feat_sub: "Olvídate de las dietas genéricas. Deja que la IA avanzada construya la estrategia nutricional perfecta para tu biología.",
    feats: [
      { title: "Dieta IA Personalizada", desc: "Planes de comidas generados al instante según tus necesidades calóricas y deficiencias detectadas." },
      { title: "Predicción de Consumo", desc: "Nuestros modelos aprenden cuándo tienes hambre y envían alternativas saludables preventivas." },
      { title: "Análisis de Hábitos", desc: "Perspectivas sobre cómo el tiempo de tus macros afecta tu energía y métricas de salud a largo plazo." },
    ],
    testi_title: "Amado por optimizadores de salud.",
    reviews: [
      { review: "SmartFood AI reemplazó completamente a mi nutricionista. La forma en que ajusta mis macros dinámicamente es increíble." },
      { review: "El motor de predicción es impecable. Literalmente me dice qué comer antes de que mi energía caiga." },
      { review: "Minimalista, increíblemente rápido y los insights son accionables. Stripe para la nutrición es la comparación perfecta." },
    ],
    price_title: "Precios simples y transparentes.",
    price_sub: "Invierte en tu salud con insights impulsados por IA.",
    basic_desc: "Seguimiento esencial y consejos básicos de IA.",
    basic_feats: ["Escaneo manual de código de barras", "Objetivos de macros estándar", "Informes semanales de resumen"],
    basic_btn: "Empezar Gratis",
    pro_desc: "Todo el poder del motor metabólico.",
    pro_feats: ["Generador de comidas predictivo", "Sincronización biométrica con apps", "Ajuste dinámico de macros IA", "Análisis continuo de hábitos"],
    pro_btn: "Iniciar prueba gratuita",
    cta_title: "¿Listo para transformar tu salud?",
    cta_sub: "Únete a miles de personas optimizando su cuerpo con la plataforma de nutrición IA más avanzada.",
    cta_btn: "Probar SmartFood AI ahora",
    footer: "Construido con inteligencia.",
    dash_title: "Perspectivas Diarias",
    dash_sub: "Tendencias metabólicas predichas por IA para hoy.",
    dash_accuracy: "94% Precisión",
    macro_title: "Objetivos de Macros IA",
    recalc: "Recalcular con IA",
    stat1: "Cal. Netas", stat2: "Puntuación", stat3: "Energía",
    stat1s: "Objetivo: 2,000", stat2s: "Top 5% esta semana", stat3s: "Alta hasta las 8 PM",
    coach: "\"Necesitas 20g más de proteína hoy. Intenta añadir un yogur griego a tu merienda.\"",
    weekly: "Ingesta Semanal vs Objetivo",
  },
  en: {
    nav: { features: "Features", platform: "Platform", testimonials: "Testimonials", pricing: "Pricing", login: "Log in", cta: "Start Now" },
    badge: "V2.0: Smarter & Faster AI Models",
    h1: "Optimize your nutrition with intelligent data.",
    hero_p: "SmartFood AI analyzes your habits, predicts your consumption, and generates highly accurate recommendations tailored to your metabolic goals.",
    try: "Try SmartFood AI",
    demo: "View Demo",
    integrations: "Powered by modern Health & AI pipelines",
    feat_title: "Intelligence at every meal.",
    feat_sub: "Skip the generic diets. Let advanced AI build the perfect nutritional strategy aligned with your biology.",
    feats: [
      { title: "Personalized AI Diet", desc: "Get meal plans generated instantly based on your exact caloric needs, goals, and detected deficiencies." },
      { title: "Consumption Prediction", desc: "Our models learn when you're likely to snack or overeat, sending preemptive healthy alternatives." },
      { title: "Habit Analysis", desc: "Deep insights into how your macro timing affects your daily energy levels and long-term health metrics." },
    ],
    testi_title: "Loved by health optimizers.",
    reviews: [
      { review: "SmartFood AI completely replaced my nutritionist. The way it adjusts my macros dynamically on workout vs rest days is mind-blowing." },
      { review: "The prediction engine is flawless. It literally tells me what to eat before my energy crashes during long training weeks." },
      { review: "Minimalist, incredibly fast, and the insights are actually actionable. Stripe for nutrition is the perfect comparison." },
    ],
    price_title: "Simple, transparent pricing.",
    price_sub: "Invest in your health with AI-powered insights.",
    basic_desc: "Essential tracking & basic AI tips.",
    basic_feats: ["Manual barcode scanning", "Standard macro targets", "Weekly summary reports"],
    basic_btn: "Get Started Free",
    pro_desc: "Full power of the metabolic engine.",
    pro_feats: ["Auto-predictive meal generator", "Health app biometric syndication", "Dynamic macro adjustment AI", "Continuous habit analytics"],
    pro_btn: "Start Free Trial",
    cta_title: "Ready to transform your health?",
    cta_sub: "Join thousands of high-performers optimizing their bodies using the most advanced AI nutrition platform ever built.",
    cta_btn: "Try SmartFood AI Now",
    footer: "Crafted with intelligence.",
    dash_title: "Daily Insights",
    dash_sub: "AI-predicted metabolic trends for today.",
    dash_accuracy: "94% Accuracy",
    macro_title: "Macro AI Targets",
    recalc: "Recalculate with AI",
    stat1: "Calorie Net", stat2: "Nutrition Score", stat3: "Energy Output",
    stat1s: "Target: 2,000", stat2s: "Top 5% this week", stat3s: "Predicted till 8 PM",
    coach: "\"You're 20g short on protein today. Try adding a Greek yogurt to your afternoon snack.\"",
    weekly: "Weekly Intake vs Target",
  },
  fr: {
    nav: { features: "Fonctionnalités", platform: "Plateforme", testimonials: "Témoignages", pricing: "Tarifs", login: "Connexion", cta: "Commencer" },
    badge: "V2.0 : Modèles IA plus intelligents et rapides",
    h1: "Optimisez votre nutrition avec des données intelligentes.",
    hero_p: "SmartFood AI analyse vos habitudes, prédit votre consommation et génère des recommandations très précises adaptées à vos objectifs métaboliques.",
    try: "Essayer SmartFood AI",
    demo: "Voir la Démo",
    integrations: "Propulsé par des pipelines Santé et IA modernes",
    feat_title: "L'intelligence à chaque repas.",
    feat_sub: "Oubliez les régimes génériques. Laissez l'IA avancée construire la stratégie nutritionnelle parfaite pour votre biologie.",
    feats: [
      { title: "Régime IA Personnalisé", desc: "Obtenez des plans de repas générés instantanément selon vos besoins caloriques et carences détectées." },
      { title: "Prédiction de Consommation", desc: "Nos modèles apprennent quand vous êtes susceptible de grignoter et envoient des alternatives saines préventives." },
      { title: "Analyse des Habitudes", desc: "Des insights sur la façon dont le timing de vos macros affecte votre énergie et vos métriques de santé à long terme." },
    ],
    testi_title: "Adoré par les optimiseurs de santé.",
    reviews: [
      { review: "SmartFood AI a complètement remplacé mon nutritionniste. La façon dont il ajuste mes macros dynamiquement est époustouflante." },
      { review: "Le moteur de prédiction est impeccable. Il me dit littéralement quoi manger avant que mon énergie ne chute." },
      { review: "Minimaliste, incroyablement rapide, et les insights sont vraiment exploitables. Stripe pour la nutrition est la comparaison parfaite." },
    ],
    price_title: "Tarification simple et transparente.",
    price_sub: "Investissez dans votre santé avec des insights propulsés par l'IA.",
    basic_desc: "Suivi essentiel et conseils IA de base.",
    basic_feats: ["Scan de code-barres manuel", "Objectifs de macros standards", "Rapports hebdomadaires récapitulatifs"],
    basic_btn: "Commencer Gratuitement",
    pro_desc: "Toute la puissance du moteur métabolique.",
    pro_feats: ["Générateur de repas prédictif", "Synchronisation biométrique des apps", "Ajustement dynamique des macros IA", "Analyse continue des habitudes"],
    pro_btn: "Démarrer l'essai gratuit",
    cta_title: "Prêt à transformer votre santé ?",
    cta_sub: "Rejoignez des milliers de personnes qui optimisent leur corps grâce à la plateforme de nutrition IA la plus avancée.",
    cta_btn: "Essayer SmartFood AI maintenant",
    footer: "Conçu avec intelligence.",
    dash_title: "Aperçus Quotidiens",
    dash_sub: "Tendances métaboliques prédites par IA pour aujourd'hui.",
    dash_accuracy: "94% de Précision",
    macro_title: "Objectifs Macros IA",
    recalc: "Recalculer avec IA",
    stat1: "Cal. Nettes", stat2: "Score Nutrition", stat3: "Énergie",
    stat1s: "Objectif : 2 000", stat2s: "Top 5% cette semaine", stat3s: "Prévu jusqu'à 20h",
    coach: "\"Il vous manque 20g de protéines aujourd'hui. Essayez d'ajouter un yaourt grec à votre collation.\"",
    weekly: "Apport Hebdomadaire vs Objectif",
  },
} as const;

// ─── Context ──────────────────────────────────────────────────────────────────

type Translations = {
  nav: { features: string; platform: string; testimonials: string; pricing: string; login: string; cta: string };
  badge: string; h1: string; hero_p: string; try: string; demo: string; integrations: string;
  feat_title: string; feat_sub: string; feats: ReadonlyArray<{ title: string; desc: string }>;
  testi_title: string; reviews: ReadonlyArray<{ review: string }>;
  price_title: string; price_sub: string; basic_desc: string; basic_feats: ReadonlyArray<string>; basic_btn: string;
  pro_desc: string; pro_feats: ReadonlyArray<string>; pro_btn: string;
  cta_title: string; cta_sub: string; cta_btn: string; footer: string;
  dash_title: string; dash_sub: string; dash_accuracy: string; macro_title: string; recalc: string;
  stat1: string; stat2: string; stat3: string; stat1s: string; stat2s: string; stat3s: string;
  coach: string; weekly: string;
};

const LangCtx = createContext<{ lang: Lang; t: Translations; setLang: (l: Lang) => void }>({
  lang: "es", t: T["es"] as Translations, setLang: () => {},
});

// ─── Chart Data ───────────────────────────────────────────────────────────────

const calorieData = [
  { day: "L", calories: 2100, target: 2000 },
  { day: "M", calories: 1950, target: 2000 },
  { day: "X", calories: 2400, target: 2000 },
  { day: "J", calories: 1800, target: 2000 },
  { day: "V", calories: 2050, target: 2000 },
  { day: "S", calories: 2600, target: 2000 },
  { day: "D", calories: 2200, target: 2000 },
];

const macroData = [
  { name: "Protein", val: 140, goal: 150, color: "#3b82f6" },
  { name: "Carbs",  val: 210, goal: 200, color: "#8b5cf6" },
  { name: "Fat",    val: 55,  goal: 65,  color: "#14b8a6" },
];

// ─── Language Switcher ────────────────────────────────────────────────────────

function LangSwitcher() {
  const { lang, setLang } = useContext(LangCtx);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LANGUAGES.find((l) => l.code === lang)!;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        id="lang-switcher-btn"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-full transition-all"
        aria-label="Switch language"
      >
        <Globe className="w-4 h-4 text-gray-400" />
        <span>{current.flag}</span>
        <span className="hidden sm:inline">{current.label}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/60 overflow-hidden z-50"
          >
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                id={`lang-option-${l.code}`}
                onClick={() => { setLang(l.code); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                  lang === l.code
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="text-base">{l.flag}</span>
                <span>{l.label}</span>
                {lang === l.code && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  const { t } = useContext(LangCtx);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100/50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-xl">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-xl tracking-tight text-gray-900">SmartFood AI</span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features"     className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">{t.nav.features}</a>
            <a href="#demo"         className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">{t.nav.platform}</a>
            <a href="#testimonials" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">{t.nav.testimonials}</a>
            <a href="#pricing"      className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">{t.nav.pricing}</a>
          </div>

          {/* Desktop Right Controls */}
          <div className="hidden md:flex items-center gap-3">
            <LangSwitcher />
            <button className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">{t.nav.login}</button>
            <button className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium px-4 py-2 rounded-full transition-all shadow-sm hover:shadow-md">
              {t.nav.cta}
            </button>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <LangSwitcher />
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 p-1">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-4 space-y-1"
        >
          <a href="#features"     className="block px-3 py-2 text-base font-medium text-gray-700">{t.nav.features}</a>
          <a href="#pricing"      className="block px-3 py-2 text-base font-medium text-gray-700">{t.nav.pricing}</a>
          <a href="#testimonials" className="block px-3 py-2 text-base font-medium text-gray-700">{t.nav.testimonials}</a>
          <div className="border-t border-gray-100 mt-4 pt-4 flex flex-col gap-2">
            <button className="w-full text-left px-3 py-2 text-base font-medium text-gray-700">{t.nav.login}</button>
            <button className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg text-base font-medium">{t.nav.cta}</button>
          </div>
        </motion.div>
      )}
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  const { t } = useContext(LangCtx);
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-100/40 rounded-full blur-3xl -z-10" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-8">
        <SparkleIcon className="w-4 h-4" />
        <span>{t.badge}</span>
      </motion.div>

      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
        className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-br from-gray-900 via-gray-800 to-gray-500 max-w-4xl">
        {t.h1}
      </motion.h1>

      <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-6 text-xl text-gray-600 max-w-2xl leading-relaxed">
        {t.hero_p}
      </motion.p>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-full text-lg font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-900/20 hover:shadow-xl hover:shadow-gray-900/30">
          {t.try} <ChevronRight className="w-5 h-5" />
        </button>
        <button className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 px-8 py-4 rounded-full text-lg font-medium transition-all flex items-center justify-center gap-2 shadow-sm">
          {t.demo}
        </button>
      </motion.div>
    </section>
  );
}

// ─── Dashboard Mockup ─────────────────────────────────────────────────────────

function DashboardMockup() {
  const { t } = useContext(LangCtx);
  return (
    <section id="demo" className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative">
      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
        className="relative rounded-2xl bg-white border border-gray-200/60 shadow-2xl shadow-gray-200/50 overflow-hidden ring-1 ring-gray-900/5">
        {/* Window Controls */}
        <div className="h-12 border-b border-gray-100 bg-gray-50/50 flex items-center px-4 gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
          <div className="ml-4 text-xs font-medium text-gray-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Secure AI Connection Active
          </div>
        </div>

        <div className="flex h-[600px]">
          {/* Sidebar */}
          <div className="w-64 border-r border-gray-100 bg-gray-50/30 p-4 hidden md:flex flex-col gap-2">
            <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{t.nav.platform}</div>
            <SidebarItem icon={<LineChart />} label={t.dash_title} active />
            <SidebarItem icon={<Salad />}     label="Meal Planner" />
            <SidebarItem icon={<Activity />}  label="Metabolic Status" />
            <SidebarItem icon={<Target />}    label="Goals & Tracking" />
            <div className="mt-auto">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <div className="flex items-center gap-2 text-blue-700 font-semibold mb-2">
                  <Bot className="w-5 h-5" /> AI Coach
                </div>
                <p className="text-xs text-blue-600/80 leading-relaxed">{t.coach}</p>
              </div>
            </div>
          </div>

          {/* Main */}
          <div className="flex-1 p-6 lg:p-10 overflow-y-auto bg-gray-50/10">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{t.dash_title}</h2>
                <p className="text-sm text-gray-500 mt-1">{t.dash_sub}</p>
              </div>
              <div className="text-sm font-medium px-3 py-1 bg-green-50 text-green-700 rounded-full flex items-center gap-1 border border-green-100">
                <ArrowUpRight className="w-4 h-4" /> {t.dash_accuracy}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <StatCard title={t.stat1} value="1,840" subtitle={t.stat1s} icon={<Flame className="w-5 h-5 text-orange-500" />} />
              <StatCard title={t.stat2} value="A+"    subtitle={t.stat2s} icon={<Star  className="w-5 h-5 text-amber-500"  />} />
              <StatCard title={t.stat3} value="High"  subtitle={t.stat3s} icon={<Zap   className="w-5 h-5 text-yellow-500" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-semibold text-gray-900">{t.weekly}</h3>
                  <div className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Last 7 Days</div>
                </div>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={calorieData}>
                      <defs>
                        <linearGradient id="colorCal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}   />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9ca3af" }} dy={10} />
                      <YAxis hide domain={["dataMin - 200", "dataMax + 200"]} />
                      <Tooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} cursor={{ stroke: "#e5e7eb", strokeWidth: 2 }} />
                      <Area type="monotone" dataKey="target"   stroke="#9ca3af" strokeDasharray="5 5" fill="none"             strokeWidth={2} />
                      <Area type="monotone" dataKey="calories" stroke="#3b82f6" strokeWidth={3}        fillOpacity={1} fill="url(#colorCal)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-6">{t.macro_title}</h3>
                <div className="space-y-4">
                  {macroData.map((macro) => (
                    <div key={macro.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 font-medium">{macro.name}</span>
                        <span className="text-gray-900 font-semibold">{macro.val}g <span className="text-gray-400 font-normal">/ {macro.goal}g</span></span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <motion.div className="h-full rounded-full" style={{ backgroundColor: macro.color }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(macro.val / macro.goal) * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.2 }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <button className="w-full text-center text-sm text-blue-600 font-medium hover:text-blue-700 flex justify-center items-center gap-1">
                    {t.recalc} <Bot className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// ─── Integrations ─────────────────────────────────────────────────────────────

function Integrations() {
  const { t } = useContext(LangCtx);
  return (
    <section className="py-16 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm font-medium text-gray-400 mb-8 uppercase tracking-widest">{t.integrations}</p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="flex items-center gap-2 text-xl font-bold text-gray-800"><Cpu      className="w-6 h-6" /> Meta Llama</div>
          <div className="flex items-center gap-2 text-xl font-bold text-gray-800"><Database className="w-6 h-6" /> Apple Health</div>
          <div className="flex items-center gap-2 text-xl font-bold text-gray-800"><Activity  className="w-6 h-6" /> Google Fit</div>
          <div className="flex items-center gap-2 text-xl font-bold text-gray-800"><CloudCog  className="w-6 h-6" /> OpenAI</div>
        </div>
      </div>
    </section>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────

const FEAT_STYLES = [
  { icon: <Brain    className="text-blue-500   w-6 h-6" />, bg: "bg-blue-50"   },
  { icon: <Target   className="text-purple-500 w-6 h-6" />, bg: "bg-purple-50" },
  { icon: <Activity className="text-green-500  w-6 h-6" />, bg: "bg-green-50"  },
];

function Features() {
  const { t } = useContext(LangCtx);
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">{t.feat_title}</h2>
        <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">{t.feat_sub}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {t.feats.map((f, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="p-8 rounded-3xl bg-gray-50/50 border border-gray-100 hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${FEAT_STYLES[i].bg} shadow-sm`}>
              {FEAT_STYLES[i].icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
            <p className="text-gray-500 leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

const TESTI_PEOPLE = [
  { name: "David Chen",     role: "Software Engineer" },
  { name: "Sarah Jenkins",  role: "Marathon Runner"   },
  { name: "Marcus Webb",    role: "Founder"           },
];

function Testimonials() {
  const { t } = useContext(LangCtx);
  return (
    <section id="testimonials" className="py-24 bg-gray-50 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-12">{t.testi_title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
          {t.reviews.map((r, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => <Star key={j} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-gray-600 mb-6 font-medium leading-relaxed">"{r.review}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div>
                  <div className="text-sm font-bold text-gray-900">{TESTI_PEOPLE[i].name}</div>
                  <div className="text-xs text-gray-500">{TESTI_PEOPLE[i].role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

function Pricing() {
  const { t } = useContext(LangCtx);
  return (
    <section id="pricing" className="py-24 px-4 max-w-7xl mx-auto text-center">
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">{t.price_title}</h2>
      <p className="text-gray-500 mb-12">{t.price_sub}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Basic */}
        <div className="p-8 rounded-3xl border border-gray-200 text-left">
          <h3 className="text-2xl font-bold text-gray-900">Basic</h3>
          <p className="text-gray-500 mt-2 text-sm">{t.basic_desc}</p>
          <div className="my-6"><span className="text-4xl font-bold text-gray-900">$0</span><span className="text-gray-500"> /mo</span></div>
          <ul className="space-y-4 mb-8">
            {t.basic_feats.map((f, i) => (
              <li key={i} className="flex gap-3 text-gray-600 font-medium"><CheckCircle2 className="text-gray-400 shrink-0" /> {f}</li>
            ))}
          </ul>
          <button className="w-full py-3 rounded-xl border border-gray-300 font-semibold text-gray-900 hover:bg-gray-50 transition-colors">{t.basic_btn}</button>
        </div>

        {/* Pro */}
        <div className="p-8 rounded-3xl bg-gray-900 border border-gray-800 text-left relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full" />
          <div className="flex justify-between items-center relative z-10">
            <h3 className="text-2xl font-bold text-white">Pro AI</h3>
            <span className="text-xs font-bold bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20">MOST POPULAR</span>
          </div>
          <p className="text-gray-400 mt-2 text-sm">{t.pro_desc}</p>
          <div className="my-6"><span className="text-4xl font-bold text-white">$12</span><span className="text-gray-400"> /mo</span></div>
          <ul className="space-y-4 mb-8">
            {t.pro_feats.map((f, i) => (
              <li key={i} className="flex gap-3 text-gray-300 font-medium"><CheckCircle2 className="text-blue-500 shrink-0" /> {f}</li>
            ))}
          </ul>
          <button className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors shadow-lg shadow-blue-900/50">{t.pro_btn}</button>
        </div>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────

function CTA() {
  const { t } = useContext(LangCtx);
  return (
    <section className="py-24 px-4 bg-white border-t border-gray-100">
      <div className="max-w-4xl mx-auto text-center rounded-3xl bg-linear-to-br from-gray-50 to-blue-50 p-12 border border-blue-100 shadow-xl shadow-blue-900/5">
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight mb-6">{t.cta_title}</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">{t.cta_sub}</p>
        <button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-full text-lg font-medium transition-all inline-flex items-center gap-2 shadow-lg hover:shadow-xl hover:shadow-gray-900/20">
          {t.cta_btn} <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SparkleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}

function SidebarItem({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <div className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${active ? "bg-white shadow-sm border border-gray-200 text-gray-900" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"}`}>
      <div className={`${active ? "text-blue-600" : "text-gray-400"} w-5 h-5`}>{icon}</div>
      {label}
    </div>
  );
}

function StatCard({ title, value, subtitle, icon }: { title: string; value: string; subtitle: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between">
      <div>
        <div className="text-gray-500 text-sm font-medium mb-1">{title}</div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-xs text-gray-400 mt-1">{subtitle}</div>
      </div>
      <div className="bg-gray-50 p-2 rounded-lg">{icon}</div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const [lang, setLang] = useState<Lang>("es");
  const t = T[lang];

  return (
    <LangCtx.Provider value={{ lang, t, setLang }}>
      <main className="bg-white min-h-screen font-sans antialiased text-gray-900 selection:bg-blue-100 selection:text-blue-900">
        <Navbar />
        <Hero />
        <DashboardMockup />
        <Integrations />
        <Features />
        <Testimonials />
        <Pricing />
        <CTA />
        <footer className="py-8 text-center text-sm text-gray-400 border-t border-gray-100 bg-white">
          © {new Date().getFullYear()} SmartFood AI. {t.footer}
        </footer>
      </main>
    </LangCtx.Provider>
  );
}