"use client"

import { useMemo, useState } from "react"
import useSWR from "swr"
import { Globe, Hash, UserX, AlertTriangle, ShieldAlert, AlertCircle, ShieldCheck } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  getHighRiskSenders,
  getPhishingTerms,
  getSecurityIncidents,
  getSuspiciousDomains,
} from "@/lib/api"
import type { RiskLevel } from "@/lib/types"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { RiskBadge } from "@/components/risk-badge"
import { RISK_META } from "@/lib/risk"

const LEVEL_ICONS: Record<RiskLevel, typeof AlertCircle> = {
  safe: ShieldCheck,
  medium: AlertTriangle,
  high: ShieldAlert,
}

const LEVEL_BADGE: Record<RiskLevel, typeof Badge> = {
  safe: "outline",
  medium: "secondary",
  high: "destructive",
}

const LEVEL_LABELS: Record<RiskLevel, string> = {
  safe: "Safe",
  medium: "Medium",
  high: "High",
}

function ListSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  )
}

export function ThreatIntelClient() {
  const [severity, setSeverity] = useState<RiskLevel | "all">("all")

  const senders = useSWR("high-risk-senders", getHighRiskSenders)
  const domains = useSWR("suspicious-domains", getSuspiciousDomains)
  const terms = useSWR("phishing-terms", getPhishingTerms)
  const incidents = useSWR("security-incidents", getSecurityIncidents)

  const filterBySeverity = <T extends { level: RiskLevel }>(items?: T[]) =>
    (items ?? []).filter((i) => severity === "all" || i.level === severity)

  const filteredSenders = useMemo(() => filterBySeverity(senders.data), [senders.data, severity])
  const filteredDomains = useMemo(() => filterBySeverity(domains.data), [domains.data, severity])
  const filteredIncidents = useMemo(() => filterBySeverity(incidents.data), [incidents.data, severity])

  const maxFreq = Math.max(1, ...(terms.data?.map((t) => t.frequency) ?? [1]))

  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-0.5">
          <h2 className="font-heading text-lg font-semibold tracking-tight">Threat Landscape</h2>
          <p className="text-sm text-muted-foreground">Aggregated intelligence across all monitored inboxes</p>
        </div>
        <ToggleGroup
          value={[severity]}
          onValueChange={(val) => setSeverity((val[0] as RiskLevel | "all") ?? "all")}
          className="w-fit"
        >
          <ToggleGroupItem value="all">All</ToggleGroupItem>
          <ToggleGroupItem value="high">High</ToggleGroupItem>
          <ToggleGroupItem value="medium">Medium</ToggleGroupItem>
          <ToggleGroupItem value="safe">Safe</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
        {/* High-risk senders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserX className="size-4 text-high" />
              High-Risk Senders
            </CardTitle>
            <CardDescription>Addresses with the most threat detections</CardDescription>
          </CardHeader>
          <CardContent>
            {senders.isLoading ? (
              <ListSkeleton />
            ) : senders.error ? (
              <p className="py-6 text-center text-sm text-muted-foreground">Failed to load senders.</p>
            ) : filteredSenders.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No senders match this severity.</p>
            ) : (
              <ul className="flex flex-col divide-y divide-border">
                {filteredSenders.map((s) => (
                  <li key={s.email} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate font-mono text-xs">{s.email}</span>
                      <span className="text-xs text-muted-foreground">Last seen {s.lastSeen}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold tabular-nums">{s.detections}</span>
                      <RiskBadge level={s.level} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Suspicious domains */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="size-4 text-medium" />
              Suspicious Domains
            </CardTitle>
            <CardDescription>Look-alike and newly registered domains</CardDescription>
          </CardHeader>
          <CardContent>
            {domains.isLoading ? (
              <ListSkeleton />
            ) : domains.error ? (
              <p className="py-6 text-center text-sm text-muted-foreground">Failed to load domains.</p>
            ) : filteredDomains.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No domains match this severity.</p>
            ) : (
              <ul className="flex flex-col divide-y divide-border">
                {filteredDomains.map((d) => (
                  <li key={d.domain} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate font-mono text-xs">{d.domain}</span>
                      <span className="text-xs text-muted-foreground">{d.category}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground tabular-nums">{d.reports} reports</span>
                      <RiskBadge level={d.level} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Phishing terms */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="size-4 text-primary" />
              Frequently Detected Phishing Terms
            </CardTitle>
            <CardDescription>Common phrases across flagged messages</CardDescription>
          </CardHeader>
          <CardContent>
            {terms.isLoading ? (
              <ListSkeleton />
            ) : terms.error ? (
              <p className="py-6 text-center text-sm text-muted-foreground">Failed to load terms.</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {terms.data?.map((t) => (
                  <li key={t.term} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>{t.term}</span>
                      <span className="text-xs text-muted-foreground tabular-nums">{t.frequency}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${(t.frequency / maxFreq) * 100}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Recent incidents */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Security Incidents</CardTitle>
            <CardDescription>Notable campaigns detected recently</CardDescription>
          </CardHeader>
          <CardContent>
            {incidents.isLoading ? (
              <ListSkeleton />
            ) : incidents.error ? (
              <p className="py-6 text-center text-sm text-muted-foreground">Failed to load incidents.</p>
            ) : filteredIncidents.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No incidents match this severity.</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {filteredIncidents.map((inc) => {
                  const LevelIcon = LEVEL_ICONS[inc.level]
                  return (
                    <li
                      key={inc.id}
                      className="flex flex-col gap-1.5 rounded-lg border border-border bg-muted/30 p-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="flex items-center gap-2 text-sm font-medium">
                          <LevelIcon className={cn("size-4 shrink-0", RISK_META[inc.level].text)} />
                          {inc.title}
                        </span>
                        <span className="shrink-0 text-xs text-muted-foreground">{inc.date}</span>
                      </div>
                      <p className="text-xs leading-relaxed text-muted-foreground">{inc.summary}</p>
                    </li>
                  )
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
