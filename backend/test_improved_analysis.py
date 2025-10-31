#!/usr/bin/env python3

import asyncio
from app.services.video_extractor import video_extractor
from app.services.video_analyzer import get_video_analyzer
import os

async def test_genuine_video_analysis():
    """Test the improved analysis on a genuine video"""
    
    print("🧪 Testing Improved Deepfake Detection")
    print("=" * 50)
    
    # Test with the genuine YouTube video
    url = 'https://www.youtube.com/shorts/x8jB7GQxCj4'
    print(f"📹 Testing URL: {url}")
    
    try:
        # Extract video
        print("\n1️⃣ Extracting video...")
        video_path, info = video_extractor.extract_and_analyze_ready(url)
        
        if not video_path or not info:
            print("❌ Failed to extract video")
            return
            
        print(f"✅ Video extracted: {info['title']}")
        print(f"⏱️ Duration: {info['duration']}s")
        print(f"📂 Size: {os.path.getsize(video_path) / 1024 / 1024:.2f}MB")
        
        # Analyze video
        print("\n2️⃣ Running deepfake analysis...")
        analyzer = get_video_analyzer()
        result = await analyzer.analyze_video(video_path)
        
        print(f"\n📊 ANALYSIS RESULTS:")
        print(f"🔍 Verdict: {result['verdict']}")
        print(f"🎯 Confidence: {result['confidence']:.2%}")
        print(f"⚡ Processing time: {result['processing_time']}s")
        print(f"🤖 Model: {result['model']}")
        print(f"🎬 Frames analyzed: {result['frame_count']}")
        print(f"📈 Probabilities:")
        print(f"   - FAKE: {result['probabilities']['fake']:.2%}")
        print(f"   - REAL: {result['probabilities']['real']:.2%}")
        
        if 'analysis_notes' in result:
            print(f"📝 Notes: {result['analysis_notes']}")
        
        if 'threshold_used' in result:
            print(f"🎚️ Threshold: {result['threshold_used']:.0%}")
        
        # Expected: This should now show REAL for genuine content
        expected = "REAL"
        if result['verdict'] == expected:
            print(f"\n✅ SUCCESS: Correctly identified as {expected}")
        else:
            print(f"\n⚠️ ISSUE: Expected {expected}, got {result['verdict']}")
            print("This indicates the model may need further calibration")
        
        # Cleanup
        video_extractor.cleanup_video(video_path)
        print("\n🗑️ Cleaned up temp files")
        
    except Exception as e:
        print(f"❌ ERROR: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_genuine_video_analysis())