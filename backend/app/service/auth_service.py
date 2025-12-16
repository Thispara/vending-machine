import hmac
import hashlib
import os
from dotenv import load_dotenv
from datetime import timedelta, datetime
import jwt
from sqlalchemy.orm import Session
from app.models.models import UserModel
from app.schemas.schemas import UserLogin, UserRegister

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY_JWT")
ALGORITHM = "HS256"

KEY = os.getenv("HASHED_PASSWORD_KEY")

def check_password(password: str, hashed_password: str) -> bool:
    return hmac.compare_digest(hmac.new(KEY.encode(), password.encode(), hashlib.sha256).hexdigest(), hashed_password)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=1)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=7)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

class AuthService:
    def __init__(self, db: Session):
        self.db = db
    
    def login(self, user: UserLogin) -> dict:
        db_user = self.db.query(UserModel).filter(UserModel.username == user.username).first()
        if not db_user:
            return {"status": "error", "message": "User not found"}
        if not check_password(user.password, db_user.hashed_password):
            return {"status": "error", "message": "Incorrect password"}
        access_token_expires = timedelta(minutes=60)
        refresh_token_expires = timedelta(days=1)

        access_token = create_access_token(
            data={"sub": db_user.id}, expires_delta=access_token_expires
        )
        refresh_token = create_refresh_token(
            data={"sub": db_user.id}, expires_delta=refresh_token_expires
        )

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "expires_in": int(access_token_expires.total_seconds()),
        }
        
    def refresh_token(self, refresh_token: str) -> dict:
        try:
            payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id = payload.get("sub")
            if user_id is None:
                raise HTTPException(status_code=401, detail="Invalid authentication credentials")
            db_user = self.db.query(UserModel).filter(UserModel.id == user_id).first()
            if not db_user:
                raise HTTPException(status_code=401, detail="Invalid authentication credentials")
            access_token_expires = timedelta(minutes=60)
            refresh_token_expires = timedelta(days=1)

            access_token = create_access_token(
                data={"sub": db_user.id}, expires_delta=access_token_expires
            )
            refresh_token = create_refresh_token(
                data={"sub": db_user.id}, expires_delta=refresh_token_expires
            )

            return {
                "access_token": access_token,
                "refresh_token": refresh_token,
                "token_type": "bearer",
                "expires_in": int(access_token_expires.total_seconds()),
            }
        except JWTError:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    def register(self, user: UserRegister) -> dict:
        db_user = self.db.query(UserModel).filter(UserModel.username == user.username).first()
        if db_user:
            return {"status": "error", "message": "User already exists"}
        try:
            hashed_password = hmac.new(KEY.encode(), user.password.encode(), hashlib.sha256).hexdigest()
            new_user = UserModel(username=user.username, hashed_password=hashed_password)
            self.db.add(new_user)
            self.db.commit()
            return {"status": "success", "message": "User registered successfully"}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    def validate_user(self, username: str) -> UserModel | None:
        return self.db.query(UserModel).filter(UserModel.username == username).first()

    def revoke_token(self, token: str) -> None:
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id = payload.get("sub")
            if user_id is None:
                raise HTTPException(status_code=401, detail="Invalid authentication credentials")
            db_user = self.db.query(UserModel).filter(UserModel.id == user_id).first()
            if not db_user:
                raise HTTPException(status_code=401, detail="Invalid authentication credentials")
            db_user.refresh_token = None
            self.db.commit()
        except JWTError:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    