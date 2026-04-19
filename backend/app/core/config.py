from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

class Settings(BaseSettings):
    PROJECT_NAME: str = "SmartFood AI API"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "super-secret-key-change-it-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    
    # CORS
    BACKEND_CORS_ORIGINS: List[Union[str, AnyHttpUrl]] = []

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        return v

    # Database
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "smartfood"
    DATABASE_URL: str | None = None

    @property
    def async_database_url(self) -> str:
        if self.DATABASE_URL:
            # Handle both postgres:// and postgresql:// from Railway/Heroku
            url = self.DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")
            if "postgresql+asyncpg://" not in url:
                url = url.replace("postgres://", "postgresql+asyncpg://")
            
            # If it's a production URL (contains a cloud host), ensure SSL is handled
            # asyncpg uses 'ssl' parameter instead of 'sslmode'
            if "railway.app" in url or "amazonaws.com" in url:
                if "ssl=" not in url:
                    separator = "&" if "?" in url else "?"
                    url = f"{url}{separator}ssl=True"
            return url
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}/{self.POSTGRES_DB}"

    model_config = SettingsConfigDict(case_sensitive=True, env_file=".env")

@lru_cache()
def get_settings() -> Settings:
    return Settings()

settings = get_settings()
