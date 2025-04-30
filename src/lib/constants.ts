import {
  Activity,
  Bell,
  CheckCircle,
  Coins,
  FileText,
  PillBottleIcon,
  ShieldCheck,
  TrendingUp,
  User,
  Users,
} from "lucide-react";

export const BACKEND_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8080"
    : "http://49.13.80.195:8081";

export const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://solstatz.com";

export const menuItems = [
  {
    group: "MEV",
    links: [
      { href: "/mev/summary", label: "Mev Summary", icon: FileText },
      { href: "/mev/live-attacks", label: "Live Attacks", icon: Activity },
      { href: "/mev/top-attacks", label: "Attacks", icon: TrendingUp },
      { href: "/mev/top-sandwichers", label: "Sandwichers", icon: Users },
      { href: "/mev/top-pools", label: "Pools", icon: PillBottleIcon },
      { href: "/mev/top-tokens", label: "Tokens", icon: Coins },
      { href: "/mev/top-victims", label: "Victims", icon: User },
      { href: "/mev/validators", label: "Validators", icon: CheckCircle },
      {
        href: "/mev/protection-providers",
        label: "Protection Providers",
        icon: ShieldCheck,
      },
    ],
  },
  {
    group: "Alerts",
    links: [{ href: "/alerter", label: "Alerter", icon: Bell }],
  },
];

export const CHART_COLORS = ["#80f28c", "#fff", "#6b7280"];

export const DISCORD_WEBHOOK_URL =
  "https://discord.com/api/webhooks/1367247062428549200/5d-ryHswkOj4Q-HUxTGSzpFID8BHKkqLQyzsK85832xDg7lBB8LJ-IOVkXL5GdnihPXP";
