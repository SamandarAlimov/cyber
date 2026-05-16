import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { GlassCard } from "@/components/glass-card";
import logo from "@/assets/alsamos-logo.png";
import { Building2, Target, Sparkles } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Alsamos Corporation Company — Cyber Alsamos haqida" },
      {
        name: "description",
        content:
          "Alsamos Corporation — innovatsion texnologiyalar va kiberxavfsizlik yo'nalishidagi kompaniya.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { t } = useI18n();
  return (
    <div className="px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 flex items-center gap-4">
          <img src={logo} alt="Alsamos" className="h-16 w-16 drop-shadow-[0_0_24px_rgba(255,140,40,0.4)]" />
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              <Building2 className="mr-1 inline h-3 w-3" />
              alsamos.com
            </div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              {t("about_title")}
            </h1>
          </div>
        </div>

        <GlassCard className="p-8 md:p-10">
          <p className="text-lg leading-relaxed text-foreground/90">{t("about_lead")}</p>
        </GlassCard>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <GlassCard className="p-6">
            <Target className="h-7 w-7 text-primary" />
            <h2 className="mt-4 text-lg font-semibold">{t("about_mission_t")}</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">{t("about_mission_d")}</p>
          </GlassCard>
          <GlassCard className="p-6">
            <Sparkles className="h-7 w-7 text-accent" />
            <h2 className="mt-4 text-lg font-semibold">{t("about_vision_t")}</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">{t("about_vision_d")}</p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
