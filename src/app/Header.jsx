import { useState, useEffect, useRef, useCallback } from "react";
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
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
} from "lucide-react";
import { cn } from "../lib/utils";
import { useOnClickOutside } from "../hooks/use-click-outside";

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

  // Authentication state
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
  });

  // Modal states
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  // Form states
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signUpForm, setSignUpForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [rememberMe, setRememberMe] = useState(false);

  const userDropdownRef = useRef(null);
  const langDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const loginModalRef = useRef(null);
  const signUpModalRef = useRef(null);

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

    // Check for saved auth state
    const savedAuth = localStorage.getItem("authState");
    if (savedAuth) {
      try {
        const parsedAuth = JSON.parse(savedAuth);
        setAuthState(parsedAuth);
      } catch (e) {
        console.error("Failed to parse saved auth state");
      }
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

  // Handle login form submission
  const handleLogin = useCallback(
    (e) => {
      e.preventDefault();

      // In a real app, you would validate and send to an API
      // This is just a demo implementation
      setAuthState({
        isAuthenticated: true,
        user: {
          name: "John Doe",
          email: loginForm.email,
        },
      });

      // Save to localStorage if remember me is checked
      if (rememberMe) {
        localStorage.setItem(
          "authState",
          JSON.stringify({
            isAuthenticated: true,
            user: {
              name: "John Doe",
              email: loginForm.email,
            },
          })
        );
      }

      // Close the modal
      setIsLoginModalOpen(false);

      // Reset form
      setLoginForm({ email: "", password: "" });
    },
    [loginForm, rememberMe]
  );

  // Handle sign up form submission
  const handleSignUp = useCallback(
    (e) => {
      e.preventDefault();

      // In a real app, you would validate and send to an API
      // This is just a demo implementation
      if (signUpForm.password !== signUpForm.confirmPassword) {
        alert("Passwords don't match");
        return;
      }

      setAuthState({
        isAuthenticated: true,
        user: {
          name: signUpForm.name,
          email: signUpForm.email,
        },
      });

      // Save to localStorage
      localStorage.setItem(
        "authState",
        JSON.stringify({
          isAuthenticated: true,
          user: {
            name: signUpForm.name,
            email: signUpForm.email,
          },
        })
      );

      // Close the modal
      setIsSignUpModalOpen(false);

      // Reset form
      setSignUpForm({ name: "", email: "", password: "", confirmPassword: "" });
    },
    [signUpForm]
  );

  // Handle logout
  const handleLogout = useCallback(() => {
    setAuthState({
      isAuthenticated: false,
      user: null,
    });

    // Remove from localStorage
    localStorage.removeItem("authState");

    // Close dropdown
    setIsUserDropdownOpen(false);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm px-4">
      <div className="container flex h-16 items-center justify-between">
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
          {authState.isAuthenticated ? (
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
                  className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-popover border animate-in fade-in-50 zoom-in-95 slide-in-from-top-5 duration-200"
                  role="menu"
                  aria-orientation="vertical"
                >
                  <div className="py-1 rounded-md bg-popover text-popover-foreground">
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm font-medium">
                        {authState.user?.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {authState.user?.email}
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
          "fixed inset-0 top-16 z-40 transform transition-transform duration-300 ease-in-out md:hidden bg-background/95 backdrop-blur-sm",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
        aria-hidden={!isMenuOpen}
      >
        <nav className="container grid gap-2 p-4 overflow-y-auto max-h-[calc(100vh-4rem)]">
          {!authState.isAuthenticated && (
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

            {authState.isAuthenticated && (
              <div className="px-4 py-2 mt-4">
                <div className="flex items-center gap-3 mb-1">
                  <User className="h-5 w-5" />
                  <div>
                    <p className="text-sm font-medium">
                      {authState.user?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {authState.user?.email}
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

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            ref={loginModalRef}
            className="bg-background rounded-lg shadow-lg w-full max-w-md border animate-in fade-in-50 zoom-in-95 duration-300"
          >
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Login</h2>
              <button
                onClick={() => setIsLoginModalOpen(false)}
                className="rounded-full h-8 w-8 inline-flex items-center justify-center hover:bg-muted"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>
            </div>
            <form onSubmit={handleLogin} className="p-6 space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={loginForm.email}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={loginForm.password}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, password: e.target.value })
                    }
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm text-muted-foreground"
                  >
                    Remember me
                  </label>
                </div>
                <a
                  href="#"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
              >
                Login
              </button>
              <div className="text-center text-sm">
                <span className="text-muted-foreground">
                  Don't have an account?{" "}
                </span>
                <button
                  type="button"
                  className="font-medium text-primary hover:underline"
                  onClick={() => {
                    setIsLoginModalOpen(false);
                    setIsSignUpModalOpen(true);
                  }}
                >
                  Sign up
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sign Up Modal */}
      {isSignUpModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            ref={signUpModalRef}
            className="bg-background rounded-lg shadow-lg w-full max-w-md border animate-in fade-in-50 zoom-in-95 duration-300"
          >
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Sign Up</h2>
              <button
                onClick={() => setIsSignUpModalOpen(false)}
                className="rounded-full h-8 w-8 inline-flex items-center justify-center hover:bg-muted"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>
            </div>
            <form onSubmit={handleSignUp} className="p-6 space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={signUpForm.name}
                    onChange={(e) =>
                      setSignUpForm({ ...signUpForm, name: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="signup-email" className="text-sm font-medium">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={signUpForm.email}
                    onChange={(e) =>
                      setSignUpForm({ ...signUpForm, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="signup-password"
                  className="text-sm font-medium"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={signUpForm.password}
                    onChange={(e) =>
                      setSignUpForm({ ...signUpForm, password: e.target.value })
                    }
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="confirm-password"
                  className="text-sm font-medium"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={signUpForm.confirmPassword}
                    onChange={(e) =>
                      setSignUpForm({
                        ...signUpForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  required
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-muted-foreground"
                >
                  I agree to the{" "}
                  <a href="#" className="text-primary hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
              >
                Create Account
              </button>
              <div className="text-center text-sm">
                <span className="text-muted-foreground">
                  Already have an account?{" "}
                </span>
                <button
                  type="button"
                  className="font-medium text-primary hover:underline"
                  onClick={() => {
                    setIsSignUpModalOpen(false);
                    setIsLoginModalOpen(true);
                  }}
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default HeaderWithDropdown;
