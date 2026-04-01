import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
TEMP_DIR = os.getenv("TEMP_DIR", "/tmp/vidtag")
MAX_FRAMES = int(os.getenv("MAX_FRAMES", 5))
GRPC_PORT = int(os.getenv("GRPC_PORT", 50051))

if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY is not set in .env")

os.makedirs(TEMP_DIR, exist_ok=True)
