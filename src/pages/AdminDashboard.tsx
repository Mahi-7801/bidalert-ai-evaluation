import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, Users, Clock } from "lucide-react";
import { insforge } from "@/lib/insforge";

interface LoginRecord {
  email: string;
  name: string;
  lastLogin: string;
}

interface AppUser {
  id: string;
  nickname?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [logins, setLogins] = useState<LoginRecord[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    if (!isAdmin) {
      navigate("/admin-login");
      return;
    }

    // Load local login history
    try {
      const stored = localStorage.getItem("userLogins");
      if (stored) {
        const parsed = JSON.parse(stored) as LoginRecord[];
        setLogins(parsed);
      }
    } catch {
      setLogins([]);
    }

    // Load users from Insforge backend
    const loadUsers = async () => {
      try {
        setLoadingUsers(true);
        const { data, error } = await insforge.database
          .from("users")
          .select("id, nickname, avatar_url, bio, created_at, updated_at")
          .order("created_at", { ascending: false });

        if (error) {
          console.warn("Failed to load users:", error);
          setUsers([]);
        } else {
          setUsers(data || []);
        }
      } catch (err) {
        console.warn("Unexpected error loading users:", err);
        setUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    };

    loadUsers();
  }, [navigate]);

  const formatDateTime = (iso: string) => {
    if (!iso) return "-";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <Header />
      <main className="flex-1 py-8">
        <div className="container px-4 max-w-6xl space-y-6">
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-slate-900">
                    Admin Control Panel
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Full visibility into Bidalert user logins for this environment.
                  </CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="gap-1 text-xs font-semibold">
                <Users className="h-3 w-3" />
                {users.length || logins.length} users
              </Badge>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-semibold text-slate-900">
                  User Login Activity
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Each entry shows a unique account with email, display name, and last login timestamp.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="h-3 w-3" />
                <span>Updated from local login history</span>
              </div>
            </CardHeader>
            <CardContent>
              {logins.length === 0 ? (
                <div className="py-10 text-center text-sm text-slate-500">
                  No user login data recorded yet. Once users access the dashboard, their
                  email and name will appear here for admin review.
                </div>
              ) : (
                <div className="rounded-md border border-slate-200 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50">
                        <TableHead className="min-w-[240px]">Email</TableHead>
                        <TableHead className="min-w-[180px]">User Name</TableHead>
                        <TableHead className="min-w-[200px]">Last Login</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {logins.map((u) => (
                        <TableRow key={u.email}>
                          <TableCell className="font-medium">{u.email}</TableCell>
                          <TableCell>{u.name || "-"}</TableCell>
                          <TableCell>{formatDateTime(u.lastLogin)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-semibold text-slate-900">
                  Registered Users
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Live view of all user accounts stored in the <code>users</code> table.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {loadingUsers ? (
                <div className="py-8 text-center text-sm text-slate-500">
                  Loading users...
                </div>
              ) : users.length === 0 ? (
                <div className="py-8 text-center text-sm text-slate-500">
                  No users found yet. Once someone signs in with Google or GitHub,
                  their profile will appear here.
                </div>
              ) : (
                <div className="rounded-md border border-slate-200 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50">
                        <TableHead className="min-w-[260px]">User ID</TableHead>
                        <TableHead className="min-w-[180px]">Nickname</TableHead>
                        <TableHead className="min-w-[220px]">Created At</TableHead>
                        <TableHead className="min-w-[220px]">Last Updated</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell className="font-mono text-xs">{u.id}</TableCell>
                          <TableCell>{u.nickname || "—"}</TableCell>
                          <TableCell>
                            {u.created_at
                              ? new Date(u.created_at).toLocaleString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "—"}
                          </TableCell>
                          <TableCell>
                            {u.updated_at
                              ? new Date(u.updated_at).toLocaleString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;


