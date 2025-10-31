#!/usr/bin/env python3

from app.services.video_extractor import video_extractor
import os

print("Testing YouTube video extraction...")

url = 'https://www.youtube.com/shorts/x8jB7GQxCj4'
print(f"URL: {url}")

try:
    # Test extraction
    video_path, info = video_extractor.extract_and_analyze_ready(url)
    
    if video_path and info:
        print(f"✅ SUCCESS: Video extracted")
        print(f"📋 Title: {info['title']}")
        print(f"⏱️ Duration: {info['duration']}s")
        print(f"📂 File size: {os.path.getsize(video_path) / 1024 / 1024:.2f}MB")
        print(f"📁 Path: {video_path}")
        
        # Cleanup
        video_extractor.cleanup_video(video_path)
        print("🗑️ Cleaned up temp file")
    else:
        print("❌ FAILED: Could not extract video")
        if info:
            print(f"Info available: {info}")
            
except Exception as e:
    print(f"❌ ERROR: {e}")
    import traceback
    traceback.print_exc()