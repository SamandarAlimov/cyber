import { useI18n } from "@/lib/i18n";
import logo from "@/assets/alsamos-logo.png";

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="mt-20 border-t border-border/40">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="Alsamos" className="h-7 w-7" />
            <div>
              <div className="font-mono text-sm font-semibold">cyber.alsamos.com</div>
              <div className="text-xs text-muted-foreground">
                Alsamos Corporation Company
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Alsamos Corporation. {t("footer_rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
