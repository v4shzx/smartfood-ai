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
    nav: { home: "Inicio", features: "Características", platform: "Plataforma", testimonials: "Testimonios", pricing: "Precios", contact: "Contacto", login: "Iniciar sesión", cta: "Comenzar" },
    badge: "V2.0: Modelos IA más potentes y rápidos",
    h1: "Predice la demanda. Reduce desperdicios. Maximiza ganancias",
    hero_p: "Con SmartFood, anticipa la demanda de alimentos usando IA y machine learning. Ajusta tu inventario automáticamente y visualiza todo con dashboards claros y accionables.",
    try: "Probar SmartFood AI",
    demo: "Ver Demo",
    integrations: "Impulsado por pipelines modernos de Salud e IA",
    feat_title: "Inteligencia en cada comida.",
    feat_sub: "Optimiza la gestión de tu inventario. Deja que la IA avanzada construya la estrategia perfecta para tu negocio.",
    feats: [
      { title: "Predicción IA", desc: "Predicciones generadas al instante basadas en datos históricos y factores externos como el clima." },
      { title: "Reducción de Desperdicios", desc: "Nuestros modelos aprenden los patrones de consumo para minimizar el excedente de alimentos." },
      { title: "Optimización de Ganancias", desc: "Perspectivas profundas sobre cómo ajustar tu producción para maximizar la rentabilidad diaria." },
    ],
    testi_title: "Amado por optimizadores de salud.",
    reviews: [
      { review: "SmartFood AI reemplazó completamente a mi nutricionista. La forma en que ajusta mis macros dinámicamente es increíble." },
      { review: "El motor de predicción es impecable. Literalmente me dice qué comer antes de que mi energía caiga." },
      { review: "Minimalista, increíblemente rápido y los insights son accionables. Stripe para la nutrición es la comparación perfecta." },
    ],
    price_title: "Planes de Servicio",
    price_sub: "Elige el plan que mejor se adapte a tu negocio.",
    pricing_plans: [
      {
        name: "Básico",
        price: "$0",
        unit: "MXN / mes",
        desc: "Ideal para comenzar",
        feats: ["Registro manual de ventas", "Predicción básica (clima + regresión)", "Dashboard con gráficas simples", "Historial de 30 días"],
        btn: "Comenzar gratis",
        popular: false
      },
      {
        name: "Profesional",
        price: "$299",
        unit: "MXN / mes",
        desc: "Para negocios en crecimiento",
        feats: ["Todo lo de Básico", "Predicción avanzada con IA", "Recomendaciones inteligentes", "Análisis de tendencias", "Historial de hasta 1 año", "Exportación de reportes", "1 sucursal"],
        btn: "Probar 7 días gratis",
        popular: true
      },
      {
        name: "Empresarial",
        price: "$899",
        unit: "MXN / mes",
        desc: "Solución definitiva para empresas",
        feats: ["Todo lo de Profesional", "Inventario inteligente", "Punto de venta (POS)", "Predicción en tiempo real", "Alertas automáticas", "Multiples sucursales", "Multiusuarios con roles", "Integraciones (API / ERP)"],
        btn: "Comprar ahora",
        popular: false
      }
    ],
    popular_badge: "Más Popular",
    contact_title: "Contáctanos",
    contact_sub: "Estamos aquí para ayudarte. Envíanos un mensaje.",
    contact_form: {
      name: "Nombre Completo",
      email: "Correo Electrónico",
      subject: "Asunto",
      message: "Mensaje",
      send: "Enviar Mensaje",
      placeholder_name: "Tu nombre",
      placeholder_email: "tu@correo.com",
      placeholder_subject: "¿Cómo podemos ayudarte?",
      placeholder_message: "Escribe tu mensaje aquí...",
    },
    cta_title: "¿Listo para transformar tu salud?",
    cta_sub: "Únete a miles de personas optimizando su cuerpo con la plataforma de nutrición IA más avanzada.",
    cta_btn: "Probar SmartFood AI ahora",
    footer: "Construido con inteligencia.",
    footer_dev: "Diseñado y desarrollado por Alejandro Balderas Rios",
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
      apple: "Continuar con Apple",
      microsoft: "Continuar con Microsoft",
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
    },
    dashboard: {
      search: "Buscar datos de salud...",
      logout: "Cerrar sesión",
      planner: "Planificador",
      metabolic: "Metabólico",
      goals: "Objetivos",
      metrics: "Métricas",
      recent: "Actividad Reciente",
      insight: "Sugerencia IA",
      export: "Exportar",
      add_meal: "Registrar Comida",
      menu: "Menú Principal",
      settings: "Ajustes",
      profile: "Perfil",
      preferences: "Preferencias",
      coach_title: "Asistente IA",
      efficiency: "Eficiencia vs Objetivos",
      intake: "Ingesta",
      goal: "Objetivo",
      breakdown: "Desglose Optimizado",
      view_all: "Ver Todo",
      accept: "Aceptar Recomendación",
      details: "Detalles",
      morning: "¡Buenos días, Alex!",
      afternoon: "¡Buenas tardes, Alex!",
      evening: "¡Buenas noches, Alex!",
      home: "Inicio",
      op_title: "Operación",
      pos: "Punto de Venta",
      sales: "Registro de Ventas",
      store: "Tienda",
      inv_title: "Inventario",
      inventory: "Inventario",
      suppliers: "Gestión de Proveedores",
      ana_title: "Analítica",
      charts: "Gráficas",
      trends: "Análisis de Tendencias",
      reports: "Reportes",
      aiEngine: "Inteligencia Artificial",
      prediction: "Predicción",
      adm_title: "Administración",
      staff: "Personal",
      collapse: "Colapsar menú",
      expand: "Expandir menú",
      account_title: "Mi Cuenta",
      account_sub: "Gestiona tu información personal, seguridad y preferencias.",
      security_title: "Seguridad y Acceso",
      security_sub: "Actualizada hace 2 meses",
      change_email: "Cambiar Correo",
      change_pass: "Cambiar Contraseña",
      current_pass: "Contraseña Actual",
      new_pass: "Nueva Contraseña",
      confirm_pass: "Confirmar Contraseña",
      save_pass: "Guardar Nueva Contraseña",
      billing_title: "Tu suscripción está activa",
      billing_sub: "Disfrutas de todas las funcionalidades IA sin límites.",
      manage_billing: "Gestionar Pago",
      notifications_title: "Notificaciones",
      notifications_sub: "Configurar alertas y reportes",
    }
  },
  en: {
    nav: { home: "Home", features: "Features", platform: "Platform", testimonials: "Testimonials", pricing: "Pricing", contact: "Contact", login: "Log in", cta: "Start Now" },
    badge: "V2.0: Smarter & Faster AI Models",
    h1: "Predict demand. Reduce waste. Maximize profits",
    hero_p: "With SmartFood, anticipate food demand using AI and machine learning. Automatically adjust your inventory and visualize everything with clear, actionable dashboards.",
    try: "Try SmartFood AI",
    demo: "View Demo",
    integrations: "Powered by modern Health & AI pipelines",
    feat_title: "Intelligence at every meal.",
    feat_sub: "Optimize your inventory management. Let advanced AI build the perfect strategy for your business.",
    feats: [
      { title: "AI Prediction", desc: "Instantly generated predictions based on historical data and external factors like weather." },
      { title: "Waste Reduction", desc: "Our models learn consumption patterns to minimize food surplus and waste." },
      { title: "Profit Optimization", desc: "Deep insights into adjusting your production to maximize daily profitability." },
    ],
    testi_title: "Loved by health optimizers.",
    reviews: [
      { review: "SmartFood AI completely replaced my nutritionist. The way it adjusts my macros dynamically on workout vs rest days is mind-blowing." },
      { review: "The prediction engine is flawless. It literally tells me what to eat before my energy crashes during long training weeks." },
      { review: "Minimalist, incredibly fast, and the insights are actually actionable. Stripe for nutrition is the perfect comparison." },
    ],
    price_title: "Service Plans",
    price_sub: "Choose the plan that best fits your business.",
    pricing_plans: [
      {
        name: "Basic",
        price: "$0",
        unit: "MXN / mo",
        desc: "Ideal to get started",
        feats: ["Manual sales logging", "Basic prediction (weather + regression)", "Dashboard with simple charts", "30-day history"],
        btn: "Start for free",
        popular: false
      },
      {
        name: "Professional",
        price: "$299",
        unit: "MXN / mo",
        desc: "For growing businesses",
        feats: ["Everything in Starter", "Advanced AI prediction", "Smart recommendations", "Trend analysis", "Up to 1-year history", "Report export", "1 branch"],
        btn: "Try 7 days for free",
        popular: true
      },
      {
        name: "Enterprise",
        price: "$899",
        unit: "MXN / mo",
        desc: "Complete solution to scale",
        feats: ["Everything in Growth", "Smart inventory", "Point of Sale (POS)", "Real-time prediction", "Automatic alerts", "Multiple branches", "Multi-user with roles", "Integrations (API / ERP)"],
        btn: "Buy now",
        popular: false
      }
    ],
    popular_badge: "Most Popular",
    contact_title: "Contact Us",
    contact_sub: "We're here to help. Send us a message.",
    contact_form: {
      name: "Full Name",
      email: "Email Address",
      subject: "Subject",
      message: "Message",
      send: "Send Message",
      placeholder_name: "Your name",
      placeholder_email: "you@email.com",
      placeholder_subject: "How can we help?",
      placeholder_message: "Write your message here...",
    },
    cta_title: "Ready to transform your health?",
    cta_sub: "Join thousands of high-performers optimizing their bodies using the most advanced AI nutrition platform ever built.",
    cta_btn: "Try SmartFood AI Now",
    footer: "Crafted with intelligence.",
    footer_dev: "Designed and developed by Alejandro Balderas Rios",
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
      tagline: "Predict demand. Reduce waste. Maximize profits.",
      description: "The world's most advanced AI for food demand prediction and waste reduction.",
      welcome: "Welcome back",
      subtitle: "Enter your credentials to access your dashboard",
      google: "Continue with Google",
      apple: "Continue with Apple",
      microsoft: "Continue with Microsoft",
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
    },
    dashboard: {
      search: "Search health data...",
      logout: "Log out",
      planner: "Meal Planner",
      metabolic: "Metabolic",
      goals: "Goals",
      metrics: "Metrics",
      recent: "Recent Activity",
      insight: "AI Insight",
      export: "Export",
      add_meal: "Log Meal",
      menu: "Main Menu",
      settings: "Settings",
      profile: "Profile",
      preferences: "Preferences",
      coach_title: "AI Assistant",
      efficiency: "Efficiency vs Goals",
      intake: "Intake",
      goal: "Goal",
      breakdown: "Optimized Breakdown",
      view_all: "View All",
      accept: "Accept Recommendation",
      details: "Details",
      morning: "Good morning, Alex!",
      afternoon: "Good afternoon, Alex!",
      evening: "Good evening, Alex!",
      home: "Home",
      op_title: "Operations",
      pos: "Point of Sale",
      sales: "Sales Registry",
      store: "Store",
      inv_title: "Inventory",
      inventory: "Inventory",
      suppliers: "Supplier Management",
      ana_title: "Analytics",
      charts: "Charts",
      trends: "Trend Analysis",
      reports: "Reports",
      aiEngine: "AI & Intelligence",
      prediction: "Prediction",
      adm_title: "Administration",
      staff: "Staff",
      collapse: "Collapse menu",
      expand: "Expand menu",
      account_title: "My Account",
      account_sub: "Manage your personal information, security, and preferences.",
      security_title: "Security & Access",
      security_sub: "Updated 2 months ago",
      change_email: "Change Email",
      change_pass: "Change Password",
      current_pass: "Current Password",
      new_pass: "New Password",
      confirm_pass: "Confirm Password",
      save_pass: "Save New Password",
      billing_title: "Your subscription is active",
      billing_sub: "You enjoy all AI features without limits.",
      manage_billing: "Manage Billing",
      notifications_title: "Notifications",
      notifications_sub: "Configure alerts and reports",
    }
  },
  fr: {
    nav: { home: "Accueil", features: "Fonctionnalités", platform: "Plateforme", testimonials: "Témoignages", pricing: "Tarifs", contact: "Contact", login: "Connexion", cta: "Commencer" },
    badge: "V2.0 : Modèles IA plus intelligents et rapides",
    h1: "Prédisez la demande. Réduisez le gaspillage. Maximisez les profits",
    hero_p: "Avec SmartFood, anticipez la demande alimentaire grâce à l'IA et au machine learning. Ajustez automatiquement votre inventaire et visualisez tout avec des tableaux de bord clairs et exploitables.",
    try: "Essayer SmartFood AI",
    demo: "Voir la Démo",
    integrations: "Propulsé par des pipelines Santé et IA modernes",
    feat_title: "L'intelligence à chaque repas.",
    feat_sub: "Optimisez la gestion de votre inventaire. Laissez l'IA construire la stratégie parfaite pour votre entreprise.",
    feats: [
      { title: "Prédiction IA", desc: "Prédictions instantanées basées sur l'historique et des facteurs externes comme la météo." },
      { title: "Réduction du Gaspillage", desc: "Nos modèles apprennent les habitudes de consommation pour minimiser les surplus alimentaires." },
      { title: "Optimisation des Profits", desc: "Des insights pour ajuster votre production et maximiser la rentabilité quotidienne." },
    ],
    testi_title: "Adoré par les optimiseurs de santé.",
    reviews: [
      { review: "SmartFood AI a complètement remplacé mon nutritionniste. La façon dont il ajuste mes macros dynamiquement est époustouflante." },
      { review: "Le moteur de prédiction est impeccable. Il me dit littéralement quoi manger avant que mon énergie ne chute." },
      { review: "Minimaliste, incroyablement rapide, et les insights sont vraiment exploitables. Stripe pour la nutrition est la comparaison parfaite." },
    ],
    price_title: "Plans de Service",
    price_sub: "Choisissez le plan qui convient le mieux à votre entreprise.",
    pricing_plans: [
      {
        name: "Basique",
        price: "$0",
        unit: "MXN / mois",
        desc: "Idéal pour commencer",
        feats: ["Enregistrement manuel des ventes", "Prédiction de base (météo + régression)", "Tableau de bord avec graphiques simples", "Historique de 30 jours"],
        btn: "Commencer gratuitement",
        popular: false
      },
      {
        name: "Professionnel",
        price: "$299",
        unit: "MXN / mois",
        desc: "Pour les entreprises en croissance",
        feats: ["Tout ce qui est dans Starter", "Prédiction IA avancée", "Recommandations intelligentes", "Analyse des tendances", "Jusqu'à 1 an d'historique", "Exportation de rapports", "1 succursale"],
        btn: "Essayer 7 jours gratuitement",
        popular: true
      },
      {
        name: "Entreprise",
        price: "$899",
        unit: "MXN / mois",
        desc: "Solution complète pour passer à l'échelle",
        feats: ["Tout ce qui est dans Growth", "Inventaire intelligent", "Point de Vente (POS)", "Prédiction en temps réel", "Alertes automatiques", "Plusieurs succursales", "Multi-utilisateurs avec rôles", "Intégrations (API / ERP)"],
        btn: "Acheter maintenant",
        popular: false
      }
    ],
    popular_badge: "Plus Populaire",
    contact_title: "Contactez-nous",
    contact_sub: "Nous sommes là pour vous aider. Envoyez-nous un message.",
    contact_form: {
      name: "Nom Complet",
      email: "Adresse E-mail",
      subject: "Sujet",
      message: "Message",
      send: "Envoyer le Message",
      placeholder_name: "Votre nom",
      placeholder_email: "vous@email.com",
      placeholder_subject: "Comment pouvons-nous vous aider ?",
      placeholder_message: "Écrivez votre message ici...",
    },
    cta_title: "Prêt à transformer votre santé ?",
    cta_sub: "Rejoignez des milliers de personnes qui optimisent leur corps grâce à la plateforme de nutrition IA la plus avancée.",
    cta_btn: "Essayer SmartFood AI maintenant",
    footer: "Conçu avec intelligence.",
    footer_dev: "Conçu et développé par Alejandro Balderas Rios",
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
      tagline: "Prédisez la demande. Réduisez le gaspillage. Maximisez les profits.",
      description: "L'IA la plus avancée au monde pour la prédiction de la demande et la réduction du gaspillage.",
      welcome: "Bon retour",
      subtitle: "Entrez vos identifiants para accéder à votre tableau de bord",
      google: "Continuer avec Google",
      apple: "Continuer avec Apple",
      microsoft: "Continuer avec Microsoft",
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
    },
    dashboard: {
      search: "Rechercher des données...",
      logout: "Se déconnecter",
      planner: "Planificateur",
      metabolic: "Métabolique",
      goals: "Objectifs",
      metrics: "Mesures",
      recent: "Activité Récente",
      insight: "Insight IA",
      export: "Exporter",
      add_meal: "Enregistrer Repas",
      menu: "Menu Principal",
      settings: "Paramètres",
      profile: "Profil",
      preferences: "Préférences",
      coach_title: "Assistant IA",
      efficiency: "Efficacité vs Objectifs",
      intake: "Consommation",
      goal: "Objectif",
      breakdown: "Répartition Optimisée",
      view_all: "Voir Tout",
      accept: "Accepter la Recommandation",
      details: "Détails",
      morning: "Bonjour, Alex !",
      afternoon: "Bon après-midi, Alex !",
      evening: "Bonsoir, Alex !",
      home: "Accueil",
      op_title: "Opérations",
      pos: "Point de Vente",
      sales: "Registre des Ventes",
      store: "Boutique",
      inv_title: "Inventaire",
      inventory: "Inventaire",
      suppliers: "Gestion Fournisseurs",
      ana_title: "Analytique",
      charts: "Graphiques",
      trends: "Analyse Tendances",
      reports: "Rapports",
      aiEngine: "Intelligence IA",
      prediction: "Prédiction",
      adm_title: "Administration",
      staff: "Personnel",
      collapse: "Réduire le menu",
      expand: "Agrandir le menu",
      account_title: "Mon Compte",
      account_sub: "Gérez vos informations personnelles, votre sécurité et vos préférences.",
      security_title: "Sécurité et Accès",
      security_sub: "Mis à jour il y a 2 mois",
      change_email: "Changer d'Email",
      change_pass: "Changer le Mot de Passe",
      current_pass: "Mot de Passe Actuel",
      new_pass: "Nouveau Mot de Passe",
      confirm_pass: "Confirmer le Mot de Passe",
      save_pass: "Enregistrer le Nouveau Mot de Passe",
      billing_title: "Votre abonnement est actif",
      billing_sub: "Vous profitez de toutes les fonctionnalités IA sans limites.",
      manage_billing: "Gérer le Paiement",
      notifications_title: "Notifications",
      notifications_sub: "Configurer les alertes et les rapports",
    }
  },
} as const;

export type Translations = typeof T["en"];

const LangCtx = createContext<{ lang: Lang; t: Translations; setLang: (l: Lang) => void }>({
  lang: "es", t: T["es"] as unknown as Translations, setLang: () => { },
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("es");

  useEffect(() => {
    const saved = localStorage.getItem("app-lang") as Lang;
    if (saved && (saved === "es" || saved === "en" || saved === "fr")) {
      setLang(saved);
    }
  }, []);

  const handleSetLang = (l: Lang) => {
    setLang(l);
    localStorage.setItem("app-lang", l);
  };

  const t = T[lang] as unknown as Translations;

  return (
    <LangCtx.Provider value={{ lang, t, setLang: handleSetLang }}>
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
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const current = LANGUAGES.find((l) => l.code === lang)!;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!mounted) return <div className="w-20 md:w-24 h-8" />;

  const FlagIcon = ({ code }: { code: Lang }) => {
    if (code === "es") return (
      <svg viewBox="0 0 512 512" className="w-4 h-4 rounded-full shadow-sm border border-slate-200 dark:border-slate-800 shrink-0">
        <path fill="#AA151B" d="M0 0h512v512H0z" />
        <path fill="#F1BF00" d="M0 128h512v256H0z" />
        <path fill="#AA151B" d="M0 0v128h512V0zm0 384v128h512V384z" />
      </svg>
    );
    if (code === "en") return (
      <svg viewBox="0 0 512 512" className="w-4 h-4 rounded-full shadow-sm border border-slate-200 dark:border-slate-800 shrink-0">
        <path fill="#012169" d="M0 0h512v512H0z" />
        <path fill="#FFF" d="m0 0 512 512m0-512L0 512" />
        <path stroke="#FFF" strokeWidth="64" d="m0 0 512 512m0-512L0 512" />
        <path stroke="#C8102E" strokeWidth="40" d="m0 0 512 512m0-512L0 512" />
        <path stroke="#FFF" strokeWidth="96" d="M256 0v512M0 256h512" />
        <path stroke="#C8102E" strokeWidth="60" d="M256 0v512M0 256h512" />
      </svg>
    );
    if (code === "fr") return (
      <svg viewBox="0 0 512 512" className="w-4 h-4 rounded-full shadow-sm border border-slate-200 dark:border-slate-800 shrink-0">
        <path fill="#002395" d="M0 0h171v512H0z" />
        <path fill="#FFF" d="M171 0h170v512H171z" />
        <path fill="#ED2939" d="M341 0h171v512H341z" />
      </svg>
    );
    return null;
  };

  return (
    <div ref={ref} className="relative">
      <button
        id="lang-switcher-btn"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white/80 dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-full transition-all backdrop-blur-sm shadow-sm"
        aria-label="Switch language"
      >
        <Globe className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
        <FlagIcon code={current.code} />
        <span className="hidden md:inline font-bold">{current.code.toUpperCase()}</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 2, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/50 overflow-hidden z-50 p-1"
          >
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                id={`lang-option-${l.code}`}
                onClick={() => { setLang(l.code); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold transition-all rounded-xl ${lang === l.code
                  ? "bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
              >
                <FlagIcon code={l.code} />
                <span>{l.label}</span>
                {lang === l.code && (
                  <motion.div layoutId="active-lang" className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
