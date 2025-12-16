# main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from pathlib import Path

from app.db.database import engine
from app.models import models
from app.db.init_db import get_db
from app.db.seed import seed_machine
from app.db.seed_product import seed_products
from app.db.seed_balance import seed_balance

from app.middleware.auth_middleware import JWTAuthMiddleware
from app.routers.auth_router import router as auth_router
from app.routers.vending_router import router as vending_router
from app.routers.admin_router import router as admin_router


BASE_DIR = Path(__file__).resolve().parent.parent


@asynccontextmanager
async def lifespan(app: FastAPI):
    models.Base.metadata.create_all(bind=engine)

    db = next(get_db())
    try:
        seed_machine(db)
        seed_products(db)
        seed_balance(db)
    finally:
        db.close()

    yield


app = FastAPI(
    root_path="/api/v1",
    lifespan=lifespan,
)

app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(vending_router, prefix="/vending", tags=["Vending"])
app.include_router(admin_router, prefix="/admin", tags=["Admin"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    JWTAuthMiddleware,
    protected_paths=["/api/v1/admin"],
)

app.mount(
    "/images",
    StaticFiles(directory=BASE_DIR / "images"),
    name="images",
)

@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok"}
