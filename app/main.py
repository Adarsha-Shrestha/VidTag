from fastapi import FastAPI
from app.routes.analyze import router as analyze_router

app = FastAPI(
    title="VidTag",
    description="AI-powered UGC video metadata tagging API",
    version="1.0.0"
)

app.include_router(analyze_router)

@app.get("/health")
def health():
    return {"status": "ok", "service": "vidtag"}
