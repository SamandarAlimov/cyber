import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

export function CommandBlock({
  command,
  comment,
  output,
}: {
  command: string;
  comment?: string;
  output?: string;
}) {
  const [copied, setCopied] = useState(false);
  const { t } = useI18n();

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
    <div className="group border-b border-white/5 px-4 py-4 last:border-b-0">
      {comment && (
        <div className="mb-2 font-mono text-[11px] text-slate-400">
          # {comment}
        </div>
      )}
      <div className="flex min-w-0 items-start gap-2">
        <div className="min-w-0 flex-1 font-mono text-[12px] leading-5 sm:text-[13px]">
          <div className="text-cyan-300">(kali@kali)-[~]</div>
          <div className="flex min-w-0 items-start gap-2">
            <span className="text-cyan-300">$</span>
            <code className="min-w-0 break-all text-emerald-300">{command}</code>
          </div>
        </div>
        <button
          type="button"
          onClick={onCopy}
          aria-label={copied ? t("copied") : t("copy")}
          title={copied ? t("copied") : t("copy_tooltip")}
          className="mt-5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-white/10 hover:text-emerald-300 focus-visible:bg-white/10 focus-visible:text-emerald-300 focus-visible:outline-none"
        >
          {copied ? <Check className="h-4 w-4 text-emerald-300" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
      {output && (
        <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words font-mono text-[12px] leading-5 text-slate-200 sm:text-[13px]">
          {output}
        </pre>
      )}
    </div>
  );
}
