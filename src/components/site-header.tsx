import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useI18n, type Lang } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import logo from "@/assets/alsamos-logo.png";
import { Shield, UserCircle2, Menu, X } from "lucide-react";

export function SiteHeader() {
  const { t, lang, setLang } = useI18n();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="glass-strong border-b">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 px-3 sm:h-16 sm:px-4 md:px-6">
          <Link to="/" onClick={close} className="flex min-w-0 items-center gap-2 group sm:gap-2.5">
            <img
              src={logo}
              alt="Alsamos"
              className="h-7 w-7 shrink-0 drop-shadow-[0_0_12px_rgba(255,140,40,0.5)] transition-transform group-hover:scale-110 sm:h-8 sm:w-8"
            />
            <div className="min-w-0 leading-tight">
              <div className="truncate font-mono text-xs font-bold tracking-tight sm:text-sm">
                <span className="text-primary">cyber</span>
                <span className="text-muted-foreground">.</span>
                <span className="text-accent">alsamos</span>
              </div>
              <div className="hidden text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:block">
                Corporation
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            <NavLink to="/">{t("nav_home")}</NavLink>
            <NavLink to="/roadmap">{t("nav_roadmap")}</NavLink>
            <NavLink to="/learn">{t("nav_learn")}</NavLink>
            <NavLink to="/about">{t("nav_about")}</NavLink>
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="glass flex items-center rounded-full p-0.5 text-xs font-medium">
              {(["uz", "en"] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`rounded-full px-2 py-1 uppercase transition-colors sm:px-3 ${
                    lang === l
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            {user ? (
              <Link
                to="/profile"
                className="glass inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-medium hover:border-primary/40 sm:px-3"
              >
                <UserCircle2 className="h-4 w-4 text-primary" />
                <span className="hidden sm:inline">{t("nav_profile")}</span>
              </Link>
            ) : (
              <Link
                to="/auth"
                className="glass inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-medium hover:border-primary/40 sm:px-3"
              >
                <UserCircle2 className="h-4 w-4" />
                <span className="hidden sm:inline">{t("nav_signin")}</span>
              </Link>
            )}
            <Link
              to="/learn"
              className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-accent-foreground transition-all hover:brightness-110"
              style={{ boxShadow: "var(--shadow-orange)" }}
            >
              <Shield className="h-3.5 w-3.5" />
              {t("cta_start")}
            </Link>

            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="glass inline-flex h-9 w-9 items-center justify-center rounded-full md:hidden"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="border-t border-border/40 md:hidden">
            <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-3 py-3 sm:px-4">
              <MobileNavLink to="/" onClick={close}>{t("nav_home")}</MobileNavLink>
              <MobileNavLink to="/roadmap" onClick={close}>{t("nav_roadmap")}</MobileNavLink>
              <MobileNavLink to="/learn" onClick={close}>{t("nav_learn")}</MobileNavLink>
              <MobileNavLink to="/about" onClick={close}>{t("nav_about")}</MobileNavLink>
              <Link
                to="/learn"
                onClick={close}
                className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground"
                style={{ boxShadow: "var(--shadow-orange)" }}
              >
                <Shield className="h-4 w-4" />
                {t("cta_start")}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      activeProps={{ className: "text-primary bg-primary/10" }}
      activeOptions={{ exact: to === "/" }}
      className="rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  to,
  onClick,
  children,
}: {
  to: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      activeProps={{ className: "text-primary bg-primary/10" }}
      activeOptions={{ exact: to === "/" }}
      className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/5 hover:text-foreground"
    >
      {children}
    </Link>
  );
}
