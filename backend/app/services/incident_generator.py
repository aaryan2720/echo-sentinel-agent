"""
Incident Generator Service
Automatically creates incidents from detected deepfakes and suspicious content
"""
import asyncio
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
import json
import uuid
from dataclasses import dataclass, asdict
from enum import Enum

from app.config import get_settings


class IncidentSeverity(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class IncidentStatus(Enum):
    PENDING = "pending"
    INVESTIGATING = "investigating"
    CONFIRMED = "confirmed"
    RESOLVED = "resolved"
    FALSE_POSITIVE = "false_positive"


@dataclass
class AutoIncident:
    """Auto-generated incident structure"""
    id: str
    title: str
    description: str
    severity: IncidentSeverity
    status: IncidentStatus
    platform: str
    source_url: str
    media_url: Optional[str]
    confidence: float
    verdict: str
    risk_score: float
    timestamp: datetime
    source_type: str  # 'instagram_monitor', 'twitter_monitor', etc.
    source_id: str
    metadata: Dict[str, Any]
    tags: List[str]
    network_size: int = 1
    geographical_impact: Optional[str] = None
    estimated_reach: int = 0


class IncidentGenerator:
    """
    Automatically generates incidents from deepfake detections
    Handles severity classification, deduplication, and enrichment
    """
    
    def __init__(self):
        self.settings = get_settings()
        self.logger = logging.getLogger(__name__)
        
        # In-memory storage for demo (would use database in production)
        self.incidents: Dict[str, AutoIncident] = {}
        self.incident_counter = 0
        
        # Alert thresholds
        self.severity_thresholds = {
            "confidence": {
                IncidentSeverity.LOW: 0.60,
                IncidentSeverity.MEDIUM: 0.75,
                IncidentSeverity.HIGH: 0.85,
                IncidentSeverity.CRITICAL: 0.95
            },
            "engagement": {
                IncidentSeverity.LOW: 100,
                IncidentSeverity.MEDIUM: 1000,
                IncidentSeverity.HIGH: 10000,
                IncidentSeverity.CRITICAL: 50000
            },
            "risk_score": {
                IncidentSeverity.LOW: 0.3,
                IncidentSeverity.MEDIUM: 0.5,
                IncidentSeverity.HIGH: 0.7,
                IncidentSeverity.CRITICAL: 0.9
            }
        }
        
        self.logger.info("🎯 Incident Generator initialized")
    
    async def create_incident(self, detection_data: Dict[str, Any]) -> str:
        """
        Create a new incident from a deepfake detection
        
        Args:
            detection_data: Detection results with metadata
            
        Returns:
            incident_id: Generated incident ID
        """
        try:
            # Generate unique incident ID
            incident_id = f"INC-{datetime.now().strftime('%Y%m%d')}-{self.incident_counter:04d}"
            self.incident_counter += 1
            
            # Calculate severity
            severity = self._calculate_severity(detection_data)
            
            # Determine status
            status = IncidentStatus.PENDING
            if detection_data.get("confidence", 0) > 0.9:
                status = IncidentStatus.INVESTIGATING
            
            # Generate tags
            tags = self._generate_tags(detection_data)
            
            # Estimate reach and impact
            estimated_reach = self._estimate_reach(detection_data)
            network_size = self._calculate_network_size(detection_data)
            
            # Create incident
            incident = AutoIncident(
                id=incident_id,
                title=detection_data.get("title", f"Deepfake Detection - {detection_data.get('platform', 'Unknown')}"),
                description=detection_data.get("description", "Automated deepfake detection"),
                severity=severity,
                status=status,
                platform=detection_data.get("platform", "Unknown"),
                source_url=detection_data.get("url", ""),
                media_url=detection_data.get("media_url"),
                confidence=detection_data.get("confidence", 0.0),
                verdict=detection_data.get("verdict", "UNKNOWN"),
                risk_score=detection_data.get("risk_score", 0.0),
                timestamp=datetime.now(),
                source_type=detection_data.get("source_type", "manual"),
                source_id=detection_data.get("source_id", ""),
                metadata=detection_data.get("metadata", {}),
                tags=tags,
                network_size=network_size,
                estimated_reach=estimated_reach
            )
            
            # Store incident
            self.incidents[incident_id] = incident
            
            # Log incident creation
            self.logger.warning(f"🚨 INCIDENT CREATED: {incident_id}")
            self.logger.warning(f"   Title: {incident.title}")
            self.logger.warning(f"   Severity: {severity.value.upper()}")
            self.logger.warning(f"   Platform: {incident.platform}")
            self.logger.warning(f"   Confidence: {incident.confidence:.2%}")
            self.logger.warning(f"   Estimated Reach: {estimated_reach:,}")
            
            # Check for immediate alerts
            if severity in [IncidentSeverity.HIGH, IncidentSeverity.CRITICAL]:
                await self._send_immediate_alert(incident)
            
            return incident_id
            
        except Exception as e:
            self.logger.error(f"❌ Failed to create incident: {e}")
            raise
    
    def _calculate_severity(self, detection_data: Dict[str, Any]) -> IncidentSeverity:
        """Calculate incident severity based on multiple factors"""
        confidence = detection_data.get("confidence", 0.0)
        risk_score = detection_data.get("risk_score", 0.0)
        
        # Get engagement metrics if available
        engagement = 0
        if "metadata" in detection_data and "engagement" in detection_data["metadata"]:
            eng_data = detection_data["metadata"]["engagement"]
            engagement = eng_data.get("likes", 0) + eng_data.get("comments", 0)
        
        # Score each factor
        confidence_severity = self._get_severity_by_threshold("confidence", confidence)
        risk_severity = self._get_severity_by_threshold("risk_score", risk_score)
        engagement_severity = self._get_severity_by_threshold("engagement", engagement)
        
        # Take the highest severity
        severities = [confidence_severity, risk_severity, engagement_severity]
        severity_values = [s.value for s in IncidentSeverity]
        max_severity_idx = max(severity_values.index(s.value) for s in severities)
        
        return list(IncidentSeverity)[max_severity_idx]
    
    def _get_severity_by_threshold(self, metric: str, value: float) -> IncidentSeverity:
        """Get severity level based on threshold for a specific metric"""
        thresholds = self.severity_thresholds.get(metric, {})
        
        for severity in [IncidentSeverity.CRITICAL, IncidentSeverity.HIGH, 
                        IncidentSeverity.MEDIUM, IncidentSeverity.LOW]:
            if value >= thresholds.get(severity, 0):
                return severity
        
        return IncidentSeverity.LOW
    
    def _generate_tags(self, detection_data: Dict[str, Any]) -> List[str]:
        """Generate relevant tags for the incident"""
        tags = []
        
        # Platform tag
        platform = detection_data.get("platform", "").lower()
        if platform:
            tags.append(f"platform:{platform}")
        
        # Source type tag
        source_type = detection_data.get("source_type", "")
        if source_type:
            tags.append(f"source:{source_type}")
        
        # Confidence level tag
        confidence = detection_data.get("confidence", 0.0)
        if confidence > 0.9:
            tags.append("high-confidence")
        elif confidence > 0.75:
            tags.append("medium-confidence")
        else:
            tags.append("low-confidence")
        
        # Content type tags
        if "metadata" in detection_data:
            metadata = detection_data["metadata"]
            
            # Hashtag tags
            if "hashtags" in metadata:
                for hashtag in metadata["hashtags"][:3]:  # Limit to first 3 hashtags
                    tags.append(f"hashtag:{hashtag.lower()}")
            
            # Engagement level
            if "engagement" in metadata:
                engagement = metadata["engagement"]
                total_eng = engagement.get("likes", 0) + engagement.get("comments", 0)
                if total_eng > 10000:
                    tags.append("viral")
                elif total_eng > 1000:
                    tags.append("high-engagement")
        
        # Verdict tag
        verdict = detection_data.get("verdict", "").lower()
        if verdict:
            tags.append(f"verdict:{verdict}")
        
        return tags
    
    def _estimate_reach(self, detection_data: Dict[str, Any]) -> int:
        """Estimate the potential reach of the content"""
        base_reach = 100  # Minimum reach assumption
        
        if "metadata" in detection_data and "engagement" in detection_data["metadata"]:
            engagement = detection_data["metadata"]["engagement"]
            likes = engagement.get("likes", 0)
            comments = engagement.get("comments", 0)
            
            # Rough estimation: engagement * reach multiplier
            engagement_total = likes + comments
            
            # Platform-specific reach multipliers
            platform = detection_data.get("platform", "").lower()
            multipliers = {
                "instagram": 10,  # 1 engagement = ~10 reach
                "twitter": 15,    # Higher viral potential
                "tiktok": 20,     # Highest viral potential
                "youtube": 25,    # Long-form content spreads more
            }
            
            multiplier = multipliers.get(platform, 10)
            estimated_reach = engagement_total * multiplier
            
            return max(base_reach, estimated_reach)
        
        return base_reach
    
    def _calculate_network_size(self, detection_data: Dict[str, Any]) -> int:
        """Calculate network propagation size"""
        # For now, return 1 (single node)
        # This would be enhanced with real social network analysis
        return 1
    
    async def _send_immediate_alert(self, incident: AutoIncident):
        """Send immediate alert for high/critical severity incidents"""
        try:
            self.logger.critical(f"🚨🚨🚨 HIGH PRIORITY ALERT: {incident.id}")
            self.logger.critical(f"   Incident: {incident.title}")
            self.logger.critical(f"   Severity: {incident.severity.value.upper()}")
            self.logger.critical(f"   Platform: {incident.platform}")
            self.logger.critical(f"   Estimated Reach: {incident.estimated_reach:,}")
            self.logger.critical(f"   URL: {incident.source_url}")
            
            # In production, this would send notifications via:
            # - Email alerts
            # - Slack/Discord webhooks
            # - SMS for critical incidents
            # - Dashboard notifications
            
        except Exception as e:
            self.logger.error(f"❌ Failed to send immediate alert: {e}")
    
    def get_incidents(self, status: Optional[IncidentStatus] = None, 
                     platform: Optional[str] = None,
                     severity: Optional[IncidentSeverity] = None,
                     limit: int = 50) -> List[Dict[str, Any]]:
        """
        Get incidents with optional filtering
        
        Args:
            status: Filter by incident status
            platform: Filter by platform
            severity: Filter by severity
            limit: Maximum number of incidents to return
            
        Returns:
            List of incident dictionaries
        """
        incidents = list(self.incidents.values())
        
        # Apply filters
        if status:
            incidents = [inc for inc in incidents if inc.status == status]
        
        if platform:
            incidents = [inc for inc in incidents if inc.platform.lower() == platform.lower()]
        
        if severity:
            incidents = [inc for inc in incidents if inc.severity == severity]
        
        # Sort by timestamp (newest first)
        incidents.sort(key=lambda x: x.timestamp, reverse=True)
        
        # Limit results
        incidents = incidents[:limit]
        
        # Convert to dictionaries
        return [self._incident_to_dict(inc) for inc in incidents]
    
    def _incident_to_dict(self, incident: AutoIncident) -> Dict[str, Any]:
        """Convert incident to dictionary format"""
        return {
            "id": incident.id,
            "title": incident.title,
            "description": incident.description,
            "severity": incident.severity.value,
            "status": incident.status.value,
            "platform": incident.platform,
            "source_url": incident.source_url,
            "media_url": incident.media_url,
            "confidence": incident.confidence,
            "verdict": incident.verdict,
            "risk_score": incident.risk_score,
            "timestamp": incident.timestamp.isoformat(),
            "source_type": incident.source_type,
            "source_id": incident.source_id,
            "metadata": incident.metadata,
            "tags": incident.tags,
            "network_size": incident.network_size,
            "geographical_impact": incident.geographical_impact,
            "estimated_reach": incident.estimated_reach
        }
    
    def get_incident_stats(self) -> Dict[str, Any]:
        """Get incident statistics"""
        incidents = list(self.incidents.values())
        
        if not incidents:
            return {
                "total": 0,
                "by_severity": {},
                "by_platform": {},
                "by_status": {},
                "recent_24h": 0
            }
        
        # Calculate stats
        total = len(incidents)
        recent_cutoff = datetime.now() - timedelta(hours=24)
        recent_24h = len([inc for inc in incidents if inc.timestamp > recent_cutoff])
        
        # Group by severity
        by_severity = {}
        for severity in IncidentSeverity:
            count = len([inc for inc in incidents if inc.severity == severity])
            if count > 0:
                by_severity[severity.value] = count
        
        # Group by platform
        by_platform = {}
        for incident in incidents:
            platform = incident.platform
            by_platform[platform] = by_platform.get(platform, 0) + 1
        
        # Group by status
        by_status = {}
        for status in IncidentStatus:
            count = len([inc for inc in incidents if inc.status == status])
            if count > 0:
                by_status[status.value] = count
        
        return {
            "total": total,
            "by_severity": by_severity,
            "by_platform": by_platform,
            "by_status": by_status,
            "recent_24h": recent_24h,
            "avg_confidence": sum(inc.confidence for inc in incidents) / total if total > 0 else 0,
            "total_estimated_reach": sum(inc.estimated_reach for inc in incidents)
        }
    
    async def update_incident_status(self, incident_id: str, status: IncidentStatus, 
                                   notes: Optional[str] = None) -> bool:
        """Update incident status"""
        if incident_id not in self.incidents:
            return False
        
        incident = self.incidents[incident_id]
        old_status = incident.status
        incident.status = status
        
        if notes:
            if "status_updates" not in incident.metadata:
                incident.metadata["status_updates"] = []
            
            incident.metadata["status_updates"].append({
                "timestamp": datetime.now().isoformat(),
                "old_status": old_status.value,
                "new_status": status.value,
                "notes": notes
            })
        
        self.logger.info(f"📝 Updated incident {incident_id}: {old_status.value} → {status.value}")
        
        return True


# Singleton instance
_incident_generator: Optional[IncidentGenerator] = None


def get_incident_generator() -> IncidentGenerator:
    """Get or create IncidentGenerator singleton"""
    global _incident_generator
    if _incident_generator is None:
        _incident_generator = IncidentGenerator()
    return _incident_generator