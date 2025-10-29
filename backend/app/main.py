from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.session import init_db
from app.api.routes import advice, saved_advice


def create_application() -> FastAPI:
    """
    Application factory pattern.
    Creates and configures the FastAPI application.
    """
    # Initialize FastAPI app
    app = FastAPI(
        title=settings.PROJECT_NAME,
        openapi_url=f"{settings.API_V1_STR}/openapi.json"
    )

    # Configure CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Initialize database
    init_db()

    # Include routers
    app.include_router(
        advice.router,
        prefix=f"{settings.API_V1_STR}",
        tags=["advice"]
    )
    app.include_router(
        saved_advice.router,
        prefix=f"{settings.API_V1_STR}/saved-advice",
        tags=["saved-advice"]
    )

    # Root endpoint
    @app.get("/")
    def read_root():
        return {
            "status": "API is running!",
            "message": "Use POST /api/advice to get advice",
            "docs": "/docs"
        }

    # Health check endpoint
    @app.get("/health")
    def health_check():
        return {"status": "healthy"}

    return app


# Create application instance
app = create_application()
