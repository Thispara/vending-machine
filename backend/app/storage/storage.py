import os
from app.storage.local import LocalStorage
from app.storage.s3 import S3Storage

def get_storage():
    if os.getenv("STORAGE_DRIVER") == "s3":
        return S3Storage()
    return LocalStorage()