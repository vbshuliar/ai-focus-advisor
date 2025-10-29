import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


class Settings:
    """Application settings"""

    # API Settings
    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "AI Focus Advisor"

    # OpenAI Settings
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL: str = "gpt-4o-mini"
    OPENAI_TEMPERATURE: float = 0.7
    OPENAI_MAX_TOKENS: int = 300

    # CORS Settings
    BACKEND_CORS_ORIGINS: list = ["*"]  # In production, specify your frontend URL

    # Database Settings
    DATABASE_URL: str = "sqlite:///./ideas.db"


settings = Settings()
