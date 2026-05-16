import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { GlassCard } from "@/components/glass-card";
import { TRACKS, totalLessons } from "@/content/lessons";
import { TRACK_ICONS, ACCENT_COLORS } from "@/lib/track-icons";
import {
  ArrowRight,
  Sparkles,
  Copy,
  Languages,
  ListChecks,
  ShieldCheck,
  Terminal,
  Map,
  AlertTriangle,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cyber Alsamos — Etik xaker bo'lishni o'rgan | Alsamos Corporation" },
      {
        name: "description",
        content:
          "O'zbek tilidagi to'liq professional ethical hacking platformasi. 9 modul, 35+ dars, real terminal va Kali Linux bilan amaliy mashqlar.",
      },
      { property: "og:title", content: "Cyber Alsamos — kiberxavfsizlik ta'lim platformasi" },
      {
        property: "og:description",
        content:
          "Kirishdan to capstone pentest hisobotigacha. Bepul, o'zbek tilida, hands-on.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { t, lang } = useI18n();

  return (
    <div className="relative">
      {/* Background grid */}
      <div className="grid-bg pointer-events-none absolute inset-0 -z-10" />

      {/* Hero */}
      <section className="relative px-4 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="mx-auto max-w-5xl text-center">
          <div className="glass mx-auto mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span className="font-mono uppercase tracking-wider text-muted-foreground">
              {t("hero_badge")}
            </span>
          </div>

          <h1 className="font-sans text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            {t("hero_title_1")}
            <br />
            <span className="text-gradient">{t("hero_title_2")}</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">
            {t("hero_sub")}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/learn"
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-base font-semibold text-accent-foreground transition-all hover:brightness-110"
              style={{ boxShadow: "var(--shadow-orange)" }}
            >
              {t("cta_start")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/roadmap"
              className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 text-base font-semibold transition-all hover:border-primary/40"
            >
              <Map className="h-4 w-4 text-primary" />
              {t("cta_roadmap")}
            </Link>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-12 grid max-w-2xl grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { n: TRACKS.length, l: t("stats_modules") },
              { n: totalLessons(), l: t("stats_lessons") },
              { n: "100%", l: t("stats_free") },
              { n: "UZ/EN", l: t("stats_lang") },
            ].map((s, i) => (
              <div key={i} className="glass rounded-2xl px-3 py-4">
                <div className="font-mono text-2xl font-bold text-primary">{s.n}</div>
                <div className="mt-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
                  {s.l}
                </div>
              </div>
            ))}
          </div>

          {/* Mini terminal preview */}
          <div className="mx-auto mt-14 max-w-2xl text-left">
            <div className="glass rounded-2xl p-1 neon-glow">
              <div className="overflow-x-auto rounded-xl bg-[#0a120e] p-4 font-mono text-[11px] sm:p-5 sm:text-sm">
                <div className="mb-2 flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                </div>
                <div className="whitespace-pre text-primary/80">
                  <span className="text-primary">root@kali</span>:~# nmap -sV -p- 10.10.10.5
                </div>
                <pre className="mt-1 whitespace-pre text-muted-foreground">
{`Starting Nmap 7.94...
PORT     STATE SERVICE   VERSION
22/tcp   open  ssh       OpenSSH 8.2
80/tcp   open  http      Apache 2.4.41
443/tcp  open  ssl/http  nginx 1.18.0`}
                </pre>
                <div className="mt-2 text-primary">
                  <span className="text-primary">root@kali</span>:~#
                  <span className="ml-1 inline-block h-4 w-2 animate-pulse-glow bg-primary align-middle" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              {t("tracks_title")}
            </h2>
            <p className="mt-2 text-muted-foreground">{t("tracks_sub")}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {TRACKS.map((track) => {
              const Icon = TRACK_ICONS[track.icon];
              const colors = ACCENT_COLORS[track.accent];
              return (
                <GlassCard key={track.id} hover className="p-5 group">
                  <Link
                    to="/learn/$trackId"
                    params={{ trackId: track.id }}
                    className="block"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-11 w-11 items-center justify-center rounded-xl"
                        style={{ background: colors.bg, color: colors.fg }}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                        Module {String(track.number).padStart(2, "0")}
                      </div>
                    </div>
                    <h3 className="mt-3 text-base font-semibold">{track.title[lang]}</h3>
                    <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">
                      {track.description[lang]}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-xs font-mono">
                      <span className="text-muted-foreground">
                        {track.lessons.length} {t("lessons")}
                      </span>
                      <span
                        className="inline-flex items-center gap-1 transition-transform group-hover:translate-x-1"
                        style={{ color: colors.fg }}
                      >
                        {t("start_lesson")}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </Link>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-10 text-center text-3xl font-bold tracking-tight md:text-4xl">
            {t("features_title")}
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { Icon: Terminal, t: "f1_title", d: "f1_desc" },
              { Icon: Languages, t: "f2_title", d: "f2_desc" },
              { Icon: ListChecks, t: "f3_title", d: "f3_desc" },
              { Icon: ShieldCheck, t: "f4_title", d: "f4_desc" },
            ].map(({ Icon, t: tk, d }) => (
              <GlassCard key={tk} className="p-6">
                <Icon className="h-7 w-7 text-primary" />
                <h3 className="mt-4 font-semibold">{t(tk as never)}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{t(d as never)}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Legal warning */}
      <section className="px-4 py-10">
        <div className="mx-auto max-w-4xl">
          <GlassCard
            className="p-6 md:p-7"
            style={{
              borderColor: "color-mix(in oklab, var(--destructive) 30%, transparent)",
            }}
          >
            <div className="flex items-start gap-4">
              <AlertTriangle className="mt-1 h-6 w-6 shrink-0 text-destructive" />
              <div>
                <h3 className="font-semibold">{t("legal_warning_title")}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {t("legal_warning_body")}
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <GlassCard className="relative overflow-hidden p-10 text-center md:p-14">
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                background:
                  "radial-gradient(ellipse 60% 80% at 50% 100%, var(--accent), transparent 70%)",
              }}
            />
            <div className="relative">
              <Copy className="mx-auto h-8 w-8 text-accent" />
              <h3 className="mt-4 text-2xl font-bold md:text-3xl">
                {t("cta_start")} →{" "}
                <span className="font-mono text-primary">cyber.alsamos.com</span>
              </h3>
              <Link
                to="/learn"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 font-semibold text-primary-foreground transition-all hover:brightness-110"
                style={{ boxShadow: "var(--shadow-neon)" }}
              >
                {t("cta_explore")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}
