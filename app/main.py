from fastapi import FastAPI
from app.routes.analyze import router as analyze_router
from app.routes.batch import router as batch_router
from slowapi import Limiter, _rate_limit_exceeded_handler
from strawberry.fastapi import GraphQLRouter
from app.graphql_schema import schema
import threading
from app.services.grpc_server import start_grpc_server
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title="VidTag",
    description="AI-powered UGC video metadata tagging API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

limiter = Limiter(key_func=get_remote_address, default_limits=["5/minute"])
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.include_router(analyze_router)
app.include_router(batch_router)

graphql_app = GraphQLRouter(schema)
app.include_router(graphql_app, prefix="/graphql")

# @app.on_event("startup")
# async def startup_event():
#     thread = threading.Thread(target=start_grpc_server, daemon=True)
#     thread.start()

@app.on_event("startup")
async def startup_event():
    thread = threading.Thread(
        target=start_grpc_server,
        daemon=True
    )
    thread.start()

@app.get("/health")
def health():
    return {"status": "ok", "service": "vidtag"}
