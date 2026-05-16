import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { useProgress } from "@/lib/progress";
import { TRACKS, totalLessons } from "@/content/lessons";
import { GlassCard } from "@/components/glass-card";
import { TRACK_ICONS, ACCENT_COLORS } from "@/lib/track-icons";
import { ArrowRight, Clock, BookOpen, CheckCircle2, CircleDashed, Circle } from "lucide-react";

export const Route = createFileRoute("/roadmap")({
  head: () => ({
    meta: [
      { title: "Yo'l xaritasi — Cyber Alsamos" },
      {
        name: "description",
        content:
          "Etik xaker bo'lish yo'l xaritasi: 9 modul, asoslardan capstone loyihagacha.",
      },
      { property: "og:title", content: "Cyber Alsamos — Etik xaker yo'l xaritasi" },
      {
        property: "og:description",
        content: "9 modul, 35+ dars. Asoslardan to'liq pentest hisobotigacha.",
      },
    ],
  }),
  component: RoadmapPage,
});

function RoadmapPage() {
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const { done: doneByTrack } = useProgress();

  return (
    <div className="relative px-4 py-12 md:py-16">
      <div className="mx-auto max-w-5xl">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            {t("roadmap_title")}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            {t("roadmap_sub")}
          </p>
          <div className="mt-4 inline-flex gap-3 font-mono text-xs text-muted-foreground">
            <span>{TRACKS.length} {t("stats_modules")}</span>
            <span className="text-primary/60">•</span>
            <span>{totalLessons()} {t("lessons")}</span>
          </div>
        </header>

        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-6 top-0 bottom-0 w-px md:left-1/2"
            style={{
              background:
                "linear-gradient(to bottom, transparent, var(--primary) 10%, var(--accent) 90%, transparent)",
            }}
          />

          <ol className="space-y-8">
            {TRACKS.map((track, i) => {
              const Icon = TRACK_ICONS[track.icon];
              const colors = ACCENT_COLORS[track.accent];
              const left = i % 2 === 0;
              const totalMin = track.lessons.reduce((a, l) => a + (l.duration ?? 15), 0);
              const doneSet = doneByTrack[track.id] ?? new Set<string>();
              const doneCount = track.lessons.filter((l) => doneSet.has(l.id)).length;
              const total = track.lessons.length;
              const pct = total ? Math.round((doneCount / total) * 100) : 0;
              const status: "done" | "in_progress" | "not_started" =
                doneCount >= total && total > 0
                  ? "done"
                  : doneCount > 0
                  ? "in_progress"
                  : "not_started";
              const StatusIcon =
                status === "done" ? CheckCircle2 : status === "in_progress" ? CircleDashed : Circle;
              const statusLabel =
                status === "done"
                  ? t("status_done")
                  : status === "in_progress"
                  ? t("status_in_progress")
                  : t("status_not_started");
              return (
                <li
                  key={track.id}
                  className={`relative md:grid md:grid-cols-2 md:gap-10 ${
                    left ? "" : "md:[direction:rtl]"
                  }`}
                >
                  {/* Dot */}
                  <div
                    className="absolute left-6 top-6 z-10 -translate-x-1/2 md:left-1/2"
                  >
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-full ring-4 ring-background"
                      style={{ background: colors.bg, color: colors.fg }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <div
                    className={`pl-16 md:pl-0 md:[direction:ltr] ${
                      left ? "md:pr-12 md:text-right" : "md:col-start-2 md:pl-12"
                    }`}
                  >
                    <GlassCard hover className="p-5">
                      <Link
                        to="/learn/$trackId"
                        params={{ trackId: track.id }}
                        className="block"
                      >
                        <div
                          className={`flex items-center gap-2 ${
                            left ? "md:justify-end" : ""
                          }`}
                        >
                          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                            Module {String(track.number).padStart(2, "0")}
                          </div>
                          {user && (
                            <span
                              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider"
                              style={{
                                color: status === "done" ? colors.fg : "var(--muted-foreground)",
                                background:
                                  status === "done"
                                    ? colors.bg
                                    : status === "in_progress"
                                    ? "color-mix(in oklab, var(--accent) 14%, transparent)"
                                    : "color-mix(in oklab, var(--muted-foreground) 10%, transparent)",
                              }}
                              aria-label={statusLabel}
                            >
                              <StatusIcon className="h-3 w-3" />
                              {statusLabel}
                              {status === "in_progress" && (
                                <span className="opacity-80">· {pct}%</span>
                              )}
                            </span>
                          )}
                        </div>
                        <h3
                          className="mt-1 text-lg font-bold md:text-xl"
                          style={{ color: colors.fg }}
                        >
                          {track.title[lang]}
                        </h3>
                        <p className="mt-1.5 text-sm text-muted-foreground">
                          {track.description[lang]}
                        </p>
                        <ul className={`mt-3 space-y-1 text-xs text-muted-foreground ${left ? "md:ml-auto" : ""}`}>
                          {track.lessons.slice(0, 4).map((l) => (
                            <li key={l.id} className="truncate">
                              · {l.title[lang]}
                            </li>
                          ))}
                          {track.lessons.length > 4 && (
                            <li className="opacity-60">
                              + {track.lessons.length - 4}…
                            </li>
                          )}
                        </ul>
                        <div
                          className={`mt-4 flex items-center gap-3 font-mono text-[11px] text-muted-foreground ${
                            left ? "md:justify-end" : ""
                          }`}
                        >
                          <span className="inline-flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            {track.lessons.length}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            ~{totalMin}m
                          </span>
                          <span
                            className="inline-flex items-center gap-1 font-semibold"
                            style={{ color: colors.fg }}
                          >
                            {t("open_module")}
                            <ArrowRight className="h-3 w-3" />
                          </span>
                        </div>
                      </Link>
                    </GlassCard>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="mt-14 text-center">
          <Link
            to="/learn"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 font-semibold text-accent-foreground transition-all hover:brightness-110"
            style={{ boxShadow: "var(--shadow-orange)" }}
          >
            {t("cta_start")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
