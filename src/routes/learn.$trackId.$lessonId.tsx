import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { useProgress } from "@/lib/progress";
import {
  findLesson,
  findTrack,
  type Lesson,
  type Track,
} from "@/content/lessons";
import { CommandBlock } from "@/components/command-block";
import { CyberTerminal } from "@/components/cyber-terminal";
import { GlassCard } from "@/components/glass-card";
import { createSession, execCommand } from "@/lib/terminal/sim";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  ListChecks,
  ShieldAlert,
  Signal,
  Target,
  Terminal,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/learn/$trackId/$lessonId")({
  loader: ({ params }) => {
    const track = findTrack(params.trackId);
    const lesson = findLesson(params.trackId, params.lessonId);
    if (!track || !lesson) throw notFound();
    return { track, lesson } as { track: Track; lesson: Lesson };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData?.lesson.title.uz ?? "Dars"} - Cyber Alsamos`,
      },
      {
        name: "description",
        content: loaderData?.lesson.intro.uz ?? "",
      },
    ],
  }),
  component: LessonPage,
  notFoundComponent: () => (
    <div className="px-4 py-20 text-center">
      <h1 className="text-2xl font-bold">Dars topilmadi</h1>
      <Link to="/learn" className="mt-4 inline-block text-primary hover:underline">
        {"<- Treklarga qaytish"}
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

function LessonPage() {
  const { track, lesson } = Route.useLoaderData() as { track: Track; lesson: Lesson };
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const { isDone, markComplete } = useProgress();
  const [busy, setBusy] = useState(false);
  const done = isDone(track.id, lesson.id);
  const tt = (uz: string, en: string) => (lang === "uz" ? uz : en);

  const idx = track.lessons.findIndex((l) => l.id === lesson.id);
  const prev = track.lessons[idx - 1];
  const next = track.lessons[idx + 1];
  const commandCount = lesson.steps.length;
  const commandOutputs = getCommandOutputs(lesson);

  const onMark = async () => {
    if (!user) return;
    setBusy(true);
    const ok = await markComplete(track.id, lesson.id);
    setBusy(false);
    if (ok) {
      toast.success(tt("Dars bajarildi deb belgilandi", "Lesson marked complete"));
    }
  };

  return (
    <div className="px-3 py-6 sm:px-4 sm:py-8">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/learn/$trackId"
          params={{ trackId: track.id }}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("back_to_module")}
        </Link>

        <header className="mt-4 grid gap-5 border-b border-border/50 pb-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-accent">
              {tt("O'quv darsi", "Learning lesson")} / {track.title[lang]}
            </div>
            <h1 className="mt-2 max-w-4xl text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              {lesson.title[lang]}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground md:text-base">
              {lesson.intro[lang]}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {lesson.duration && (
                <MetaPill icon={<Clock className="h-3.5 w-3.5" />}>
                  {lesson.duration} {t("minutes")}
                </MetaPill>
              )}
              {lesson.difficulty && (
                <MetaPill icon={<Signal className="h-3.5 w-3.5" />}>
                  {t(`difficulty_${lesson.difficulty}` as never)}
                </MetaPill>
              )}
              <MetaPill icon={<Terminal className="h-3.5 w-3.5" />}>
                {commandCount} {tt("komanda", "commands")}
              </MetaPill>
              <MetaPill icon={<BookOpen className="h-3.5 w-3.5" />}>
                {idx + 1}/{track.lessons.length}
              </MetaPill>
            </div>
          </div>

          <GlassCard className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {tt("Dars holati", "Lesson status")}
                </div>
                <div className="mt-1 text-xl font-semibold">
                  {done ? t("completed") : tt("Davom etmoqda", "In progress")}
                </div>
              </div>
              {done ? (
                <CheckCircle2 className="h-6 w-6 text-primary" />
              ) : (
                <ListChecks className="h-6 w-6 text-accent" />
              )}
            </div>
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>{tt("Terminal transcript", "Terminal transcript")}</span>
                <span>{commandCount} {tt("komanda", "commands")}</span>
              </div>
              <div className="h-2 rounded-md bg-primary" />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {user ? (
                <button
                  onClick={onMark}
                  disabled={busy || done}
                  className={`inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-semibold transition-all ${
                    done
                      ? "bg-primary/15 text-primary"
                      : "bg-primary text-primary-foreground hover:brightness-110"
                  } disabled:opacity-60`}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {done ? t("completed") : t("mark_complete")}
                </button>
              ) : (
                <Link
                  to="/auth"
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary/15 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/25"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {t("sign_in_to_save")}
                </Link>
              )}
            </div>
          </GlassCard>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)]">
          <main className="space-y-5">
            <GlassCard className="p-5 md:p-6">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-primary">
                <Target className="h-4 w-4" />
                {t("objectives")}
              </div>
              <ul className="grid gap-2 md:grid-cols-2">
                {lesson.objectives[lang].map((objective, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm leading-6">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary/70" />
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>

            <GlassCard className="border-accent/30 p-5 md:p-6">
              <div className="flex items-start gap-3">
                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <div>
                  <div className="text-sm font-semibold">
                    {tt("Faqat ruxsat etilgan muhitda mashq qiling", "Practice only in authorized environments")}
                  </div>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {tt(
                      "Bu darsdagi buyruqlar o'quv simulyatori va o'zingizga tegishli lablar uchun. Begona tizimlarni skanlash yoki sinash qonuniy javobgarlikka olib keladi.",
                      "Commands in this lesson are for the simulator and labs you own or are authorized to test. Scanning or testing third-party systems can create legal liability.",
                    )}
                  </p>
                </div>
              </div>
            </GlassCard>

            {lesson.sections && lesson.sections.length > 0 && (
              <GlassCard className="p-5 md:p-6">
                <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-primary">
                  <BookOpen className="h-4 w-4" />
                  {t("reading")}
                </div>
                <div className="space-y-5">
                  {lesson.sections.map((sec, i) => (
                    <section key={i} className="min-w-0">
                      <h2 className="break-words text-base font-semibold">{sec.heading[lang]}</h2>
                      <p className="mt-2 whitespace-pre-line break-words text-sm leading-7 text-muted-foreground">
                        {sec.body[lang]}
                      </p>
                    </section>
                  ))}
                </div>
              </GlassCard>
            )}

            <GlassCard className="overflow-hidden p-0">
              <div className="border-b border-border/50 px-5 py-4 md:px-6">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Terminal className="h-4 w-4 text-primary" />
                    {t("commands")}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {tt(
                      "Har bir komanda real terminal qatoriga o'xshab berilgan. O'ngdagi copy ikonka orqali Kali labingizga ko'chiring.",
                      "Each command is shown as a real terminal line. Use the copy icon on the right for your Kali lab.",
                    )}
                  </p>
                </div>
              </div>
              <div className="bg-[#202637] bg-[radial-gradient(ellipse_at_center,rgba(54,64,86,0.45),transparent_55%)]">
                <div className="flex items-center justify-between border-b border-white/10 bg-[#1d2230] px-4 py-2 font-mono text-xs text-slate-200">
                  <div className="flex items-center gap-5">
                    <span>Session</span>
                    <span>Actions</span>
                    <span>Edit</span>
                    <span>View</span>
                    <span>Help</span>
                  </div>
                  <span className="hidden text-slate-300 sm:inline">kali@kali: ~</span>
                </div>
                {lesson.steps.map((step, i) => (
                  <CommandBlock
                    key={`${step.command}-${i}`}
                    command={step.command}
                    comment={step.hint?.[lang]}
                    output={commandOutputs[i]}
                  />
                ))}
              </div>
            </GlassCard>

            <div className="flex items-center justify-between gap-3">
              {prev ? (
                <Link
                  to="/learn/$trackId/$lessonId"
                  params={{ trackId: track.id, lessonId: prev.id }}
                  className="glass inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm hover:border-primary/40"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {t("prev_lesson")}
                </Link>
              ) : (
                <span />
              )}
              {next && (
                <Link
                  to="/learn/$trackId/$lessonId"
                  params={{ trackId: track.id, lessonId: next.id }}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:brightness-110"
                >
                  {t("next_lesson")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </main>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="flex items-center gap-2 text-xs">
              <span className="glass rounded-md px-3 py-1 font-mono text-primary">
                ● {t("sandbox_sim")}
              </span>
              <span className="rounded-md px-3 py-1 font-mono text-muted-foreground/60">
                ○ {t("sandbox_live")}
              </span>
            </div>
            <CyberTerminal
              key={lesson.id}
              fs={lesson.fs}
              cwd={lesson.cwd}
            />
            <GlassCard className="p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {tt("Keyingi qadam", "Next step")}
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {tt(
                  "Simulyatorda natijani ko'ring, keyin shu buyruqlarni o'zingizning Kali Linux labingizda takrorlang.",
                  "Check the result in the simulator, then repeat the same commands inside your own Kali Linux lab.",
                )}
              </p>
            </GlassCard>
          </aside>
        </div>
      </div>
    </div>
  );
}

function MetaPill({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-background/35 px-2.5 py-1 text-xs text-muted-foreground">
      {icon}
      {children}
    </span>
  );
}

function getCommandOutputs(lesson: Lesson) {
  let state = createSession({ fs: lesson.fs, cwd: lesson.cwd });
  return lesson.steps.map((step) => {
    const result = execCommand(state, step.command);
    state = result.state;
    return result.out;
  });
}
