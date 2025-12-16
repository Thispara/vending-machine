import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = (
    f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}"
    f"@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
)

# DATABASE_URL = "postgresql+psycopg2://postgres:postgres@localhost:55432/vending"
DEFAULT_MACHINE_ID = "00000000-0000-0000-0000-000000000001"
BASE_URL = "http://localhost:8000/api/v1"