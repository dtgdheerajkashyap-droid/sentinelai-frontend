"use client"

import { useState } from "react"
import useSWR from "swr"
import { Mail, RefreshCw, Trash2, Plug, CircleAlert as AlertCircle, Loader as Loader2, Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { getConnectedAccounts } from "@/lib/api"
import type { ConnectedAccount } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "sonner"

function AccountCard({
  account,
  onSync,
  onDisconnect,
}: {
  account: ConnectedAccount
  onSync: (id: string) => void
  onDisconnect: (id: string) => void
}) {
  const [syncing, setSyncing] = useState(false)

  function handleSync() {
    setSyncing(true)
    onSync(account.id)
    setTimeout(() => {
      setSyncing(false)
      toast.success("Account synced", { description: `${account.email} is up to date.` })
    }, 1500)
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted">
          <Mail className="size-5 text-muted-foreground" />
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{account.email}</span>
            <Badge
              variant={
                account.status === "connected"
                  ? "default"
                  : account.status === "error"
                    ? "destructive"
                    : "secondary"
              }
              className="text-[10px]"
            >
              {account.status}
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground">
            {account.provider} · {account.emailsMonitored.toLocaleString()} emails monitored · Last sync{" "}
            {account.lastSync}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={handleSync}
          disabled={syncing || account.status === "disconnected"}
        >
          {syncing ? <Loader2 className="size-3.5 animate-spin" /> : <RefreshCw className="size-3.5" />}
          Sync
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground hover:text-destructive"
          onClick={() => onDisconnect(account.id)}
          aria-label="Disconnect account"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  )
}

export function AccountsClient() {
  const { data, error, isLoading, mutate } = useSWR<ConnectedAccount[]>("connected-accounts", getConnectedAccounts)

  const [accounts, setAccounts] = useState<ConnectedAccount[] | undefined>(undefined)
  const [adding, setAdding] = useState(false)

  // Seed from data once
  if (data && accounts === undefined) {
    setAccounts(data)
  }

  function handleSync(id: string) {
    setAccounts((prev) =>
      prev?.map((a) => (a.id === id ? { ...a, lastSync: "just now" } : a)),
    )
  }

  function handleDisconnect(id: string) {
    setAccounts((prev) => prev?.filter((a) => a.id !== id))
    toast.success("Account disconnected", { description: "You can reconnect it at any time." })
  }

  function handleAdd() {
    setAdding(true)
    setTimeout(() => {
      setAdding(false)
      toast.success("Integration ready", { description: "This will connect to the FastAPI backend once live." })
    }, 1200)
  }

  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-0.5">
          <h2 className="font-heading text-lg font-semibold tracking-tight">Connected Accounts</h2>
          <p className="text-sm text-muted-foreground">Email providers linked to SentinelAI</p>
        </div>
        <Button onClick={handleAdd} disabled={adding} size="sm" className="gap-1.5">
          {adding ? <Loader2 className="size-3.5 animate-spin" /> : <Plus className="size-3.5" />}
          Add Account
        </Button>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Unable to load accounts</AlertTitle>
          <AlertDescription>
            Something went wrong while fetching connected accounts.
            <Button variant="outline" size="sm" className="mt-2 w-fit" onClick={() => mutate()}>
              <RefreshCw className="size-3.5" /> Try again
            </Button>
          </AlertDescription>
        </Alert>
      ) : isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : accounts && accounts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
              <Plug className="size-5 text-muted-foreground" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium">No accounts connected</p>
              <p className="text-sm text-muted-foreground">
                Connect an email provider to start scanning for threats.
              </p>
            </div>
            <Button onClick={handleAdd} disabled={adding} size="sm">
              {adding ? "Connecting…" : "Connect Account"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {accounts?.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              onSync={handleSync}
              onDisconnect={handleDisconnect}
            />
          ))}
        </div>
      )}
    </div>
  )
}
