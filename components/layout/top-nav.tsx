"use client"

import { usePathname } from "next/navigation"
import { useState } from "react"
import { Bell, Menu, PanelLeft, Search, ScanLine, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { PAGE_TITLES } from "@/lib/nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function TopNav({
  collapsed,
  onToggleCollapse,
  onOpenMobile,
}: {
  collapsed: boolean
  onToggleCollapse: () => void
  onOpenMobile: () => void
}) {
  const pathname = usePathname()
  const title = PAGE_TITLES[pathname] ?? "SentinelAI"
  const [scanning, setScanning] = useState(false)

  function handleScan() {
    setScanning(true)
    const id = toast.loading("Scanning inbox for threats…")
    setTimeout(() => {
      setScanning(false)
      toast.success("Inbox scan complete", {
        id,
        description: "12 new messages analyzed · 2 flagged as high-risk",
      })
    }, 2200)
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md lg:px-6">
      <Button
        variant="ghost"
        size="icon-sm"
        className="lg:hidden"
        onClick={onOpenMobile}
        aria-label="Open navigation menu"
      >
        <Menu />
      </Button>

      {collapsed && (
        <Button
          variant="ghost"
          size="icon-sm"
          className="hidden lg:inline-flex"
          onClick={onToggleCollapse}
          aria-label="Expand sidebar"
        >
          <PanelLeft />
        </Button>
      )}

      <h1 className="font-heading text-base font-semibold tracking-tight whitespace-nowrap">
        {title}
      </h1>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <div className="relative hidden md:block">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search emails, senders, domains…"
            className="h-9 w-56 pl-9 lg:w-72"
            aria-label="Global email search"
          />
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 sm:flex">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-safe opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-safe" />
          </span>
          <span className="text-xs font-medium text-muted-foreground">
            Gmail connected
          </span>
        </div>

        <Button
          variant="ghost"
          size="icon-sm"
          className="relative"
          aria-label="Notifications"
        >
          <Bell />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-high ring-2 ring-background" />
        </Button>

        <Button onClick={handleScan} disabled={scanning} size="sm">
          {scanning ? (
            <Loader2 data-icon="inline-start" className="animate-spin" />
          ) : (
            <ScanLine data-icon="inline-start" />
          )}
          <span className="hidden sm:inline">
            {scanning ? "Scanning…" : "Scan Inbox"}
          </span>
        </Button>

        <Avatar className={cn("size-8")}>
          <AvatarFallback className="bg-primary/15 text-xs font-medium text-primary">
            AM
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
