from pydantic import BaseModel, HttpUrl
from typing import Optional

class AnalyzeRequest(BaseModel):
    url: str  # Accept str, validate shape in route

class VideoResult(BaseModel):
    url: str
    tags: list[str]
    category: str
    brand_safe: bool
    confidence: float
    summary: str

class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None
