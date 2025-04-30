import {
  Activity,
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
];

export const CHART_COLORS = ["#80f28c", "#fff", "#6b7280"];
