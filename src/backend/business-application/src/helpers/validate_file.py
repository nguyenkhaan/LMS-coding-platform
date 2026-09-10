# Dell biet viet gi 

from fastapi import HTTPException, UploadFile
from src.cores.settings import MAX_TESTCASE_FILE_SIZE_MB
import re 

MAX_FILE_SIZE = MAX_TESTCASE_FILE_SIZE_MB * 1024 * 1024
ALLOWED_EXTENSIONS = [".txt", ".in", ".out"]
ALLOWED_MIME_TYPES = ["text/plain"]

def validate_file(file: UploadFile , regex):
    if not file:
        raise HTTPException(status_code=400, detail="File is missing")

    filename = file.filename or ""
    true_name = filename.rsplit(".", 1)[0] 
    if not re.fullmatch(regex, true_name): 
        raise HTTPException(
            status_code = 400, 
            detail = "Invalid file name format"
        )
    ext = ""
    if "." in filename:
        ext = "." + filename.rsplit(".", 1)[1].lower()
  
    if ext not in ALLOWED_EXTENSIONS or file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(status_code=400, detail=f"Invalid file type for {filename}")
        
    if file.size is not None and file.size > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail=f"File {filename} exceeds {MAX_TESTCASE_FILE_SIZE_MB}MB limit")