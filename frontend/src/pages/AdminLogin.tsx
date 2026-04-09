import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wheat, Eye, EyeOff, Lock, Mail, Shield, UserPlus, LogIn, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";

// ─── Login form ──────────────────────────────────────────────────────────────

const LoginForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login(email, password);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="login-email">Email address</Label>
        <div className="relative">
          <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="login-email"
            type="email"
            placeholder="admin@miloha.co.tz"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-9"
            required
            autoComplete="email"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="login-password">Password</Label>
        <div className="relative">
          <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="login-password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-9 pr-10"
            required
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <Button type="submit" className="w-full gap-2" disabled={isLoading}>
        <LogIn size={15} />
        {isLoading ? "Signing in…" : "Sign In"}
      </Button>

      <div className="rounded-xl border border-border/60 bg-muted/40 p-4 text-xs text-muted-foreground">
        <p className="font-semibold mb-2 text-foreground/70">Demo accounts:</p>
        <div className="space-y-1">
          <p><span className="font-mono text-primary/80">admin@miloha.co.tz</span> — Super Admin</p>
          <p><span className="font-mono text-primary/80">content@miloha.co.tz</span> — Content Manager</p>
          <p><span className="font-mono text-primary/80">sales@miloha.co.tz</span> — Sales Manager</p>
        </div>
        <p className="mt-2">Password for all: <span className="font-mono text-primary/80">demo1234</span></p>
      </div>
    </form>
  );
};

// ─── Register form ────────────────────────────────────────────────────────────

const RegisterForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== passwordConfirmation) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setIsLoading(true);
    try {
      await register(name, email, password, passwordConfirmation);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="reg-name">Full name</Label>
        <div className="relative">
          <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="reg-name"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="pl-9"
            required
            autoComplete="name"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reg-email">Email address</Label>
        <div className="relative">
          <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="reg-email"
            type="email"
            placeholder="you@miloha.co.tz"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-9"
            required
            autoComplete="email"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reg-password">Password <span className="text-muted-foreground font-normal">(min 8 characters)</span></Label>
        <div className="relative">
          <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="reg-password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-9 pr-10"
            required
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reg-confirm">Confirm password</Label>
        <div className="relative">
          <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="reg-confirm"
            type={showConfirm ? "text" : "password"}
            placeholder="Repeat your password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            className="pl-9 pr-10"
            required
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <Button type="submit" className="w-full gap-2" disabled={isLoading}>
        <UserPlus size={15} />
        {isLoading ? "Creating account…" : "Create Account"}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        New accounts are assigned <strong>Viewer</strong> access. A Super Admin can adjust your role after registration.
      </p>
    </form>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const AdminLogin = () => {
  const navigate = useNavigate();

  const handleSuccess = () => navigate("/admin");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="absolute inset-0 grain-grid opacity-20 pointer-events-none" />
      <div className="absolute right-[-4rem] top-24 h-72 w-72 rounded-full bg-accent/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-[-5rem] h-72 w-72 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
            <Wheat size={32} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">MILOHA Admin</h1>
          <p className="mt-1 text-sm text-muted-foreground">Grain Hub Management Portal</p>
        </div>

        <Card className="surface-panel border-border/60">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield size={18} className="text-primary" />
              Admin Portal
            </CardTitle>
            <CardDescription>
              Sign in to your account or register a new admin account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2 mb-5">
                <TabsTrigger value="login" className="gap-1.5">
                  <LogIn size={13} /> Sign In
                </TabsTrigger>
                <TabsTrigger value="register" className="gap-1.5">
                  <UserPlus size={13} /> Register
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <LoginForm onSuccess={handleSuccess} />
              </TabsContent>

              <TabsContent value="register">
                <RegisterForm onSuccess={handleSuccess} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          <a href="/" className="underline hover:text-foreground transition-colors">← Back to website</a>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
