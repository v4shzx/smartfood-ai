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

export type Translation = typeof T.es;
export type Translations = Translation;

export const T = {
  es: {
    nav: { home: "Inicio", features: "Características", platform: "Plataforma", testimonials: "Testimonios", pricing: "Precios", contact: "Contacto", docs: "Documentación", docs_cta: "¡Ingresa ya!", login: "Iniciar sesión", cta: "Comenzar" },
    badge: "V2.0: Modelos IA más potentes y rápidos",
    h1: "Predice la demanda. Reduce desperdicios. Maximiza ganancias",
    hero_p: "Con SmartFood, anticipa la demanda de alimentos usando IA y machine learning. Ajusta tu inventario automáticamente y visualiza todo con dashboards claros y accionables.",
    try: "Probar SmartFood AI",
    demo: "Ver Demo",
    integrations: "Impulsado por tecnologías de alto rendimiento y de nueva generación",
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
      { review: "Minimaliste, increíblemente rápido y los insights son accionables. Stripe para la nutrition es la comparación perfecta." },
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
        feats: ["Todo lo de Profesional", "Inventario inteligente", "Punto de venta (POS)", "Predicción en tiempo real", "Alertes automáticas", "Multiples sucursales", "Multiusuarios con roles", "Integraciones (API / ERP)"],
        btn: "Comprar ahora",
        popular: false
      }
    ],
    popular_badge: "Más Popular",
    contact_title: "Contáctanos",
    contact_sub: "Estamos aquí para ayudarte. Envíanos un mensaje.",
    contact_form: {
      name: "Nombre Complet",
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
    recalc: "Recalculer con IA",
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
      signup: "Crear Cuenta",
      no_account: "¿No tienes cuenta?",
      has_account: "¿Ya tienes cuenta?",
      create: "Crear cuenta",
      login_now: "Iniciar Sesión",
      welcome_new: "Crea tu cuenta",
      subtitle_new: "Comienza a optimizar tu negocio con IA hoy mismo",
      name_label: "Nombre Completo",
      name_placeholder: "Juan Pérez",
      terms: "Términos de servicio",      privacy: "Privacidad",
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
      adm_title: "Administration",
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
      payment_methods_title: "Métodos de Pago",
      add_card: "Agregar Tarjeta",
      add_card_desc: "Introduce los detalles de tu nueva tarjeta de crédito o débito.",
      card_holder: "Nombre en la tarjeta",
      card_number: "Número de tarjeta",
      card_cvc: "CVC",
      save_card: "Guardar Tarjeta",
      expires: "Expira",
      primary: "Principal",
      remove: "Eliminar",
      sub_type: "Tipo de Suscripción",
      sub_status: "Estatus de Suscripción",
      sub_active: "Activa",
      sub_basic: "Plan Básico",
      sub_pro: "Plan Profesional Edition",
      sub_enterprise: "Plan Empresarial Pro",
      total_orders: "Pedidos Totales",
      processed_today: "Procesados hoy",
      revenue_today: "Ingresos Hoy",
      yesterday: "Ayer",
      top_product: "Producto Top",
      units_sold: "unidades vendidas",
      critical_stock: "Stock Crítico",
      sales_performance: "Rendimiento de Ventas",
      last_7_days: "Últimos 7 días",
      inventory_alerts: "Alertas de Inventario",
      critical_items: "Críticos",
      manage_inventory: "Gestionar Inventario",
      no_alerts: "No hay alertas críticas.",
      smart_plan: "Plan Inteligente",
      ai_prediction_tomorrow: "IA: Predicción para Mañana",
      max_probability: "Máxima probabilidad de venta",
      view_analysis: "Ver análisis",
      prediction_desc: "Proyecta tus ingresos y optimiza tu operación basándote en patrones históricos y factores externos.",
      simulation_scenario: "Escenario de Simulación",
      lift_intensity: "Intensidad Lift",
      simulate_scenario: "Simular Escenario",
      projected_peak_hour: "Hora Pico Proyectada",
      high_demand: "Fuerte Demanda",
      estimated_total_today: "Total Estimado Hoy",
      model_precision: "Precisión del Modelo",
      optimal: "Óptimo",
      daily_revenue_projection: "Proyección de Ingresos Diarios",
      based_on_history: "Basado en comportamiento histórico por hora",
      ia_strategy: "Estrategia IA",
      today_tip: "Tip de Hoy",
      rain_tip: "Aplica el escenario de **Lluvia** para ver cómo impactaría una baja de demanda en tu stock crítico.",
      calculating: "Calculando tendencia...",
      language: "Idioma",
      visual_mode: "Modo Visual",
      system_auto: "Automático",
      light: "Claro",
      dark: "Oscuro",
      measurement_units: "Unidades de Medida",
      metric_kg: "Sistema (kg)",
      imperial_lb: "Imperial (lb)",
      scenarios: {
        baseline: "Base",
        promo: "Promo",
        rain: "Lluvia",
        event: "Evento",
        heatwave: "Calor",
        monthend: "Fin Mes"
      },
      inventory_desc: "Control de insumos, stock crítico y movimientos.",
      new_item: "Nuevo item",
      insumos_to_deplete: "Insumos por agotar",
      total_sku: "Total SKU",
      products_in_catalog: "Productos en catálogo",
      search_insumo_sku: "Buscar por insumo o SKU...",
      updated: "Actualizado",
      current_stock: "Stock actual",
      inventory_movement: "Movimiento de inventario",
      entry: "Entrada",
      exit: "Salida",
      adjust: "Ajuste",
      quantity: "Cantidad",
      resulting_stock: "Stock Resultante",
      note: "Nota",
      optional: "Opcional",
      eg_purchase: "Ej. Compra semanal, Merma por calor...",
      confirm_movement: "Confirmar movimiento",
      search_products: "Buscar productos...",
      all_categories: "Todas las categorías",
      discount: "Descuento",
      subtotal: "Subtotal",
      total: "Total",
      checkout_cash: "Cobrar Efectivo",
      checkout_card: "Cobrar Tarjeta",
      empty_cart: "El carrito está vacío",
      add_items_to_start: "Agrega productos para comenzar una venta.",
      confirm_sale: "¿Confirmar esta venta?",
      sale_success: "¡Venta procesada con éxito!",
      cart: "Carrito",
      sales_desc: "Historial, filtros y detalle por transacción.",
      export_csv: "Exportar CSV",
      go_to_pos: "Ir a POS",
      search_sales: "Buscar por folio, cajero o método...",
      method: "Método",
      all: "Todos",
      cash: "Efectivo",
      card: "Tarjeta",
      from: "Desde",
      to: "Hasta",
      transactions: "Transacciones",
      results: "resultados",
      cashier: "Cajero",
      view_detail: "Ver detalle",
      summary: "Resumen",
      filtered: "Filtrado",
      incomes: "Ingresos",
      tickets: "Tickets",
      avg_ticket: "Ticket promedio",
      next: "Siguiente",
      export_pdf_desc: "Export PDF, notas y devoluciones",
      connect_billing_desc: "Lo conectamos cuando integremos facturación y reglas de caja.",
      detail: "Detalle",
      reprint_ticket: "Reimprimir ticket",
      store_desc: "Productos, categorías y precios.",
      new_product: "Nuevo producto",
      search_product_category: "Buscar producto o categoría...",
      category: "Categoría",
      all_categories_f: "Todas",
      available: "Disponibles",
      active_only: "Solo activos",
      sold_out: "Agotado",
      edit: "Editar",
      add_to_menu: "Añadir al menú",
      product: "Producto",
      product_name: "Nombre del producto",
      eg_taco: "Ej. Taco al Pastor",
      price_mxn: "Precio (MXN)",
      availability: "Disponibilidad",
      show_in_pos: "Mostrar en el POS",
      save_changes: "Guardar cambios",
      cancel: "Cancelar",
      processing: "Procesando...",
      portal_ready: "Portal Listo",
      change: "Cambiar",
      update: "Actualizar",
      configure: "Configurar",
      notifications: "Notifications",
      view_all_reports: "Ver todos los reportes",
      today: "Hoy",
      items: "items",
      alert: "Alerta",
      active: "Activo",
      no_data: "Sin Datos",
      weekly_summary: "Resumen semanal",
      menu_title: "Menú",
      temperature: "Temperatura",
      partly_cloudy: "Parcialmente nublado",
      sunny: "Soleado",
      rainy: "Lluvia",
      suppliers_desc: "Directorio de contacto, tiempos de entrega y notas.",
      new_supplier: "Nuevo proveedor",
      search_suppliers: "Buscar por nombre, contacto, email...",
      delivery_days: "días entrega",
      contact_details: "Detalles del contacto",
      lead_time: "Lead Time",
      days: "días",
      rating: "Rating",
      notes: "Notas",
      no_additional_notes: "Sin notas adicionales.",
      history: "Historial",
      last_purchase: "Última compra",
      never: "Nunca",
      generate_po: "Generar Orden Compra",
      select_supplier_desc: "Selecciona un proveedor para ver detalles",
      supplier: "Proveedor",
      business_name: "Razón Social / Nombre",
      contact_label: "Contact",
      phone: "Teléfono",
      email: "Email",
      staff_desc: "Gestión de roles, accesos y actividad del equipo.",
      new_member: "Nuevo integrante",
      search_staff: "Buscar por nombre o rol...",
      active_now: "Activo ahora",
      last_active: "Último acceso",
      member: "Integrante",
      full_name: "Nombre Completo",
      role: "Rol",
      status: "Estatus",
      active_member: "Miembro activo",
      show_in_reports: "Mostrar en reportes",
      charts_desc: "Análisis visual de ingresos, tickets y productos estrella.",
      range_1w: "1 Sem",
      range_1m: "1 Mes",
      range_3m: "3 Mes",
      revenue_vs_tickets: "Ingresos vs Tickets",
      temporal_performance: "Desempeño temporal",
      top_products_sub: "Por volumen (unidades)",
      no_top_products: "No hay productos destacados en este periodo.",
      trends_desc: "Descubre patrones ocultos procesados por nuestro motor de IA.",
      insights_relevante: "Insights Relevantes",
      no_insights_data: "No hay suficientes datos para generar insights aún.",
      opportunities: "Oportunidades",
      analyzing_market: "Analizando mercado...",
      waste_analysis: "Análisis de Alérgenos & Merma",
      waste_preventive: "Análisis preventivo",
      waste_tip: "Optimiza tus compras basándote en la proyección de demanda semanal.",
      predictive_info: "Información predictiva basada en data histórica.",
      sales_chart_label: "Ventas",
      tickets_chart_label: "Tickets",
      projection_label: "Proyección",
      hour_label: "Hora",
      trends_insights: {
        peak_demand: { title: "Pico de demanda", desc: "A las {hour}:00 hrs se registra el mayor flujo de clientes históricamente." },
        no_peak_data: { title: "Pico de demanda", desc: "Aún no hay suficientes datos para identificar picos de demanda." },
        star_product: { title: "Producto Estrella", desc: "El {product} es tu producto estrella, liderando en generación de ingresos." },
        no_star_data: { title: "Producto Estrella", desc: "Tus productos más populares aparecerán aquí una vez que comiencen las ventas." },
        low_stock: { title: "Estado de Inventario", desc: "Atención: Tienes {count} productos con stock crítico o agotado." },
        stock_healthy: { title: "Estado de Inventario", desc: "Niveles de inventario saludables. No se detectan faltantes críticos hoy." },
        crossover_promo: { title: "Crossover", desc: "Activar promoción: Combinar productos de {category} con bebidas los {day} para subir ticket promedio." },
        inventory_adjust: { title: "Stock", desc: "Ajustar pedido de insumos los {day}: la demanda de {category} sube significativamente." },
        waste_prevention: { title: "Merma", desc: "Se recomienda revisar el excedente de {category} al inicio de la semana para evitar desperdicios." },
        days: {
          sunday: "domingos", monday: "lunes", tuesday: "martes", wednesday: "miércoles",
          thursday: "jueves", friday: "viernes", saturday: "sábados", weekend: "fines de semana", peak_days: "días pico"
        }
      },
      reports_desc: "Genera reportes y exporta.",
      type_label: "Type",
      range_label: "Rango",
      generate_btn: "Generar",
      export_pdf_btn: "Exportar PDF",
      from_label: "Desde",
      to_label: "Hasta",
      preview_label: "Vista previa",
      templates_label: "Plantillas",
      auto_label: "Auto",
      click_to_generate: "Genera con un click.",
      report_types: { sales: "Ventas", inventory: "Inventario", finance: "Financiero" },
      report_ranges: { today: "Hoy", "7d": "7 días", "30d": "30 días", custom: "Personalizado" },
      templates: { daily_cut: "Corte diario", weekly_exec: "Semanal ejecutivo", critical_inventory: "Inventario crítico", sales_by_product: "Ventas por producto" },
      search_and_roles: "Búsqueda y roles",
      permissions_title: "Permisos",
      roles_label: "Roles",
      new_member_label: "Nuevo integrante",
      save_btn: "Guardar",
      roles_data: {
        Admin: { title: "Admin", desc: "Acceso total, usuarios y configuración." },
        Gerente: { title: "Gerente", desc: "Reportes, inventario, proveedores, ajustes." },
        Cajero: { title: "Cajero", desc: "POS y registro de ventas." },
        Cocina: { title: "Cocina", desc: "Producción y consumos (siguiente)." }
      },
      admin_pro: "Administrador Pro",
      email_field: "Correo Electrónico",
      change_password_field: "Cambiar Contraseña",
      updated_2_months_ago: "Actualizada hace 2 meses",
      change_btn: "Cambiar",
      update_btn: "Actualizar",
      configure_btn: "Configurar",
      saving_btn: "Guardando...",
      portal_ready_btn: "Portal Listo",
      pass_updated_success: "Contraseña actualizada correctamente",
      pass_mismatch_error: "Las contraseñas no coinciden",
      pass_length_error: "La contraseña debe tener al menos 6 caracteres",
      generated_at: "Generado"
    },
    docs: {
      title: "Documentación",
      subtitle: "Todo lo que necesitas saber para dominar SmartFood AI",
      search_placeholder: "Buscar en la guía...",
      getting_started: "Primeros Pasos",
      core_features: "Funcionalidades Core",
      ai_intelligence: "Inteligencia Artificial",
      admin_guide: "Administración",
      ai_science: "Ciencia de Datos",
      security_privacy: "Seguridad y Privacidad",
      sidebar_title: "Contenido de la Guía",
      on_this_page: "En esta página",
      features: {
        dashboard: { title: "Dashboard", desc: "Monitorea métricas en tiempo real." },
        prediction: { title: "Predicción", desc: "IA que anticipa tu demanda." },
        sales: { title: "Ventas", desc: "Registra cobros en segundos." },
        team: { title: "Equipo", desc: "Gestiona accesos y roles." }
      },
      sections: {
        welcome: {
          title: "Bienvenido a SmartFood AI",
          content: "SmartFood AI es la plataforma líder para la optimización de cafeterías y comedores industriales basada en inteligencia artificial. Nuestra misión es erradicar el desperdicio alimentario mientras maximizamos la rentabilidad de los negocios gastronómicos mediante el uso de algoritmos predictivos de última generación.",
          items: [
            { title: "Introducción", desc: "SmartFood AI no es solo un software de ventas, es un ecosistema completo diseñado para ayudar a gerentes de comedores a tomar decisiones informadas basadas en datos reales." },
            { title: "Propósito", desc: "Buscamos reducir el desperdicio en un 30% promedio mediante predicciones precisas que ajustan la producción diaria a la demanda real de los comensales." },
            { title: "Alcance", desc: "Nuestra solución es escalable y se adapta desde pequeñas cafeterías escolares hasta comedores industriales de gran volumen con múltiples sucursales." },
            { title: "Beneficios Clave", desc: "Ahorro directo en materia prima, optimización del tiempo del personal, y visualización clara de la salud financiera del negocio." }
          ]
        },
        setup: {
          title: "Configuración Inicial",
          content: "Para comenzar a operar, es vital configurar correctamente los cimientos de tu negocio en la plataforma.",
          items: [
            { title: "Perfil de Negocio", desc: "Completa tus datos en 'Mi Cuenta', configurando la moneda base, zona horaria y los impuestos aplicables para tu región." },
            { title: "Estructura de Categorías", desc: "Define grupos lógicos (ej. Bebidas, Platillos Fuertes, Postres). Esto ayuda a la IA a identificar qué tipos de productos tienen mejor rendimiento por temporada." },
            { title: "Carga de Productos", desc: "Añade cada ítem de tu menú con su precio de venta y costo. Puedes marcarlos como 'disponibles' o 'agotados' instantáneamente." },
            { title: "Inventario Inicial", desc: "Es fundamental registrar tus existencias actuales para que el sistema empiece a avisarte sobre stocks críticos desde la primera venta." }
          ]
        },
        dashboard_overview: {
          title: "Vista General (Home)",
          content: "El Dashboard es tu cabina de mando. Aquí consolidamos billones de puntos de datos en 4 KPIs críticos.",
          items: [
            { title: "Lectura de KPIs", desc: "Observa los ingresos diarios comparados contra el día anterior, el número de órdenes procesadas y el producto estrella del periodo." },
            { title: "Alertas Inteligentes", desc: "El sistema resalta automáticamente los productos que están por debajo de su stock mínimo definido para una compra rápida." },
            { title: "Gráficas de Rendimiento", desc: "Visualiza la tendencia de ventas de los últimos 7 días para entender el flujo de tu negocio a lo largo de la semana." },
            { title: "Atajos de Operación", desc: "Accede rápidamente al POS o a la gestión de inventario directamente desde los widgets de la pantalla principal." }
          ]
        },
        pos: {
          title: "Punto de Venta (POS)",
          content: "Nuestro POS está optimizado para flujos de alta transaccionalidad y facilidad de uso.",
          items: [
            { title: "Venta Rápida", desc: "Selecciona productos mediante la cuadrícula visual o usa un lector de códigos de barras. El sistema calcula el total automáticamente." },
            { title: "Descuentos", desc: "Aplica descuentos porcentuales a la cuenta total de forma sencilla para promociones especiales o cortesías." },
            { title: "Métodos de Pago", desc: "Gestiona pagos en efectivo (con calculadora de cambio) o tarjeta. Cada método se registra para el corte de caja final." },
            { title: "Gestión de Carrito", desc: "Modifica cantidades, elimina ítems o limpia el carrito con un solo clic antes de procesar el cobro final." }
          ]
        },
        sales_registry: {
          title: "Registro de Ventas",
          content: "Explora cada transacción histórica con detalle forense para auditorías y aclaraciones.",
          items: [
            { title: "Historial Transaccional", desc: "Lista completa de todas las ventas con folio único, hora exacta, cajero que atendió y monto total." },
            { title: "Filtros Avanzados", desc: "Busca ventas específicas por rango de fechas, método de pago o nombre del producto vendido." },
            { title: "Reimpresión de Tickets", desc: "Genera copias digitales o físicas de tickets pasados en cualquier momento desde el registro." },
            { title: "Anulación de Ventas", desc: "Capacidad para cancelar transacciones erróneas (sujeto a permisos de Administrador) para corregir el inventario." }
          ]
        },
        inventory: {
          title: "Gestión de Inventario",
          content: "Control de insumos en tiempo real para evitar quiebres de stock o sobreinventario.",
          items: [
            { title: "Control de Existencias", desc: "Visualiza el 'On Hand' real de cada producto. El sistema descuenta existencias automáticamente tras cada venta." },
            { title: "Registro de Movimientos", desc: "Lleva una bitácora de todas las entradas (compras) y salidas (mermas o transferencias) de inventario." },
            { title: "Ajustes Manuales", desc: "Realiza correcciones de inventario tras inventarios físicos para asegurar que el sistema coincida con la realidad." },
            { title: "Alertas de Stock Crítico", desc: "Configura el stock mínimo por producto. La IA te avisará visualmente cuando sea necesario reabastecer." }
          ]
        },
        store: {
          title: "Gestión de Tienda",
          content: "El catálogo es el corazón de tu operación. Administra tus productos y precios.",
          items: [
            { title: "Catálogo Digital", desc: "Gestiona el nombre, categoría y disponibilidad de todos tus productos en un solo lugar." },
            { title: "Precios y Costos", desc: "Actualiza tus precios de venta de forma masiva o individual según cambien tus costos con proveedores." },
            { title: "Control de Disponibilidad", desc: "Activa o desactiva productos del POS con un interruptor para que los cajeros no vendan lo que no hay." },
            { title: "Organización por Categorías", desc: "Mueve productos entre categorías para optimizar la navegación en el POS y los reportes analíticos." }
          ]
        },
        suppliers: {
          title: "Proveedores",
          content: "Gestiona tu cadena de suministro eficientemente para un reabastecimiento sin fricciones.",
          items: [
            { title: "Directorio de Contactos", desc: "Almacena nombres, teléfonos y correos de tus proveedores clave para un acceso rápido." },
            { title: "Pedidos", desc: "Registra qué productos te surte cada proveedor y mantén un historial de tus órdenes de compra pasadas." },
            { title: "Lead Time y Calificación", desc: "Registra cuántos días tarda cada proveedor en entregar y califica su servicio para optimizar tus compras futuras." },
            { title: "Historial de Compras", desc: "Consulta cuánto has comprado a cada proveedor para negociar mejores precios basados en volumen." }
          ]
        },
        prediction: {
          title: "Predicción de Demanda",
          content: "Usa el poder de la IA para saber exactamente cuánto cocinar mañana.",
          items: [
            { title: "Modelos Predictivos", desc: "Nuestros algoritmos analizan años de datos para detectar patrones de consumo semanales y mensuales." },
            { title: "Impacto Climático", desc: "La IA ajusta las predicciones según el pronóstico del clima. (ej. vende más bebidas calientes en días fríos)." },
            { title: "Simulación de Escenarios", desc: "Prueba qué pasaría con tus ventas bajo escenarios de 'Lluvia', 'Promoción' o 'Día Festivo'." },
            { title: "Ajuste de Producción", desc: "Recibe recomendaciones sobre cuántas unidades preparar de cada platillo para minimizar la merma." }
          ]
        },
        trends: {
          title: "Análisis de Tendencias",
          content: "Descubre patrones ocultos en tus datos que los reportes tradicionales no muestran.",
          items: [
            { title: "Identificación de Patrones", desc: "La IA detecta qué productos se suelen vender juntos para sugerirte promociones cruzadas (Cross-selling)." },
            { title: "Análisis de Horas Pico", desc: "Identifica tus horas de mayor afluencia para optimizar los horarios del personal y la preparación de alimentos." },
            { title: "Recomendaciones de IA", desc: "Recibe sugerencias automáticas para mover el inventario que tiene baja rotación mediante ofertas." },
            { title: "Oportunidades de Negocio", desc: "Detecta nichos desatendidos o categorías que están creciendo rápidamente en tu mercado local." }
          ]
        },
        analytics: {
          title: "Gráficas Avanzadas",
          content: "Visualización de datos de nivel empresarial para una comprensión profunda del negocio.",
          items: [
            { title: "Ingresos vs Transacciones", desc: "Compara cuánto dinero entra contra cuántas ventas se hacen para medir el ticket promedio." },
            { title: "Distribución por Categoría", desc: "Entiende qué porcentaje de tus ingresos viene de cada grupo de productos (ej. el 40% son snacks)." },
            { title: "Volumen de Productos", desc: "Analiza cuáles son los 5 productos con más movimiento para asegurar su stock prioritario." },
            { title: "Análisis de Rentabilidad", desc: "Cruza tus ventas con tus costos registrados para ver el margen real de beneficio por cada producto." }
          ]
        },
        reports: {
          title: "Reportes y Exportación",
          content: "Genera documentos oficiales listos para imprimir o compartir.",
          items: [
            { title: "Cortes de Caja", desc: "Resúmenes diarios que facilitan el cuadre de efectivo y tarjetas al finalizar cada turno." },
            { title: "Informes de Inventario", desc: "Exporta una lista valorizada de tus existencias actuales para auditorías contables." },
            { title: "Resumen Financiero", desc: "Informes mensuales con ingresos, costos y mermas para una visión clara de la utilidad." },
            { title: "Exportación Profesional", desc: "Todos los reportes se generan en PDF con un diseño limpio, listo para ser enviado por correo." }
          ]
        },
        staff: {
          title: "Gestión de Personal",
          content: "Administra a tu equipo de trabajo y controla sus niveles de acceso.",
          items: [
            { title: "Control de Usuarios", desc: "Crea cuentas individuales para cada empleado para que sus acciones queden registradas bajo su nombre." },
            { title: "Roles y Permisos", desc: "Asigna perfiles como 'Cajero', 'Gerente' o 'Administrador' para restringir acceso a funciones sensibles." },
            { title: "Monitor de Actividad", desc: "Visualiza la última vez que cada usuario inició sesión y qué transacciones ha procesado últimamente." },
            { title: "Seguridad del Equipo", desc: "Gestiona el cambio de contraseñas y la baja de personal de forma centralizada y segura." }
          ]
        },
        account: {
          title: "Mi Cuenta y Seguridad",
          content: "Gestiona tu identidad, suscripción y preferencias visuales.",
          items: [
            { title: "Seguridad de Acceso", desc: "Actualiza tu correo y contraseña regularmente para mantener tu portal protegido contra accesos no autorizados." },
            { title: "Gestión de Suscripción", desc: "Visualiza tu plan actual (Básico, Pro o Enterprise) y mantente al tanto de la renovación de tu servicio." },
            { title: "Métodos de Pago", desc: "Añade tarjetas de crédito o débito para el pago automatizado de tus herramientas SmartFood AI." },
            { title: "Preferencias Visuales", desc: "Configura el Modo Oscuro para reducir la fatiga visual y elige tus unidades de medida preferidas." }
          ]
        },
        ai_logic: {
          title: "El Motor de SmartFood",
          content: "Conoce la ciencia que impulsa nuestras predicciones del 94% de precisión.",
          items: [
            { title: "Algoritmos Utilizados", desc: "Combinamos Regresión Lineal para tendencias y Redes Neuronales LSTM para patrones temporales complejos." },
            { title: "Procesamiento de Datos", desc: "Tus datos se limpian y anonimizan antes de ser procesados en nuestros servidores de alto rendimiento." },
            { title: "Variables Externas", desc: "Inyectamos datos de APIs meteorológicas y calendarios de eventos locales para afinar el pronóstico." },
            { title: "Entrenamiento del Modelo", desc: "La IA aprende de tus ventas diarias; entre más tiempo uses el sistema, más precisas serán las predicciones." }
          ]
        },
        security_tech: {
          title: "Arquitectura de Seguridad",
          content: "Tus datos son tu activo más valioso. Los protegemos con estándares bancarios.",
          items: [
            { title: "Aislamiento de Datos", desc: "Implementamos arquitectura Multi-Tenant que garantiza que tu información nunca se mezcle con otros negocios." },
            { title: "Cifrado de Extremo a Extremo", desc: "Toda la comunicación entre el dashboard y el servidor viaja cifrada mediante protocolos TLS 1.3 de última generación." },
            { title: "Cumplimiento y Privacidad", desc: "Respetamos las normativas de protección de datos, asegurando que solo tú tengas control sobre tu información comercial." },
            { title: "Backups Automáticos", desc: "Realizamos copias de seguridad cada 24 horas para que tu negocio nunca pierda su historial operativo ante cualquier fallo." }
          ]
        }
      }
    }
  },
  en: {
    nav: { home: "Home", features: "Features", platform: "Platform", testimonials: "Testimonials", pricing: "Pricing", contact: "Contact", docs: "Documentation", docs_cta: "Log In Now!", login: "Log in", cta: "Start Now" },
    badge: "V2.0: Smarter & Faster AI Models",
    h1: "Predict demand. Reduce waste. Maximize profits",
    hero_p: "With SmartFood, anticipate food demand using AI and machine learning. Automatically adjust your inventory and visualize everything with clear, actionable dashboards.",
    try: "Try SmartFood AI",
    demo: "View Demo",
    integrations: "Powered by high-performance and next-generation technologies",
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
      signup: "Create Account",
      no_account: "Don't have an account?",
      has_account: "Already have an account?",
      create: "Create account",
      login_now: "Login now",
      welcome_new: "Create your account",
      subtitle_new: "Start optimizing your business with AI today",
      name_label: "Full Name",
      name_placeholder: "John Doe",
      terms: "Terms of Service",      privacy: "Privacy Policy",
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
      payment_methods_title: "Payment Methods",
      add_card: "Add Card",
      add_card_desc: "Enter your new credit or debit card details.",
      card_holder: "Cardholder Name",
      card_number: "Card Number",
      card_cvc: "CVC",
      save_card: "Save Card",
      expires: "Expires",
      primary: "Primary",
      remove: "Remove",
      sub_type: "Subscription Type",
      sub_status: "Subscription Status",
      sub_active: "Active",
      sub_basic: "Basic Plan",
      sub_pro: "Professional Plan Edition",
      sub_enterprise: "Enterprise Pro Plan",
      total_orders: "Total Orders",
      processed_today: "Processed today",
      revenue_today: "Revenue Today",
      yesterday: "Yesterday",
      top_product: "Top Product",
      units_sold: "units sold",
      critical_stock: "Critical Stock",
      sales_performance: "Sales Performance",
      last_7_days: "Last 7 days",
      inventory_alerts: "Inventory Alerts",
      critical_items: "Critical",
      manage_inventory: "Manage Inventory",
      no_alerts: "No critical alerts.",
      smart_plan: "Smart Plan",
      ai_prediction_tomorrow: "AI: Tomorrow's Prediction",
      max_probability: "Max sales probability",
      view_analysis: "View analysis",
      prediction_desc: "Project your revenue and optimize your operation based on historical patterns and external factors.",
      simulation_scenario: "Simulation Scenario",
      lift_intensity: "Lift Intensity",
      simulate_scenario: "Simulate Scenario",
      projected_peak_hour: "Projected Peak Hour",
      high_demand: "Strong Demand",
      estimated_total_today: "Estimated Total Today",
      model_precision: "Model Precision",
      optimal: "Optimal",
      daily_revenue_projection: "Daily Revenue Projection",
      based_on_history: "Based on historical hourly behavior",
      ia_strategy: "AI Strategy",
      today_tip: "Today's Tip",
      rain_tip: "Apply the **Rain** scenario to see how a demand drop would impact your critical stock.",
      calculating: "Calculating trend...",
      language: "Language",
      visual_mode: "Visual Mode",
      system_auto: "Automatic",
      light: "Light",
      dark: "Dark",
      measurement_units: "Measurement Units",
      metric_kg: "Metric (kg)",
      imperial_lb: "Imperial (lb)",
      scenarios: {
        baseline: "Base",
        promo: "Promo",
        rain: "Rain",
        event: "Event",
        heatwave: "Heatwave",
        monthend: "Month End"
      },
      inventory_desc: "Control of supplies, critical stock and movements.",
      new_item: "New Item",
      insumos_to_deplete: "Supplies to deplete",
      total_sku: "Total SKU",
      products_in_catalog: "Products in catalog",
      search_insumo_sku: "Search by supply or SKU...",
      updated: "Updated",
      current_stock: "Current stock",
      inventory_movement: "Inventory Movement",
      entry: "Entry",
      exit: "Exit",
      adjust: "Adjust",
      quantity: "Quantity",
      resulting_stock: "Resulting Stock",
      note: "Note",
      optional: "Optional",
      eg_purchase: "E.g. Weekly purchase, Heat waste...",
      confirm_movement: "Confirm Movement",
      search_products: "Search products...",
      all_categories: "All categories",
      discount: "Discount",
      subtotal: "Subtotal",
      total: "Total",
      checkout_cash: "Checkout Cash",
      checkout_card: "Checkout Card",
      empty_cart: "Cart is empty",
      add_items_to_start: "Add products to start a sale.",
      confirm_sale: "Confirm this sale?",
      sale_success: "Sale processed successfully!",
      cart: "Cart",
      sales_desc: "History, filters and detail per transaction.",
      export_csv: "Export CSV",
      go_to_pos: "Go to POS",
      search_sales: "Search by ID, cashier or method...",
      method: "Method",
      all: "All",
      cash: "Cash",
      card: "Card",
      from: "From",
      to: "To",
      transactions: "Transactions",
      results: "results",
      cashier: "Cashier",
      view_detail: "View detail",
      summary: "Summary",
      filtered: "Filtered",
      incomes: "Incomes",
      tickets: "Tickets",
      avg_ticket: "Avg Ticket",
      next: "Next",
      export_pdf_desc: "Export PDF, notes and returns",
      connect_billing_desc: "We will connect it when we integrate billing and cash rules.",
      detail: "Detail",
      reprint_ticket: "Reprint ticket",
      store_desc: "Products, categories and prices.",
      new_product: "New Product",
      search_product_category: "Search product or category...",
      category: "Category",
      all_categories_f: "All",
      available: "Available",
      active_only: "Active only",
      sold_out: "Sold out",
      edit: "Edit",
      add_to_menu: "Add to menu",
      product: "Product",
      product_name: "Product name",
      eg_taco: "E.g. Pastor Taco",
      price_mxn: "Price (MXN)",
      availability: "Availability",
      show_in_pos: "Show in POS",
      save_changes: "Save changes",
      cancel: "Cancel",
      processing: "Processing...",
      portal_ready: "Portal Ready",
      change: "Change",
      update: "Update",
      configure: "Configure",
      notifications: "Notifications",
      view_all_reports: "View all reports",
      today: "Today",
      items: "items",
      alert: "Alert",
      active: "Active",
      no_data: "No Data",
      weekly_summary: "Weekly summary",
      menu_title: "Menu",
      suppliers_desc: "Contact directory, delivery times and notes.",
      new_supplier: "New Supplier",
      search_suppliers: "Search by name, contact, email...",
      delivery_days: "delivery days",
      contact_details: "Contact details",
      lead_time: "Lead Time",
      days: "days",
      rating: "Rating",
      notes: "Notes",
      no_additional_notes: "No additional notes.",
      history: "History",
      last_purchase: "Last purchase",
      never: "Never",
      generate_po: "Generate Purchase Order",
      select_supplier_desc: "Select a supplier to see details",
      supplier: "Supplier",
      business_name: "Business Name",
      contact_label: "Contact",
      phone: "Phone",
      email: "Email",
      staff_desc: "Management of roles, access and team activity.",
      new_member: "New Member",
      search_staff: "Search by name or role...",
      active_now: "Active now",
      last_active: "Last active",
      member: "Member",
      full_name: "Full Name",
      role: "Role",
      status: "Status",
      active_member: "Active member",
      show_in_reports: "Show in reports",
      charts_desc: "Visual analysis of revenue, tickets and star products.",
      range_1w: "1 Wk",
      range_1m: "1 Mo",
      range_3m: "3 Mo",
      revenue_vs_tickets: "Revenue vs Tickets",
      temporal_performance: "Temporal performance",
      top_products_sub: "By volume (units)",
      no_top_products: "No featured products in this period.",
      trends_desc: "Discover hidden patterns processed by our AI engine.",
      insights_relevante: "Relevant Insights",
      no_insights_data: "Not enough data to generate insights yet.",
      opportunities: "Opportunities",
      analyzing_market: "Analyzing market...",
      waste_analysis: "Allergen & Waste Analysis",
      waste_preventive: "Preventive analysis",
      waste_tip: "Optimize your purchases based on the weekly demand projection.",
      predictive_info: "Predictive information based on historical data.",
      sales_chart_label: "Sales",
      tickets_chart_label: "Tickets",
      projection_label: "Projection",
      hour_label: "Hour",
      trends_insights: {
        peak_demand: { title: "Peak Demand", desc: "At {hour}:00 hrs, the highest customer flow is historically recorded." },
        no_peak_data: { title: "Peak Demand", desc: "Not enough data yet to identify demand peaks." },
        star_product: { title: "Star Product", desc: "{product} is your star product, leading in revenue generation." },
        no_star_data: { title: "Star Product", desc: "Your most popular products will appear here once sales begin." },
        low_stock: { title: "Inventory Status", desc: "Attention: You have {count} products with critical or out-of-stock levels." },
        stock_healthy: { title: "Inventory Status", desc: "Healthy inventory levels. No critical shortages detected today." },
        crossover_promo: { title: "Crossover", desc: "Activate promotion: Combine {category} products with drinks on {day} to increase average ticket." },
        inventory_adjust: { title: "Stock", desc: "Adjust supply orders on {day}: demand for {category} increases significantly." },
        waste_prevention: { title: "Waste", desc: "Recommendation: Review {category} surplus at the start of the week to avoid waste." },
        days: {
          sunday: "Sundays", monday: "Mondays", tuesday: "Tuesdays", wednesday: "Wednesdays",
          thursday: "Thursdays", friday: "Fridays", saturday: "Saturdays", weekend: "weekends", peak_days: "peak days"
        }
      },
      reports_desc: "Generate reports and export.",
      type_label: "Type",
      range_label: "Range",
      generate_btn: "Generate",
      export_pdf_btn: "Export PDF",
      from_label: "From",
      to_label: "To",
      preview_label: "Preview",
      templates_label: "Templates",
      auto_label: "Auto",
      click_to_generate: "Generate with one click.",
      report_types: { sales: "Sales", inventory: "Inventory", finance: "Financial" },
      report_ranges: { today: "Today", "7d": "7 days", "30d": "30 days", custom: "Custom" },
      templates: { daily_cut: "Daily Cut", weekly_exec: "Weekly Executive", critical_inventory: "Critical Inventory", sales_by_product: "Sales by Product" },
      search_and_roles: "Search and roles",
      permissions_title: "Permissions",
      roles_label: "Roles",
      new_member_label: "New Member",
      save_btn: "Save",
      roles_data: {
        Admin: { title: "Admin", desc: "Full access, users and configuration." },
        Gerente: { title: "Manager", desc: "Reports, inventory, suppliers, adjustments." },
        Cajero: { title: "Cashier", desc: "POS and sales registration." },
        Cocina: { title: "Kitchen", desc: "Production and consumption (next)." }
      },
      admin_pro: "Pro Administrator",
      email_field: "Email Address",
      change_password_field: "Change Password",
      updated_2_months_ago: "Updated 2 months ago",
      change_btn: "Change",
      update_btn: "Update",
      configure_btn: "Configure",
      saving_btn: "Saving...",
      portal_ready_btn: "Portal Ready",
      pass_updated_success: "Password updated successfully",
      pass_mismatch_error: "Passwords do not match",
      pass_length_error: "Password must be at least 6 characters",
      generated_at: "Generated"
    },
    docs: {
      title: "Documentation",
      subtitle: "Everything you need to know to master SmartFood AI",
      search_placeholder: "Search the guide...",
      getting_started: "Getting Started",
      core_features: "Core Features",
      ai_intelligence: "AI Intelligence",
      admin_guide: "Administration",
      ai_science: "Data Science",
      security_privacy: "Security & Privacy",
      on_this_page: "On this page",
      features: {
        dashboard: { title: "Dashboard", desc: "Monitor real-time metrics." },
        prediction: { title: "Prediction", desc: "AI that anticipates your demand." },
        sales: { title: "Sales", desc: "Record payments in seconds." },
        team: { title: "Team", desc: "Manage access and roles." }
      },
      sections: {
        welcome: {
          title: "Welcome to SmartFood AI",
          content: "SmartFood AI is the leading platform for optimizing cafeterias and industrial dining halls based on artificial intelligence. Our mission is to eradicate food waste while maximizing profitability for culinary businesses through the use of state-of-the-art predictive algorithms.",
          items: [
            { title: "Introduction", desc: "SmartFood AI is not just a point of sale software; it's a complete ecosystem designed to help dining hall managers make informed decisions based on real data." },
            { title: "Purpose", desc: "We aim to reduce waste by an average of 30% through precise predictions that align daily production with the actual demand of diners." },
            { title: "Scope", desc: "Our solution is scalable, adapting from small school cafeterias to high-volume industrial dining halls with multiple branches." },
            { title: "Key Benefits", desc: "Direct savings in raw materials, optimization of staff time, and clear visualization of business financial health." }
          ]
        },
        setup: {
          title: "Initial Setup",
          content: "To start operating, it is vital to correctly configure your business foundations within the platform.",
          items: [
            { title: "Business Profile", desc: "Complete your details in 'My Account', setting the base currency, time zone, and applicable taxes for your region." },
            { title: "Category Structure", desc: "Define logical groups (e.g., Drinks, Main Courses, Desserts). This helps the AI identify which types of products perform better by season." },
            { title: "Product Loading", desc: "Add each item of your menu with its selling price and cost. You can mark them as 'available' or 'out of stock' instantly." },
            { title: "Initial Inventory", desc: "It is fundamental to record your current stock so the system starts notifying you about critical levels from the very first sale." }
          ]
        },
        dashboard_overview: {
          title: "General View (Home)",
          content: "The Dashboard is your control center. Here we consolidate billions of data points into 4 critical KPIs.",
          items: [
            { title: "KPI Reading", desc: "Observe daily revenue compared to the previous day, the number of processed orders, and the star product of the period." },
            { title: "Smart Alerts", desc: "The system automatically highlights products that are below their defined minimum stock for quick purchasing." },
            { title: "Performance Charts", desc: "Visualize the sales trend of the last 7 days to understand your business flow throughout the week." },
            { title: "Operation Shortcuts", desc: "Quickly access the POS or inventory management directly from the home screen widgets." }
          ]
        },
        pos: {
          title: "Point of Sale (POS)",
          content: "Our POS is optimized for high transaction flows and ease of use.",
          items: [
            { title: "Quick Sale", desc: "Select products via visual grid or use a barcode scanner. The system calculates the total automatically." },
            { title: "Discounts", desc: "Apply percentage discounts to the total bill easily for special promotions or courtesies." },
            { title: "Payment Methods", desc: "Manage cash payments (with change calculator) or card. Each method is recorded for the final cash cut." },
            { title: "Cart Management", desc: "Modify quantities, remove items, or clear the cart with a single click before processing the final payment." }
          ]
        },
        sales_registry: {
          title: "Sales Registry",
          content: "Explore each historical transaction with forensic detail for audits and clarifications.",
          items: [
            { title: "Transactional History", desc: "Complete list of all sales with unique folio, exact time, cashier who served, and total amount." },
            { title: "Advanced Filters", desc: "Search for specific sales by date range, payment method, or name of the product sold." },
            { title: "Ticket Reprinting", desc: "Generate digital or physical copies of past tickets at any time from the registry." },
            { title: "Sale Voiding", desc: "Ability to cancel erroneous transactions (subject to Admin permissions) to correct inventory." }
          ]
        },
        inventory: {
          title: "Inventory Management",
          content: "Real-time supply control to avoid stockouts or overstock.",
          items: [
            { title: "Stock Control", desc: "Visualize the real 'On Hand' for each product. The system automatically discounts stock after each sale." },
            { title: "Movement Registry", desc: "Keep a log of all entries (purchases) and exits (waste or transfers) of inventory." },
            { title: "Manual Adjustments", desc: "Perform inventory corrections after physical counts to ensure the system matches reality." },
            { title: "Critical Stock Alerts", desc: "Configure minimum stock per product. The AI will visually notify you when restocking is necessary." }
          ]
        },
        store: {
          title: "Store Management",
          content: "The catalog is the heart of your operation. Manage your products and prices.",
          items: [
            { title: "Digital Catalog", desc: "Manage the name, category, and availability of all your products in one place." },
            { title: "Prices and Costs", desc: "Update your selling prices in bulk or individually as your costs with suppliers change." },
            { title: "Availability Control", desc: "Toggle products on/off for the POS with a switch so cashiers don't sell what isn't there." },
            { title: "Category Organization", desc: "Move products between categories to optimize POS navigation and analytical reports." }
          ]
        },
        suppliers: {
          title: "Suppliers",
          content: "Manage your supply chain efficiently for frictionless restocking.",
          items: [
            { title: "Contact Directory", desc: "Store names, phones, and emails of your key suppliers for quick access." },
            { title: "Orders", desc: "Record which products each supplier provides and keep a history of your past purchase orders." },
            { title: "Lead Time and Rating", desc: "Record how many days each supplier takes to deliver and rate their service to optimize future purchases." },
            { title: "Purchase History", desc: "See how much you have bought from each supplier to negotiate better prices based on volume." }
          ]
        },
        prediction: {
          title: "Demand Prediction",
          content: "Use the power of AI to know exactly how much to cook tomorrow.",
          items: [
            { title: "Predictive Models", desc: "Our algorithms analyze years of data to detect weekly and monthly consumption patterns." },
            { title: "Weather Impact", desc: "AI adjusts predictions based on the weather forecast. (e.g., sell more hot drinks on cold days)." },
            { title: "Scenario Simulation", desc: "Test what would happen with your sales under 'Rain', 'Promotion', or 'Holiday' scenarios." },
            { title: "Production Adjustment", desc: "Receive recommendations on how many units to prepare for each dish to minimize waste." }
          ]
        },
        trends: {
          title: "Trend Analysis",
          content: "Discover hidden patterns in your data that traditional reports don't show.",
          items: [
            { title: "Pattern Identification", desc: "AI detects which products are usually sold together to suggest cross-selling promotions." },
            { title: "Peak Hour Analysis", desc: "Identify your highest traffic hours to optimize staff schedules and food preparation." },
            { title: "AI Recommendations", desc: "Receive automatic suggestions to move slow-rotating inventory through offers." },
            { title: "Business Opportunities", desc: "Detect underserved niches or categories that are growing rapidly in your local market." }
          ]
        },
        analytics: {
          title: "Advanced Charts",
          content: "Enterprise-level data visualization for a deep understanding of the business.",
          items: [
            { title: "Revenue vs. Transactions", desc: "Compare how much money comes in against how many sales are made to measure the average ticket." },
            { title: "Category Distribution", desc: "Understand what percentage of your revenue comes from each product group (e.g., 40% are snacks)." },
            { title: "Product Volume", desc: "Analyze which 5 products have the most movement to ensure their priority stock." },
            { title: "Profitability Analysis", desc: "Cross your sales with your registered costs to see the real profit margin per product." }
          ]
        },
        reports: {
          title: "Reports and Export",
          content: "Generate official documents ready to print or share.",
          items: [
            { title: "Cash Cuts", desc: "Daily summaries that facilitate cash and card reconciliation at the end of each shift." },
            { title: "Inventory Reports", desc: "Export a valued list of your current stock for accounting audits." },
            { title: "Financial Summary", desc: "Monthly reports with revenue, costs, and waste for a clear view of profit." },
            { title: "Professional Export", desc: "All reports are generated in PDF with a clean design, ready to be sent by email." }
          ]
        },
        staff: {
          title: "Staff Management",
          content: "Manage your work team and control their access levels.",
          items: [
            { title: "User Control", desc: "Create individual accounts for each employee so their actions are recorded under their name." },
            { title: "Roles and Permissions", desc: "Assign profiles like 'Cashier', 'Manager', or 'Admin' to restrict access to sensitive functions." },
            { title: "Activity Monitor", desc: "Visualize the last time each user logged in and what transactions they have processed lately." },
            { title: "Team Security", desc: "Manage password changes and staff decommissioning centrally and safely." }
          ]
        },
        account: {
          title: "My Account and Security",
          content: "Manage your identity, subscription, and visual preferences.",
          items: [
            { title: "Access Security", desc: "Update your email and password regularly to keep your portal protected against unauthorized access." },
            { title: "Subscription Management", desc: "View your current plan (Basic, Pro, or Enterprise) and stay on top of your service renewal." },
            { title: "Payment Methods", desc: "Add credit or debit cards for the automated payment of your SmartFood AI tools." },
            { title: "Visual Preferences", desc: "Configure Dark Mode to reduce eye strain and choose your preferred measurement units." }
          ]
        },
        ai_logic: {
          title: "The SmartFood Engine",
          content: "Know the science driving our 94% accurate predictions.",
          items: [
            { title: "Algorithms Used", desc: "We combine Linear Regression for trends and LSTM Neural Networks for complex temporal patterns." },
            { title: "Data Processing", desc: "Your data is cleaned and anonymized before being processed on our high-performance servers." },
            { title: "External Variables", desc: "We inject data from weather APIs and local event calendars to fine-tune the forecast." },
            { title: "Model Training", desc: "The AI learns from your daily sales; the longer you use the system, the more accurate predictions will be." }
          ]
        },
        security_tech: {
          title: "Security Architecture",
          content: "Your data is your most valuable asset. We protect it with banking standards.",
          items: [
            { title: "Data Isolation", desc: "We implement Multi-Tenant architecture that guarantees your information never mixes with other businesses." },
            { title: "End-to-End Encryption", desc: "All communication between the dashboard and server travels encrypted via latest TLS 1.3 protocols." },
            { title: "Compliance and Privacy", desc: "We respect data protection regulations, ensuring only you have control over your commercial information." },
            { title: "Automatic Backups", desc: "We perform backups every 24 hours so your business never loses its operational history in case of any failure." }
          ]
        }
      }
    }
  },
  fr: {
    nav: { home: "Accueil", features: "Fonctionnalités", platform: "Plateforme", testimonials: "Témoignages", pricing: "Tarifs", contact: "Contact", docs: "Documentation", docs_cta: "S'inscrire!", login: "Connexion", cta: "Commencer" },
    badge: "V2.0 : Modèles IA plus intelligents et rapides",
    h1: "Prédisez la demande. Réduisez le gaspillage. Maximisez les profits",
    hero_p: "Avec SmartFood, anticipez la demande alimentaire grâce à l'IA et au machine learning. Ajustez automatiquement votre inventaire et visualisez tout avec des tableaux de bord clairs et exploitables.",
    try: "Essayer SmartFood AI",
    demo: "Voir la Démo",
    integrations: "Propulsé por des technologies de haute performance et de nouvelle génération",
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
        desc: "Solution complète para passer à l'échelle",
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
    footer_dev: "Conçu et développé por Alejandro Balderas Rios",
    dash_title: "Aperçus Quotidiens",
    dash_sub: "Tendances métaboliques prédites por IA pour aujourd'hui.",
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
      microsoft: "Continuer with Microsoft",
      or: "ou e-mail",
      email_label: "Adresse e-mail",
      email_placeholder: "nom@entreprise.com",
      password_label: "Mot de passe",
      password_placeholder: "••••••••",
      forgot: "Mot de passe oublié ?",
      remember: "Rester connecté",
      signin: "Se connecter",
      signup: "Créer un Compte",
      no_account: "Pas de compte ?",
      has_account: "Déjà un compte ?",
      create: "Créer un compte",
      login_now: "Se connecter",
      welcome_new: "Créez votre compte",
      subtitle_new: "Optimisez votre entreprise avec l'IA dès aujourd'hui",
      name_label: "Nom Complet",
      name_placeholder: "Jean Dupont",
      terms: "Conditions d'utilisation",      privacy: "Confidentialité",
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
      payment_methods_title: "Moyens de Paiement",
      add_card: "Ajouter une Carte",
      add_card_desc: "Entrez les détails de votre nouvelle carte de crédit ou de débit.",
      card_holder: "Nom sur la carte",
      card_number: "Numéro de carte",
      card_cvc: "CVC",
      save_card: "Enregistrer la Carte",
      expires: "Expire",
      primary: "Principal",
      remove: "Supprimer",
      sub_type: "Type d'Abonnement",
      sub_status: "Statut de l'Abonnement",
      sub_active: "Actif",
      sub_basic: "Plan Basique",
      sub_pro: "Édition Plan Professionnel",
      sub_enterprise: "Plan Entreprise Pro",
      total_orders: "Commandes Totales",
      processed_today: "Traitées aujourd'hui",
      revenue_today: "Revenus Aujourd'hui",
      yesterday: "Hier",
      top_product: "Produit Top",
      units_sold: "unités vendues",
      critical_stock: "Stock Critique",
      sales_performance: "Performance des Ventes",
      last_7_days: "7 derniers jours",
      inventory_alerts: "Alertes d'Inventaire",
      critical_items: "Critiques",
      manage_inventory: "Gérer l'Inventaire",
      no_alerts: "Pas d'alertes critiques.",
      smart_plan: "Plan Intelligent",
      ai_prediction_tomorrow: "IA : Prédiction pour Demain",
      max_probability: "Probabilité de vente maximale",
      view_analysis: "Voir l'analyse",
      prediction_desc: "Projetez vos revenus et optimisez votre exploitation en fonction des modèles historiques et des facteurs externes.",
      simulation_scenario: "Scénario de Simulation",
      lift_intensity: "Intensité du Lift",
      simulate_scenario: "Simuler le Scénario",
      projected_peak_hour: "Heure de Pointe Prévue",
      high_demand: "Forte Demande",
      estimated_total_today: "Total Estimé Aujourd'hui",
      model_precision: "Précision du Modèle",
      optimal: "Optimal",
      daily_revenue_projection: "Projection des Revenus Quotidiens",
      based_on_history: "Basé sur le comportement historique por heure",
      ia_strategy: "Stratégie IA",
      today_tip: "Conseil du Jour",
      rain_tip: "Appliquez le scénario **Pluie** pour voir comment une baisse de la demande impacterait votre stock critique.",
      calculating: "Calcul de la tendance...",
      language: "Langue",
      visual_mode: "Mode Visuel",
      system_auto: "Automatique",
      light: "Clair",
      dark: "Sombre",
      measurement_units: "Unités de Mesure",
      metric_kg: "Système (kg)",
      imperial_lb: "Impérial (lb)",
      scenarios: {
        baseline: "Base",
        promo: "Promo",
        rain: "Pluie",
        event: "Événement",
        heatwave: "Canicule",
        monthend: "Fin de Mois"
      },
      inventory_desc: "Contrôle des fournitures, du stock critique et des mouvements.",
      new_item: "Nouvel article",
      insumos_to_deplete: "Fournitures à épuiser",
      total_sku: "Total SKU",
      products_in_catalog: "Produits au catalogue",
      search_insumo_sku: "Chercher par fourniture ou SKU...",
      updated: "Mis à jour",
      current_stock: "Stock actuel",
      inventory_movement: "Mouvement de Stock",
      entry: "Entrée",
      exit: "Sortie",
      adjust: "Ajustement",
      quantity: "Quantité",
      resulting_stock: "Stock Résultant",
      note: "Note",
      optional: "Facultatif",
      eg_purchase: "Ex. Achat hebdomadaire, perte due à la chaleur...",
      confirm_movement: "Confirmer le mouvement",
      search_products: "Rechercher des produits...",
      all_categories: "Toutes les catégories",
      discount: "Remise",
      subtotal: "Sous-total",
      total: "Total",
      checkout_cash: "Encaisser Espèces",
      checkout_card: "Encaisser Carte",
      empty_cart: "Le panier est vide",
      add_items_to_start: "Ajoutez des produits pour commencer una vente.",
      confirm_sale: "Confirmer cette vente ?",
      sale_success: "Vente traitée avec succès !",
      cart: "Panier",
      sales_desc: "Historique, filtres et détails par transaction.",
      export_csv: "Exporter CSV",
      go_to_pos: "Aller au POS",
      search_sales: "Chercher par folio, caissier ou méthode...",
      method: "Méthode",
      all: "Tous",
      cash: "Espèces",
      card: "Carte",
      from: "De",
      to: "À",
      transactions: "Transactions",
      results: "résultats",
      cashier: "Caissier",
      view_detail: "Voir détail",
      summary: "Résumé",
      filtered: "Filtré",
      incomes: "Revenus",
      tickets: "Tickets",
      avg_ticket: "Ticket moyen",
      next: "Suivant",
      export_pdf_desc: "Export PDF, notes et retours",
      connect_billing_desc: "Nous le connecterons lors de l'intégration de la facturation et des règles de caisse.",
      detail: "Détail",
      reprint_ticket: "Réimprimer le ticket",
      store_desc: "Produits, catégories et prix.",
      new_product: "Nouveau produit",
      search_product_category: "Rechercher un produit ou une catégorie...",
      category: "Catégorie",
      all_categories_f: "Toutes",
      available: "Disponibles",
      active_only: "Actifs uniquement",
      sold_out: "Épuisé",
      edit: "Modifier",
      add_to_menu: "Ajouter au menu",
      product: "Produit",
      product_name: "Nom du produit",
      eg_taco: "Ex. Taco al Pastor",
      price_mxn: "Prix (MXN)",
      availability: "Disponibilité",
      show_in_pos: "Afficher dans le POS",
      save_changes: "Enregistrer les modifications",
      cancel: "Annuler",
      processing: "Traitement...",
      portal_ready: "Portail Prêt",
      change: "Changer",
      update: "Mettre à jour",
      configure: "Configurer",
      notifications: "Notifications",
      view_all_reports: "Voir tous les rapports",
      today: "Aujourd'hui",
      items: "articles",
      alert: "Alerte",
      active: "Actif",
      no_data: "Pas de données",
      weekly_summary: "Résumé hebdomadaire",
      menu_title: "Menu",
      suppliers_desc: "Répertoire de contacts, délais de livraison et notes.",
      new_supplier: "Nouveau fournisseur",
      search_suppliers: "Chercher par nom, contact, email...",
      delivery_days: "jours de livraison",
      contact_details: "Détails du contact",
      lead_time: "Délai de livraison",
      days: "jours",
      rating: "Note",
      notes: "Notes",
      no_additional_notes: "Pas de notes additionnelles.",
      history: "Historique",
      last_purchase: "Dernier achat",
      never: "Jamais",
      generate_po: "Générer un bon de commande",
      select_supplier_desc: "Sélectionnez un fournisseur pour voir les détails",
      supplier: "Fournisseur",
      business_name: "Raison Sociale / Nom",
      contact_label: "Contact",
      phone: "Téléphone",
      email: "Email",
      staff_desc: "Gestion des rôles, des accès et de l'activité de l'équipe.",
      new_member: "Nouveau membre",
      search_staff: "Chercher par nom ou rôle...",
      active_now: "Actif maintenant",
      last_active: "Dernière connexion",
      member: "Membre",
      full_name: "Nom complet",
      role: "Rôle",
      status: "Statut",
      active_member: "Membre actif",
      show_in_reports: "Afficher dans les rapports",
      charts_desc: "Analyse visuelle des revenus, des tickets et des produits phares.",
      range_1w: "1 Sem",
      range_1m: "1 Mois",
      range_3m: "3 Mois",
      revenue_vs_tickets: "Revenu vs Tickets",
      temporal_performance: "Performance temporelle",
      top_products_sub: "Par volume (unités)",
      no_top_products: "Aucun produit phare dans cette période.",
      trends_desc: "Découvrez les modèles cachés traités por notre moteur d'IA.",
      insights_relevante: "Insights Pertinents",
      no_insights_data: "Pas assez de données pour générer des informations pour l'instant.",
      opportunities: "Opportunités",
      analyzing_market: "Analyse du marché...",
      waste_analysis: "Analyse des Allergènes et du Gaspillage",
      waste_preventive: "Analyse préventive",
      waste_tip: "Optimisez vos achats en fonction de la projection de la demande hebdomadaire.",
      predictive_info: "Informations prédictives basées sur des données historiques.",
      sales_chart_label: "Ventes",
      tickets_chart_label: "Tickets",
      projection_label: "Projection",
      hour_label: "Heure",
      trends_insights: {
        peak_demand: { title: "Pic de Demande", desc: "À {hour}:00, le flux de clients le plus élevé est historiquement enregistré." },
        no_peak_data: { title: "Pic de Demande", desc: "Pas encore assez de données para identifier les pics de demande." },
        star_product: { title: "Produit Vedette", desc: "{product} est votre produit vedette, en tête de la génération de revenus." },
        no_star_data: { title: "Produit Vedette", desc: "Vos produits les plus populaires apparaîtront ici dès que las ventes commenceront." },
        low_stock: { title: "État des Stocks", desc: "Attention : Vous avez {count} produits en stock critique ou épuisés." },
        stock_healthy: { title: "État des Stocks", desc: "Niveaux de stock sains. Pénuries critiques non détectées aujourd'hui." },
        crossover_promo: { title: "Crossover", desc: "Activer la promotion : Combiner les produits {category} avec des boissons le {day} pour augmenter le ticket moyen." },
        inventory_adjust: { title: "Stock", desc: "Ajuster la commande de fournitures le {day} : la demande de {category} augmente considérablement." },
        waste_prevention: { title: "Gaspillage", desc: "Recommandation : Revoyez l'excédent de {category} en début de semaine pour éviter le gaspillage." },
        days: {
          sunday: "dimanches", monday: "lundis", tuesday: "mardis", wednesday: "mercredis",
          thursday: "jeudis", friday: "vendredis", saturday: "samedis", weekend: "week-ends", peak_days: "jours de pointe"
        }
      },
      reports_desc: "Générez des rapports et exportez.",
      type_label: "Type",
      range_label: "Période",
      generate_btn: "Générer",
      export_pdf_btn: "Exporter PDF",
      from_label: "De",
      to_label: "À",
      preview_label: "Aperçu",
      templates_label: "Modèles",
      auto_label: "Auto",
      click_to_generate: "Générer en un clic.",
      report_types: { sales: "Ventes", inventory: "Inventaire", finance: "Financier" },
      report_ranges: { today: "Aujourd'hui", "7d": "7 jours", "30d": "30 jours", custom: "Personnalisé" },
      templates: { daily_cut: "Clôture quotidienne", weekly_exec: "Hebdomadaire exécutif", critical_inventory: "Inventaire critique", sales_by_product: "Ventes par produit" },
      search_and_roles: "Recherche et rôles",
      permissions_title: "Permissions",
      roles_label: "Rôles",
      new_member_label: "Nouveau membre",
      save_btn: "Enregistrer",
      roles_data: {
        Admin: { title: "Admin", desc: "Accès total, utilisateurs et configuration." },
        Gerente: { title: "Gérant", desc: "Rapports, inventaire, fournisseurs, ajustements." },
        Cajero: { title: "Caissier", desc: "POS et enregistrement des ventes." },
        Cocina: { title: "Cuisine", desc: "Production et consommation (prochainement)." }
      },
      admin_pro: "Administrateur Pro",
      email_field: "Adresse E-mail",
      change_password_field: "Changer le Mot de Passe",
      updated_2_months_ago: "Mis à jour il y a 2 mois",
      change_btn: "Changer",
      update_btn: "Actualiser",
      configure_btn: "Configurer",
      saving_btn: "Enregistrement...",
      portal_ready_btn: "Portail Prêt",
      pass_updated_success: "Mot de passe mis à jour avec succès",
      pass_mismatch_error: "Les mots de passe ne correspondent pas",
      pass_length_error: "Le mot de passe doit comporter au moins 6 caractères",
      generated_at: "Généré"
    },
    docs: {
      title: "Documentation",
      subtitle: "Tout ce que vous devez savoir pour maîtriser SmartFood AI",
      search_placeholder: "Rechercher dans le guide...",
      getting_started: "Premiers Pas",
      core_features: "Fonctionnalités Core",
      ai_intelligence: "Intelligence Artificielle",
      admin_guide: "Administration",
      ai_science: "Science des Données",
      security_privacy: "Sécurité et Confidentialité",
      on_this_page: "Sur cette page",
      features: {
        dashboard: { title: "Dashboard", desc: "Suivez vos mesures en temps réel." },
        prediction: { title: "Prédiction", desc: "Une IA qui anticipe votre demande." },
        sales: { title: "Ventes", desc: "Enregistrez les paiements en quelques secondes." },
        team: { title: "Équipe", desc: "Gérez les accès et les rôles." }
      },
      sections: {
        welcome: {
          title: "Bienvenue sur SmartFood AI",
          content: "SmartFood AI est la plateforme leader pour l'optimisation des cafétérias et des cantines industrielles basée sur l'intelligence artificielle. Notre mission est d'éradiquer le gaspillage alimentaire tout en maximisant la rentabilité des entreprises culinaires grâce à l'utilisation d'algorithmes prédictifs de pointe.",
          items: [
            { title: "Introduction", desc: "SmartFood AI n'est pas seulement un logiciel de point de vente ; c'est un écosystème complet conçu pour aider les gestionnaires de cantines à prendre des décisions éclairées basées sur des données réelles." },
            { title: "Objectif", desc: "Nous visons à réduire le gaspillage de 30 % en moyenne grâce à des prédictions précises qui alignent la production quotidienne sur la demande réelle des convives." },
            { title: "Portée", desc: "Notre solution est évolutive, s'adaptant des petites cafétérias scolaires aux cantines industrielles à grand volume avec plusieurs succursales." },
            { title: "Avantages Clés", desc: "Économies directes sur les matières premières, optimisation du temps du personnel et visualisation claire de la santé financière de l'entreprise." }
          ]
        },
        setup: {
          title: "Configuration Initiale",
          content: "Pour commencer à opérer, il est vital de configurer correctement les bases de votre entreprise sur la plateforme.",
          items: [
            { title: "Profil d'Entreprise", desc: "Complétez vos coordonnées dans 'Mon Compte', en configurant la devise de base, le fuseau horaire et les taxes applicables à votre région." },
            { title: "Structure des Catégories", desc: "Définissez des groupes logiques (ex. Boissons, Plats Principaux, Desserts). Cela aide l'IA à identifier quels types de produits sont les plus performants par saison." },
            { title: "Chargement des Produits", desc: "Ajoutez chaque article de votre menu avec son prix de vente et son coût. Vous pouvez les marquer comme 'disponibles' ou 'en rupture de stock' instantanément." },
            { title: "Inventaire Initial", desc: "Il est fondamental d'enregistrer vos stocks actuels pour que le système commence à vous informer des niveaux critiques dès la première vente." }
          ]
        },
        dashboard_overview: {
          title: "Vue Générale (Home)",
          content: "Le Dashboard est votre centre de commandement. Ici, nous consolidons des milliards de points de données en 4 KPI critiques.",
          items: [
            { title: "Lecture des KPI", desc: "Observez les revenus quotidiens comparés à la veille, le nombre de commandes traitées et le produit vedette de la période." },
            { title: "Alertes Intelligentes", desc: "Le système met automatiquement en évidence les produits qui sont en dessous de leur stock minimum défini pour un achat rapide." },
            { title: "Graphiques de Performance", desc: "Visualisez la tendance des ventes des 7 derniers jours pour comprendre le flux de votre entreprise tout au long de la semaine." },
            { title: "Raccourcis Opérationnels", desc: "Accédez rapidement au POS ou à la gestion des stocks directement depuis les widgets de l'écran d'accueil." }
          ]
        },
        pos: {
          title: "Point de Vente (POS)",
          content: "Notre POS est optimisé pour les flux de transactions élevés et la facilité d'utilisation.",
          items: [
            { title: "Vente Rapide", desc: "Sélectionnez des produits via une grille visuelle ou utilisez un lecteur de code-barres. Le système calcule le total automatiquement." },
            { title: "Remises", desc: "Appliquez facilement des remises en pourcentage sur la facture totale pour des promotions spéciales ou des courtoisies." },
            { title: "Modes de Paiement", desc: "Gérez les paiements en espèces (avec calculateur de monnaie) ou par carte. Chaque méthode est enregistrée pour la clôture de caisse finale." },
            { title: "Gestion du Panier", desc: "Modifiez les quantités, supprimez des articles ou videz le panier d'un seul clic avant de traiter le paiement final." }
          ]
        },
        sales_registry: {
          title: "Registre des Ventes",
          content: "Explorez chaque transaction historique avec des détails médico-légaux pour les audits et les clarifications.",
          items: [
            { title: "Historique Transactionnel", desc: "Liste complète de toutes les ventes avec un folio unique, l'heure exacte, le caissier qui a servi et le montant total." },
            { title: "Filtres Avancés", desc: "Recherchez des ventes spécifiques par plage de dates, mode de paiement ou nom du produit vendu." },
            { title: "Réimpression de Tickets", desc: "Générez des copies numériques ou physiques des tickets passés à tout moment depuis le registre." },
            { title: "Annulation de Ventes", desc: "Possibilité d'annuler des transactions erronées (sous réserve des autorisations Admin) pour corriger l'inventaire." }
          ]
        },
        inventory: {
          title: "Gestion des Stocks",
          content: "Contrôle des fournitures en temps réel pour éviter les ruptures de stock ou le surstockage.",
          items: [
            { title: "Contrôle des Stocks", desc: "Visualisez le 'On Hand' réel de chaque produit. Le système décompte automatiquement les stocks après chaque vente." },
            { title: "Registre des Mouvements", desc: "Tenez un journal de toutes les entrées (achats) et sorties (pertes ou transferts) de stock." },
            { title: "Ajustements Manuels", desc: "Effectuez des corrections de stock après des inventaires physiques pour vous assurer que le système correspond à la réalité." },
            { title: "Alertes de Stock Critique", desc: "Configurez le stock minimum par produit. L'IA vous avertira visuellement lorsqu'un réapprovisionnement est nécessaire." }
          ]
        },
        store: {
          title: "Gestion de Boutique",
          content: "Le catalogue est le cœur de votre exploitation. Gérez vos produits et vos prix.",
          items: [
            { title: "Catalogue Numérique", desc: "Gérez le nom, la catégorie et la disponibilité de tous vos produits en un seul endroit." },
            { title: "Prix et Coûts", desc: "Actualisez vos prix de vente en gros ou individuellement à mesure que vos coûts auprès des fournisseurs changent." },
            { title: "Contrôle de Disponibilité", desc: "Activez ou désactivez des produits pour le POS avec un interrupteur afin que les caissiers ne vendent pas ce qui n'est pas là." },
            { title: "Organisation par Catégories", desc: "Déplacez des produits entre les catégories pour optimiser la navigation sur le POS et les rapports analytiques." }
          ]
        },
        suppliers: {
          title: "Fournisseurs",
          content: "Gérez votre chaîne d'approvisionnement efficacement pour un réapprovisionnement sans friction.",
          items: [
            { title: "Répertoire de Contacts", desc: "Stockez les noms, téléphones et e-mails de vos principaux fournisseurs pour un accès rapide." },
            { title: "Commandes", desc: "Enregistrez quels produits chaque fournisseur vous livre et conservez un historique de vos bons de commande passés." },
            { title: "Délai de Livraison et Évaluation", desc: "Enregistrez le nombre de jours que chaque fournisseur met à livrer et évaluez leur service pour optimiser vos futurs achats." },
            { title: "Historique des Achats", desc: "Consultez combien vous avez acheté à chaque fournisseur pour négocier de meilleurs prix basés sur le volume." }
          ]
        },
        prediction: {
          title: "Prédiction de la Demande",
          content: "Utilisez la puissance de l'IA pour savoir exactement combien cuisiner demain.",
          items: [
            { title: "Modèles Prédictifs", desc: "Nos algorithmes analysent des années de données pour détecter les habitudes de consommation hebdomadaires et mensuelles." },
            { title: "Impact Météo", desc: "L'IA ajuste les prévisions selon la météo. (ex. vendez plus de boissons chaudes les jours froids)." },
            { title: "Simulation de Scénarios", desc: "Testez ce qui se passerait avec vos ventes selon les scénarios 'Pluie', 'Promotion' ou 'Jour Férié'." },
            { title: "Ajustement de la Production", desc: "Recevez des recommandations sur le nombre d'unités à préparer pour chaque plat afin de minimiser le gaspillage." }
          ]
        },
        trends: {
          title: "Analyse des Tendances",
          content: "Découvrez des modèles cachés dans vos données que les rapports traditionnels ne montrent pas.",
          items: [
            { title: "Identification des Modèles", desc: "L'IA détecte quels produits sont généralement vendus ensemble pour suggérer des promotions croisées (Cross-selling)." },
            { title: "Analyse des Heures de Pointe", desc: "Identifiez vos heures de plus forte affluence pour optimiser les horaires du personnel et la préparation des repas." },
            { title: "Recommandations de l'IA", desc: "Recevez des suggestions automatiques pour faire tourner les stocks à faible rotation via des offres." },
            { title: "Opportunités Commerciales", desc: "Détectez des niches mal desservies ou des catégories qui croissent rapidement sur votre marché local." }
          ]
        },
        analytics: {
          title: "Graphiques Avancés",
          content: "Visualisation des données de niveau entreprise pour une compréhension approfondie de l'activité.",
          items: [
            { title: "Revenu vs Transactions", desc: "Comparez l'argent qui entre par rapport au nombre de ventes effectuées pour mesurer le ticket moyen." },
            { title: "Distribution par Catégorie", desc: "Comprenez quel pourcentage de vos revenus provient de chaque groupe de produits (ex. 40 % sont des snacks)." },
            { title: "Volume de Produits", desc: "Analysez quels sont les 5 produits ayant le plus de mouvement pour assurer leur stock prioritaire." },
            { title: "Analyse de Rentabilité", desc: "Croisez vos ventes avec vos coûts enregistrés pour voir la marge bénéficiaire réelle par produit." }
          ]
        },
        reports: {
          title: "Rapports et Exportation",
          content: "Générez des documents officiels prêts à être imprimés ou partagés.",
          items: [
            { title: "Clôtures de Caisse", desc: "Résumés quotidiens qui facilitent le rapprochement des espèces et des cartes à la fin de chaque service." },
            { title: "Rapports d'Inventaire", desc: "Exportez une liste valorisée de vos stocks actuels pour les audits comptables." },
            { title: "Résumé Financier", desc: "Rapports mensuels avec revenus, coûts et pertes pour une vision claire du bénéfice." },
            { title: "Exportation Professionnelle", desc: "Tous les rapports sont générés en PDF avec un design propre, prêt à être envoyé par e-mail." }
          ]
        },
        staff: {
          title: "Gestion du Personnel",
          content: "Gérez votre équipe de travail et contrôlez leurs niveaux d'accès.",
          items: [
            { title: "Contrôle des Utilisateurs", desc: "Créez des comptes individuels pour chaque employé afin que leurs actions soient enregistrées sous leur nom." },
            { title: "Rôles et Permissions", desc: "Attribuez des profils tels que 'Caissier', 'Gérant' ou 'Admin' pour restreindre l'accès aux fonctions sensibles." },
            { title: "Moniteur d'Activité", desc: "Visualisez la dernière fois que chaque utilisateur s'est connecté et quelles transactions il a traitées récemment." },
            { title: "Sécurité de l'Équipe", desc: "Gérez les changements de mots de passe et le départ du personnel de manière centralisée et sécurisée." }
          ]
        },
        account: {
          title: "Mon Compte et Sécurité",
          content: "Gérez votre identité, votre abonnement et vos préférences visuelles.",
          items: [
            { title: "Sécurité des Accès", desc: "Mettez régulièrement à jour votre e-mail et votre mot de passe pour protéger votre portail contre les accès non autorisés." },
            { title: "Gestion de l'Abonnement", desc: "Visualisez votre plan actuel (Basique, Pro ou Entreprise) et restez informé du renouvellement de votre service." },
            { title: "Modes de Paiement", desc: "Ajoutez des cartes de crédit ou de débit pour le paiement automatisé de vos outils SmartFood AI." },
            { title: "Préférences Visuelles", desc: "Configurez le Mode Sombre pour réduire la fatigue visuelle et choisissez vos unités de mesure préférées." }
          ]
        },
        ai_logic: {
          title: "Le Moteur SmartFood",
          content: "Découvrez la science qui alimente nos prédictions avec une précision de 94 %.",
          items: [
            { title: "Algorithmes Utilisés", desc: "Nous combinons la régression linéaire pour les tendances et les réseaux de neurones LSTM pour les modèles temporels complexes." },
            { title: "Traitement des Données", desc: "Vos données sont nettoyées et anonymisées avant d'être traitées sur nos serveurs haute performance." },
            { title: "Variables Externes", desc: "Nous injectons des données provenant d'API météo et de calendriers d'événements locaux pour affiner les prévisions." },
            { title: "Entraînement du Modèle", desc: "L'IA apprend de vos ventes quotidiennes ; plus vous utilisez le système, plus les prédictions seront précises." }
          ]
        },
        security_tech: {
          title: "Architecture de Sécurité",
          content: "Vos données sont votre atout le plus précieux. Nous les protégeons avec des normes bancaires.",
          items: [
            { title: "Isolation des Données", desc: "Nous mettons en œuvre une architecture Multi-Tenant qui garantit que vos informations ne se mélangent jamais à celles d'autres entreprises." },
            { title: "Chiffrement de Bout en Bout", desc: "Toute communication entre le tableau de bord et le serveur voyage chiffrée via les derniers protocoles TLS 1.3." },
            { title: "Conformité et Confidentialité", desc: "Nous respectons les réglementations sur la protection des données, garantissant que vous seul avez le contrôle sur vos informations commerciales." },
            { title: "Sauvegardes Automatiques", desc: "Nous effectuons des sauvegardes toutes les 24 heures pour que votre entreprise ne perde jamais son historique opérationnel en cas de défaillance." }
          ]
        }
      }
    }
  },
} as const;

const LangCtx = createContext<{ lang: Lang; t: any; setLang: (l: Lang) => void }>({
  lang: "es", t: T["es"], setLang: () => { },
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

  const t = T[lang] as unknown as Translation;

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
