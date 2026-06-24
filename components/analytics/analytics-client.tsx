"use client"

import useSWR from "swr"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
} from "recharts"

import { cn } from "@/lib/utils"
import { getScanTrend, getRiskDistribution, getDetectionSignals, getOverviewStats } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { RISK_META } from "@/lib/risk"

function ChartSkeleton({ className }: { className?: string }) {
  return <Skeleton className={cn("aspect-video w-full", className)} />
}

export function AnalyticsClient() {
  const stats = useSWR("overview-stats", getOverviewStats)
  const trend = useSWR("scan-trend", getScanTrend)
  const distribution = useSWR("risk-distribution", getRiskDistribution)
  const signals = useSWR("detection-signals", getDetectionSignals)

  const trendData = trend.data ?? []
  const distributionData = distribution.data ?? []
  const signalsData = signals.data ?? []
  const statsData = stats.data ?? []

  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      <div className="flex flex-col gap-0.5">
        <h2 className="font-heading text-lg font-semibold tracking-tight">Analytics</h2>
        <p className="text-sm text-muted-foreground">Historical trends, distributions and signal breakdowns</p>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {stats.isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))
        ) : stats.error ? (
          <div className="col-span-full flex items-center justify-center rounded-lg border border-border p-6 text-sm text-muted-foreground">
            Failed to load summary statistics.
          </div>
        ) : (
          statsData.map((stat) => (
            <Card key={stat.key} className="gap-0 py-0">
              <CardContent className="flex flex-col gap-2 p-4">
                <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                <span className="font-heading text-2xl font-semibold tabular-nums tracking-tight">
                  {stat.value.toLocaleString()}
                </span>
                <span className={cn("text-xs font-medium", stat.change >= 0 ? "text-safe" : "text-high")}>
                  {stat.change >= 0 ? "+" : ""}
                  {stat.change}% vs last period
                </span>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Charts grid */}
      <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
        {/* Scan Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Scan Trend (14 days)</CardTitle>
            <CardDescription>Emails scanned and threats detected over time</CardDescription>
          </CardHeader>
          <CardContent>
            {trend.isLoading ? (
              <ChartSkeleton />
            ) : trend.error ? (
              <div className="flex items-center justify-center rounded-lg border border-border p-6 text-sm text-muted-foreground">
                Failed to load trend data.
              </div>
            ) : (
              <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 8, right: 8, left: 12, bottom: 0 }}>
                    <defs>
                      <linearGradient id="fillScanned" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0.02} />
                      </linearGradient>
                      <linearGradient id="fillThreats" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-high)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--color-high)" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} minTickGap={24} />
                    <YAxis tickLine={false} axisLine={false} width={44} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--popover)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        fontSize: "12px",
                        color: "var(--popover-foreground)",
                      }}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="scanned" stroke="var(--color-chart-1)" fill="url(#fillScanned)" strokeWidth={2} />
                    <Area type="monotone" dataKey="threats" stroke="var(--color-high)" fill="url(#fillThreats)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Risk Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
            <CardDescription>Breakdown of safe, medium and high-risk messages</CardDescription>
          </CardHeader>
          <CardContent>
            {distribution.isLoading ? (
              <ChartSkeleton />
            ) : distribution.error ? (
              <div className="flex items-center justify-center rounded-lg border border-border p-6 text-sm text-muted-foreground">
                Failed to load distribution data.
              </div>
            ) : (
              <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distributionData}
                      dataKey="count"
                      nameKey="label"
                      innerRadius={60}
                      outerRadius={90}
                      strokeWidth={2}
                      paddingAngle={2}
                    >
                      {distributionData.map((entry) => (
                        <Cell key={entry.level} fill={RISK_META[entry.level].chart} stroke="var(--color-card)" />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--popover)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        fontSize: "12px",
                        color: "var(--popover-foreground)",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detection Signals */}
        <Card>
          <CardHeader>
            <CardTitle>Detection Signals</CardTitle>
            <CardDescription>Threats caught by URL, sender, urgency and AI-model analysis</CardDescription>
          </CardHeader>
          <CardContent>
            {signals.isLoading ? (
              <ChartSkeleton />
            ) : signals.error ? (
              <div className="flex items-center justify-center rounded-lg border border-border p-6 text-sm text-muted-foreground">
                Failed to load signal data.
              </div>
            ) : (
              <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={signalsData} margin={{ top: 8, right: 8, left: 12, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="signal" tickLine={false} axisLine={false} tickMargin={8} />
                    <YAxis tickLine={false} axisLine={false} width={44} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--popover)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        fontSize: "12px",
                        color: "var(--popover-foreground)",
                      }}
                    />
                    <Bar dataKey="detections" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} maxBarSize={56} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top terms mini table */}
        <Card>
          <CardHeader>
            <CardTitle>Top Phishing Terms</CardTitle>
            <CardDescription>Most frequently detected suspicious phrases</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-3">
              {[
                { term: "verify your account", count: 312 },
                { term: "action required", count: 268 },
                { term: "suspended", count: 221 },
                { term: "password expires", count: 187 },
                { term: "wire transfer", count: 154 },
                { term: "click here", count: 142 },
                { term: "urgent", count: 131 },
              ].map((t) => (
                <li key={t.term} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t.term}</span>
                  <span className="font-semibold tabular-nums">{t.count}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
