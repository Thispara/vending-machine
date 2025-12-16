from fastapi import APIRouter, Depends, Request, Response, HTTPException
from app.schemas.schemas import UserLogin, UserRegister
from app.service.auth_service import AuthService
from app.db.init_db import get_db
from sqlalchemy.orm import Session
from app.service.auth_service import create_access_token, create_refresh_token, check_password
from datetime import timedelta

router = APIRouter(tags=["Auth"])

def get_auth_service(db: Session = Depends(get_db)) -> AuthService:
    return AuthService(db)

@router.post("/login")
def login(payload: UserLogin, response: Response, service: AuthService = Depends(get_auth_service)):
    user = service.validate_user(payload.username)
    if not user:
        raise HTTPException(status_code=401)
    if not check_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401)
    access_token = create_access_token(
    data={"sub": str(user.id), "role": "admin"},
    expires_delta=timedelta(minutes=1),
)

    refresh_token = create_refresh_token(
    data={"sub": str(user.id), "role": "admin"},
    expires_delta=timedelta(days=7),
)

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,        # prod = True
        samesite="lax",
        max_age=60 * 15
    )

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=60 * 60 * 24 * 7
    )

    return {"message": "login success"}

@router.post("/refresh")
def refresh(request: Request, response: Response, service: AuthService = Depends(get_auth_service)):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=401)

    token = service.refresh_token(refresh_token)

    response.set_cookie(
        key="access_token",
        value=new_access,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=60 * 15
    )

    return {"message": "refreshed"}

@router.post("/register")
def register(user: UserRegister, service: AuthService = Depends(get_auth_service)):
    return service.register(user)

@router.post("/logout")
def logout(
    request: Request,
    response: Response,
    service: AuthService = Depends(get_auth_service),
):
    refresh_token = request.cookies.get("refresh_token")
    access_token = request.cookies.get("access_token")

    if refresh_token:
        service.revoke_token(refresh_token)
    if access_token:
        service.revoke_token(access_token)

    response.delete_cookie(
        key="refresh_token",
        path="/",
        httponly=True,
    )
    response.delete_cookie(
        key="access_token",
        path="/",
        httponly=True,
    )

    return {"message": "logout success"}




