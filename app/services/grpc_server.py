import grpc
from concurrent import futures
from app.proto import vidtag_pb2, vidtag_pb2_grpc
from app.services.video import download_video, extract_frames
from app.services.gemini import analyze_frames
from app.config import MAX_FRAMES, GRPC_PORT
import os

class VidTagServicer(vidtag_pb2_grpc.VidTagServiceServicer):
    def AnalyzeBatch(self, request, context):
        results = []
        for url in request.urls:
            video_path = None
            try:
                video_path = download_video(url)
                frames = extract_frames(video_path, n=MAX_FRAMES)
                result = analyze_frames(frames, url=url)
                results.append(vidtag_pb2.VideoResult(
                    url=result.url,
                    tags=result.tags,
                    category=result.category,
                    brand_safe=result.brand_safe,
                    confidence=result.confidence,
                    summary=result.summary,
                    error=""
                ))
            except Exception as e:
                results.append(vidtag_pb2.VideoResult(
                    url=url,
                    tags=[],
                    category="",
                    brand_safe=False,
                    confidence=0.0,
                    summary="",
                    error=str(e)
                ))
            finally:
                if video_path and os.path.exists(video_path):
                    os.remove(video_path)

        return vidtag_pb2.BatchResponse(results=results)

def start_grpc_server():
    server = grpc.server(
        futures.ThreadPoolExecutor(max_workers=4)
    )

    vidtag_pb2_grpc.add_VidTagServiceServicer_to_server(
        VidTagServicer(), server
    )

    server.add_insecure_port(f"[::]:{GRPC_PORT}")
    server.start()

    print(f"gRPC server running on port {GRPC_PORT}")

    server.wait_for_termination()

def run_batch(urls: list[str]) -> list[dict]:
    """Internal helper — calls gRPC server and returns list of dicts."""
    channel = grpc.insecure_channel(f"localhost:{GRPC_PORT}")
    stub = vidtag_pb2_grpc.VidTagServiceStub(channel)
    response = stub.AnalyzeBatch(vidtag_pb2.BatchRequest(urls=urls))
    results = []
    for r in response.results:
        results.append({
            "url": r.url,
            "tags": list(r.tags),
            "category": r.category,
            "brand_safe": r.brand_safe,
            "confidence": r.confidence,
            "summary": r.summary,
            "error": r.error
        })
    return results