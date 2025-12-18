import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

const ADMIN_USERNAME = "bidalert";
const ADMIN_PASSWORD = "bidalert@123";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        localStorage.setItem("isAdmin", "true");
        toast.success("Admin access granted");
        navigate("/admin");
      } else {
        toast.error("Invalid admin credentials");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <Card className="shadow-xl border border-slate-200/70 bg-white/90 backdrop-blur">
            <CardHeader className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-slate-900">
                    Admin Login
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Restricted access for Bidalert administrators.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    placeholder="Enter admin username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      placeholder="Enter admin password"
                      className="pr-10"
                    />
                    <Lock className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full mt-2"
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Login as Admin"}
                </Button>
                <p className="text-xs text-slate-500 mt-2">
                  Note: This admin login is separate from user OAuth login and
                  grants access to internal monitoring tools only.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminLogin;


