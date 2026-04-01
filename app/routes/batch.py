# app/routes/batch.py  (new file)
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.grpc_server import run_batch   # we'll write this helper

router = APIRouter()

class BatchRequest(BaseModel):
    urls: list[str]

@router.post("/batch")
async def batch_analyze(request: BatchRequest):
    try:
        results = run_batch(request.urls)
        return {"results": results}
    except Exception as e:
        print("BATCH ERROR:", e)
        raise HTTPException(status_code=500, detail=str(e))