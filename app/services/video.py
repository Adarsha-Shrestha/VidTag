import yt_dlp
import uuid
import os
import cv2
from PIL import Image
import base64
import io
from app.config import TEMP_DIR

def download_video(url: str) -> str:
    """
    Download video from URL. Returns local file path.
    Raises ValueError for unsupported URLs.
    Raises RuntimeError for download failures.
    """
    video_id = str(uuid.uuid4())[:8]
    output_path = os.path.join(TEMP_DIR, f"{video_id}.mp4")

    ydl_opts = {
        "outtmpl": output_path,
        "format": "mp4/bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best",
        "quiet": True,
        "no_warnings": True,
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
    except yt_dlp.utils.DownloadError as e:
        raise RuntimeError(f"Download failed: {str(e)}")

    if not os.path.exists(output_path):
        raise RuntimeError("Download succeeded but file not found")

    return output_path

def extract_frames(video_path: str, n: int = 5) -> list[Image.Image]:
    """
    Extract n evenly-spaced frames from video file.
    Returns list of PIL Images.
    Raises RuntimeError if video cannot be opened.
    """
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise RuntimeError(f"Cannot open video: {video_path}")

    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    if total_frames == 0:
        raise RuntimeError("Video has no frames")

    indices = [int(total_frames * i / n) for i in range(n)]
    frames = []

    for idx in indices:
        cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
        ret, frame = cap.read()
        if ret:
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            frames.append(Image.fromarray(frame_rgb))

    cap.release()

    if not frames:
        raise RuntimeError("Could not extract any frames")

    return frames

def frames_to_base64(frames: list[Image.Image]) -> list[str]:
    """
    Encode PIL Images to base64 JPEG strings.
    Returns list of base64-encoded strings.
    """
    encoded = []
    for frame in frames:
        buffer = io.BytesIO()
        frame.save(buffer, format="JPEG", quality=85)
        b64 = base64.b64encode(buffer.getvalue()).decode("utf-8")
        encoded.append(b64)
    return encoded
