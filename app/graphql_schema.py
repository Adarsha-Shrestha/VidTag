import strawberry
from typing import List
from app.services.video import download_video, extract_frames
from app.services.gemini import analyze_frames
from app.config import MAX_FRAMES
import os

@strawberry.type
class VideoResultType:
    url: str
    tags: List[str]
    category: str
    brand_safe: bool
    confidence: float
    summary: str

@strawberry.type
class Query:
    @strawberry.field
    def analyze_video(self, url: str) -> VideoResultType:
        video_path = None
        try:
            video_path = download_video(url)
            frames = extract_frames(video_path, n=MAX_FRAMES)
            result = analyze_frames(frames, url=url)
            return VideoResultType(
                url=result.url,
                tags=result.tags,
                category=result.category,
                brand_safe=result.brand_safe,
                confidence=result.confidence,
                summary=result.summary
            )
        finally:
            if video_path and os.path.exists(video_path):
                os.remove(video_path)

schema = strawberry.Schema(query=Query)
