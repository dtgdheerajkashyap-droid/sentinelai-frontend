export type RiskLevel = "safe" | "medium" | "high"

export interface EmailScan {
  id: string
  senderName: string
  senderEmail: string
  subject: string
  riskScore: number
  riskLevel: RiskLevel
  urlsFound: number
  urgencyScore: number
  scanDate: string
  // Detailed analysis (used by the threat details panel)
  senderRisk: number
  urlRisk: number
  urgencyRisk: number
  aiClassification: string
  detectedUrls: string[]
  detectionReasons: string[]
  recommendedAction: string
}

export interface OverviewStat {
  key: string
  label: string
  value: number
  /** Percentage change vs. the previous period. */
  change: number
  format?: "number" | "score" | "percent"
}

export interface RiskDistributionPoint {
  level: RiskLevel
  label: string
  count: number
}

export interface ScanTrendPoint {
  date: string
  scanned: number
  threats: number
}

export interface DetectionSignalPoint {
  signal: string
  detections: number
}

export interface ThreatTimelineEvent {
  id: string
  title: string
  description: string
  level: RiskLevel
  time: string
}

export interface HighRiskSender {
  email: string
  detections: number
  lastSeen: string
  level: RiskLevel
}

export interface SuspiciousDomain {
  domain: string
  reports: number
  category: string
  level: RiskLevel
}

export interface PhishingTerm {
  term: string
  frequency: number
}

export interface SecurityIncident {
  id: string
  title: string
  summary: string
  level: RiskLevel
  date: string
}

export interface ConnectedAccount {
  id: string
  provider: string
  email: string
  status: "connected" | "disconnected" | "error"
  lastSync: string
  emailsMonitored: number
}
