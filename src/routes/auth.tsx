import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { GlassCard } from "@/components/glass-card";
import { toast } from "sonner";
import {
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  LogIn,
  Mail,
  ShieldCheck,
  UserPlus,
} from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Kirish — Cyber Alsamos" },
      {
        name: "description",
        content: "Cyber Alsamos hisobingizga kiring yoki ro'yxatdan o'ting.",
      },
    ],
  }),
  component: AuthPage,
});

type Mode = "signin" | "signup" | "reset";

function AuthPage() {
  const { lang } = useI18n();
  const { session, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const tt = (uz: string, en: string) => (lang === "uz" ? uz : en);

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [busy, setBusy] = useState(false);
  const [oauthBusy, setOauthBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && session) navigate({ to: "/profile" });
  }, [authLoading, session, navigate]);

  const friendly = (msg: string) => {
    const m = msg.toLowerCase();
    if (m.includes("invalid login")) return tt("Email yoki parol noto'g'ri", "Invalid email or password");
    if (m.includes("user already registered")) return tt("Bu email allaqachon ro'yxatdan o'tgan", "Email already registered");
    if (m.includes("password should be at least")) return tt("Parol kamida 6 belgidan iborat bo'lishi kerak", "Password must be at least 6 characters");
    if (m.includes("pwned") || m.includes("compromised") || m.includes("found in")) return tt("Bu parol ma'lumot sizib chiqishlarda topilgan. Boshqa parol tanlang.", "This password was found in a data breach. Choose a stronger one.");
    if (m.includes("rate") || m.includes("too many")) return tt("Juda ko'p urinish. Birozdan keyin qayta urining.", "Too many attempts. Try again shortly.");
    if (m.includes("network") || m.includes("fetch")) return tt("Tarmoq xatosi. Internetni tekshiring.", "Network error. Check your connection.");
    return msg;
  };

  const validate = (): string | null => {
    if (!email.includes("@") || email.length < 5) return tt("To'g'ri email kiriting", "Enter a valid email");
    if (mode !== "reset" && password.length < 6) return tt("Parol kamida 6 belgi", "Password must be ≥ 6 chars");
    return null;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/profile`,
            data: { display_name: displayName || email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast.success(tt("Hisob yaratildi!", "Account created!"));
      } else if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success(tt("Xush kelibsiz!", "Welcome back!"));
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth`,
        });
        if (error) throw error;
        toast.success(tt("Tiklash linki yuborildi. Email'ingizni tekshiring.", "Reset link sent. Check your inbox."));
        setMode("signin");
      }
    } catch (err: any) {
      setError(friendly(err?.message ?? "Error"));
    } finally {
      setBusy(false);
    }
  };

  const signInGoogle = async () => {
    setError(null);
    setOauthBusy(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/profile` },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(friendly(err?.message ?? "OAuth error"));
      setOauthBusy(false);
    }
  };

  const passStrength = (() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 6) s++;
    if (password.length >= 10) s++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) s++;
    if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();

  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-12rem)] max-w-md items-center px-4 py-10">
      <GlassCard className="w-full p-6 md:p-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="font-mono text-2xl font-bold">
            <span className="text-primary">$</span>{" "}
            {mode === "signin"
              ? tt("kirish", "sign in")
              : mode === "signup"
              ? tt("ro'yxatdan o'tish", "sign up")
              : tt("parolni tiklash", "reset password")}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {mode === "reset"
              ? tt(
                  "Email manzilingizga tiklash linkini yuboramiz",
                  "We'll send a reset link to your email"
                )
              : tt(
                  "Streak, profil va o'rganish tarixingizni saqlang",
                  "Save your streak, profile and learning progress"
                )}
          </p>
        </div>

        {/* Mode tabs */}
        {mode !== "reset" && (
          <div className="mb-5 grid grid-cols-2 gap-1 rounded-full border border-border/60 bg-background/30 p-1 text-sm">
            <TabBtn active={mode === "signin"} onClick={() => { setMode("signin"); setError(null); }}>
              {tt("Kirish", "Sign in")}
            </TabBtn>
            <TabBtn active={mode === "signup"} onClick={() => { setMode("signup"); setError(null); }}>
              {tt("Ro'yxat", "Sign up")}
            </TabBtn>
          </div>
        )}

        {/* Google OAuth */}
        {mode !== "reset" && (
          <>
            <button
              type="button"
              onClick={signInGoogle}
              disabled={oauthBusy || busy}
              className="mb-4 inline-flex w-full items-center justify-center gap-2.5 rounded-md border border-border/60 bg-background/40 px-4 py-2.5 text-sm font-medium backdrop-blur transition-all hover:border-primary/40 hover:bg-background/60 disabled:opacity-50"
            >
              {oauthBusy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <GoogleIcon className="h-4 w-4" />
              )}
              {tt("Google bilan davom etish", "Continue with Google")}
            </button>
            <div className="mb-4 flex items-center gap-3 text-[11px] uppercase tracking-widest text-muted-foreground/60">
              <div className="h-px flex-1 bg-border/60" />
              {tt("yoki", "or")}
              <div className="h-px flex-1 bg-border/60" />
            </div>
          </>
        )}

        {/* Error banner */}
        {error && (
          <div
            role="alert"
            className="mb-4 flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive"
          >
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={submit} className="space-y-4" noValidate>
          {mode === "signup" && (
            <Field
              label={tt("Ism", "Display name")}
              value={displayName}
              onChange={setDisplayName}
              placeholder="h4ck3r"
              autoComplete="nickname"
            />
          )}

          <Field
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            required
            placeholder="you@alsamos.com"
            autoComplete="email"
            icon={<Mail className="h-4 w-4" />}
          />

          {mode !== "reset" && (
            <div>
              <Field
                label={tt("Parol", "Password")}
                type={showPass ? "text" : "password"}
                value={password}
                onChange={setPassword}
                required
                placeholder="••••••••"
                minLength={6}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                rightSlot={
                  <button
                    type="button"
                    onClick={() => setShowPass((s) => !s)}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label={showPass ? "Hide password" : "Show password"}
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
              />
              {mode === "signup" && password && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          i <= passStrength
                            ? passStrength <= 1
                              ? "bg-destructive"
                              : passStrength === 2
                              ? "bg-accent"
                              : "bg-primary"
                            : "bg-border/60"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="mt-1 text-[11px] text-muted-foreground">
                    {passStrength <= 1
                      ? tt("Zaif", "Weak")
                      : passStrength === 2
                      ? tt("O'rtacha", "Okay")
                      : passStrength === 3
                      ? tt("Yaxshi", "Good")
                      : tt("Kuchli", "Strong")}
                  </div>
                </div>
              )}
              {mode === "signin" && (
                <div className="mt-2 text-right">
                  <button
                    type="button"
                    onClick={() => { setMode("reset"); setError(null); }}
                    className="text-xs text-muted-foreground hover:text-primary"
                  >
                    {tt("Parolni unutdingizmi?", "Forgot password?")}
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={busy || oauthBusy}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : mode === "signin" ? (
              <LogIn className="h-4 w-4" />
            ) : mode === "signup" ? (
              <UserPlus className="h-4 w-4" />
            ) : (
              <Mail className="h-4 w-4" />
            )}
            {busy
              ? tt("Iltimos kuting...", "Please wait...")
              : mode === "signin"
              ? tt("Kirish", "Sign in")
              : mode === "signup"
              ? tt("Hisob yaratish", "Create account")
              : tt("Tiklash linkini yuborish", "Send reset link")}
          </button>

          {mode === "reset" && (
            <button
              type="button"
              onClick={() => { setMode("signin"); setError(null); }}
              className="inline-flex w-full items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {tt("Kirishga qaytish", "Back to sign in")}
            </button>
          )}
        </form>

        {/* Footer */}
        <div className="mt-6 border-t border-border/60 pt-4 text-center text-xs text-muted-foreground">
          {tt(
            "Ro'yxatdan o'tmasdan ham hamma darslarga kirish mumkin.",
            "You can access all lessons without signing up."
          )}{" "}
          <Link to="/learn" className="font-medium text-primary hover:underline">
            {tt("Treklar →", "Browse tracks →")}
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 font-medium transition-all ${
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  icon,
  rightSlot,
  ...rest
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  icon?: React.ReactNode;
  rightSlot?: React.ReactNode;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "type">) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="relative flex items-center">
        {icon && (
          <span className="pointer-events-none absolute left-3 text-muted-foreground">
            {icon}
          </span>
        )}
        <input
          {...rest}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-md border border-border/60 bg-background/40 py-2 font-mono text-sm outline-none ring-primary/40 backdrop-blur transition-all focus:border-primary/60 focus:ring-2 ${
            icon ? "pl-9" : "pl-3"
          } ${rightSlot ? "pr-10" : "pr-3"}`}
        />
        {rightSlot && (
          <span className="absolute right-3 flex items-center">{rightSlot}</span>
        )}
      </div>
    </label>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
    </svg>
  );
}
