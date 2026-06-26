import { Globe2 } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const LanguageToggle = () => {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <button
      className="icon-button language-button"
      type="button"
      onClick={toggleLanguage}
      title={t("language")}
      aria-label={t("language")}
    >
      <Globe2 size={18} />
      <span>{language === "en" ? "AR" : "EN"}</span>
    </button>
  );
};

export default LanguageToggle;
