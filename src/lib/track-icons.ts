import {
  Bomb,
  Globe,
  Network,
  ScrollText,
  Server,
  Shield,
  Terminal,
  Wrench,
  MonitorCog,
  type LucideIcon,
} from "lucide-react";
import type { Track } from "@/content/lessons";

export const TRACK_ICONS: Record<Track["icon"], LucideIcon> = {
  shield: Shield,
  server: Server,
  terminal: Terminal,
  windows: MonitorCog,
  network: Network,
  wrench: Wrench,
  globe: Globe,
  bomb: Bomb,
  scroll: ScrollText,
};

export const ACCENT_COLORS: Record<Track["accent"], { fg: string; bg: string }> = {
  primary: { fg: "var(--primary)", bg: "color-mix(in oklab, var(--primary) 14%, transparent)" },
  accent: { fg: "var(--accent)", bg: "color-mix(in oklab, var(--accent) 18%, transparent)" },
  info: { fg: "oklch(0.78 0.16 220)", bg: "color-mix(in oklab, oklch(0.78 0.16 220) 16%, transparent)" },
  danger: { fg: "var(--destructive)", bg: "color-mix(in oklab, var(--destructive) 16%, transparent)" },
  warning: { fg: "oklch(0.85 0.18 90)", bg: "color-mix(in oklab, oklch(0.85 0.18 90) 18%, transparent)" },
};
