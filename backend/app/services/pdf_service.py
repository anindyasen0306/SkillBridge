"""
PDF text extraction service using pdfplumber.
Handles multi-page PDFs, cleans whitespace, and validates file type.
"""

import io
import pdfplumber
from fastapi import HTTPException, UploadFile


from app.core.config import settings

MAX_FILE_SIZE_BYTES = settings.MAX_FILE_SIZE_MB * 1024 * 1024  # 10 MB


async def extract_text_from_pdf(file: UploadFile) -> str:
    """
    Read an uploaded PDF and return extracted text.
    Raises HTTP 400 for wrong file type or empty content.
    Raises HTTP 413 if file exceeds size limit.
    """
    if not (file.filename or "").lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted.")

    content = await file.read(MAX_FILE_SIZE_BYTES + 1)

    if len(content) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(status_code=413, detail=f"File too large. Max {settings.MAX_FILE_SIZE_MB} MB.")

    if len(content) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    try:
        with pdfplumber.open(io.BytesIO(content)) as pdf:
            pages_text = []
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    pages_text.append(text.strip())

        full_text = "\n\n".join(pages_text)

        if not full_text.strip():
            raise HTTPException(
                status_code=400,
                detail="Could not extract text from PDF. The file may be scanned/image-only.",
            )

        return full_text

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid or unreadable PDF.")
