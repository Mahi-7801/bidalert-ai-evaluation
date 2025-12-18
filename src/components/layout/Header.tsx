import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FileText, LogOut, User, Menu, X, Github, Chrome, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { insforge } from "@/lib/insforge";
import { toast } from "sonner";
import { SignedIn, SignedOut, UserButton, useUser } from "@insforge/react";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Initialize admin flag from localStorage
    if (typeof window !== "undefined") {
      setIsAdmin(localStorage.getItem("isAdmin") === "true");

      const handleStorage = (event: StorageEvent) => {
        if (event.key === "isAdmin") {
          setIsAdmin(event.newValue === "true");
        }
      };

      window.addEventListener("storage", handleStorage);
      return () => window.removeEventListener("storage", handleStorage);
    }
  }, []);

  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    try {
      const { data, error } = await insforge.auth.signInWithOAuth({
        provider,
        redirectTo: window.location.origin + '/dashboard',
      });
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch (error) {
      console.error(`${provider} sign in error:`, error);
      toast.error(`Failed to sign in with ${provider}`);
    }
  };

  const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="16" height="16" className="mr-2">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
      <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
    </svg>
  );

  const GitHubIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="mr-2">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.416-4.041-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.744.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  );

  const handleSignOut = async () => {
    try {
      await insforge.auth.signOut();
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  const navLinks = [
    { to: "/dashboard", label: "Dashboard", shortLabel: "Dashboard" },
    { to: "/draft", label: "AI Draft", shortLabel: "Draft" },
    { to: "/documents", label: "Documents", shortLabel: "Docs" },
    { to: "/upload", label: "Upload", shortLabel: "Upload" },
    { to: "/evaluation", label: "Evaluation", shortLabel: "Evaluate" },
    { to: "/compare", label: "Compare", shortLabel: "Compare" },
    { to: "/audit", label: "Audit Trail", shortLabel: "Audit" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-2 sm:px-4 max-w-full overflow-hidden">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mr-2 sm:mr-4 md:mr-6 flex-shrink-0">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="hidden font-bold sm:inline-block whitespace-nowrap">
            BidAnalyzer AI
          </span>
        </Link>

        {/* Desktop Navigation */}
        {user && (
          <nav className="hidden lg:flex flex-wrap items-center gap-1 min-w-0">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 text-sm font-medium transition-colors rounded-md whitespace-nowrap flex-shrink-0 ${
                  location.pathname === link.to
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
                title={link.label}
              >
                <span className="hidden 2xl:inline">{link.label}</span>
                <span className="2xl:hidden">{link.shortLabel}</span>
              </Link>
            ))}
          </nav>
        )}

        <div className="flex-1" />

        {/* User Menu or Auth Buttons */}
        <SignedIn>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.email?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.email || 'User'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                <User className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/admin-login')}>
                <Shield className="mr-2 h-4 w-4" />
                <span>Admin Login</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SignedIn>
        <SignedOut>
          <div className="flex items-center gap-2 flex-shrink-0">
            {!isAdmin && (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center"
                  onClick={() => handleOAuthSignIn('google')}
                >
                  <GoogleIcon />
                  <span>Google</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center"
                  onClick={() => handleOAuthSignIn('github')}
                >
                  <GitHubIcon />
                  <span>GitHub</span>
                </Button>
                <Button 
                  asChild
                  variant="outline"
                  size="sm"
                  className="flex items-center border-blue-600 text-blue-700 hover:bg-blue-50"
                >
                  <Link to="/admin-login">
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Admin Login</span>
                  </Link>
                </Button>
              </>
            )}

            {isAdmin && (
              <>
                <Button 
                  asChild
                  variant="outline" 
                  size="sm" 
                  className="flex items-center border-blue-600 text-blue-700 hover:bg-blue-50"
                >
                  <Link to="/admin">
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Admin Panel</span>
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => {
                    localStorage.removeItem("isAdmin");
                    setIsAdmin(false);
                    navigate("/");
                  }}
                >
                  Logout Admin
                </Button>
              </>
            )}
          </div>
        </SignedOut>

        {/* Mobile Menu Toggle */}
        {user && (
          <Button
            variant="ghost"
            size="sm"
            className="ml-2 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        )}
      </div>

      {/* Mobile Navigation */}
      {user && mobileMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="container px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 text-sm font-medium transition-colors rounded-md ${
                  location.pathname === link.to
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
