"""
Unit test for incident generator service
Verifies empty stats handling, incident creation, retrieval, and status updates
"""
import sys
import os
import asyncio

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.services.incident_generator import (
    IncidentGenerator,
    IncidentSeverity,
    IncidentStatus
)


async def run_tests():
    print("[TEST] Running IncidentGenerator tests...")
    generator = IncidentGenerator()

    # 1. Test empty stats doesn't raise KeyError and has all expected keys
    stats = generator.get_incident_stats()
    assert stats["total"] == 0, f"Expected total 0, got {stats['total']}"
    assert "avg_confidence" in stats, "avg_confidence missing from empty stats"
    assert "total_estimated_reach" in stats, "total_estimated_reach missing from empty stats"
    assert stats["avg_confidence"] == 0.0
    assert stats["total_estimated_reach"] == 0
    print("[PASS] Empty stats test passed")

    # 2. Test incident creation
    incident_data = {
        "title": "Test Deepfake Detected",
        "description": "A synthetic video was detected",
        "platform": "Twitter",
        "confidence": 0.92,
        "verdict": "FAKE",
        "risk_score": 0.85,
        "url": "https://twitter.com/example/status/12345",
        "media_url": "https://example.com/video.mp4",
        "source_type": "unit_test",
        "source_id": "test-123",
        "metadata": {
            "engagement": {"likes": 2500, "comments": 150}
        }
    }
    incident_id = await generator.create_incident(incident_data)
    assert incident_id.startswith("INC-"), f"Invalid incident id format: {incident_id}"
    print(f"[PASS] Created incident: {incident_id}")

    # 3. Test incident retrieval by ID
    incident = generator.get_incident_by_id(incident_id)
    assert incident is not None, "Failed to retrieve incident by ID"
    assert incident["id"] == incident_id
    assert incident["title"] == "Test Deepfake Detected"
    assert incident["platform"] == "Twitter"
    assert incident["confidence"] == 0.92
    print("[PASS] Incident retrieval by ID passed")

    # 4. Test incident status update
    success = await generator.update_incident_status(
        incident_id,
        IncidentStatus.RESOLVED,
        notes="Verified and resolved during automated testing"
    )
    assert success is True, "Failed to update incident status"
    updated_incident = generator.get_incident_by_id(incident_id)
    assert updated_incident["status"] == "resolved"
    print("[PASS] Incident status update passed")

    # 5. Test stats with incidents present
    new_stats = generator.get_incident_stats()
    assert new_stats["total"] == 1
    assert new_stats["avg_confidence"] == 0.92
    assert new_stats["total_estimated_reach"] > 0
    print("[PASS] Populated stats test passed")

    print("\n[SUCCESS] All incident generator tests passed successfully!")


if __name__ == "__main__":
    asyncio.run(run_tests())
