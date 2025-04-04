import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils"; // Đảm bảo đường dẫn chính xác
import {
  BarChart2,
  BookOpen,
  Calendar,
  Home,
  Plus,
  Settings,
} from "lucide-react";
import { Button } from "../components/ui/button"; // Đảm bảo đường dẫn chính xác
import { QuickAddQuestion } from "../components/questions/QuickAddQuestion"; // Đảm bảo đường dẫn chính xác
import { useIsMobile } from "../hooks/use-mobile"; // Đảm bảo đường dẫn chính xác

export function MobileNav() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [showFab, setShowFab] = useState(false);

  // Ẩn FAB khi bàn phím mở (ước lượng)
  useEffect(() => {
    const handleResize = () => {
      const viewportHeight = window.innerHeight;
      const windowHeight = window.outerHeight;

      // Nếu viewport height nhỏ hơn nhiều so với window height, có thể bàn phím đang mở
      setShowFab(viewportHeight > windowHeight * 0.8);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Kiểm tra ban đầu

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isMobile) return null;

  const routes = [
    {
      href: "/",
      label: "Home",
      icon: <Home className="h-5 w-5" />,
      active: location.pathname === "/",
    },
    {
      href: "/questions",
      label: "Questions",
      icon: <BookOpen className="h-5 w-5" />,
      active: location.pathname === "/questions",
    },
    {
      href: "/review",
      label: "Review",
      icon: <Calendar className="h-5 w-5" />,
      active: location.pathname === "/review",
    },
    {
      href: "/analytics",
      label: "Stats",
      icon: <BarChart2 className="h-5 w-5" />,
      active: location.pathname === "/analytics",
    },
    {
      href: "/settings",
      label: "Settings",
      icon: <Settings className="h-5 w-5" />,
      active: location.pathname === "/settings",
    },
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-background md:hidden">
        {routes.map((route) => (
          <Link
            key={route.href}
            to={route.href}
            className={cn(
              "flex h-full w-full flex-col items-center justify-center px-3 text-muted-foreground transition-colors",
              route.active && "text-primary"
            )}
          >
            {route.icon}
            <span className="mt-1 text-xs">{route.label}</span>
          </Link>
        ))}
      </nav>

      {showFab && (
        <QuickAddQuestion>
          <Button
            size="icon"
            className="fixed bottom-20 right-4 z-50 h-14 w-14 rounded-full shadow-lg md:hidden"
          >
            <Plus className="h-6 w-6" />
            <span className="sr-only">Add question</span>
          </Button>
        </QuickAddQuestion>
      )}
    </>
  );
}
