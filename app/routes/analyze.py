from fastapi import APIRouter, HTTPException
from app.models import AnalyzeRequest, VideoResult

router = APIRouter()

@router.post("/analyze", response_model=VideoResult)
async def analyze_video(request: AnalyzeRequest):
    # Stub — returns dummy data until Phase 3 wires real logic
    return VideoResult(
        url=request.url,
        tags=["stub"],
        category="pending",
        brand_safe=True,
        confidence=0.0,
        summary="Stub response — Gemini not yet connected"
    )
