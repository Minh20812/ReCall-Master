import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import {
  BarChart2,
  BookOpen,
  Calendar,
  Home,
  Settings,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";

export function MainNav() {
  const location = useLocation();
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleLanguageChange = (event) => {
      const { language, nativeName } = event.detail;
      toast({
        title: "Language Changed",
        description: `The interface language has been changed to ${language} (${nativeName})`,
        duration: 3000,
      });
    };

    document.addEventListener("languageChanged", handleLanguageChange);
    return () => {
      document.removeEventListener("languageChanged", handleLanguageChange);
    };
  }, [toast]);

  const routes = [
    {
      href: "/",
      label: "Dashboard",
      icon: <Home className="w-5 h-5" />,
      active: location.pathname === "/",
    },
    {
      href: "/questions",
      label: "Questions",
      icon: <BookOpen className="w-5 h-5" />,
      active: location.pathname === "/questions",
    },
    {
      href: "/review",
      label: "Review",
      icon: <Calendar className="w-5 h-5" />,
      active: location.pathname === "/review",
    },
    {
      href: "/analytics",
      label: "Analytics",
      icon: <BarChart2 className="w-5 h-5" />,
      active: location.pathname === "/analytics",
    },
    {
      href: "/settings",
      label: "Settings",
      icon: <Settings className="w-5 h-5" />,
      active: location.pathname === "/settings",
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center h-14">
        {isMobile ? (
          <>
            <Link to="/" className="flex items-center gap-2 mr-auto">
              <span className="text-xl font-bold">RecallMaster</span>
            </Link>
            <div className="flex items-center gap-2">
              <LanguageSwitcher variant="icon" />
              <ModeToggle />
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                asChild
              >
                <Link to="/profile">
                  <User className="w-5 h-5" />
                  <span className="sr-only">Profile</span>
                </Link>
              </Button>
            </div>
          </>
        ) : (
          <>
            <Link to="/" className="flex items-center gap-2 mr-6">
              <span className="text-xl font-bold">RecallMaster</span>
            </Link>

            <nav className="hidden md:flex items-center gap-5 text-sm">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  to={route.href}
                  className={cn(
                    "flex items-center gap-1 transition-colors hover:text-foreground/80",
                    route.active
                      ? "text-foreground font-medium"
                      : "text-foreground/60"
                  )}
                >
                  {route.icon}
                  {route.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2 ml-auto">
              <LanguageSwitcher variant="minimal" />
              <ModeToggle />
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                asChild
              >
                <Link to="/profile">
                  <User className="w-5 h-5" />
                  <span className="sr-only">Profile</span>
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
