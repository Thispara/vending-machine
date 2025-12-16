from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from jose import JWTError, jwt
import os

SECRET_KEY = os.getenv("SECRET_KEY_JWT")
ALGORITHM = "HS256"


class JWTAuthMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, protected_paths: list[str]):
        super().__init__(app)
        self.protected_paths = protected_paths

    async def dispatch(self, request: Request, call_next):
        if request.method == "OPTIONS":
            return await call_next(request)

        if not any(request.url.path.startswith(p) for p in self.protected_paths):
            return await call_next(request)

        token = request.cookies.get("access_token")

        if not token:
            return JSONResponse(
                status_code=401,
                content={"detail": "Not authenticated"},
            )

        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            request.state.user = payload
        except JWTError:
            return JSONResponse(
                status_code=401,
                content={"detail": "Invalid or expired token"},
            )

        return await call_next(request)
