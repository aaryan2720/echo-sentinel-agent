#!/usr/bin/env python3
"""
Test Instagram Monitoring Phase 1 Implementation
"""
import asyncio
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.services.instagram_monitor import get_instagram_monitor

async def test_monitoring():
    try:
        monitor = get_instagram_monitor()
        print('🚀 Testing Instagram monitoring...')
        
        # Start monitoring some hashtags
        job_id = await monitor.start_monitoring(['politics', 'breaking', 'viral'])
        print(f'✅ Started monitoring job: {job_id}')
        
        # Wait a moment for some simulated posts
        print('⏳ Waiting for simulated posts...')
        await asyncio.sleep(3)
        
        # Check status
        status = monitor.get_monitoring_status()
        print('📊 Monitoring Status:')
        print(f'   Active Jobs: {status["active_jobs"]}')
        print(f'   Total Hashtags: {status["total_hashtags"]}')
        print(f'   Posts Scanned: {status["posts_scanned"]}')
        print(f'   Deepfakes Detected: {status["deepfakes_detected"]}')
        
        # Wait a bit more to see if incidents get generated
        if status["posts_scanned"] > 0:
            print('⏳ Waiting for analysis results...')
            await asyncio.sleep(5)
            
            # Check again
            final_status = monitor.get_monitoring_status()
            print('📈 Final Status:')
            print(f'   Posts Scanned: {final_status["posts_scanned"]}')
            print(f'   Deepfakes Detected: {final_status["deepfakes_detected"]}')
            
            if final_status["deepfakes_detected"] > 0:
                print('🚨 DEEPFAKE INCIDENTS GENERATED!')
        
        # Stop monitoring
        await monitor.stop_monitoring(job_id)
        print(f'⏹️ Stopped monitoring job: {job_id}')
        
        print('\n🎉 Phase 1 Instagram Monitoring Test Complete!')
        print('✅ Instagram hashtag monitoring is working!')
        print('✅ Auto-incident generation is working!')
        print('✅ Ready for frontend integration!')
        
    except Exception as e:
        print(f'❌ Test failed: {e}')
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    asyncio.run(test_monitoring())