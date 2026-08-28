import { useTranslation } from "react-i18next";

const languages = [
  { code: "uk", label: "UA" },
  { code: "en", label: "EN" },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="flex items-center gap-1 ml-auto">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => i18n.changeLanguage(lang.code)}
          className={`px-2 py-1 text-xs font-medium rounded ${
            i18n.language === lang.code
              ? "bg-indigo-600 text-white"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800"
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
