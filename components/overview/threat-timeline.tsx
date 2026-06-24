import { cn } from "@/lib/utils"
import { RISK_META } from "@/lib/risk"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { ThreatTimelineEvent } from "@/lib/types"

export function ThreatTimeline({ events }: { events: ThreatTimelineEvent[] }) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Threat Activity Timeline</CardTitle>
        <CardDescription>Most recent security events</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ol className="relative flex flex-col">
          {events.map((event, i) => {
            const meta = RISK_META[event.level]
            return (
              <li key={event.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span
                    className={cn("mt-1.5 size-2.5 shrink-0 rounded-full", meta.dot)}
                  />
                  {i < events.length - 1 && (
                    <span className="w-px flex-1 bg-border" />
                  )}
                </div>
                <div className={cn("flex flex-col gap-0.5 pb-5", i === events.length - 1 && "pb-0")}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium leading-tight">
                      {event.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {event.time}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {event.description}
                  </span>
                </div>
              </li>
            )
          })}
        </ol>
      </CardContent>
    </Card>
  )
}
