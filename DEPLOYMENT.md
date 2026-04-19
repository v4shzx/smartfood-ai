# Guía de Despliegue - SmartFood AI

Este documento detalla la arquitectura técnica y los pasos necesarios para desplegar **SmartFood AI** en un entorno de producción real.

## 🛠 Stack Tecnológico Actual

Para buscar un proveedor adecuado, es fundamental conocer las tecnologías que componen el proyecto:

### Frontend
- **Framework:** Next.js 16+ (React 19)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS (versión 4)
- **Librerías Clave:** Framer Motion (animaciones), Recharts (gráficas), Lucide React (iconos).
- **Consumo de API:** Fetch API / Hooks personalizados.

### Backend
- **Framework:** FastAPI (Python 3.x)
- **Servidor ASGI:** Uvicorn (Desarrollo) / Gunicorn con Uvicorn workers (Producción recomendado).
- **ORM:** SQLAlchemy con soporte para PostgreSQL.
- **Migraciones:** Alembic.
- **Autenticación:** JWT (JSON Web Tokens).

### Base de Datos
- **Motor:** PostgreSQL 15+
- **Administración:** pgAdmin 4 (opcional en producción).

### Infraestructura
- **Contenerización:** Docker y Docker Compose.
- **Orquestación:** Preparado para Docker Swarm o Kubernetes si fuera necesario.

---

## 🚀 Requisitos para el Proveedor de Hosting

Al buscar un host, asegúrate de que cumpla con estos requisitos mínimos:

1.  **Soporte Docker:** Fundamental si deseas usar tu configuración actual sin cambios mayores.
2.  **Base de Datos Gestionada:** Recomendado para evitar pérdida de datos y facilitar backups.
3.  **Certificado SSL (HTTPS):** Obligatorio para la seguridad de los datos de la cafetería.
4.  **Variables de Entorno:** Panel para gestionar secretos (claves de API, contraseñas de DB) de forma segura.

---

## 🏗️ Opciones de Despliegue Recomendadas

### Opción 1: Híbrida (Vercel + Railway) - *La más rápida*
- **Frontend en Vercel:** Es el hogar natural de Next.js. Ofrece CI/CD automático, CDN global y SSL gratuito.
- **Backend y DB en Railway:** Excelente soporte para FastAPI y PostgreSQL. Se integra fácilmente con GitHub.

### Opción 2: Todo-en-uno con Docker (DigitalOcean / Hetzner + Coolify)
- Compras un VPS (Servidor Privado Virtual).
- Instalas **Coolify** (una alternativa de código abierto a Heroku/Vercel).
- Despliegas tus contenedores directamente. Es la opción más económica a largo plazo.

### Opción 3: Cloud Nativo (AWS / Google Cloud)
- **AWS App Runner** para el backend y **Vercel** para el frontend.
- **AWS RDS** para la base de datos PostgreSQL.
- Ideal para escalabilidad masiva, pero requiere más configuración.

---

## 📋 Lista de Ajustes para Producción

Antes de lanzar, verifica estos cambios:

- [ ] **Configurar CORS:** Cambiar `allow_origins=["*"]` por el dominio real del frontend en el backend.
- [ ] **Variables de Entorno:**
    *   `NEXT_PUBLIC_API_URL`: Dirección pública de la API del backend.
    *   `SECRET_KEY`: Una cadena aleatoria larga para firmar los tokens JWT.
    *   `POSTGRES_PASSWORD`: Cambiar la contraseña por defecto por una segura.
- [ ] **SSL/HTTPS:** Asegurarse de que tanto el front como el back funcionen bajo `https://`.
- [ ] **Base de Datos:** Ejecutar las migraciones de Alembic en el servidor de producción.
- [ ] **Logs y Monitoreo:** Configurar un servicio como Sentry o Datadog para detectar errores en tiempo real.

---

## 💡 Consejos de Seguridad
*   Nunca subas el archivo `.env` al repositorio público.
*   Usa contraseñas complejas para la base de datos.
*   Mantén las dependencias actualizadas (`npm audit` y `pip list --outdated`).
