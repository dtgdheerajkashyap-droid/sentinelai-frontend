"use client"

import {
  AlertTriangle,
  Brain,
  Clock,
  Link2,
  ShieldCheck,
  User,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { RISK_META, formatScanDate } from "@/lib/risk"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { RiskBadge } from "@/components/risk-badge"
import { RiskGauge } from "@/components/risk-gauge"
import type { EmailScan } from "@/lib/types"

function SignalBar({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof User
  label: string
  value: number
}) {
  const level = value >= 70 ? "high" : value >= 40 ? "medium" : "safe"
  const meta = RISK_META[level]
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 text-muted-foreground">
          <Icon className="size-4" />
          {label}
        </span>
        <span className={cn("font-medium tabular-nums", meta.text)}>{value}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${value}%`, backgroundColor: meta.chart }}
        />
      </div>
    </div>
  )
}

export function ThreatDetailsPanel({
  scan,
  open,
  onOpenChange,
}: {
  scan: EmailScan | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border p-5">
          <SheetTitle>Email Threat Details</SheetTitle>
          {scan && (
            <p className="text-xs text-muted-foreground">
              Analysis ID · {scan.id}
            </p>
          )}
        </SheetHeader>

        {scan && (
          <ScrollArea className="h-[calc(100svh-73px)]">
            <div className="flex flex-col gap-6 p-5">
              {/* Sender + subject */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">{scan.senderName}</span>
                  <RiskBadge level={scan.riskLevel} />
                </div>
                <span className="text-xs text-muted-foreground">
                  {scan.senderEmail}
                </span>
                <p className="text-sm leading-relaxed text-foreground">
                  {scan.subject}
                </p>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="size-3.5" />
                  {formatScanDate(scan.scanDate)}
                </span>
              </div>

              <Separator />

              {/* Gauge */}
              <div className="flex flex-col items-center gap-3">
                <RiskGauge score={scan.riskScore} />
                <RiskBadge level={scan.riskLevel} />
              </div>

              <Separator />

              {/* Signal breakdown */}
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-medium">Signal Breakdown</h3>
                <SignalBar icon={Link2} label="URL risk" value={scan.urlRisk} />
                <SignalBar icon={User} label="Sender risk" value={scan.senderRisk} />
                <SignalBar
                  icon={AlertTriangle}
                  label="Urgency risk"
                  value={scan.urgencyRisk}
                />
              </div>

              <Separator />

              {/* AI classification */}
              <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-muted/40 p-3">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Brain className="size-4 text-primary" />
                  AI Classification
                </span>
                <span className="text-sm font-medium">{scan.aiClassification}</span>
              </div>

              {/* Detected URLs */}
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-medium">
                  Detected URLs ({scan.detectedUrls.length})
                </h3>
                {scan.detectedUrls.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    No URLs were found in this message.
                  </p>
                ) : (
                  <ul className="flex flex-col gap-1.5">
                    {scan.detectedUrls.map((url, i) => (
                      <li
                        key={`${url}-${i}`}
                        className="flex items-center gap-2 rounded-md border border-border bg-card px-2.5 py-1.5"
                      >
                        <Link2 className="size-3.5 shrink-0 text-high" />
                        <span className="truncate font-mono text-xs text-muted-foreground">
                          {url}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Detection reasons */}
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-medium">Detection Reasons</h3>
                <ul className="flex flex-col gap-2">
                  {scan.detectionReasons.map((reason, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-medium" />
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended action */}
              <div
                className={cn(
                  "flex flex-col gap-1.5 rounded-lg border p-3",
                  scan.riskLevel === "high"
                    ? "border-high/30 bg-high/10"
                    : scan.riskLevel === "medium"
                      ? "border-medium/30 bg-medium/10"
                      : "border-safe/30 bg-safe/10",
                )}
              >
                <span className="flex items-center gap-2 text-sm font-medium">
                  <ShieldCheck
                    className={cn("size-4", RISK_META[scan.riskLevel].text)}
                  />
                  Recommended Action
                </span>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {scan.recommendedAction}
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  Mark as Safe
                </Button>
                <Button className="flex-1">Quarantine</Button>
              </div>
            </div>
          </ScrollArea>
        )}
      </SheetContent>
    </Sheet>
  )
}
