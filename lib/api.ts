/**
 * Data access layer for SentinelAI.
 *
 * Every function here returns a Promise and is the single place the UI reads
 * data from. Today they resolve mock data; later each body can be replaced
 * with a `fetch()` to the FastAPI backend without changing any component.
 *
 * Example future implementation:
 *   export async function getEmailScans() {
 *     const res = await fetch(`${API_BASE}/scans`, { cache: "no-store" })
 *     if (!res.ok) throw new Error("Failed to load scans")
 *     return res.json()
 *   }
 */
import {
  MOCK_ACCOUNTS,
  MOCK_HIGH_RISK_SENDERS,
  MOCK_INCIDENTS,
  MOCK_PHISHING_TERMS,
  MOCK_SCANS,
  MOCK_SUSPICIOUS_DOMAINS,
} from "@/lib/mock-data"
import type {
  ConnectedAccount,
  DetectionSignalPoint,
  EmailScan,
  HighRiskSender,
  OverviewStat,
  PhishingTerm,
  RiskDistributionPoint,
  ScanTrendPoint,
  SecurityIncident,
  SuspiciousDomain,
  ThreatTimelineEvent,
} from "@/lib/types"

// export const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000"

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

export async function getEmailScans(): Promise<EmailScan[]> {
  return delay(MOCK_SCANS)
}

export async function getEmailScan(id: string): Promise<EmailScan | undefined> {
  return delay(MOCK_SCANS.find((s) => s.id === id))
}

export async function getOverviewStats(): Promise<OverviewStat[]> {
  const total = MOCK_SCANS.length
  const safe = MOCK_SCANS.filter((s) => s.riskLevel === "safe").length
  const medium = MOCK_SCANS.filter((s) => s.riskLevel === "medium").length
  const high = MOCK_SCANS.filter((s) => s.riskLevel === "high").length
  const avg = Math.round(MOCK_SCANS.reduce((a, s) => a + s.riskScore, 0) / total)

  return delay([
    { key: "total", label: "Total Emails Scanned", value: 12480, change: 8.2, format: "number" },
    { key: "safe", label: "Safe Emails", value: Math.round((safe / total) * 12480), change: 3.1, format: "number" },
    { key: "medium", label: "Medium-Risk Emails", value: Math.round((medium / total) * 12480), change: -2.4, format: "number" },
    { key: "high", label: "High-Risk Emails", value: Math.round((high / total) * 12480), change: 14.6, format: "number" },
    { key: "avg", label: "Average Risk Score", value: avg, change: -1.8, format: "score" },
  ])
}

export async function getRiskDistribution(): Promise<RiskDistributionPoint[]> {
  const safe = MOCK_SCANS.filter((s) => s.riskLevel === "safe").length
  const medium = MOCK_SCANS.filter((s) => s.riskLevel === "medium").length
  const high = MOCK_SCANS.filter((s) => s.riskLevel === "high").length
  return delay([
    { level: "safe", label: "Safe", count: safe },
    { level: "medium", label: "Medium", count: medium },
    { level: "high", label: "High", count: high },
  ])
}

export async function getScanTrend(): Promise<ScanTrendPoint[]> {
  const days = 14
  const out: ScanTrendPoint[] = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 864e5)
    const scanned = 280 + Math.round(Math.sin(i / 2) * 60 + (days - i) * 6)
    out.push({
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      scanned,
      threats: Math.round(scanned * (0.08 + Math.abs(Math.cos(i / 3)) * 0.06)),
    })
  }
  return delay(out)
}

export async function getDetectionSignals(): Promise<DetectionSignalPoint[]> {
  return delay([
    { signal: "Malicious URL", detections: 386 },
    { signal: "Sender Spoofing", detections: 312 },
    { signal: "Urgency Language", detections: 274 },
    { signal: "AI Model Flag", detections: 419 },
  ])
}

export async function getThreatTimeline(): Promise<ThreatTimelineEvent[]> {
  return delay([
    { id: "t1", title: "High-risk message quarantined", description: "PayPal credential phishing from paypa1-secure.com", level: "high", time: "09:42" },
    { id: "t2", title: "Suspicious domain flagged", description: "micros0ft-support.com added to watchlist", level: "high", time: "08:15" },
    { id: "t3", title: "Medium-risk message reviewed", description: "FedEx delivery lure with shortened link", level: "medium", time: "07:03" },
    { id: "t4", title: "Inbox sync completed", description: "12,480 messages re-scanned successfully", level: "safe", time: "06:30" },
    { id: "t5", title: "Urgency pattern detected", description: "Spike in 'action required' subject lines", level: "medium", time: "Yesterday" },
  ])
}

export async function getHighRiskSenders(): Promise<HighRiskSender[]> {
  return delay(MOCK_HIGH_RISK_SENDERS)
}

export async function getSuspiciousDomains(): Promise<SuspiciousDomain[]> {
  return delay(MOCK_SUSPICIOUS_DOMAINS)
}

export async function getPhishingTerms(): Promise<PhishingTerm[]> {
  return delay(MOCK_PHISHING_TERMS)
}

export async function getSecurityIncidents(): Promise<SecurityIncident[]> {
  return delay(MOCK_INCIDENTS)
}

export async function getConnectedAccounts(): Promise<ConnectedAccount[]> {
  return delay(MOCK_ACCOUNTS)
}
