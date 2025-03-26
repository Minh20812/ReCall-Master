import { useState, useEffect } from "react";
import { Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

const languages = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇺🇸",
    direction: "ltr",
    dateFormat: "MM/DD/YYYY",
    numberFormat: "1,234.56",
  },
  {
    code: "vi",
    name: "Vietnamese",
    nativeName: "Tiếng Việt",
    flag: "🇻🇳",
    direction: "ltr",
    dateFormat: "DD/MM/YYYY",
    numberFormat: "1.234,56",
  },
  {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    flag: "🇪🇸",
    direction: "ltr",
    dateFormat: "DD/MM/YYYY",
    numberFormat: "1.234,56",
  },
  {
    code: "fr",
    name: "French",
    nativeName: "Français",
    flag: "🇫🇷",
    direction: "ltr",
    dateFormat: "DD/MM/YYYY",
    numberFormat: "1 234,56",
  },
  {
    code: "zh",
    name: "Chinese",
    nativeName: "中文",
    flag: "🇨🇳",
    direction: "ltr",
    dateFormat: "YYYY/MM/DD",
    numberFormat: "1,234.56",
  },
  {
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
    flag: "🇸🇦",
    direction: "rtl",
    dateFormat: "DD/MM/YYYY",
    numberFormat: "1,234.56",
  },
];

export function LanguageSettings() {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [useSystemLanguage, setUseSystemLanguage] = useState(false);
  const [useNativeFormats, setUseNativeFormats] = useState(true);

  // Simulate loading the user's language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || "en";
    setSelectedLanguage(savedLanguage);

    const savedUseSystem = localStorage.getItem("useSystemLanguage") === "true";
    setUseSystemLanguage(savedUseSystem);

    const savedUseNativeFormats =
      localStorage.getItem("useNativeFormats") !== "false";
    setUseNativeFormats(savedUseNativeFormats);
  }, []);

  const handleLanguageChange = (value) => {
    setSelectedLanguage(value);
  };

  const handleSystemLanguageToggle = (checked) => {
    setUseSystemLanguage(checked);
    if (checked) {
      // In a real implementation, this would detect the system language
      const systemLanguage = "en"; // This would be detected from the browser
      setSelectedLanguage(systemLanguage);
    }
  };

  const handleNativeFormatsToggle = (checked) => {
    setUseNativeFormats(checked);
  };

  const saveSettings = () => {
    localStorage.setItem("language", selectedLanguage);
    localStorage.setItem("useSystemLanguage", useSystemLanguage.toString());
    localStorage.setItem("useNativeFormats", useNativeFormats.toString());

    // Trigger language change event
    const selectedLang = languages.find(
      (lang) => lang.code === selectedLanguage
    );
    if (selectedLang) {
      const event = new CustomEvent("languageChanged", {
        detail: {
          language: selectedLang.name,
          nativeName: selectedLang.nativeName,
        },
      });
      document.dispatchEvent(event);
    }

    // Hiển thị thông báo với `sonner`
    toast.success("Your language preferences have been updated.");
  };

  const selectedLangDetails =
    languages.find((lang) => lang.code === selectedLanguage) || languages[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Language Settings</CardTitle>
        <CardDescription>
          Choose your preferred language and regional format settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="system-language">Use system language</Label>
            <p className="text-sm text-muted-foreground">
              Automatically use your device's language settings
            </p>
          </div>
          <Switch
            id="system-language"
            checked={useSystemLanguage}
            onCheckedChange={handleSystemLanguageToggle}
          />
        </div>

        <div className="space-y-3">
          <Label>Interface language</Label>
          <RadioGroup
            value={selectedLanguage}
            onValueChange={handleLanguageChange}
            className="grid gap-3 pt-2"
            disabled={useSystemLanguage}
          >
            {languages.map((language) => (
              <div
                key={language.code}
                className={`flex items-center justify-between space-x-2 rounded-md border p-4 ${
                  useSystemLanguage ? "opacity-50" : ""
                } ${
                  language.code === selectedLanguage && !useSystemLanguage
                    ? "border-primary"
                    : "border-input"
                }`}
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem
                    value={language.code}
                    id={`language-${language.code}`}
                    disabled={useSystemLanguage}
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{language.flag}</span>
                    <Label
                      htmlFor={`language-${language.code}`}
                      className="font-medium cursor-pointer"
                    >
                      {language.name}
                    </Label>
                    <span className="text-sm text-muted-foreground">
                      ({language.nativeName})
                    </span>
                  </div>
                </div>
                {language.code === selectedLanguage && !useSystemLanguage && (
                  <Check className="h-5 w-5 text-primary" />
                )}
              </div>
            ))}
          </RadioGroup>
        </div>

        {selectedLangDetails.direction === "rtl" && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Right-to-left language selected</AlertTitle>
            <AlertDescription>
              This language is written from right to left. The interface layout
              will adjust accordingly.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="native-formats">
                Use native number and date formats
              </Label>
              <p className="text-sm text-muted-foreground">
                Display dates and numbers according to the selected language's
                conventions
              </p>
            </div>
            <Switch
              id="native-formats"
              checked={useNativeFormats}
              onCheckedChange={handleNativeFormatsToggle}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">
                Date format preview
              </Label>
              <div className="p-3 rounded-md bg-muted">
                {useNativeFormats
                  ? selectedLangDetails.dateFormat
                  : "MM/DD/YYYY"}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">
                Number format preview
              </Label>
              <div className="p-3 rounded-md bg-muted">
                {useNativeFormats
                  ? selectedLangDetails.numberFormat
                  : "1,234.56"}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button onClick={saveSettings}>Save Changes</Button>
      </CardFooter>
    </Card>
  );
}
