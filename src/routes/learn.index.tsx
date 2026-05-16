import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { useProgress } from "@/lib/progress";
import { TRACKS, totalLessons, type Track } from "@/content/lessons";
import { GlassCard } from "@/components/glass-card";
import { ACCENT_COLORS, TRACK_ICONS } from "@/lib/track-icons";
import {
  ArrowRight,
  BookOpen,
  Clock,
  Compass,
  GraduationCap,
  LockKeyhole,
  PlayCircle,
  ShieldCheck,
} from "lucide-react";

export const Route = createFileRoute("/learn/")({
  head: () => ({
    meta: [
      { title: "O'quv markazi - Cyber Alsamos" },
      {
        name: "description",
        content:
          "Cyber Alsamos learner dashboard: boshlang'ich roadmap, modullar, progress va amaliy terminal darslari.",
      },
    ],
  }),
  component: LearnIndex,
});

function LearnIndex() {
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const { done: doneByTrack, doneIds } = useProgress();
  const tt = (uz: string, en: string) => (lang === "uz" ? uz : en);

  const firstTrack = TRACKS[0];
  const nextTrack =
    TRACKS.find((track) => track.lessons.some((lesson) => !doneByTrack[track.id]?.has(lesson.id))) ??
    firstTrack;
  const nextLesson =
    nextTrack.lessons.find((lesson) => !doneByTrack[nextTrack.id]?.has(lesson.id)) ??
    nextTrack.lessons[0];
  const total = totalLessons();
  const completed = user ? doneIds.size : 0;
  const allComplete = user && completed >= total;
  const overallPct = user ? Math.round((completed / total) * 100) : 0;
  const totalMinutes = TRACKS.reduce(
    (sum, track) => sum + track.lessons.reduce((a, lesson) => a + (lesson.duration ?? 15), 0),
    0,
  );

  return (
    <div className="px-4 py-8 md:py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="min-w-0">
            <div className="font-mono text-xs uppercase tracking-widest text-accent">
              {tt("Cyber Alsamos o'quv markazi", "Cyber Alsamos learning center")}
            </div>
            <h1 className="mt-2 max-w-4xl text-3xl font-bold tracking-tight md:text-5xl">
              {tt("Etik xakerlikni tartibli va xavfsiz o'rganing", "Learn ethical hacking with a clear, safe path")}
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-muted-foreground md:text-base">
              {tt(
                "Boshlovchilar uchun yo'l xaritasi, amaliy komandalar, progress nazorati va brauzer terminali bir joyda. Har bir dars qonuniy, ruxsatli lab muhitida mashq qilishga yo'naltirilgan.",
                "A beginner-friendly roadmap, practice commands, progress tracking and browser terminal in one place. Every lesson is oriented around legal, authorized lab practice.",
              )}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to="/learn/$trackId/$lessonId"
                params={{ trackId: nextTrack.id, lessonId: nextLesson.id }}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:brightness-110"
              >
                <PlayCircle className="h-4 w-4" />
                {allComplete ? tt("Yana ko'rish", "Review") : completed > 0 ? t("continue_lesson") : t("start_lesson")}
              </Link>
              <Link
                to="/roadmap"
                className="glass inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold hover:border-primary/40"
              >
                <Compass className="h-4 w-4 text-primary" />
                {t("cta_roadmap")}
              </Link>
            </div>
          </div>

          <GlassCard className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {user ? tt("Davom etish", "Continue") : tt("Boshlash nuqtasi", "Starting point")}
                </div>
                <h2 className="mt-1 text-xl font-semibold">{nextLesson.title[lang]}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{nextTrack.title[lang]}</p>
              </div>
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <GraduationCap className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2 text-center">
              <MiniStat label={t("stats_modules")} value={TRACKS.length} />
              <MiniStat label={t("lessons")} value={total} />
              <MiniStat label={t("minutes")} value={`~${Math.round(totalMinutes / 60)}h`} />
            </div>
            <div className="mt-5">
              <div className="mb-2 flex justify-between text-xs text-muted-foreground">
                <span>{tt("Umumiy progress", "Overall progress")}</span>
                <span>{user ? `${completed}/${total}` : tt("Kirish ixtiyoriy", "Sign-in optional")}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-md bg-background/70">
                <div
                  className="h-full rounded-md bg-primary transition-all"
                  style={{ width: `${overallPct}%` }}
                />
              </div>
            </div>
          </GlassCard>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <LearningStat
            icon={<ShieldCheck className="h-5 w-5" />}
            title={tt("Etik va qonuniy", "Ethical and legal")}
            body={tt("Har bir modul ruxsat va scope madaniyatini eslatadi.", "Every module reinforces authorization and scope discipline.")}
          />
          <LearningStat
            icon={<BookOpen className="h-5 w-5" />}
            title={tt("Bosqichma-bosqich", "Step by step")}
            body={tt("Linux, tarmoq, web va hisobotlar ketma-ket ulanadi.", "Linux, networking, web and reporting build on each other.")}
          />
          <LearningStat
            icon={<LockKeyhole className="h-5 w-5" />}
            title={tt("Progress saqlanadi", "Progress saved")}
            body={tt("Hisobga kirsangiz darslar, streak va profil yangilanadi.", "Sign in to persist lessons, streaks and profile state.")}
          />
        </section>

        <section className="grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
          <GlassCard className="p-5">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {tt("Boshlovchi roadmap", "Beginner roadmap")}
            </div>
            <h2 className="mt-1 text-xl font-semibold">
              {tt("Avval shu 3 modulni tugating", "Finish these 3 modules first")}
            </h2>
            <div className="mt-5 space-y-3">
              {TRACKS.slice(0, 3).map((track, index) => (
                <RoadmapStep key={track.id} track={track} index={index} />
              ))}
            </div>
          </GlassCard>

          <div className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">{t("learn_title")}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{t("learn_sub")}</p>
              </div>
              <div className="font-mono text-xs text-muted-foreground">
                {TRACKS.length} {t("stats_modules")} / {total} {t("lessons")}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {TRACKS.map((track) => (
                <ModuleCard key={track.id} track={track} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function ModuleCard({ track }: { track: Track }) {
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const { done } = useProgress();
  const Icon = TRACK_ICONS[track.icon];
  const colors = ACCENT_COLORS[track.accent];
  const doneCount = track.lessons.filter((lesson) => done[track.id]?.has(lesson.id)).length;
  const pct = Math.round((doneCount / track.lessons.length) * 100);
  const totalMin = track.lessons.reduce((a, lesson) => a + (lesson.duration ?? 15), 0);

  return (
    <Link
      to="/learn/$trackId"
      params={{ trackId: track.id }}
      className="block focus:outline-none"
    >
      <GlassCard hover className="h-full p-5">
        <div className="flex items-start gap-3">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
            style={{ background: colors.bg, color: colors.fg }}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Module {String(track.number).padStart(2, "0")}
            </div>
            <h3 className="mt-1 text-base font-semibold leading-tight">{track.title[lang]}</h3>
            <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
              {track.description[lang]}
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            {track.lessons.length} {t("lessons")}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            ~{totalMin} {t("minutes")}
          </span>
          <ArrowRight className="h-4 w-4 text-primary" />
        </div>
        {user && (
          <div className="mt-4">
            <div className="mb-1.5 flex justify-between text-[11px] text-muted-foreground">
              <span>
                {doneCount}/{track.lessons.length}
              </span>
              <span>{pct}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-md bg-background/70">
              <div
                className="h-full rounded-md transition-all"
                style={{ width: `${pct}%`, background: colors.fg }}
              />
            </div>
          </div>
        )}
      </GlassCard>
    </Link>
  );
}

function RoadmapStep({ track, index }: { track: Track; index: number }) {
  const { lang } = useI18n();
  const Icon = TRACK_ICONS[track.icon];
  const colors = ACCENT_COLORS[track.accent];
  return (
    <Link
      to="/learn/$trackId"
      params={{ trackId: track.id }}
      className="flex items-center gap-3 rounded-lg border border-border/50 bg-background/25 p-3 transition-colors hover:border-primary/40"
    >
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md"
        style={{ background: colors.bg, color: colors.fg }}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-mono text-[10px] text-muted-foreground">
          {String(index + 1).padStart(2, "0")}
        </div>
        <div className="truncate text-sm font-semibold">{track.title[lang]}</div>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground" />
    </Link>
  );
}

function LearningStat({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <GlassCard className="p-5">
      <div className="flex items-center gap-2 text-sm font-semibold text-primary">
        {icon}
        {title}
      </div>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
    </GlassCard>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-border/50 bg-background/30 px-3 py-3">
      <div className="font-mono text-xl font-bold text-primary">{value}</div>
      <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
