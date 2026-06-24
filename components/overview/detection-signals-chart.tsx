"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { DetectionSignalPoint } from "@/lib/types"

const chartConfig = {
  detections: { label: "Detections", color: "var(--color-chart-1)" },
} satisfies ChartConfig

export function DetectionSignalsChart({
  data,
}: {
  data: DetectionSignalPoint[]
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detection Signals</CardTitle>
        <CardDescription>
          Threats caught by URL, sender, urgency and AI-model analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[260px] w-full">
          <BarChart data={data} margin={{ left: 12, right: 8, top: 8 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="signal"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={44}
              className="text-xs"
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar
              dataKey="detections"
              fill="var(--color-detections)"
              radius={[6, 6, 0, 0]}
              maxBarSize={56}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
