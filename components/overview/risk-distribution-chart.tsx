"use client"

import { Cell, Label, Pie, PieChart } from "recharts"

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
import { RISK_META } from "@/lib/risk"
import type { RiskDistributionPoint } from "@/lib/types"

const chartConfig = {
  count: { label: "Emails" },
  safe: { label: "Safe", color: "var(--color-safe)" },
  medium: { label: "Medium", color: "var(--color-medium)" },
  high: { label: "High", color: "var(--color-high)" },
} satisfies ChartConfig

export function RiskDistributionChart({
  data,
}: {
  data: RiskDistributionPoint[]
}) {
  const total = data.reduce((a, d) => a + d.count, 0)

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Risk-Level Distribution</CardTitle>
        <CardDescription>Breakdown of analyzed messages</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col items-center gap-4">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[220px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent nameKey="level" hideLabel />}
            />
            <Pie
              data={data}
              dataKey="count"
              nameKey="level"
              innerRadius={62}
              outerRadius={92}
              strokeWidth={2}
              paddingAngle={2}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.level}
                  fill={RISK_META[entry.level].chart}
                  stroke="var(--color-card)"
                />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-2xl font-semibold"
                        >
                          {total}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) + 20}
                          className="fill-muted-foreground text-xs"
                        >
                          Scanned
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>

        <div className="grid w-full grid-cols-3 gap-2">
          {data.map((d) => (
            <div key={d.level} className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1.5">
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: RISK_META[d.level].chart }}
                />
                <span className="text-xs text-muted-foreground">{d.label}</span>
              </div>
              <span className="text-sm font-semibold tabular-nums">
                {d.count}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
