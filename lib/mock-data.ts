import type {
  ConnectedAccount,
  EmailScan,
  HighRiskSender,
  PhishingTerm,
  RiskLevel,
  SecurityIncident,
  SuspiciousDomain,
} from "@/lib/types"

function levelFromScore(score: number): RiskLevel {
  if (score >= 70) return "high"
  if (score >= 40) return "medium"
  return "safe"
}

const SENDERS: Array<[string, string]> = [
  ["PayPal Service", "service@paypa1-secure.com"],
  ["HR Department", "hr@company-internal.com"],
  ["Amazon Support", "no-reply@amazon.com"],
  ["IT Helpdesk", "it-support@company.com"],
  ["DocuSign", "dse@docusign.net"],
  ["Microsoft 365", "account-security@micros0ft-support.com"],
  ["Netflix", "info@account-netflix.info"],
  ["Wells Fargo Alerts", "alerts@wellsfargo-verify.net"],
  ["Dropbox", "no-reply@dropbox.com"],
  ["LinkedIn", "messages-noreply@linkedin.com"],
  ["Coinbase", "security@coinbase-wallet-alert.com"],
  ["Google", "no-reply@accounts.google.com"],
  ["FedEx Delivery", "tracking@fedex-parcel-update.com"],
  ["Slack", "feedback@slack.com"],
  ["Apple", "appleid@id-apple-verify.com"],
  ["Zoom", "no-reply@zoom.us"],
  ["Chase Bank", "secure@chase-account-review.com"],
  ["GitHub", "noreply@github.com"],
  ["Adobe Sign", "echosign@adobesign.com"],
  ["Payroll Notice", "payroll@company-payments.info"],
]

const SUBJECTS = [
  "Your account has been temporarily suspended",
  "Action required: verify your identity within 24 hours",
  "Invoice #INV-20984 is ready for review",
  "Unusual sign-in activity detected",
  "You have a new document to sign",
  "Password expires today — update now",
  "Your package could not be delivered",
  "Quarterly benefits enrollment is now open",
  "Security alert: new device added to your account",
  "Wire transfer confirmation needed",
  "Your subscription payment failed",
  "Weekly engineering sync notes",
  "Please review the updated contract",
  "Confirm your email to continue",
  "Your refund of $482.10 has been processed",
]

const URLS = [
  "http://paypa1-secure.com/verify?id=88213",
  "https://micros0ft-support.com/login",
  "http://bit.ly/3xK9pQr",
  "https://account-netflix.info/billing",
  "https://docs.google.com/document/d/1a2b3c",
  "http://wellsfargo-verify.net/secure-login",
  "https://coinbase-wallet-alert.com/unlock",
  "https://github.com/company/repo/pull/482",
  "http://fedex-parcel-update.com/track/9920",
  "https://id-apple-verify.com/manage",
]

const REASON_POOL = [
  "Sender domain does not match the claimed organization",
  "Display name spoofs a trusted brand",
  "Message contains urgency-inducing language",
  "Embedded URL uses a look-alike domain",
  "Link redirects through a known shortener",
  "Requests credentials or payment information",
  "SPF / DKIM authentication failed",
  "Recently registered sender domain",
  "Attachment mimics an invoice document",
  "Reply-to address differs from the sender",
]

const AI_CLASSES = [
  "Credential Phishing",
  "Business Email Compromise",
  "Brand Impersonation",
  "Malware Delivery",
  "Benign / Legitimate",
  "Spam / Promotional",
]

const ACTIONS: Record<RiskLevel, string> = {
  high: "Quarantine immediately and report to the security team. Do not click any links or reply.",
  medium: "Review carefully before interacting. Verify the sender through a known channel.",
  safe: "No action required. This message appears legitimate.",
}

// Deterministic pseudo-random generator so server/client renders match.
function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

function buildScans(): EmailScan[] {
  const rand = seeded(7)
  const scans: EmailScan[] = []
  const now = Date.now()

  for (let i = 0; i < 48; i++) {
    const [senderName, senderEmail] = SENDERS[Math.floor(rand() * SENDERS.length)]
    const subject = SUBJECTS[Math.floor(rand() * SUBJECTS.length)]
    const suspicious =
      senderEmail.includes("verify") ||
      senderEmail.includes("alert") ||
      senderEmail.includes("paypa1") ||
      senderEmail.includes("micros0ft") ||
      senderEmail.includes(".info")

    const base = suspicious ? 55 + rand() * 43 : rand() * 60
    const riskScore = Math.round(Math.min(99, base))
    const riskLevel = levelFromScore(riskScore)
    const urlsFound = Math.floor(rand() * (riskLevel === "high" ? 6 : 3))
    const urgencyScore = Math.round(
      Math.min(99, riskLevel === "high" ? 50 + rand() * 49 : rand() * 60),
    )

    const detectedUrls = Array.from({ length: urlsFound }, () => URLS[Math.floor(rand() * URLS.length)])
    const reasonCount = riskLevel === "high" ? 4 : riskLevel === "medium" ? 2 : 1
    const detectionReasons = Array.from(new Set(
      Array.from({ length: reasonCount }, () => REASON_POOL[Math.floor(rand() * REASON_POOL.length)]),
    ))

    const daysAgo = Math.floor(rand() * 30)
    const hoursAgo = Math.floor(rand() * 24)
    const scanDate = new Date(now - daysAgo * 864e5 - hoursAgo * 36e5).toISOString()

    scans.push({
      id: `scan-${(i + 1).toString().padStart(4, "0")}`,
      senderName,
      senderEmail,
      subject,
      riskScore,
      riskLevel,
      urlsFound,
      urgencyScore,
      scanDate,
      senderRisk: Math.round(Math.min(99, riskScore + (rand() * 20 - 10))),
      urlRisk: urlsFound > 0 ? Math.round(Math.min(99, riskScore + (rand() * 16 - 4))) : Math.round(rand() * 25),
      urgencyRisk: urgencyScore,
      aiClassification:
        riskLevel === "safe"
          ? AI_CLASSES[4 + Math.floor(rand() * 2)]
          : AI_CLASSES[Math.floor(rand() * 4)],
      detectedUrls,
      detectionReasons,
      recommendedAction: ACTIONS[riskLevel],
    })
  }

  return scans.sort((a, b) => +new Date(b.scanDate) - +new Date(a.scanDate))
}

export const MOCK_SCANS: EmailScan[] = buildScans()

export const MOCK_HIGH_RISK_SENDERS: HighRiskSender[] = [
  { email: "service@paypa1-secure.com", detections: 34, lastSeen: "2h ago", level: "high" },
  { email: "account-security@micros0ft-support.com", detections: 27, lastSeen: "5h ago", level: "high" },
  { email: "security@coinbase-wallet-alert.com", detections: 19, lastSeen: "1d ago", level: "high" },
  { email: "alerts@wellsfargo-verify.net", detections: 16, lastSeen: "1d ago", level: "high" },
  { email: "appleid@id-apple-verify.com", detections: 12, lastSeen: "2d ago", level: "medium" },
  { email: "payroll@company-payments.info", detections: 9, lastSeen: "3d ago", level: "medium" },
]

export const MOCK_SUSPICIOUS_DOMAINS: SuspiciousDomain[] = [
  { domain: "paypa1-secure.com", reports: 41, category: "Brand spoofing", level: "high" },
  { domain: "micros0ft-support.com", reports: 33, category: "Credential harvest", level: "high" },
  { domain: "coinbase-wallet-alert.com", reports: 22, category: "Crypto scam", level: "high" },
  { domain: "fedex-parcel-update.com", reports: 18, category: "Package lure", level: "medium" },
  { domain: "account-netflix.info", reports: 14, category: "Billing scam", level: "medium" },
  { domain: "company-payments.info", reports: 11, category: "Payroll fraud", level: "medium" },
]

export const MOCK_PHISHING_TERMS: PhishingTerm[] = [
  { term: "verify your account", frequency: 312 },
  { term: "action required", frequency: 268 },
  { term: "suspended", frequency: 221 },
  { term: "password expires", frequency: 187 },
  { term: "wire transfer", frequency: 154 },
  { term: "click here", frequency: 142 },
  { term: "urgent", frequency: 131 },
  { term: "confirm identity", frequency: 118 },
  { term: "payment failed", frequency: 96 },
  { term: "limited time", frequency: 84 },
]

export const MOCK_INCIDENTS: SecurityIncident[] = [
  {
    id: "inc-01",
    title: "Coordinated PayPal credential phishing wave",
    summary: "34 inbound messages spoofing PayPal billing detected across monitored inboxes within 6 hours.",
    level: "high",
    date: "Today, 09:42",
  },
  {
    id: "inc-02",
    title: "Microsoft 365 login harvesting campaign",
    summary: "Look-alike domain micros0ft-support.com observed delivering fake MFA prompts.",
    level: "high",
    date: "Yesterday, 17:08",
  },
  {
    id: "inc-03",
    title: "Payroll redirection attempt",
    summary: "Business email compromise targeting the finance team. Reply-to mismatch flagged.",
    level: "medium",
    date: "2 days ago, 11:20",
  },
  {
    id: "inc-04",
    title: "Bulk package-delivery lures",
    summary: "FedEx-themed messages with shortened tracking links blocked before delivery.",
    level: "medium",
    date: "3 days ago, 08:55",
  },
]

export const MOCK_ACCOUNTS: ConnectedAccount[] = [
  {
    id: "acc-gmail",
    provider: "Gmail",
    email: "security.ops@sentinelai.io",
    status: "connected",
    lastSync: "2 minutes ago",
    emailsMonitored: 12480,
  },
]
