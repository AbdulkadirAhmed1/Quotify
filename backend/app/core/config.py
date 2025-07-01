#/backend/app/core/config.py
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    mongo_uri: str

    model_config = SettingsConfigDict(extra="ignore")  # Ignore unknown .env fields

settings = Settings()
