from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .base import Base

# Local SQLite DB — can switch to PostgreSQL/MySQL later
SQLALCHEMY_DATABASE_URL = "sqlite:///./ideas.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    """Creates all tables if they don’t exist."""
    Base.metadata.create_all(bind=engine)