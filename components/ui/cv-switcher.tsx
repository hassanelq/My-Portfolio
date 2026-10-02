"use client";
import { useState } from "react";
import { ArrowDownToLine } from "lucide-react";
import { site } from "@/content/site";
export function CVSwitcher() {
  const [language, setLanguage] = useState<"en" | "fr">("en");
  return (
    <div className="cv-switcher">
      <div className="cv-languages" role="group" aria-label="CV language">
        {(["en", "fr"] as const).map((lang) => (
          <button
            key={lang}
            type="button"
            aria-pressed={lang === language}
            onClick={() => setLanguage(lang)}
          >
            {lang.toUpperCase()}
          </button>
        ))}
      </div>
      <a
        href={site.cv[language]}
        download
        className="cv-download"
        aria-label={`Download CV in ${language === "en" ? "English" : "French"}`}
      >
        Download CV <ArrowDownToLine size={15} aria-hidden="true" />
      </a>
    </div>
  );
}
