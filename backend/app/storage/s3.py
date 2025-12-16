import boto3
import os
from dotenv import load_dotenv
from fastapi import UploadFile
import uuid
load_dotenv()

BUCKET_NAME = os.getenv("S3_BUCKET")

def get_s3_client():
    return boto3.client(
        "s3",
        endpoint_url=os.getenv("ENDPOINT"),
        region_name=os.getenv("REGION"),
        aws_access_key_id=os.getenv("ACCESS_KEY_ID"),
        aws_secret_access_key=os.getenv("ACCESS_KEY"),
    )

class S3Storage:
    def save_file(self, file: UploadFile):
        s3 = get_s3_client()

        key = f"{uuid.uuid4()}-{file.filename}"

        s3.put_object(
            Bucket=BUCKET_NAME,
            Key=key,
            Body=file.file,
            ContentType=file.content_type,
        )
        file_url = f"{os.getenv('ENDPOINT')}/{BUCKET_NAME}/{key}"

        return file_url

