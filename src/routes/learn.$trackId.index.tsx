import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { useProgress } from "@/lib/progress";
import { findTrack, type Lesson, type Track } from "@/content/lessons";
import { GlassCard } from "@/components/glass-card";
import { ACCENT_COLORS, TRACK_ICONS } from "@/lib/track-icons";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  PlayCircle,
  Signal,
  Terminal,
} from "lucide-react";

export const Route = createFileRoute("/learn/$trackId/")({
  loader: ({ params }) => {
    const track = findTrack(params.trackId);
    if (!track) throw notFound();
    return { track } as { track: Track };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData?.track.title.uz ?? "Modul"} - Cyber Alsamos`,
      },
      {
        name: "description",
        content: loaderData?.track.description.uz ?? "",
      },
    ],
  }),
  component: TrackPage,
  notFoundComponent: () => (
    <div className="px-4 py-20 text-center">
      <h1 className="text-2xl font-bold">Modul topilmadi</h1>
      <Link to="/learn" className="mt-4 inline-block text-primary hover:underline">
        <- Modullarga qaytish
      </Link>
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="px-4 py-20 text-center">
      <p className="text-destructive">{error.message}</p>
      <button onClick={reset} className="mt-3 text-primary hover:underline">
        Qayta urinish
      </button>
    </div>
  ),
});

function TrackPage() {
  const { track } = Route.useLoaderData() as { track: Track };
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const { done: doneByTrack } = useProgress();
  const Icon = TRACK_ICONS[track.icon];
  const colors = ACCENT_COLORS[track.accent];
  const doneSet = doneByTrack[track.id] ?? new Set<string>();
  const doneCount = track.lessons.filter((lesson) => doneSet.has(lesson.id)).length;
  const pct = Math.round((doneCount / track.lessons.length) * 100);
  const totalMin = track.lessons.reduce((a, lesson) => a + (lesson.duration ?? 15), 0);
  const nextLesson = track.lessons.find((lesson) => !doneSet.has(lesson.id)) ?? track.lessons[0];
  const tt = (uz: string, en: string) => (lang === "uz" ? uz : en);

  const ctaLabel =
    doneCount === 0
      ? t("start_lesson")
      : doneCount >= track.lessons.length
        ? tt("Yana ko'rish", "Review")
        : t("continue_lesson");

  return (
    <div className="px-4 py-8 md:py-10">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/learn"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("back_to_tracks")}
        </Link>

        <header className="mt-4 grid gap-5 border-b border-border/50 pb-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="flex min-w-0 gap-4">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg md:h-16 md:w-16"
              style={{ background: colors.bg, color: colors.fg }}
            >
              <Icon className="h-7 w-7" />
            </div>
            <div className="min-w-0">
              <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Module {String(track.number).padStart(2, "0")}
              </div>
              <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">
                {track.title[lang]}
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground md:text-base">
                {track.description[lang]}
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <MetaItem icon={<BookOpen className="h-3.5 w-3.5" />}>
                  {track.lessons.length} {t("lessons")}
                </MetaItem>
                <MetaItem icon={<Clock className="h-3.5 w-3.5" />}>
                  ~{totalMin} {t("minutes")}
                </MetaItem>
                <MetaItem icon={<Terminal className="h-3.5 w-3.5" />}>
                  {tt("Simulyator komandalar", "Simulator commands")}
                </MetaItem>
              </div>
            </div>
          </div>

          <GlassCard className="p-5">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {tt("Modul progressi", "Module progress")}
            </div>
            <div className="mt-2 flex items-end justify-between gap-3">
              <div className="font-mono text-3xl font-bold">{user ? `${pct}%` : "0%"}</div>
              <div className="text-right text-sm text-muted-foreground">
                {user ? `${doneCount}/${track.lessons.length}` : tt("Hisobga kiring", "Sign in to save")}
              </div>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-md bg-background/70">
              <div
                className="h-full rounded-md transition-all"
                style={{ width: `${user ? pct : 0}%`, background: colors.fg }}
              />
            </div>
            <Link
              to="/learn/$trackId/$lessonId"
              params={{ trackId: track.id, lessonId: nextLesson.id }}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:brightness-110"
            >
              <PlayCircle className="h-4 w-4" />
              {ctaLabel}
            </Link>
          </GlassCard>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <GlassCard className="p-5">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {tt("O'qish tartibi", "Study order")}
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {tt(
                  "Darslarni ketma-ket bajaring. Avval tushuncha, keyin komandani simulyatorda, oxirida o'z Kali labingizda takrorlang.",
                  "Complete lessons in order. First understand the concept, then run commands in the simulator, then repeat them in your own Kali lab.",
                )}
              </p>
            </GlassCard>
            <GlassCard className="p-5">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {tt("Etik qoida", "Ethical rule")}
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {tt(
                  "Scope hujjati va yozma ruxsatsiz hech qanday real tizimni sinamang.",
                  "Do not test real systems without written authorization and a defined scope.",
                )}
              </p>
            </GlassCard>
          </aside>

          <main className="space-y-3">
            {track.lessons.map((lesson, index) => (
              <LessonRow
                key={lesson.id}
                track={track}
                lesson={lesson}
                index={index}
                done={doneSet.has(lesson.id)}
                active={lesson.id === nextLesson.id}
              />
            ))}
          </main>
        </div>
      </div>
    </div>
  );
}

function LessonRow({
  track,
  lesson,
  index,
  done,
  active,
}: {
  track: Track;
  lesson: Lesson;
  index: number;
  done: boolean;
  active: boolean;
}) {
  const { t, lang } = useI18n();

  return (
    <Link
      to="/learn/$trackId/$lessonId"
      params={{ trackId: track.id, lessonId: lesson.id }}
      className="block focus:outline-none"
    >
      <GlassCard hover className={`p-4 md:p-5 ${active ? "border-primary/50" : ""}`}>
        <div className="flex items-start gap-4">
          <div className="pt-0.5">
            {done ? (
              <CheckCircle2 className="h-6 w-6 text-primary" />
            ) : (
              <Circle className={`h-6 w-6 ${active ? "text-primary" : "text-muted-foreground/45"}`} />
            )}
          </div>
          <div className="w-8 shrink-0 font-mono text-xs text-muted-foreground">
            {String(index + 1).padStart(2, "0")}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-semibold leading-tight md:text-lg">{lesson.title[lang]}</h2>
              {active && !done && (
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                  {t("continue_lesson")}
                </span>
              )}
            </div>
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
              {lesson.intro[lang]}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
              {lesson.duration && (
                <MetaItem icon={<Clock className="h-3.5 w-3.5" />}>
                  {lesson.duration} {t("minutes")}
                </MetaItem>
              )}
              {lesson.difficulty && (
                <MetaItem icon={<Signal className="h-3.5 w-3.5" />}>
                  {t(`difficulty_${lesson.difficulty}` as never)}
                </MetaItem>
              )}
              <MetaItem icon={<Terminal className="h-3.5 w-3.5" />}>
                {lesson.steps.length}
              </MetaItem>
            </div>
          </div>
          <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
        </div>
      </GlassCard>
    </Link>
  );
}

function MetaItem({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-border/50 bg-background/30 px-2 py-1">
      {icon}
      {children}
    </span>
  );
}
