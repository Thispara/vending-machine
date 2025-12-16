from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import DATABASE_URL

# Create a SQLAlchemy engine
engine = create_engine(DATABASE_URL)

# Create a session local class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create a declarative base class
Base = declarative_base()