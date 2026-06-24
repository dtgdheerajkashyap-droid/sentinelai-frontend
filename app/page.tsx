import {
  getDetectionSignals,
  getOverviewStats,
  getRiskDistribution,
  getScanTrend,
  getThreatTimeline,
} from "@/lib/api"
import { StatCards } from "@/components/overview/stat-cards"
import { RiskDistributionChart } from "@/components/overview/risk-distribution-chart"
import { ScanTrendChart } from "@/components/overview/scan-trend-chart"
import { DetectionSignalsChart } from "@/components/overview/detection-signals-chart"
import { ThreatTimeline } from "@/components/overview/threat-timeline"

export default async function OverviewPage() {
  const [stats, distribution, trend, signals, timeline] = await Promise.all([
    getOverviewStats(),
    getRiskDistribution(),
    getScanTrend(),
    getDetectionSignals(),
    getThreatTimeline(),
  ])

  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      <StatCards stats={stats} />

      <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
        <div className="lg:col-span-2">
          <ScanTrendChart data={trend} />
        </div>
        <RiskDistributionChart data={distribution} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
        <div className="lg:col-span-2">
          <DetectionSignalsChart data={signals} />
        </div>
        <ThreatTimeline events={timeline} />
      </div>
    </div>
  )
}
