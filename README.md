Dependencias : pip install fastapi uvicorn sqlalchemy psycopg2-binary pandas scikit-learn prophet python-dotenv

# 🧠 SmartFood AI

Plataforma administrativa que analiza ventas históricas y condiciones climáticas para estimar la demanda diaria de alimentos y sugerir ajustes automáticos de inventario mediante gráficas comparativas. Ademas de integrar IA.

---

## 🚀 Features

- 🤖 Análisis de alimentos mediante inteligencia artificial
- 🥗 Recomendaciones nutricionales personalizadas
- 📊 Dashboard interactivo con visualización de datos
- 🔐 Sistema de autenticación de usuarios
- ⚡ Arquitectura moderna (frontend + backend desacoplado)
- 🌐 Interfaz web responsive y escalable

---

## 🛠️ Tech Stack

**Frontend**

- React / Next.js
- TailwindCSS
- Axios

**Backend**

- Python (FasAPI)

**Inteligencia Artificial**

- OpenAI API / modelos personalizados

**Base de datos**

- PostgreSQL

---

**Descripción:**

- El frontend consume la API REST
- El backend procesa solicitudes y se comunica con la IA
- La IA genera respuestas inteligentes
- Los datos se almacenan en la base de datos



## 🛠️ Guía de Desarrollo

Para mantener la consistencia entre diferentes computadoras y evitar cambios innecesarios en el repositorio, sigue estas reglas:

1. **Gestión de dependencias**: El archivo `package-lock.json` está bajo seguimiento de Git. **No lo ignores**.
2. **Instalación limpia**: Cuando descargues el proyecto en una nueva computadora o cambies de rama, utiliza siempre:
   ```bash
   cd frontend
   npm ci
   ```
   *Nota: `npm ci` es más rápido y asegura que instales exactamente las mismas versiones que están registradas en el repositorio, sin modificar el archivo de bloqueo.*
3. **Nuevas librerías**: Usa `npm install <nombre>` solo cuando necesites agregar una nueva dependencia. En ese caso, sí deberás commitear los cambios resultantes en el `package-lock.json`.

## 🛠️ Guía de Inicio Rápido (Scripts Multiplataforma)

Hemos simplificado el proceso de configuración mediante scripts que funcionan en Windows (PowerShell), Mac y Linux (Bash).

### 🛠️ Entorno de Desarrollo (con Hot-Reload)
Este script levanta la base de datos, espera a que esté lista, crea el esquema e inyecta los datos de prueba (Seed).

- **Windows (PS)**: `.\scripts\launch-dev.ps1`
- **Mac / Linux (Bash)**: `./scripts/launch-dev.sh` (Recuerda dar permisos con `chmod +x scripts/*.sh`)

### 🚀 Despliegue de Producción
Este script construye las imágenes finales, aplica las migraciones de Alembic y limpia archivos temporales.

- **Windows (PS)**: `.\scripts\launch-prod.ps1`
- **Mac / Linux (Bash)**: `./scripts/launch-prod.sh`

---

### 🌐 Acceso a los Servicios

Una vez que los servicios estén activos:

- **Frontend (Aplicación)**: [http://localhost:3000](http://localhost:3000)
- **Backend (API + Swagger/Docs)**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Gestor de Base de Datos (pgAdmin)**: [http://localhost:5050](http://localhost:5050)
  - **Email**: `admin@smartfood.ai`
  - **Password**: `admin`

---

## 🗄️ Gestión de Base de Datos

Los archivos SQL de referencia se han consolidado en el backend para una mejor organización.

- **Ubicación**: `backend/db/sql/`
- **Esquema**: `schema.sql` (Define tablas de usuarios, productos, ventas, etc.)
- **Semillas**: `seed_data.sql` (Datos de ejemplo para el Demo)

### 🔍 Consultar datos en pgAdmin (Visual)

1. **Registrar Servidor**: Clic derecho en `Servers` -> `Register` -> `Server`.
2. **Conexión**:
   - **Host name**: `db`
   - **Maintenance database**: `smartfood`
   - **Username**: `postgres`
   - **Password**: `postgres` (o el indicado en tu `.env`)
3. **Explorar**: Navega por `Databases` -> `smartfood` -> `Schemas` -> `public` -> `Tables`.

### 🔍 Consultar datos en pgAdmin (Visual)

1. **Registrar Servidor**: Clic derecho en `Servers` -> `Register` -> `Server`.
   - **General**: Name = `SmartFood DB`
   - **Connection**:
     - Host name = `db` (¡Importante!)
     - Maintenance database = `smartfood_db`
     - Username = `smartfood`
     - Password = `password`
2. **Localizar Tablas**: Navega por `Databases` -> `smartfood_db` -> `Schemas` -> `public` -> `Tables`.
3. **Ver Datos**: Clic derecho en una tabla (ej. `students`) -> `View/Edit Data` -> `All Rows`.

---

## 👨‍💻 Autor

**Alejandro Balderas**
Proyecto desarrollado como solución tecnológica basada en inteligencia artificial para optimizar la alimentación.

---

## ⭐ Notas Finales

SmartFood AI es un proyecto en evolución enfocado en combinar tecnología, salud y datos para crear soluciones inteligentes. Si te interesa colaborar o mejorar el sistema, eres bienvenido.

---
