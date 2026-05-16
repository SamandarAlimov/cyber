import { useState } from "react";
import { Check, CheckCircle2, Copy, Play } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

export function CommandBlock({
  command,
  comment,
  expected,
  practiced,
  onRun,
}: {
  command: string;
  comment?: string;
  expected?: string;
  practiced?: boolean;
  onRun?: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const { t, lang } = useI18n();
  const tt = (uz: string, en: string) => (lang === "uz" ? uz : en);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      toast.success(t("copied"), { description: t("copied_message"), duration: 2000 });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Clipboard error");
    }
  };

  return (
    <div
      className={`glass group relative overflow-hidden rounded-lg transition-all ${
        practiced ? "border-primary/50" : copied ? "border-primary/60 shadow-[0_0_0_1px_var(--primary)]" : ""
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-stretch">
        <div className="flex min-w-0 flex-1 items-start gap-2 px-3 py-3 sm:gap-3 sm:px-4">
          <span className="select-none pt-px font-mono text-sm text-primary/70">$</span>
          <code className="min-w-0 flex-1 break-all font-mono text-xs leading-relaxed text-primary sm:text-sm">
            {command}
          </code>
          {practiced && (
            <span className="hidden shrink-0 items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary md:inline-flex">
              <CheckCircle2 className="h-3 w-3" />
              {tt("sinab ko'rildi", "practiced")}
            </span>
          )}
        </div>
        <div className="flex shrink-0 border-t border-border/40 bg-background/30 sm:border-l sm:border-t-0">
          {onRun && (
            <button
              type="button"
              onClick={onRun}
              aria-label={tt("Simulyatorda ishga tushirish", "Run in simulator")}
              title={tt("Simulyatorda ishga tushirish", "Run in simulator")}
              className="inline-flex flex-1 items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/10 focus-visible:bg-primary/10 focus-visible:outline-none sm:flex-none sm:px-4"
            >
              <Play className="h-4 w-4" />
              <span>{tt("Run", "Run")}</span>
            </button>
          )}
          <button
            type="button"
            onClick={onCopy}
            aria-label={copied ? t("copied") : t("copy")}
            title={copied ? t("copied") : t("copy_tooltip")}
            className="inline-flex flex-1 items-center justify-center gap-1.5 border-l border-border/40 px-3 py-2.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary focus-visible:bg-primary/10 focus-visible:text-primary focus-visible:outline-none active:bg-primary/20 sm:flex-none sm:px-4"
          >
            {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
            <span
              aria-live="polite"
              className={copied ? "text-primary" : ""}
            >
              {copied ? t("copied") : t("copy")}
            </span>
          </button>
        </div>
      </div>
      {(comment || expected) && (
        <div className="grid gap-0 border-t border-border/40 bg-background/30 text-xs sm:grid-cols-2">
          {comment && (
            <div className="px-3 py-2 text-muted-foreground sm:px-4">
              {comment}
            </div>
          )}
          {expected && (
            <div className="border-t border-border/40 px-3 py-2 font-mono text-primary/80 sm:border-l sm:border-t-0 sm:px-4">
              <span className="mr-2 font-sans font-semibold text-muted-foreground">
                {t("expected")}:
              </span>
              {expected}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
