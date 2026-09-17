import jsPDF from 'jspdf';

interface IncidentData {
  id: string;
  title: string;
  platform: string;
  confidence: number;
  type: string;
  timestamp: string;
  status: string;
  description?: string;
  evidence?: string[];
}

export const generateIncidentPDF = (incident: IncidentData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 20;

  // Header
  doc.setFontSize(20);
  doc.setTextColor(0, 255, 255); // Cyan
  doc.text('ECHO BREAKER', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 10;
  doc.setFontSize(14);
  doc.setTextColor(100, 100, 100);
  doc.text('Incident Analysis Report', pageWidth / 2, yPos, { align: 'center' });
  
  // Horizontal line
  yPos += 5;
  doc.setDrawColor(0, 255, 255);
  doc.setLineWidth(0.5);
  doc.line(20, yPos, pageWidth - 20, yPos);
  
  yPos += 15;
  
  // Incident ID and timestamp
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`Incident ID: ${incident.id}`, 20, yPos);
  doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - 20, yPos, { align: 'right' });
  
  yPos += 10;
  
  // Title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(incident.title, 20, yPos, { maxWidth: pageWidth - 40 });
  
  yPos += 15;
  
  // Metadata section
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('DETECTION DETAILS', 20, yPos);
  
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  const metadataItems = [
    `Platform: ${incident.platform}`,
    `Type: ${incident.type}`,
    `Confidence Score: ${incident.confidence}%`,
    `Status: ${incident.status}`,
    `Detection Time: ${incident.timestamp}`,
  ];
  
  metadataItems.forEach(item => {
    doc.text(item, 25, yPos);
    yPos += 6;
  });
  
  yPos += 10;
  
  // Threat Assessment
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('THREAT ASSESSMENT', 20, yPos);
  
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  const threatLevel = incident.confidence >= 90 ? 'CRITICAL' : incident.confidence >= 80 ? 'HIGH' : 'MEDIUM';
  const threatColor: [number, number, number] = incident.confidence >= 90 ? [255, 0, 0] : incident.confidence >= 80 ? [255, 165, 0] : [255, 255, 0];
  
  doc.setTextColor(...threatColor);
  doc.setFont('helvetica', 'bold');
  doc.text(`Threat Level: ${threatLevel}`, 25, yPos);
  
  yPos += 8;
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.text('This content has been flagged by our multimodal AI detection system', 25, yPos);
  doc.text('as exhibiting characteristics of synthetic media manipulation.', 25, yPos + 5);
  
  yPos += 18;
  
  // Analysis Details
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('ANALYSIS FINDINGS', 20, yPos);
  
  yPos += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  if (incident.description) {
    const splitDescription = doc.splitTextToSize(incident.description, pageWidth - 50);
    doc.text(splitDescription, 25, yPos);
    yPos += splitDescription.length * 5 + 5;
  }
  
  yPos += 10;
  
  // Detection Methods
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('DETECTION METHODS EMPLOYED', 20, yPos);
  
  yPos += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const methods = [
    '✓ Visual Transformer Analysis (ResNet-50 + ViT)',
    '✓ Audio Spectrogram Analysis',
    '✓ Temporal Consistency Check',
    '✓ Metadata Forensics',
    '✓ Network Behavior Analysis (GNN)',
  ];
  
  methods.forEach(method => {
    doc.text(method, 25, yPos);
    yPos += 6;
  });
  
  yPos += 10;
  
  // Evidence Section
  if (incident.evidence && incident.evidence.length > 0) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('EVIDENCE CHAIN', 20, yPos);
    
    yPos += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    incident.evidence.forEach((item, idx) => {
      doc.text(`${idx + 1}. ${item}`, 25, yPos);
      yPos += 6;
    });
    
    yPos += 10;
  }
  
  // Recommendations
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('RECOMMENDED ACTIONS', 20, yPos);
  
  yPos += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const recommendations = [
    '• Flag content for platform review',
    '• Notify fact-checking partners',
    '• Monitor related accounts for coordinated activity',
    '• Track content propagation across platforms',
    '• Generate public advisory if widespread',
  ];
  
  recommendations.forEach(rec => {
    doc.text(rec, 25, yPos);
    yPos += 6;
  });
  
  // Footer
  yPos = doc.internal.pageSize.getHeight() - 20;
  doc.setDrawColor(0, 255, 255);
  doc.setLineWidth(0.5);
  doc.line(20, yPos, pageWidth - 20, yPos);
  
  yPos += 8;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('EchoBreaker - Autonomous Deepfake Detection System', pageWidth / 2, yPos, { align: 'center' });
  doc.text('Mumbai Hacks 2025 | Confidential Report', pageWidth / 2, yPos + 4, { align: 'center' });
  
  // Save the PDF
  doc.save(`incident-report-${incident.id}.pdf`);
};
