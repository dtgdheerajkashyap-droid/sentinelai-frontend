import {
  LayoutDashboard,
  Mail,
  ShieldAlert,
  BarChart3,
  Plug,
  Settings,
  type LucideIcon,
} from "lucide-react"

export interface NavItem {
  title: string
  href: string
  icon: LucideIcon
}

export const NAV_ITEMS: NavItem[] = [
  { title: "Overview", href: "/", icon: LayoutDashboard },
  { title: "Email Scans", href: "/email-scans", icon: Mail },
  { title: "Threat Intelligence", href: "/threat-intelligence", icon: ShieldAlert },
  { title: "Analytics", href: "/analytics", icon: BarChart3 },
  { title: "Connected Accounts", href: "/connected-accounts", icon: Plug },
  { title: "Settings", href: "/settings", icon: Settings },
]

export const PAGE_TITLES: Record<string, string> = {
  "/": "Overview",
  "/email-scans": "Email Scans",
  "/threat-intelligence": "Threat Intelligence",
  "/analytics": "Analytics",
  "/connected-accounts": "Connected Accounts",
  "/settings": "Settings",
}
