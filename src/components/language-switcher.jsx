"use client";

import { useState, useEffect } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const languages = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇺🇸",
    direction: "ltr",
  },
  {
    code: "vi",
    name: "Vietnamese",
    nativeName: "Tiếng Việt",
    flag: "🇻🇳",
    direction: "ltr",
  },
  {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    flag: "🇪🇸",
    direction: "ltr",
  },
  {
    code: "fr",
    name: "French",
    nativeName: "Français",
    flag: "🇫🇷",
    direction: "ltr",
  },
  {
    code: "zh",
    name: "Chinese",
    nativeName: "中文",
    flag: "🇨🇳",
    direction: "ltr",
  },
  {
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
    flag: "🇸🇦",
    direction: "rtl",
  },
];

export function LanguageSwitcher({
  variant = "full",
  showFlags = true,
  align = "end",
  className,
}) {
  const [currentLanguage, setCurrentLanguage] = useState(languages[0]);
  const router = useRouter();

  // Simulate loading the user's language preference from storage/cookies
  useEffect(() => {
    // This would normally come from localStorage, cookies, or user settings
    const savedLanguageCode = localStorage.getItem("language") || "en";
    const savedLanguage =
      languages.find((lang) => lang.code === savedLanguageCode) || languages[0];
    setCurrentLanguage(savedLanguage);

    // In a real implementation, you would also set the document direction for RTL support
    // document.documentElement.dir = savedLanguage.direction
  }, []);

  const handleLanguageChange = (language) => {
    setCurrentLanguage(language);
    localStorage.setItem("language", language.code);

    // In a real implementation:
    // 1. Update the app's locale context/state
    // 2. Set document direction for RTL languages
    // document.documentElement.dir = language.direction

    // Show success toast (implemented in the main-nav component)
    const event = new CustomEvent("languageChanged", {
      detail: { language: language.name, nativeName: language.nativeName },
    });
    document.dispatchEvent(event);

    // Refresh the page or update translations in-place
    // In a real implementation, this would use your i18n library's methods
    // router.refresh()
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={variant === "icon" ? "icon" : "default"}
          className={cn(
            "gap-1 focus-visible:ring-1 focus-visible:ring-ring",
            variant === "minimal" && "h-8 px-2",
            className
          )}
        >
          {variant === "icon" ? (
            <Globe className="h-5 w-5" />
          ) : (
            <>
              {showFlags && (
                <span className="mr-1">{currentLanguage.flag}</span>
              )}
              {variant === "full" ? (
                <span className="hidden sm:inline-block">
                  {currentLanguage.nativeName}
                </span>
              ) : null}
              <ChevronDown className="h-4 w-4 opacity-70" />
            </>
          )}
          <span className="sr-only">Select language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-[180px]">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            className={cn(
              "flex items-center gap-2 cursor-pointer",
              language.code === currentLanguage.code && "bg-muted"
            )}
            onClick={() => handleLanguageChange(language)}
          >
            {showFlags && <span>{language.flag}</span>}
            <span className="flex-1">{language.nativeName}</span>
            {language.code === currentLanguage.code && (
              <Check className="h-4 w-4" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
