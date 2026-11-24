from sqlalchemy import create_engine, event
from sqlalchemy.engine import Engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

# https://youtu.be/NvOV3ig2tGY
DATABASE_URL = "sqlite:///library.db"

engine = create_engine(DATABASE_URL, echo=False)
SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)

@event.listens_for(Engine, "connect")
def set_sqlite_pragma(dbConnection, connection_record):
    cursor = dbConnection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()

class Base(DeclarativeBase):
    pass

def initializeDB() -> None :
    import schemas
    Base.metadata.create_all(bind=engine)