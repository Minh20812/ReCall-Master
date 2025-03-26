"use client";

import { useState, useEffect } from "react";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  {
    code: "de",
    name: "German",
    nativeName: "Deutsch",
    flag: "🇩🇪",
    direction: "ltr",
  },
  {
    code: "ja",
    name: "Japanese",
    nativeName: "日本語",
    flag: "🇯🇵",
    direction: "ltr",
  },
  {
    code: "ko",
    name: "Korean",
    nativeName: "한국어",
    flag: "🇰🇷",
    direction: "ltr",
  },
  {
    code: "pt",
    name: "Portuguese",
    nativeName: "Português",
    flag: "🇵🇹",
    direction: "ltr",
  },
  {
    code: "ru",
    name: "Russian",
    nativeName: "Русский",
    flag: "🇷🇺",
    direction: "ltr",
  },
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    flag: "🇮🇳",
    direction: "ltr",
  },
];

export function MobileLanguageSwitcher() {
  const [currentLanguage, setCurrentLanguage] = useState < string > "en";
  const [searchQuery, setSearchQuery] = useState < string > "";
  const [open, setOpen] = useState(false);

  // Simulate loading the user's language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || "en";
    setCurrentLanguage(savedLanguage);
  }, []);

  const handleLanguageChange = (value) => {
    setCurrentLanguage(value);
    localStorage.setItem("language", value);

    // Trigger language change event
    const selectedLang = languages.find((lang) => lang.code === value);
    if (selectedLang) {
      const event = new CustomEvent("languageChanged", {
        detail: {
          language: selectedLang.name,
          nativeName: selectedLang.nativeName,
        },
      });
      document.dispatchEvent(event);
    }

    setOpen(false);
  };

  const filteredLanguages = languages.filter(
    (lang) =>
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentLang = languages.find((lang) => lang.code === currentLanguage);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-10 w-10 fixed bottom-6 right-6 shadow-lg md:hidden"
        >
          <Globe className="h-5 w-5" />
          <span className="sr-only">Change language</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh]">
        <SheetHeader className="pb-4">
          <SheetTitle>Select Language</SheetTitle>
          <SheetDescription>
            Choose your preferred interface language
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <Input
            placeholder="Search languages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4"
          />
          <ScrollArea className="h-[calc(80vh-180px)]">
            <RadioGroup
              value={currentLanguage}
              onValueChange={handleLanguageChange}
              className="grid gap-2"
            >
              {filteredLanguages.map((language) => (
                <div
                  key={language.code}
                  className={`flex items-center space-x-2 rounded-md border p-3 ${
                    language.code === currentLanguage
                      ? "border-primary"
                      : "border-input"
                  }`}
                >
                  <RadioGroupItem
                    value={language.code}
                    id={`mobile-language-${language.code}`}
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{language.flag}</span>
                    <Label
                      htmlFor={`mobile-language-${language.code}`}
                      className="font-medium cursor-pointer"
                    >
                      {language.name}
                    </Label>
                    <span className="text-sm text-muted-foreground">
                      ({language.nativeName})
                    </span>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </ScrollArea>
        </div>
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex items-center gap-2">
            <span className="text-lg">{currentLang?.flag}</span>
            <span className="font-medium">Current: {currentLang?.name}</span>
          </div>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
