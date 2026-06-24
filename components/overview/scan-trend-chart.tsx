"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { ScanTrendPoint } from "@/lib/types"

const chartConfig = {
  scanned: { label: "Scanned", color: "var(--color-chart-1)" },
  threats: { label: "Threats", color: "var(--color-high)" },
} satisfies ChartConfig

export function ScanTrendChart({ data }: { data: ScanTrendPoint[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Scanning Trend</CardTitle>
        <CardDescription>Messages scanned vs. threats detected (14 days)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[260px] w-full">
          <AreaChart data={data} margin={{ left: 12, right: 8, top: 8 }}>
            <defs>
              <linearGradient id="fillScanned" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-scanned)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--color-scanned)" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="fillThreats" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-threats)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-threats)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={24}
              className="text-xs"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={44}
              className="text-xs"
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Area
              dataKey="scanned"
              type="monotone"
              fill="url(#fillScanned)"
              stroke="var(--color-scanned)"
              strokeWidth={2}
            />
            <Area
              dataKey="threats"
              type="monotone"
              fill="url(#fillThreats)"
              stroke="var(--color-threats)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
