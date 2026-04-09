import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wheat, Eye, EyeOff, Lock, Mail, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";

const AdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
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
      navigate("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
              Sign in to Dashboard
            </CardTitle>
            <CardDescription>
              Enter your admin credentials to access the management portal.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
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
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
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

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in…" : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 rounded-xl border border-border/60 bg-muted/40 p-4 text-xs text-muted-foreground">
              <p className="font-semibold mb-2 text-foreground/70">Demo accounts:</p>
              <div className="space-y-1">
                <p><span className="font-mono text-primary/80">admin@miloha.co.tz</span> — Super Admin</p>
                <p><span className="font-mono text-primary/80">content@miloha.co.tz</span> — Content Manager</p>
                <p><span className="font-mono text-primary/80">sales@miloha.co.tz</span> — Sales Manager</p>
              </div>
              <p className="mt-2">Password for all: <span className="font-mono text-primary/80">demo1234</span></p>
            </div>
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
