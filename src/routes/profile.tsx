import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { useProgress } from "@/lib/progress";
import { GlassCard } from "@/components/glass-card";
import { TRACKS as tracks, type Track } from "@/content/lessons";
import { Flame, Trophy, BookOpenCheck, LogOut, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profil — Cyber Alsamos" },
      { name: "description", content: "Sizning streak va o'rgangan darslaringiz." },
    ],
  }),
  component: ProfilePage,
});

type Profile = {
  id: string;
  username: string | null;
  display_name: string | null;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
};



function ProfilePage() {
  const { user, loading, signOut } = useAuth();
  const { lang } = useI18n();
  const { done: doneByTrack, doneIds } = useProgress();
  const navigate = useNavigate();
  const tt = (uz: string, en: string) => (lang === "uz" ? uz : en);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [uname, setUname] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: p } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      if (p) {
        setProfile(p as Profile);
        setName(p.display_name ?? "");
        setUname(p.username ?? "");
      }
    })();
  }, [user]);

  const save = async () => {
    if (!user) return;
    setBusy(true);
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: name || null, username: uname || null })
      .eq("id", user.id);
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success(tt("Saqlandi", "Saved"));
      setEditing(false);
      setProfile((p) => (p ? { ...p, display_name: name, username: uname } : p));
    }
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const completedByTrack = tracks.map((tr: Track) => ({
    track: tr,
    done: tr.lessons.filter((l) => doneByTrack[tr.id]?.has(l.id)).map((l) => l.id),
  }));
  const totalDone = doneIds.size;

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-10">
      <GlassCard className="p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-accent">
              {tt("Profil", "Profile")}
            </div>
            {editing ? (
              <div className="mt-3 space-y-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={tt("Ism", "Display name")}
                  className="w-full rounded-md border border-border/60 bg-background/40 px-3 py-2 text-lg font-bold outline-none focus:border-primary/60"
                />
                <input
                  value={uname}
                  onChange={(e) => setUname(e.target.value)}
                  placeholder="username"
                  className="w-full rounded-md border border-border/60 bg-background/40 px-3 py-2 font-mono text-sm outline-none focus:border-primary/60"
                />
              </div>
            ) : (
              <>
                <h1 className="mt-1 text-3xl font-bold tracking-tight">
                  {profile?.display_name ?? user.email}
                </h1>
                <p className="font-mono text-sm text-muted-foreground">
                  @{profile?.username ?? "—"} · {user.email}
                </p>
              </>
            )}
          </div>
          <div className="flex gap-2">
            {editing ? (
              <button
                onClick={save}
                disabled={busy}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:brightness-110 disabled:opacity-50"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {tt("Saqlash", "Save")}
              </button>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="glass rounded-full px-4 py-2 text-sm hover:border-primary/40"
              >
                {tt("Tahrirlash", "Edit")}
              </button>
            )}
            <button
              onClick={async () => {
                await signOut();
                navigate({ to: "/" });
              }}
              className="glass inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm hover:border-destructive/40 hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              {tt("Chiqish", "Sign out")}
            </button>
          </div>
        </div>
      </GlassCard>

      <div className="grid gap-4 md:grid-cols-3">
        <Stat
          icon={<Flame className="h-5 w-5" />}
          label={tt("Joriy streak", "Current streak")}
          value={`${profile?.current_streak ?? 0} ${tt("kun", "days")}`}
          accent
        />
        <Stat
          icon={<Trophy className="h-5 w-5" />}
          label={tt("Eng uzun streak", "Longest streak")}
          value={`${profile?.longest_streak ?? 0} ${tt("kun", "days")}`}
        />
        <Stat
          icon={<BookOpenCheck className="h-5 w-5" />}
          label={tt("Tugatilgan darslar", "Lessons completed")}
          value={String(totalDone)}
        />
      </div>

      <div className="space-y-4">
        <h2 className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
          {tt("Yo'nalishlar bo'yicha taraqqiyot", "Progress by track")}
        </h2>
        {completedByTrack.map(({ track, done }: { track: Track; done: string[] }) => {
          const pct = Math.round((done.length / track.lessons.length) * 100);
          const doneSet = new Set(done);
          const nextLesson = track.lessons.find((l) => !doneSet.has(l.id)) ?? track.lessons[track.lessons.length - 1];
          const isComplete = done.length >= track.lessons.length;
          const ctaLabel = isComplete
            ? tt("Yana ko'rish →", "Review →")
            : done.length > 0
            ? tt("Davom etish →", "Continue →")
            : tt("Boshlash →", "Start →");
          return (
            <GlassCard key={track.id} className="p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold">{track.title[lang]}</div>
                  <div className="text-xs text-muted-foreground">
                    {done.length} / {track.lessons.length} {tt("dars", "lessons")}
                  </div>
                </div>
                <Link
                  to="/learn/$trackId/$lessonId"
                  params={{ trackId: track.id, lessonId: nextLesson.id }}
                  className="rounded-full bg-primary/15 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/25"
                >
                  {ctaLabel}
                </Link>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-background/60">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <GlassCard className="p-5">
      <div className={`flex items-center gap-2 text-xs font-medium uppercase tracking-wider ${accent ? "text-accent" : "text-muted-foreground"}`}>
        {icon}
        {label}
      </div>
      <div className="mt-2 font-mono text-3xl font-bold">{value}</div>
    </GlassCard>
  );
}
