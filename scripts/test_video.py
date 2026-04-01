import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.video import download_video, extract_frames, frames_to_base64

def test_video_pipeline():
    url = "https://www.youtube.com/watch?v=jNQXAC9IVRw" 
    
    print(f"1. Downloading video: {url}")
    try:
        video_path = download_video(url)
        print(f"Downloaded successfully to: {video_path}")
        print(f"File size: {os.path.getsize(video_path) / 1024 / 1024:.2f} MB")
    except Exception as e:
        print(f"Failed to download: {e}")
        return

    print(f"\n2. Extracting 5 frames...")
    try:
        frames = extract_frames(video_path, n=5)
        print(f"Extracted {len(frames)} frames successfully.")
        for i, frame in enumerate(frames):
            print(f"  Frame {i+1} size: {frame.size}")
    except Exception as e:
        print(f"Failed to extract frames: {e}")
        return

    print("\n3. Converting frames to base64...")
    try:
        b64_strings = frames_to_base64(frames)
        print(f"Converted {len(b64_strings)} frames to base64 successfully.")
        for i, b64 in enumerate(b64_strings):
             print(f"  Base64 string {i+1} length: {len(b64)} characters")
    except Exception as e:
        print(f"Failed to convert to base64: {e}")
        return

    print("\n4. Cleaning up...")
    try:
        os.remove(video_path)
        print("Temp video file removed.")
    except OSError as e:
        print(f"Failed to clean up: {e}")

    print("\nAll tests passed!")

if __name__ == "__main__":
    test_video_pipeline()
