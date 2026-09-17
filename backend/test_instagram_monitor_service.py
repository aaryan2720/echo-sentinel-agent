"""
Unit test for Instagram Monitor service
Verifies job creation, lifecycle management, and prompt cancellation
"""
import sys
import os
import asyncio

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.services.instagram_monitor import InstagramMonitor


async def run_tests():
    print("[TEST] Running InstagramMonitor tests...")
    monitor = InstagramMonitor()

    # 1. Test initial status
    status = monitor.get_monitoring_status()
    assert status["active_jobs"] == 0
    assert status["total_hashtags"] == 0
    print("[PASS] Initial status is clean")

    # 2. Start a monitoring job
    hashtags = ["deepfake", "election"]
    job_id = await monitor.start_monitoring(hashtags, keywords=["breaking"])
    assert job_id in monitor.active_jobs
    assert monitor.active_jobs[job_id].is_active is True
    assert job_id in monitor.job_tasks
    print(f"[PASS] Started monitoring job: {job_id}")

    # Verify status reflects active job
    status = monitor.get_monitoring_status()
    assert status["active_jobs"] == 1
    assert status["total_hashtags"] == 2
    print("[PASS] Monitoring status reflects active job")

    # Allow loop to start briefly
    await asyncio.sleep(0.1)

    # 3. Stop the monitoring job promptly
    stopped = await monitor.stop_monitoring(job_id)
    assert stopped is True
    assert monitor.active_jobs[job_id].is_active is False
    assert job_id not in monitor.job_tasks
    print("[PASS] Stopped monitoring job promptly")

    # 4. Stopping already stopped or non-existent job
    stopped_again = await monitor.stop_monitoring("non-existent-job")
    assert stopped_again is False
    print("[PASS] Non-existent job stop handling passed")

    # Final status check
    status = monitor.get_monitoring_status()
    assert status["active_jobs"] == 0
    print("[PASS] Final active jobs is 0")

    print("\n[SUCCESS] All InstagramMonitor tests passed successfully!")


if __name__ == "__main__":
    asyncio.run(run_tests())
