"use client"

import { useMemo, useState } from "react"
import useSWR from "swr"
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  RotateCw,
  Search,
  ShieldX,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { getEmailScans } from "@/lib/api"
import { formatScanDate } from "@/lib/risk"
import type { EmailScan, RiskLevel } from "@/lib/types"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RiskBadge } from "@/components/risk-badge"
import { ScansTableSkeleton } from "@/components/scans/scans-table-skeleton"
import { ThreatDetailsPanel } from "@/components/scans/threat-details-panel"

type SortKey = "riskScore" | "scanDate" | "urgencyScore" | "urlsFound"
type DateFilter = "all" | "24h" | "7d" | "30d"
const PAGE_SIZE = 8

function scoreColor(score: number) {
  if (score >= 70) return "text-high"
  if (score >= 40) return "text-medium"
  return "text-safe"
}

export function ScansTable() {
  const { data, error, isLoading, mutate } = useSWR<EmailScan[]>(
    "email-scans",
    getEmailScans,
  )

  const [query, setQuery] = useState("")
  const [levelFilter, setLevelFilter] = useState<RiskLevel | "all">("all")
  const [dateFilter, setDateFilter] = useState<DateFilter>("all")
  const [sortKey, setSortKey] = useState<SortKey>("scanDate")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")
  const [page, setPage] = useState(1)

  const [selected, setSelected] = useState<EmailScan | null>(null)
  const [panelOpen, setPanelOpen] = useState(false)

  const filtered = useMemo(() => {
    if (!data) return []
    const now = Date.now()
    const windowMs =
      dateFilter === "24h"
        ? 864e5
        : dateFilter === "7d"
          ? 7 * 864e5
          : dateFilter === "30d"
            ? 30 * 864e5
            : Infinity

    const result = data.filter((s) => {
      const matchesQuery =
        !query ||
        s.senderName.toLowerCase().includes(query.toLowerCase()) ||
        s.senderEmail.toLowerCase().includes(query.toLowerCase()) ||
        s.subject.toLowerCase().includes(query.toLowerCase())
      const matchesLevel = levelFilter === "all" || s.riskLevel === levelFilter
      const matchesDate = now - +new Date(s.scanDate) <= windowMs
      return matchesQuery && matchesLevel && matchesDate
    })

    result.sort((a, b) => {
      let cmp = 0
      if (sortKey === "scanDate") {
        cmp = +new Date(a.scanDate) - +new Date(b.scanDate)
      } else {
        cmp = a[sortKey] - b[sortKey]
      }
      return sortDir === "asc" ? cmp : -cmp
    })
    return result
  }, [data, query, levelFilter, dateFilter, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  )

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir("desc")
    }
    setPage(1)
  }

  function openDetails(scan: EmailScan) {
    setSelected(scan)
    setPanelOpen(true)
  }

  function resetFilters() {
    setQuery("")
    setLevelFilter("all")
    setDateFilter("all")
    setPage(1)
  }

  const SortHeader = ({ label, k }: { label: string; k: SortKey }) => (
    <button
      type="button"
      onClick={() => toggleSort(k)}
      className={cn(
        "inline-flex items-center gap-1 transition-colors hover:text-foreground",
        sortKey === k && "text-foreground",
      )}
    >
      {label}
      <ArrowUpDown className="size-3" />
    </button>
  )

  return (
    <Card className="gap-0 py-0">
      <CardHeader className="gap-4 border-b border-border p-4 lg:p-5 [.border-b]:pb-4 lg:[.border-b]:pb-5">
        <div className="flex flex-col gap-1">
          <CardTitle>Recent Email Scans</CardTitle>
          <CardDescription>
            {filtered.length} {filtered.length === 1 ? "message" : "messages"} match your filters
          </CardDescription>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setPage(1)
              }}
              placeholder="Search sender or subject…"
              className="h-9 pl-9"
              aria-label="Search scans"
            />
          </div>

          <Select
            value={levelFilter}
            onValueChange={(v) => {
              setLevelFilter(v as RiskLevel | "all")
              setPage(1)
            }}
          >
            <SelectTrigger className="h-9 w-full sm:w-36" aria-label="Filter by risk level">
              <SelectValue placeholder="Risk level" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All levels</SelectItem>
                <SelectItem value="high">High risk</SelectItem>
                <SelectItem value="medium">Medium risk</SelectItem>
                <SelectItem value="safe">Safe</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            value={dateFilter}
            onValueChange={(v) => {
              setDateFilter(v as DateFilter)
              setPage(1)
            }}
          >
            <SelectTrigger className="h-9 w-full sm:w-36" aria-label="Filter by date">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All time</SelectItem>
                <SelectItem value="24h">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {error ? (
          <div className="p-5">
            <Alert variant="destructive">
              <ShieldX />
              <AlertTitle>Unable to load email scans</AlertTitle>
              <AlertDescription>
                Something went wrong while reaching the analysis service.
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 w-fit"
                  onClick={() => mutate()}
                >
                  <RotateCw data-icon="inline-start" />
                  Try again
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        ) : isLoading ? (
          <ScansTableSkeleton />
        ) : paged.length === 0 ? (
          <Empty className="py-12">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Search />
              </EmptyMedia>
              <EmptyTitle>No matching emails</EmptyTitle>
              <EmptyDescription>
                Try adjusting your search or filters to find what you&apos;re looking for.
              </EmptyDescription>
            </EmptyHeader>
            <Button variant="outline" size="sm" onClick={resetFilters}>
              Clear filters
            </Button>
          </Empty>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Sender</TableHead>
                <TableHead className="hidden md:table-cell">Subject</TableHead>
                <TableHead><SortHeader label="Risk Score" k="riskScore" /></TableHead>
                <TableHead>Level</TableHead>
                <TableHead className="hidden lg:table-cell"><SortHeader label="URLs" k="urlsFound" /></TableHead>
                <TableHead className="hidden lg:table-cell"><SortHeader label="Urgency" k="urgencyScore" /></TableHead>
                <TableHead className="hidden sm:table-cell"><SortHeader label="Scan Date" k="scanDate" /></TableHead>
                <TableHead className="w-10 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.map((scan) => (
                <TableRow
                  key={scan.id}
                  className="cursor-pointer"
                  onClick={() => openDetails(scan)}
                >
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{scan.senderName}</span>
                      <span className="max-w-44 truncate text-xs text-muted-foreground">
                        {scan.senderEmail}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden max-w-72 md:table-cell">
                    <span className="block truncate text-muted-foreground">
                      {scan.subject}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={cn("font-semibold tabular-nums", scoreColor(scan.riskScore))}>
                      {scan.riskScore}
                    </span>
                  </TableCell>
                  <TableCell>
                    <RiskBadge level={scan.riskLevel} />
                  </TableCell>
                  <TableCell className="hidden tabular-nums text-muted-foreground lg:table-cell">
                    {scan.urlsFound}
                  </TableCell>
                  <TableCell className="hidden tabular-nums text-muted-foreground lg:table-cell">
                    {scan.urgencyScore}
                  </TableCell>
                  <TableCell className="hidden whitespace-nowrap text-muted-foreground sm:table-cell">
                    {formatScanDate(scan.scanDate)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`View details for ${scan.subject}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        openDetails(scan)
                      }}
                    >
                      <Eye />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {!isLoading && !error && filtered.length > 0 && (
        <div className="flex items-center justify-between gap-2 border-t border-border p-4">
          <p className="text-xs text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft data-icon="inline-start" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
              <ChevronRight data-icon="inline-end" />
            </Button>
          </div>
        </div>
      )}

      <ThreatDetailsPanel
        scan={selected}
        open={panelOpen}
        onOpenChange={setPanelOpen}
      />
    </Card>
  )
}
