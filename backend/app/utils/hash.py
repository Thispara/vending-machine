import os
import hmac
import hashlib
from dotenv import load_dotenv
load_dotenv()

KEY = os.getenv("HASHED_PASSWORD_KEY")
password = "StrongPassword123!"

if KEY is None:
    raise ValueError("HASHED_PASSWORD_KEY environment variable not set.")

hashed_password = hmac.new(KEY.encode(), password.encode(), hashlib.sha256).hexdigest()
already_hashed = "39c27b1990d228b5f46042e05e20fac0c3840e8a830b4cb41f95042ef3955175"
print(hashed_password)
