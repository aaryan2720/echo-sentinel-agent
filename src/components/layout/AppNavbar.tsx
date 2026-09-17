import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  LayoutDashboard,
  ShieldAlert,
  Network,
  Bot,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  UserCheck,
  Instagram,
  Globe,
  Activity,
  Video,
  Database,
  Cpu,
  Radio,
  ExternalLink,
} from "lucide-react";

interface AppNavbarProps {
  onOpenReviewQueue?: () => void;
  reviewCount?: number;
  unreadAlertsCount?: number;
}

export function AppNavbar({
  onOpenReviewQueue,
  reviewCount = 5,
  unreadAlertsCount = 3,
}: AppNavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const mainNavItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Incidents", path: "/incidents", icon: ShieldAlert, badge: "8" },
    { name: "Network", path: "/network", icon: Network },
    { name: "AI Agents", path: "/agents", icon: Bot, badge: "6/6" },
    { name: "Analytics", path: "/analytics", icon: BarChart3 },
    { name: "Alerts", path: "/alerts", icon: Bell, badge: unreadAlertsCount ? `${unreadAlertsCount}` : undefined, badgeColor: "destructive" },
  ];

  const toolItems = [
    { name: "Instagram Monitor", path: "/instagram-monitoring", icon: Instagram, desc: "Real-time hashtag & deepfake stream" },
    { name: "URL Analysis Inspector", path: "/url-analysis", icon: Globe, desc: "yt-dlp social media scraper & detector" },
    { name: "System Status & Telemetry", path: "/system-status", icon: Activity, desc: "Endpoint health & latency checks" },
    { name: "Visual Forensics Tester", path: "/visual-test", icon: Video, desc: "Frame-by-frame ViT detector tester" },
    { name: "Agent Multi-Test Suite", path: "/agent-test", icon: Cpu, desc: "Coordination & pipeline debugger" },
    { name: "Database Diagnostics", path: "/db-test", icon: Database, desc: "Supabase connection & schema test" },
  ];

  const isActive = (path: string) => {
    if (path === "/dashboard" && location.pathname === "/dashboard") return true;
    if (path !== "/dashboard" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const isToolsActive = toolItems.some((tool) => location.pathname === tool.path);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left: Brand + Primary Nav */}
        <div className="flex items-center gap-6 lg:gap-8">
          <Link
            to="/dashboard"
            className="flex items-center gap-2.5 transition-transform hover:scale-[1.02] focus-visible:ring-1"
          >
            <div className="relative">
              <Logo />
              <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success"></span>
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-foreground flex items-center gap-1.5">
                EchoBreaker
                <span className="text-[10px] uppercase font-mono tracking-widest px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                  Sentinel
                </span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {mainNavItems.map((item) => {
              const active = isActive(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    active
                      ? "text-primary bg-primary/10 border border-primary/25 shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
                  <span>{item.name}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-semibold ${
                        item.badgeColor === "destructive"
                          ? "bg-destructive/20 text-destructive border border-destructive/30"
                          : "bg-primary/20 text-primary"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {/* Tools Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    isToolsActive
                      ? "text-primary bg-primary/10 border border-primary/25"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <Activity className="w-4 h-4" />
                  <span>Tools & Forensics</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-72 bg-popover/95 backdrop-blur-xl border-border/80">
                <DropdownMenuLabel className="text-xs uppercase font-mono tracking-wider text-muted-foreground">
                  Forensic & Verification Tools
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {toolItems.map((tool) => {
                  const Icon = tool.icon;
                  const active = location.pathname === tool.path;
                  return (
                    <DropdownMenuItem
                      key={tool.path}
                      onClick={() => navigate(tool.path)}
                      className={`cursor-pointer p-2.5 ${active ? "bg-primary/15 text-primary" : ""}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-1.5 rounded-md bg-secondary/80 text-primary mt-0.5">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-foreground">{tool.name}</div>
                          <div className="text-xs text-muted-foreground line-clamp-1">{tool.desc}</div>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>

        {/* Right Action Controls */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Live Status Pill */}
          <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-full bg-secondary/60 border border-border/60 text-xs font-mono text-muted-foreground">
            <span className="flex h-2 w-2 rounded-full bg-success"></span>
            <span>Live Sentinel Active</span>
            <span className="text-primary font-semibold">99.8%</span>
          </div>

          {/* Review Queue Shortcut */}
          {onOpenReviewQueue && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenReviewQueue}
              className="gap-2 border-warning/40 bg-warning/10 text-warning hover:bg-warning/20 hover:text-warning transition-all text-xs font-medium"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Review Queue</span>
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-warning text-black text-[10px] font-bold">
                {reviewCount}
              </span>
            </Button>
          )}

          {/* Settings button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/settings")}
            className={`h-9 w-9 rounded-md text-muted-foreground hover:text-foreground ${
              location.pathname === "/settings" ? "bg-muted text-primary" : ""
            }`}
            title="System Settings"
          >
            <Settings className="w-4 h-4" />
          </Button>

          {/* Sign Out */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Sign Out</span>
          </Button>
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="flex sm:hidden items-center gap-2">
          {onOpenReviewQueue && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenReviewQueue}
              className="h-8 px-2 border-warning/40 bg-warning/10 text-warning text-xs"
            >
              <UserCheck className="w-3.5 h-3.5 mr-1" />
              <span>{reviewCount}</span>
            </Button>
          )}

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9 border-border">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-background/95 backdrop-blur-xl border-border p-6">
              <SheetHeader className="mb-6 text-left">
                <SheetTitle className="flex items-center gap-2">
                  <Logo />
                  <span className="font-bold text-foreground">EchoBreaker</span>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-6">
                <div className="space-y-1">
                  <div className="text-xs font-mono uppercase text-muted-foreground px-2 mb-2">Main Navigation</div>
                  {mainNavItems.map((item) => {
                    const active = isActive(item.path);
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-all ${
                          active
                            ? "bg-primary/15 text-primary border border-primary/30"
                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4" />
                          <span>{item.name}</span>
                        </div>
                        {item.badge && (
                          <Badge variant={item.badgeColor === "destructive" ? "destructive" : "secondary"} className="text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    );
                  })}
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-mono uppercase text-muted-foreground px-2 mb-2">Tools & Forensics</div>
                  {toolItems.map((tool) => {
                    const active = location.pathname === tool.path;
                    const Icon = tool.icon;
                    return (
                      <Link
                        key={tool.path}
                        to={tool.path}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                          active
                            ? "bg-primary/15 text-primary border border-primary/30"
                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        }`}
                      >
                        <Icon className="w-4 h-4 text-primary" />
                        <span>{tool.name}</span>
                      </Link>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-border/70 space-y-2">
                  <Link
                    to="/settings"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-muted/50"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setMobileOpen(false);
                      navigate("/");
                    }}
                    className="w-full justify-start text-destructive hover:bg-destructive/10 text-sm gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

// EchoBreaker Sentinel (AI-03)
