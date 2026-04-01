import os
from fastapi import APIRouter, HTTPException
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.models import AnalyzeRequest, VideoResult
from app.services.video import download_video, extract_frames, frames_to_base64
from app.services.gemini import analyze_frames
from app.config import MAX_FRAMES, TEMP_DIR

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

import re

URL_PATTERN = re.compile(
    r"^(https?://)?(www\.)?"
    r"(youtube\.com/shorts/|youtu\.be/|youtube\.com/watch\?v=|.+\.(mp4|webm|mov)).*"
)

@router.post("/analyze", response_model=VideoResult)
async def analyze_video(request: AnalyzeRequest):
    if not URL_PATTERN.match(request.url):
        raise HTTPException(
            status_code=422,
            detail="URL must be a YouTube link or direct video file URL (.mp4, .webm, .mov)"
        )
    video_path = None
    try:
        video_path = download_video(request.url)
        frames = extract_frames(video_path, n=MAX_FRAMES)
        result = analyze_frames(frames, url=request.url)
        return result

    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Always clean up temp file
        if video_path and os.path.exists(video_path):
            os.remove(video_path)
