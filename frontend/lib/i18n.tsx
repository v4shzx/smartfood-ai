"use client";

import React, { useState, useContext, createContext, useEffect, useRef } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type Lang = "es" | "en" | "fr";

export const LANGUAGES: { code: Lang; label: string; flag: string }[] = [
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
];

export const T = {
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
    login: {
      back: "Volver",
      tagline: "Optimiza tu nutrición con inteligencia.",
      description: "La IA más avanzada del mundo para el seguimiento nutricional personalizado y la optimización de la salud.",
      welcome: "Bienvenido de nuevo",
      subtitle: "Introduce tus credenciales para acceder a tu panel",
      google: "Continuar con Google",
      or: "o correo",
      email_label: "Correo electrónico",
      email_placeholder: "nombre@empresa.com",
      password_label: "Contraseña",
      password_placeholder: "••••••••",
      forgot: "¿Olvidaste tu contraseña?",
      remember: "Mantenerme conectado",
      signin: "Entrar",
      no_account: "¿No tienes cuenta?",
      create: "Crear cuenta",
      terms: "Términos de servicio",
      privacy: "Privacidad",
      security: "Seguridad"
    }
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
    login: {
      back: "Back",
      tagline: "Optimize your nutrition with intelligence.",
      description: "The world's most advanced AI for personalized nutrition tracking and health optimization.",
      welcome: "Welcome back",
      subtitle: "Enter your credentials to access your dashboard",
      google: "Continue with Google",
      or: "or email",
      email_label: "Email Address",
      email_placeholder: "name@company.com",
      password_label: "Password",
      password_placeholder: "••••••••",
      forgot: "Forgot password?",
      remember: "Keep me signed in",
      signin: "Sign in",
      no_account: "Don't have an account?",
      create: "Create account",
      terms: "Terms of Service",
      privacy: "Privacy Policy",
      security: "Security"
    }
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
    stat1s: "Objectif : 2 000", stat2s: "Top 5% cette semana", stat3s: "Prévu jusqu'à 20h",
    coach: "\"Il vous manque 20g de protéines aujourd'hui. Essayez d'ajouter un yaourt grec à votre collation.\"",
    weekly: "Apport Hebdomadaire vs Objectif",
    login: {
      back: "Retour",
      tagline: "Optimisez votre nutrition avec intelligence.",
      description: "L'IA la plus avancée au monde pour le suivi nutritionnel personnalisé et l'optimisation de la santé.",
      welcome: "Bon retour",
      subtitle: "Entrez vos identifiants para accéder à votre tableau de bord",
      google: "Continuer avec Google",
      or: "ou e-mail",
      email_label: "Adresse e-mail",
      email_placeholder: "nom@entreprise.com",
      password_label: "Mot de passe",
      password_placeholder: "••••••••",
      forgot: "Mot de passe oublié ?",
      remember: "Rester connecté",
      signin: "Se connecter",
      no_account: "Pas de compte ?",
      create: "Créer un compte",
      terms: "Conditions d'utilisation",
      privacy: "Confidentialité",
      security: "Sécurité"
    }
  },
} as const;

export type Translations = typeof T["en"];

const LangCtx = createContext<{ lang: Lang; t: Translations; setLang: (l: Lang) => void }>({
  lang: "es", t: T["es"] as unknown as Translations, setLang: () => {},
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("es");
  const t = T[lang] as unknown as Translations;

  return (
    <LangCtx.Provider value={{ lang, t, setLang }}>
      {children}
    </LangCtx.Provider>
  );
}

export function useI18n() {
  return useContext(LangCtx);
}

export function LangSwitcher() {
  const { lang, setLang } = useI18n();
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
