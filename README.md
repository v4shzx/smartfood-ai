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

### ⚙️ Configuración del entorno (`.env`)

Antes de levantar los servicios, crea el archivo `.env` en `backend/` copiando el ejemplo:

```bash
# Windows (PowerShell)
Copy-Item backend\.env.example backend\.env

# Mac / Linux
cp backend/.env.example backend/.env
```

> ⚠️ **Importante:** Las credenciales del `.env` **deben coincidir exactamente** con las del `docker-compose.yml`. Si alguna vez cambias `POSTGRES_PASSWORD`, debes bajar los servicios con `docker-compose down -v` (borra el volumen) y volver a levantar; de lo contrario PostgreSQL usará la contraseña almacenada en el volumen anterior y se producirá un error de autenticación.

### 🔍 Consultar datos en pgAdmin (Visual)

1. **Registrar Servidor**: Clic derecho en `Servers` → `Register` → `Server`.
   - **General** → Name: `SmartFood DB`
   - **Connection**:
     - **Host name**: `db` _(nombre del servicio Docker, no `localhost`)_
     - **Port**: `5432`
     - **Maintenance database**: `smartfood`
     - **Username**: `postgres`
     - **Password**: `postgres` _(o el valor de `POSTGRES_PASSWORD` en tu `.env`)_
2. **Explorar tablas**: Navega por `Databases` → `smartfood` → `Schemas` → `public` → `Tables`.
3. **Ver datos**: Clic derecho en una tabla → `View/Edit Data` → `All Rows`.

---

## 🔧 Solución de Problemas

### ❌ `FATAL: password authentication failed for user "postgres"` en pgAdmin

Este error ocurre cuando el volumen de Docker tiene una contraseña antigua que no coincide con la del `.env` / `docker-compose.yml`.

**Solución (borra solo los datos, no el código):**

```powershell
# 1. Bajar contenedores Y eliminar el volumen de datos
docker-compose down -v

# 2. Volver a levantar (crea el volumen limpio con las credenciales correctas)
docker-compose up -d
```

> En desarrollo esto es seguro porque los datos se recargan con `seed_data.sql`.

---

## 👨‍💻 Autor

**Alejandro Balderas**
Proyecto desarrollado como solución tecnológica basada en inteligencia artificial para optimizar la alimentación.

---

## ⭐ Notas Finales

SmartFood AI es un proyecto en evolución enfocado en combinar tecnología, salud y datos para crear soluciones inteligentes. Si te interesa colaborar o mejorar el sistema, eres bienvenido.

---
