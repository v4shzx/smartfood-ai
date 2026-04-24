import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.router import api_router
from app.core.config import settings

logger = logging.getLogger("smartfood.runtime")


def _detect_optional_ai_runtime() -> dict:
    runtime = {
        "pandas_available": False,
        "prophet_available": False,
    }

    try:
        import pandas  # noqa: F401
        runtime["pandas_available"] = True
    except ImportError:
        runtime["pandas_available"] = False

    try:
        from prophet import Prophet  # noqa: F401
        runtime["prophet_available"] = True
    except ImportError:
        runtime["prophet_available"] = False

    return runtime


AI_RUNTIME = _detect_optional_ai_runtime()


def get_application() -> FastAPI:
    _app = FastAPI(
        title=settings.PROJECT_NAME,
        openapi_url=f"{settings.API_V1_STR}/openapi.json"
    )

    # CORS configuration
    origins = []
    if settings.BACKEND_CORS_ORIGINS:
        origins = [str(origin) for origin in settings.BACKEND_CORS_ORIGINS]
    
    # If no origins specified or empty, allow all (useful for Railway/Dev)
    if not origins:
        origins = ["*"]

    _app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    _app.include_router(api_router, prefix=settings.API_V1_STR)

    return _app

app = get_application()


@app.on_event("startup")
async def log_runtime_capabilities() -> None:
    logger.warning(
        "AI runtime status | pandas_available=%s | prophet_available=%s",
        AI_RUNTIME["pandas_available"],
        AI_RUNTIME["prophet_available"],
    )


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "project": settings.PROJECT_NAME,
        "ai_runtime": AI_RUNTIME,
    }
