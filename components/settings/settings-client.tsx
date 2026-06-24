"use client"

import { useState } from "react"
import { Bell, Shield, Eye, Monitor, Loader as Loader2, Save } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { toast } from "sonner"

function SettingsSection({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <h3 className="text-sm font-medium">{title}</h3>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      {children}
    </div>
  )
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
  disabled,
}: {
  label: string
  description?: string
  checked: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
}) {
  return (
    <div className={cn("flex items-center justify-between gap-4", disabled && "opacity-60")}>
      <div className="flex flex-col gap-0.5">
        <span className="text-sm">{label}</span>
        {description && <span className="text-xs text-muted-foreground">{description}</span>}
      </div>
      <Switch checked={checked} onCheckedChange={onChange} disabled={disabled} />
    </div>
  )
}

export function SettingsClient() {
  const [saving, setSaving] = useState(false)

  // Preferences
  const [autoScan, setAutoScan] = useState(true)
  const [quarantineHigh, setQuarantineHigh] = useState(true)
  const [notifyMedium, setNotifyMedium] = useState(false)
  const [notifySlack, setNotifySlack] = useState(false)
  const [notifyEmail, setNotifyEmail] = useState(true)
  const [digestDaily, setDigestDaily] = useState(true)
  const [showPreviews, setShowPreviews] = useState(true)
  const [theme, setTheme] = useState("dark")
  const [riskThreshold, setRiskThreshold] = useState([70])

  function handleSave() {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      toast.success("Settings saved", { description: "Your preferences have been updated." })
    }, 1200)
  }

  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      <div className="flex flex-col gap-0.5">
        <h2 className="font-heading text-lg font-semibold tracking-tight">Settings</h2>
        <p className="text-sm text-muted-foreground">Configure SentinelAI detection, alerts and UI preferences</p>
      </div>

      <Tabs defaultValue="detection" className="w-full">
        <TabsList className="w-full sm:w-fit">
          <TabsTrigger value="detection" className="gap-1.5">
            <Shield className="size-3.5" /> Detection
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5">
            <Bell className="size-3.5" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="display" className="gap-1.5">
            <Monitor className="size-3.5" /> Display
          </TabsTrigger>
        </TabsList>

        <TabsContent value="detection" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Detection Rules</CardTitle>
              <CardDescription>Adjust how threats are identified and handled</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <SettingsSection
                title="Auto-scan inbox"
                description="Automatically scan incoming messages every 15 minutes"
              >
                <ToggleRow label="Enabled" checked={autoScan} onChange={setAutoScan} />
              </SettingsSection>

              <div className="h-px bg-border" />

              <SettingsSection
                title="Auto-quarantine"
                description="Automatically move high-risk emails to quarantine"
              >
                <ToggleRow label="Quarantine high-risk emails" checked={quarantineHigh} onChange={setQuarantineHigh} />
              </SettingsSection>

              <div className="h-px bg-border" />

              <SettingsSection
                title="Risk threshold"
                description="Minimum score to flag a message as high-risk"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Score</span>
                    <span className="font-semibold tabular-nums">{riskThreshold[0]}</span>
                  </div>
                  <Slider value={riskThreshold} onValueChange={setRiskThreshold} min={40} max={95} step={1} />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Lenient</span>
                    <span>Strict</span>
                  </div>
                </div>
              </SettingsSection>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Channels</CardTitle>
              <CardDescription>Choose how and when you receive alerts</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <SettingsSection title="In-app alerts">
                <div className="flex flex-col gap-3">
                  <ToggleRow
                    label="High-risk alerts"
                    description="Show banner when high-risk email arrives"
                    checked={true}
                    onChange={() => {}}
                    disabled
                  />
                  <ToggleRow
                    label="Medium-risk alerts"
                    description="Show banner when medium-risk email arrives"
                    checked={notifyMedium}
                    onChange={setNotifyMedium}
                  />
                </div>
              </SettingsSection>

              <div className="h-px bg-border" />

              <SettingsSection title="External channels">
                <div className="flex flex-col gap-3">
                  <ToggleRow
                    label="Email digest"
                    description="Receive a daily summary of flagged messages"
                    checked={notifyEmail}
                    onChange={setNotifyEmail}
                  />
                  <ToggleRow
                    label="Slack notifications"
                    description="Post alerts to a configured Slack channel"
                    checked={notifySlack}
                    onChange={setNotifySlack}
                  />
                </div>
              </SettingsSection>

              <div className="h-px bg-border" />

              <SettingsSection title="Digest schedule">
                <div className="flex flex-col gap-2">
                  <ToggleRow
                    label="Daily digest"
                    description="Send summary at 09:00 UTC"
                    checked={digestDaily}
                    onChange={setDigestDaily}
                  />
                </div>
              </SettingsSection>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="display" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Display Preferences</CardTitle>
              <CardDescription>Customize the dashboard appearance</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <SettingsSection title="Theme">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Select value={theme} onValueChange={setTheme}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dark">Dark (SOC)</SelectItem>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </SettingsSection>

              <div className="h-px bg-border" />

              <SettingsSection
                title="Message preview"
                description="Show a snippet of the email body in the scans table"
              >
                <ToggleRow
                  label="Show previews"
                  checked={showPreviews}
                  onChange={setShowPreviews}
                />
              </SettingsSection>

              <div className="h-px bg-border" />

              <SettingsSection
                title="Data density"
                description="Adjust how much information is shown per row"
              >
                <div className="flex items-center gap-2">
                  <Select defaultValue="comfortable">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compact">Compact</SelectItem>
                      <SelectItem value="comfortable">Comfortable</SelectItem>
                      <SelectItem value="spacious">Spacious</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </SettingsSection>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-end gap-3">
        <Button variant="outline" onClick={() => toast.info("Reset to defaults", { description: "Coming soon." })}>
          Reset
        </Button>
        <Button onClick={handleSave} disabled={saving} className="gap-1.5">
          {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
          Save Settings
        </Button>
      </div>
    </div>
  )
}
