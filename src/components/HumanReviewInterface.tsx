import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  User,
  MessageSquare,
  Eye,
  Flag,
  ThumbsUp,
  ThumbsDown,
  FileText,
  Layers
} from 'lucide-react';

interface ReviewItem {
  id: string;
  incidentId: string;
  title: string;
  type: 'video' | 'audio' | 'image';
  confidence: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  submittedAt: string;
  assignedTo?: string;
  status: 'pending' | 'in-review' | 'approved' | 'rejected' | 'needs-info';
  detectionType: string;
  thumbnailUrl?: string;
}

interface HumanReviewInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  reviewQueue?: ReviewItem[];
  onReviewSubmit?: (itemId: string, decision: 'approve' | 'reject', notes: string, reason?: string) => void;
}

export function HumanReviewInterface({ 
  isOpen, 
  onClose,
  reviewQueue = [],
  onReviewSubmit 
}: HumanReviewInterfaceProps) {
  const [selectedItem, setSelectedItem] = useState<ReviewItem | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  // Mock data if no queue provided
  const defaultQueue: ReviewItem[] = [
    {
      id: 'REV-001',
      incidentId: 'INC-2024-001',
      title: 'Political Deepfake Video - Face Manipulation',
      type: 'video',
      confidence: 89,
      priority: 'critical',
      submittedAt: '2024-10-18 14:23:00',
      status: 'pending',
      detectionType: 'Face Manipulation',
      thumbnailUrl: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=200&h=150&fit=crop'
    },
    {
      id: 'REV-002',
      incidentId: 'INC-2024-002',
      title: 'Voice Clone Detection - Uncertain Confidence',
      type: 'audio',
      confidence: 76,
      priority: 'high',
      submittedAt: '2024-10-18 13:45:00',
      status: 'pending',
      detectionType: 'Audio Anomaly',
      thumbnailUrl: 'https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=200&h=150&fit=crop'
    },
    {
      id: 'REV-003',
      incidentId: 'INC-2024-003',
      title: 'Doctored Image - Artifact Detection',
      type: 'image',
      confidence: 82,
      priority: 'high',
      submittedAt: '2024-10-18 12:15:00',
      status: 'in-review',
      assignedTo: 'You',
      detectionType: 'Image Artifacts',
      thumbnailUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=150&fit=crop'
    },
    {
      id: 'REV-004',
      incidentId: 'INC-2024-005',
      title: 'Synthetic Profile Picture - GAN Detection',
      type: 'image',
      confidence: 91,
      priority: 'medium',
      submittedAt: '2024-10-18 11:30:00',
      status: 'pending',
      detectionType: 'AI-Generated Face',
      thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=150&fit=crop'
    },
    {
      id: 'REV-005',
      incidentId: 'INC-2024-006',
      title: 'Lip-Sync Mismatch - Edge Case',
      type: 'video',
      confidence: 68,
      priority: 'medium',
      submittedAt: '2024-10-18 10:00:00',
      status: 'needs-info',
      detectionType: 'Lip-Sync Analysis',
      thumbnailUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=150&fit=crop'
    },
  ];

  const queue = reviewQueue.length > 0 ? reviewQueue : defaultQueue;

  const filteredQueue = queue.filter(item => {
    const statusMatch = filterStatus === 'all' || item.status === filterStatus;
    const priorityMatch = filterPriority === 'all' || item.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'in-review': return <Eye className="h-4 w-4 text-blue-500" />;
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'needs-info': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200';
      case 'in-review': return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200';
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200';
      case 'needs-info': return 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-200';
    }
  };

  const handleApprove = () => {
    if (selectedItem && onReviewSubmit) {
      onReviewSubmit(selectedItem.id, 'approve', reviewNotes);
    }
    // Update local state
    setSelectedItem(null);
    setReviewNotes('');
  };

  const handleReject = () => {
    if (selectedItem && onReviewSubmit && rejectionReason) {
      onReviewSubmit(selectedItem.id, 'reject', reviewNotes, rejectionReason);
    }
    // Update local state
    setSelectedItem(null);
    setReviewNotes('');
    setRejectionReason('');
  };

  const stats = {
    total: queue.length,
    pending: queue.filter(i => i.status === 'pending').length,
    inReview: queue.filter(i => i.status === 'in-review').length,
    critical: queue.filter(i => i.priority === 'critical').length,
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <User className="h-6 w-6" />
            Human Review Queue
          </DialogTitle>
          <DialogDescription>
            Review AI detections that require human verification
          </DialogDescription>
        </DialogHeader>

        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Queue</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Layers className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">In Review</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.inReview}</p>
                </div>
                <Eye className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Critical</p>
                  <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
                </div>
                <Flag className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-4">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-review">In Review</SelectItem>
              <SelectItem value="needs-info">Needs Info</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Review Queue List */}
        <div className="space-y-3">
          {filteredQueue.map((item) => (
            <Card 
              key={item.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedItem?.id === item.id ? 'border-primary ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedItem(item)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Thumbnail */}
                  {item.thumbnailUrl && (
                    <div className="flex-shrink-0">
                      <img 
                        src={item.thumbnailUrl} 
                        alt={item.title}
                        className="w-32 h-24 object-cover rounded"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="font-mono text-xs">
                            {item.id}
                          </Badge>
                          <Badge variant={getPriorityColor(item.priority)}>
                            {item.priority}
                          </Badge>
                          <Badge className={getStatusColor(item.status)}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(item.status)}
                              {item.status}
                            </span>
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Type: {item.detectionType} • Confidence: {item.confidence}%
                        </p>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <p>{item.submittedAt}</p>
                        {item.assignedTo && (
                          <p className="text-xs mt-1">
                            <User className="h-3 w-3 inline mr-1" />
                            {item.assignedTo}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Confidence Bar */}
                    <div className="mt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">AI Confidence:</span>
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              item.confidence >= 90 ? 'bg-green-500' :
                              item.confidence >= 75 ? 'bg-blue-500' :
                              item.confidence >= 60 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${item.confidence}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium">{item.confidence}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Review Panel */}
        {selectedItem && (
          <Card className="mt-6 border-2 border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Review: {selectedItem.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Review Notes */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Review Notes
                </label>
                <Textarea
                  placeholder="Add your expert analysis, observations, and decision reasoning..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows={4}
                  className="w-full"
                />
              </div>

              {/* Rejection Reason (conditionally shown) */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  If Rejecting, Select Reason
                </label>
                <Select value={rejectionReason} onValueChange={setRejectionReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rejection reason..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false-positive">False Positive - Not a deepfake</SelectItem>
                    <SelectItem value="low-quality">Low Quality Media - Cannot determine</SelectItem>
                    <SelectItem value="insufficient-evidence">Insufficient Evidence</SelectItem>
                    <SelectItem value="technical-error">Technical Error in Detection</SelectItem>
                    <SelectItem value="requires-specialist">Requires Specialist Review</SelectItem>
                    <SelectItem value="other">Other (explain in notes)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleApprove}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={!reviewNotes}
                >
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Approve Detection
                </Button>
                <Button
                  onClick={handleReject}
                  variant="destructive"
                  className="flex-1"
                  disabled={!reviewNotes || !rejectionReason}
                >
                  <ThumbsDown className="h-4 w-4 mr-2" />
                  Reject Detection
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedItem(null)}
                >
                  Cancel
                </Button>
              </div>

              {/* Helper Text */}
              <p className="text-xs text-muted-foreground text-center pt-2">
                💡 Review notes are required for both approval and rejection decisions
              </p>
            </CardContent>
          </Card>
        )}

        {filteredQueue.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
            <h3 className="text-lg font-semibold mb-2">All Clear!</h3>
            <p>No items match the current filters</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
