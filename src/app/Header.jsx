import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart2,
  BookOpen,
  Calendar,
  ChevronDown,
  Home,
  LogOut,
  Menu,
  Moon,
  Settings,
  Sun,
  User,
  X,
  UserPlus,
  LogIn,
} from "lucide-react";
import { cn } from "../lib/utils";
import { useOnClickOutside } from "../hooks/use-click-outside";
import LoginModal from "@/components/login-modal";
import SignUpModal from "@/components/signup-modal";
import { useLogoutMutation } from "@/redux/api/authApi";
import { logout } from "@/redux/feature/authSlice";

const routes = [
  {
    path: "/",
    label: "Dashboard",
    icon: <Home className="w-5 h-5" />,
  },
  {
    path: "/analytics",
    label: "Analytics",
    icon: <BarChart2 className="w-5 h-5" />,
  },
  {
    path: "/questions",
    label: "Questions",
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    path: "/review",
    label: "Review",
    icon: <Calendar className="w-5 h-5" />,
  },
  {
    path: "/settings",
    label: "Settings",
    icon: <Settings className="w-5 h-5" />,
  },
];

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
];

const HeaderWithDropdown = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(languages[0]);
  const location = useLocation();

  const [logoutApiCall] = useLogoutMutation();
  const dispatch = useDispatch();

  // Modal states
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  // Form states
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const userDropdownRef = useRef(null);
  const langDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const loginModalRef = useRef(null);
  const signUpModalRef = useRef(null);

  // Lấy thông tin user từ Redux store
  const { userInfo } = useSelector((state) => state.auth);

  // Kiểm tra trạng thái đăng nhập từ Redux
  const isAuthenticated = Boolean(
    userInfo?._id ||
      userInfo?.userInfo?._id ||
      userInfo?.email ||
      userInfo?.userInfo?.email
  );

  // Close dropdowns when clicking outside
  useOnClickOutside(userDropdownRef, () => setIsUserDropdownOpen(false), [
    menuButtonRef,
  ]);
  useOnClickOutside(langDropdownRef, () => setIsLangDropdownOpen(false), [
    menuButtonRef,
  ]);

  // Close modals when clicking outside
  useOnClickOutside(loginModalRef, () => setIsLoginModalOpen(false), []);
  useOnClickOutside(signUpModalRef, () => setIsSignUpModalOpen(false), []);

  // Check if mobile on mount and when window resizes
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIsMobile();

    // Add event listener with debounce
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkIsMobile, 100);
    };

    window.addEventListener("resize", handleResize);

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(savedDarkMode);

    if (savedDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Toggle dark mode with smooth transition
  const toggleDarkMode = useCallback(() => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);

    // Add transition class for smooth theme change
    document.documentElement.classList.add("theme-transition");

    // Apply the theme change
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Save to localStorage
    localStorage.setItem("darkMode", String(newDarkMode));

    // Remove transition class after animation completes
    setTimeout(() => {
      document.documentElement.classList.remove("theme-transition");
    }, 300);
  }, [isDarkMode]);

  const selectLanguage = useCallback((language) => {
    setCurrentLanguage(language);
    setIsLangDropdownOpen(false);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
    // Close dropdowns when opening mobile menu
    if (!isMenuOpen) {
      setIsUserDropdownOpen(false);
      setIsLangDropdownOpen(false);
    }
  }, [isMenuOpen]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      setIsUserDropdownOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Lấy tên hiển thị của user
  const getUserDisplayName = () => {
    if (userInfo?.username) return userInfo.username;
    if (userInfo?.userInfo?.username) return userInfo.userInfo.username;
    if (userInfo?.name) return userInfo.name;
    if (userInfo?.userInfo?.name) return userInfo.userInfo.name;
    return "User";
  };

  // Lấy email của user
  const getUserEmail = () => {
    if (userInfo?.email) return userInfo.email;
    if (userInfo?.userInfo?.email) return userInfo.userInfo.email;
    return "";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm px-4">
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 mr-6 transition-transform hover:scale-105 focus:scale-105"
          aria-label="RecallMaster Home"
        >
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            RecallMaster
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {routes.map((route) => (
            <Link
              key={route.path}
              to={route.path}
              className={cn(
                "flex items-center gap-1.5 transition-all duration-200 hover:text-primary relative py-1",
                location.pathname === route.path
                  ? "text-primary font-medium"
                  : "text-foreground/70 hover:text-foreground",
                "group"
              )}
              aria-current={
                location.pathname === route.path ? "page" : undefined
              }
            >
              {route.icon}
              {route.label}
              {location.pathname === route.path && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />
              )}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary rounded-full transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-1 sm:gap-2 ml-auto">
          {/* Language Switcher */}
          <div className="relative" ref={langDropdownRef}>
            <button
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-2 sm:px-3 py-2"
              onClick={() => {
                setIsLangDropdownOpen(!isLangDropdownOpen);
                setIsUserDropdownOpen(false);
              }}
              aria-expanded={isLangDropdownOpen}
              aria-haspopup="true"
              aria-label="Select language"
            >
              <span className="mr-1 text-base">{currentLanguage.flag}</span>
              <span className="hidden sm:inline-block">
                {currentLanguage.name}
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 ml-1 opacity-70 transition-transform duration-200",
                  isLangDropdownOpen && "transform rotate-180"
                )}
              />
            </button>

            {isLangDropdownOpen && (
              <div
                className="absolute right-0 mt-2 rounded-md shadow-lg bg-amber-100 border animate-in fade-in-50 duration-200 "
                role="menu"
                aria-orientation="vertical"
              >
                <div className="py-1 rounded-md bg-popover text-popover-foreground">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      className={cn(
                        "flex w-full items-center px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors duration-150",
                        currentLanguage.code === language.code &&
                          "bg-accent/50 font-medium"
                      )}
                      onClick={() => selectLanguage(language)}
                      role="menuitem"
                    >
                      <span className="mr-2 text-base">{language.flag}</span>
                      {language.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9 relative overflow-hidden"
            aria-label={
              isDarkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            <Sun
              className={cn(
                "h-4 w-4 transition-all duration-500 rotate-0 scale-100",
                isDarkMode ? "-rotate-90 scale-0" : "rotate-0 scale-100"
              )}
            />
            <Moon
              className={cn(
                "absolute h-4 w-4 transition-all duration-500",
                isDarkMode ? "rotate-0 scale-100" : "rotate-90 scale-0"
              )}
            />
          </button>

          {/* Authentication Buttons or User Profile */}
          {isAuthenticated ? (
            <div className="relative" ref={userDropdownRef}>
              <button
                className="inline-flex items-center justify-center rounded-full text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9"
                onClick={() => {
                  setIsUserDropdownOpen(!isUserDropdownOpen);
                  setIsLangDropdownOpen(false);
                }}
                aria-expanded={isUserDropdownOpen}
                aria-haspopup="true"
                aria-label="User menu"
              >
                <User className="h-4 w-4" />
              </button>

              {isUserDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-popover border animate-in fade-in-50 duration-200"
                  role="menu"
                  aria-orientation="vertical"
                >
                  <div className="py-1 rounded-md bg-popover text-popover-foreground">
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm font-medium">
                        {getUserDisplayName()}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {getUserEmail()}
                      </p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors duration-150"
                      role="menuitem"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors duration-150"
                      role="menuitem"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                    <div className="border-t my-1"></div>
                    <button
                      className="flex w-full items-center px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors duration-150"
                      role="menuitem"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="hidden md:inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </button>
              <button
                onClick={() => setIsSignUpModalOpen(true)}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline-block">Sign Up</span>
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            ref={menuButtonRef}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9 md:hidden"
            onClick={toggleMobileMenu}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            <Menu
              className={cn(
                "h-5 w-5 transition-opacity duration-200",
                isMenuOpen && "opacity-0"
              )}
            />
            <X
              className={cn(
                "h-5 w-5 absolute transition-opacity duration-200",
                isMenuOpen ? "opacity-100" : "opacity-0"
              )}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        id="mobile-menu"
        className={cn(
          " inset-0 top-16 z-40 transform transition-all duration-300 ease-in-out md:hidden bg-background/95 backdrop-blur-sm",
          isMenuOpen
            ? "opacity-100 scale-100 translate-x-0"
            : "opacity-0 scale-95 hidden"
        )}
        aria-hidden={!isMenuOpen}
      >
        <nav className="container grid gap-2 p-4 overflow-y-auto max-h-[calc(100vh-4rem)]">
          {!isAuthenticated && (
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={() => {
                  setIsLoginModalOpen(true);
                  setIsMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 rounded-md border px-3 py-3 text-sm transition-colors duration-200 hover:bg-accent/50"
              >
                <LogIn className="h-4 w-4" />
                Login
              </button>
              <button
                onClick={() => {
                  setIsSignUpModalOpen(true);
                  setIsMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground px-3 py-3 text-sm transition-colors duration-200 hover:bg-primary/90"
              >
                <UserPlus className="h-4 w-4" />
                Sign Up
              </button>
            </div>
          )}

          {routes.map((route) => (
            <Link
              key={route.path}
              to={route.path}
              className={cn(
                "flex items-center gap-3 rounded-md px-4 py-3 text-base transition-all duration-200",
                location.pathname === route.path
                  ? "bg-accent font-medium text-accent-foreground"
                  : "hover:bg-accent/50 hover:text-accent-foreground",
                isMenuOpen
                  ? "animate-in slide-in-from-right-5 duration-300"
                  : ""
              )}
              style={{
                animationDelay: `${routes.indexOf(route) * 50}ms`,
                animationFillMode: "both",
              }}
              aria-current={
                location.pathname === route.path ? "page" : undefined
              }
            >
              {route.icon}
              {route.label}
            </Link>
          ))}

          <div className="mt-6 border-t pt-6 space-y-4">
            <div className="flex items-center justify-between px-4 py-2 rounded-md hover:bg-accent/50 transition-colors duration-200">
              <span className="text-sm font-medium flex items-center gap-3">
                {isDarkMode ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
                {isDarkMode ? "Dark Mode" : "Light Mode"}
              </span>
              <button
                onClick={toggleDarkMode}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-pressed={isDarkMode}
                aria-label={
                  isDarkMode ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                <span
                  className={cn(
                    "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-lg ring-0 transition-transform duration-200",
                    isDarkMode ? "translate-x-5" : "translate-x-0"
                  )}
                />
              </button>
            </div>

            <div className="px-4 py-2">
              <p className="text-sm font-medium mb-3">Select Language</p>
              <div className="grid grid-cols-2 gap-2">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors duration-200 hover:bg-accent/50",
                      currentLanguage.code === language.code &&
                        "bg-accent font-medium text-accent-foreground"
                    )}
                    onClick={() => selectLanguage(language)}
                  >
                    <span className="text-base">{language.flag}</span>
                    {language.name}
                  </button>
                ))}
              </div>
            </div>

            {isAuthenticated && (
              <div className="px-4 py-2 mt-4">
                <div className="flex items-center gap-3 mb-1">
                  <User className="h-5 w-5" />
                  <div>
                    <p className="text-sm font-medium">
                      {getUserDisplayName()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {getUserEmail()}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <Link
                    to="/profile"
                    className="flex justify-center items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors duration-200 hover:bg-accent/50"
                  >
                    Profile
                  </Link>
                  <button
                    className="flex justify-center items-center gap-2 rounded-md border border-destructive/50 px-3 py-2 text-sm text-destructive transition-colors duration-200 hover:bg-destructive/10"
                    onClick={handleLogout}
                  >
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Conditionally render modals only when NOT authenticated */}
      {!isAuthenticated && (
        <>
          {/* Login Modal */}
          {isLoginModalOpen && (
            <LoginModal
              loginModalRef={loginModalRef}
              setIsLoginModalOpen={setIsLoginModalOpen}
              setIsSignUpModalOpen={setIsSignUpModalOpen}
            />
          )}

          {/* Sign Up Modal */}
          {isSignUpModalOpen && (
            <SignUpModal
              isOpen={isSignUpModalOpen}
              onClose={() => setIsSignUpModalOpen(false)}
              onSwitchToLogin={() => {
                setIsSignUpModalOpen(false);
                setIsLoginModalOpen(true);
              }}
            />
          )}
        </>
      )}
    </header>
  );
};

export default HeaderWithDropdown;
