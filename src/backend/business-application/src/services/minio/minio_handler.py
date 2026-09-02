import random 
from datetime import datetime, timedelta
import uuid 
from minio import Minio

from src.cores.settings import MINIO_ACCESS_KEY, MINIO_BUCKET_NAME, MINIO_SECRET_KEY, MINIO_URL 

class MinioHandler(): 
    def __init__(self): 
        self.minio_url = MINIO_URL
        self.access_key = MINIO_ACCESS_KEY 
        self.secret_key = MINIO_SECRET_KEY 
        self.bucket_name = MINIO_BUCKET_NAME
        self.client = Minio(
            self.minio_url,
            access_key=self.access_key,
            secret_key=self.secret_key,
            secure=False,
        )
    def presigned_get_object(self, bucket_name, object_name):
        # Request URL expired after 7 days
        url = self.client.presigned_get_object(
            bucket_name=bucket_name,
            object_name=object_name,
            expires=timedelta(days=7)
        )
        return url

    def check_file_name_exists(self, bucket_name, file_name):
        try:
            self.client.stat_object(bucket_name=bucket_name, object_name=file_name)
            return True
        except Exception as e:
            print(f'[x] Exception: {e}')
            return False
    def put_object(self, file_data, file_name, content_type):
        try:
            datetime_prefix = datetime.now().strftime("%d-%m-%Y_%H-%M-%S")
            random_string = str(uuid.uuid4().hex)
            object_name = f"{datetime_prefix}___{file_name}___{random_string}"
            while self.check_file_name_exists(bucket_name=self.bucket_name, file_name=object_name):
                random_prefix = random.randint(1, 1000)
                object_name = f"{datetime_prefix}___{random_prefix}___{file_name}"

            self.client.put_object(
                bucket_name=self.bucket_name,
                object_name=object_name,
                data=file_data,
                content_type=content_type,
                length=-1,
                part_size=10 * 1024 * 1024
            )
            url = self.presigned_get_object(bucket_name=self.bucket_name, object_name=object_name)
            data_file = {
                'bucket_name': self.bucket_name,
                'file_name': object_name,
                'url': url
            }
            return data_file
        except Exception as e:
            raise Exception(e)