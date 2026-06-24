import type { RiskLevel } from "@/lib/types"

export const RISK_META: Record<
  RiskLevel,
  { label: string; dot: string; text: string; bg: string; chart: string }
> = {
  safe: {
    label: "Safe",
    dot: "bg-safe",
    text: "text-safe",
    bg: "bg-safe/12 text-safe",
    chart: "var(--color-safe)",
  },
  medium: {
    label: "Medium",
    dot: "bg-medium",
    text: "text-medium",
    bg: "bg-medium/12 text-medium",
    chart: "var(--color-medium)",
  },
  high: {
    label: "High",
    dot: "bg-high",
    text: "text-high",
    bg: "bg-high/15 text-high",
    chart: "var(--color-high)",
  },
}

export function levelFromScore(score: number): RiskLevel {
  if (score >= 70) return "high"
  if (score >= 40) return "medium"
  return "safe"
}

export function formatNumber(n: number): string {
  return n.toLocaleString("en-US")
}

export function formatScanDate(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}
