import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  Code2,
  ExternalLink,
  FileText,
  Globe,
  Network,
  Radar,
  Scale,
  Search,
  Server,
  ShieldCheck,
  Terminal,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import { GlassCard } from "@/components/glass-card";
import { useI18n } from "@/lib/i18n";
import {
  ETHICAL_HACKER_SKILLS,
  REFERENCE_STANDARDS,
  SKILL_LEVEL_LABELS,
  type SkillDomain,
  type SkillLevel,
} from "@/content/skills";

export const Route = createFileRoute("/skills")({
  head: () => ({
    meta: [
      { title: "Ethical hacker bilim xaritasi - Cyber Alsamos" },
      {
        name: "description",
        content:
          "Ethical hacker mukammal bilishi kerak bo'lgan bilimlar: etika, Linux, tarmoq, web, recon, exploitation, cloud, wireless, blue team va hisobot.",
      },
      { property: "og:title", content: "Cyber Alsamos - Ethical hacker bilim xaritasi" },
      {
        property: "og:description",
        content:
          "Boshlovchilar uchun professional kiberxavfsizlik skill matrix: nima o'rganish, nimani mashq qilish va qanday dalil bilan isbotlash.",
      },
    ],
  }),
  component: SkillsPage,
});

const DOMAIN_ICONS: Record<string, LucideIcon> = {
  "ethics-scope-law": Scale,
  "systems-os": Server,
  networking: Network,
  "programming-automation": Code2,
  "web-appsec": Globe,
  "recon-enumeration": Search,
  "exploitation-privesc": Terminal,
  "cloud-devsecops": ShieldCheck,
  "wireless-iot": Wifi,
  "blue-team-detection": Radar,
  "reporting-communication": FileText,
};

const LEVEL_STYLES: Record<SkillLevel, string> = {
  foundation: "border-sky-400/25 bg-sky-400/10 text-sky-200",
  lab: "border-primary/25 bg-primary/10 text-primary",
  professional: "border-accent/25 bg-accent/10 text-accent",
};

function SkillsPage() {
  const { lang } = useI18n();
  const tt = (uz: string, en: string) => (lang === "uz" ? uz : en);
  const toolCount = new Set(ETHICAL_HACKER_SKILLS.flatMap((domain) => domain.tools)).size;
  const professionalCount = ETHICAL_HACKER_SKILLS.filter(
    (domain) => domain.level === "professional",
  ).length;

  return (
    <div className="px-4 py-8 md:py-12">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-md border border-primary/20 bg-primary/10 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-primary">
              <BookOpenCheck className="h-3.5 w-3.5" />
              {tt("Professional bilim xaritasi", "Professional skill matrix")}
            </div>
            <h1 className="mt-4 max-w-4xl text-3xl font-bold tracking-tight md:text-5xl">
              {tt(
                "Etik xaker mukammal bilishi kerak bo'lgan yo'nalishlar",
                "What an ethical hacker should master",
              )}
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-muted-foreground md:text-base">
              {tt(
                "Bu sahifa Cyber Alsamos o'quvchilariga nimani, qaysi tartibda va qanday amaliy dalil bilan o'rganishni ko'rsatadi. Maqsad - shunchaki tool yodlash emas, balki ruxsatli, tushunarli va professional pentest fikrlashini shakllantirish.",
                "This page shows Cyber Alsamos learners what to study, in what order, and what practical evidence proves progress. The goal is not memorizing tools, but building authorized, explainable, professional testing judgment.",
              )}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to="/learn"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:brightness-110"
              >
                {tt("Darslarni boshlash", "Start lessons")}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/roadmap"
                className="glass inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold hover:border-primary/40"
              >
                {tt("Roadmapni ko'rish", "View roadmap")}
              </Link>
            </div>
          </div>

          <GlassCard className="p-5">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {tt("O'quvchi nazorati", "Learner control")}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <MatrixStat label={tt("yo'nalish", "domains")} value={ETHICAL_HACKER_SKILLS.length} />
              <MatrixStat label={tt("tool", "tools")} value={toolCount} />
              <MatrixStat label={tt("pro", "pro")} value={professionalCount} />
            </div>
            <div className="mt-5 space-y-2">
              {(["foundation", "lab", "professional"] as SkillLevel[]).map((level) => (
                <div
                  key={level}
                  className="flex items-center justify-between gap-3 rounded-md border border-border/50 bg-background/25 px-3 py-2"
                >
                  <span className="text-sm font-medium">{SKILL_LEVEL_LABELS[level][lang]}</span>
                  <span className={`rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase ${LEVEL_STYLES[level]}`}>
                    {level}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <PrincipleCard
            icon={<ShieldCheck className="h-5 w-5" />}
            title={tt("Avval ruxsat", "Authorization first")}
            body={tt(
              "Har bir texnika faqat o'z labingizda yoki yozma ruxsat berilgan tizimlarda bajariladi.",
              "Every technique belongs only in your own lab or systems with written authorization.",
            )}
          />
          <PrincipleCard
            icon={<Terminal className="h-5 w-5" />}
            title={tt("Dalil bilan o'rganish", "Evidence-driven learning")}
            body={tt(
              "Har bir yo'nalishda transcript, screenshot, request/response yoki report dalili bo'lishi kerak.",
              "Every domain should produce transcripts, screenshots, request/response evidence, or reports.",
            )}
          />
          <PrincipleCard
            icon={<FileText className="h-5 w-5" />}
            title={tt("Report - asosiy mahsulot", "The report is the product")}
            body={tt(
              "Professional natija topilma, impact, PoC, remediation va retest bilan o'lchanadi.",
              "Professional output is measured by findings, impact, PoC, remediation, and retesting.",
            )}
          />
        </section>

        <section className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                {tt("Bilim domenlari", "Knowledge domains")}
              </h2>
              <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
                {tt(
                  "Har bir karta: nimani bilish, nimani mashq qilish, qaysi tool bilan ishlash va progressni qanday isbotlashni ko'rsatadi.",
                  "Each card shows what to know, what to practice, which tools matter, and how to prove progress.",
                )}
              </p>
            </div>
            <div className="font-mono text-xs text-muted-foreground">
              {ETHICAL_HACKER_SKILLS.length} {tt("yo'nalish", "domains")}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {ETHICAL_HACKER_SKILLS.map((domain, index) => (
              <SkillDomainCard key={domain.id} domain={domain} index={index} />
            ))}
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
          <GlassCard className="p-5">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
              <CheckCircle2 className="h-5 w-5" />
              {tt("Platformaga qo'shish yo'li", "How this shapes the platform")}
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {tt(
                "Keyingi bosqichda har bir modulni shu skill xaritaga bog'laymiz: dars objectives, terminal transcript, lab dalili va mini-report bir xil professional struktura bilan yuradi.",
                "Next, every module can map back to this matrix: lesson objectives, terminal transcript, lab evidence, and mini-reports will follow one professional structure.",
              )}
            </p>
          </GlassCard>

          <GlassCard className="p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {tt("Sanoat frameworklari", "Industry references")}
                </div>
                <h2 className="mt-1 text-xl font-semibold">
                  {tt("Kontent nimaga tayangan?", "What is the content based on?")}
                </h2>
              </div>
              <BookOpenCheck className="h-5 w-5 text-primary" />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {REFERENCE_STANDARDS.map((standard) => (
                <a
                  key={standard.title}
                  href={standard.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-border/50 bg-background/25 p-4 transition-colors hover:border-primary/40"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold">{standard.title}</h3>
                    <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </div>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    {standard.description[lang]}
                  </p>
                </a>
              ))}
            </div>
          </GlassCard>
        </section>
      </div>
    </div>
  );
}

function SkillDomainCard({ domain, index }: { domain: SkillDomain; index: number }) {
  const { lang } = useI18n();
  const Icon = DOMAIN_ICONS[domain.id] ?? ShieldCheck;

  return (
    <GlassCard hover className="flex h-full flex-col p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Domain {String(index + 1).padStart(2, "0")}
            </div>
            <span className={`rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase ${LEVEL_STYLES[domain.level]}`}>
              {SKILL_LEVEL_LABELS[domain.level][lang]}
            </span>
          </div>
          <h3 className="mt-1 text-lg font-semibold leading-tight">{domain.title[lang]}</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{domain.summary[lang]}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <DomainList title={lang === "uz" ? "Mukammal bilish" : "Must know"} items={domain.mustKnow[lang]} />
        <DomainList title={lang === "uz" ? "Amaliy mashq" : "Practice"} items={domain.practice[lang]} />
      </div>

      <div className="mt-5">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {lang === "uz" ? "Tool va metodlar" : "Tools and methods"}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {domain.tools.map((tool) => (
            <span
              key={tool}
              className="rounded-md border border-border/50 bg-background/30 px-2 py-1 font-mono text-[11px] text-muted-foreground"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-md border border-accent/20 bg-accent/10 p-3 text-xs leading-5 text-muted-foreground">
        <span className="font-semibold text-accent">
          {lang === "uz" ? "Progress dalili: " : "Progress evidence: "}
        </span>
        {domain.evidence[lang]}
      </div>
    </GlassCard>
  );
}

function DomainList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </div>
      <ul className="mt-2 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-6 text-muted-foreground">
            <CheckCircle2 className="mt-1 h-3.5 w-3.5 shrink-0 text-primary" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PrincipleCard({
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

function MatrixStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-border/50 bg-background/30 px-3 py-3">
      <div className="font-mono text-xl font-bold text-primary">{value}</div>
      <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
