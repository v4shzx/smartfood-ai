from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.router import api_router
from app.core.config import settings

def get_application() -> FastAPI:
    _app = FastAPI(
        title=settings.PROJECT_NAME,
        openapi_url=f"{settings.API_V1_STR}/openapi.json"
    )

    # Set all CORS enabled origins
    if settings.BACKEND_CORS_ORIGINS:
        # CORS configuration
        origins = [str(origin) for origin in settings.BACKEND_CORS_ORIGINS]
        # Si estamos en Railway, nos aseguramos de permitir el dominio
        if not origins:
            origins = ["*"] # Fallback para asegurar que funcione en el primer despliegue

        _app.add_middleware(
            CORSMiddleware,
            allow_origins=origins,
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )    else:
        # Default CORS for development if no origins specified
        _app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

    _app.include_router(api_router, prefix=settings.API_V1_STR)

    return _app

app = get_application()

@app.get("/health")
async def health_check():
    return {"status": "healthy", "project": settings.PROJECT_NAME}
