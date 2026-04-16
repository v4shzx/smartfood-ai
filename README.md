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

4. **Entornos de Docker**:
   - Para **Desarrollo** (con hot-reload):
     ```bash
     docker-compose -f docker-compose.dev.yml up --build
     ```
   - Para **Producción**:
     ```bash
     docker-compose up --build
     ```

### 🌐 Acceso a los Servicios

Una vez que los contenedores estén corriendo, puedes acceder a los siguientes servicios en tu navegador:

- **Frontend (Aplicación)**: [http://localhost:3000](http://localhost:3000)
- **Backend (API + Swagger/Docs)**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Gestor de Base de Datos (pgAdmin)**: [http://localhost:5050](http://localhost:5050)
  - **Email**: `admin@smartfood.ai`
  - **Password**: `admin`

---

## 👨‍💻 Autor

**Alejandro Balderas**
Proyecto desarrollado como solución tecnológica basada en inteligencia artificial para optimizar la alimentación.

---

## ⭐ Notas Finales

SmartFood AI es un proyecto en evolución enfocado en combinar tecnología, salud y datos para crear soluciones inteligentes. Si te interesa colaborar o mejorar el sistema, eres bienvenido.

---
