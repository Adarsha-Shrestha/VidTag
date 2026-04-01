import google.generativeai as genai
import json
import re
from app.config import GEMINI_API_KEY
from app.models import VideoResult
from PIL import Image

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.5-flash")

PROMPT = """
You are a UGC (user-generated content) video analysis AI.
Analyze the provided video frames and return a JSON object with EXACTLY these keys:

{
  "tags": ["list", "of", "5-10", "descriptive", "tags"],
  "category": "one of: lifestyle, gaming, beauty, food, travel, education, fitness, comedy, tech, other",
  "brand_safe": true or false,
  "confidence": 0.0 to 1.0,
  "summary": "one sentence describing the video content"
}

Rules:
- tags should be lowercase, specific, and useful for content filtering
- brand_safe is false if the video contains violence, explicit content, hate speech, or dangerous activities
- confidence reflects how clearly the frames represent the video's content
- Return ONLY the JSON object. No markdown, no explanation, no code fences.
"""

def analyze_frames(frames: list[Image.Image], url: str) -> VideoResult:
    """
    Send frames to Gemini Vision and parse structured response.
    Raises ValueError if Gemini response cannot be parsed.
    Raises RuntimeError for API errors.
    """
    # Build content parts: prompt + all frames as inline images
    parts = [PROMPT]
    for frame in frames:
        parts.append(frame)

    try:
        response = model.generate_content(parts)
        raw_text = response.text.strip()
    except Exception as e:
        raise RuntimeError(f"Gemini API error: {str(e)}")

    # Strip markdown fences if present (defensive)
    raw_text = re.sub(r"^```(?:json)?\n?", "", raw_text)
    raw_text = re.sub(r"\n?```$", "", raw_text)
    raw_text = raw_text.strip()

    try:
        data = json.loads(raw_text)
    except json.JSONDecodeError as e:
        raise ValueError(f"Gemini returned invalid JSON: {raw_text[:200]}... Error: {e}")

    required_keys = {"tags", "category", "brand_safe", "confidence", "summary"}
    missing = required_keys - set(data.keys())
    if missing:
        raise ValueError(f"Gemini response missing keys: {missing}")

    return VideoResult(
        url=url,
        tags=data["tags"],
        category=data["category"],
        brand_safe=data["brand_safe"],
        confidence=float(data["confidence"]),
        summary=data["summary"]
    )
