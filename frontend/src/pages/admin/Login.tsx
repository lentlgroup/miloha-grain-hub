import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { Wheat, Eye, EyeOff, LogIn, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";

const schema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

type FormData = z.infer<typeof schema>;

const Login = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? "/admin";

  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const onSubmit = async (data: FormData) => {
    setAuthError(null);
    try {
      await login(data.email, data.password);
      navigate(from, { replace: true });
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Login failed. Please try again.");
    }
  };

  const fillDemo = (email: string) => {
    setValue("email", email);
    setValue("password", "password");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left branding panel – hidden on mobile */}
      <div className="hidden lg:flex lg:w-[42%] xl:w-[38%] flex-col justify-between p-12 surface-panel-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 grain-grid opacity-20 pointer-events-none" />
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 h-72 w-72 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/8">
            <Wheat size={20} className="text-accent" />
          </div>
          <div>
            <p className="text-lg font-serif font-semibold text-white leading-none">MILOHA</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/40">Admin Panel</p>
          </div>
        </div>

        {/* Hero copy */}
        <div className="relative space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
            Pure Grains · Dar es Salaam
          </p>
          <h1 className="text-3xl font-serif font-semibold text-white leading-snug">
            Manage your grain business from one place
          </h1>
          <p className="text-sm text-white/55 leading-relaxed">
            Review customer inquiries, manage your team, configure roles and permissions, and keep
            operations running smoothly.
          </p>
          <div className="grid grid-cols-2 gap-3 pt-2">
            {[
              { label: "Inquiries", desc: "Track & respond" },
              { label: "Users", desc: "Team management" },
              { label: "Roles", desc: "Access control" },
              { label: "Permissions", desc: "Fine-grained control" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="text-sm font-semibold text-white">{item.label}</p>
                <p className="text-xs text-white/45 mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-white/25">
          A product of LIMBU ENTERPRISES LIMITED (LENTL GROUP)
        </p>
      </div>

      {/* Right login form */}
      <div className="flex flex-1 flex-col items-center justify-center p-6 lg:p-12 bg-background">
        <div className="w-full max-w-[400px] space-y-7">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-accent shadow-lg">
              <Wheat size={18} />
            </div>
            <div>
              <p className="text-base font-serif font-semibold text-foreground leading-none">MILOHA Admin</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                Pure Grains
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-2xl font-serif font-semibold text-foreground">Sign in to your account</h2>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access the admin dashboard.
            </p>
          </div>

          {/* Demo credentials */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Info size={13} className="text-primary shrink-0" />
              <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">Demo Accounts</p>
            </div>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => fillDemo("admin@miloha.co.tz")}
                className="w-full text-left rounded-lg border border-border/60 bg-background/80 px-3 py-2.5 text-xs hover:border-primary/40 hover:bg-primary/5 transition-colors"
              >
                <p className="font-semibold text-foreground">Super Admin — full access</p>
                <p className="text-muted-foreground mt-0.5">admin@miloha.co.tz</p>
              </button>
              <button
                type="button"
                onClick={() => fillDemo("sales@miloha.co.tz")}
                className="w-full text-left rounded-lg border border-border/60 bg-background/80 px-3 py-2.5 text-xs hover:border-primary/40 hover:bg-primary/5 transition-colors"
              >
                <p className="font-semibold text-foreground">Sales Manager — inquiries only</p>
                <p className="text-muted-foreground mt-0.5">sales@miloha.co.tz</p>
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Password for both: <span className="font-semibold">password</span>
            </p>
          </div>

          {authError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@miloha.co.tz"
                autoComplete="email"
                {...register("email")}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="pr-10"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  <LogIn size={16} />
                  Sign In
                </>
              )}
            </Button>
          </form>

          <div className="text-center">
            <a href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              ← Back to MILOHA website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
