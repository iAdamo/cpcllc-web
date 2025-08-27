import React, { useState } from "react";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { ChevronDownIcon } from "@/components/ui/icon";
import { useTranslation } from "../context/TranslationContext";

const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useTranslation();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLanguageChange = (lang: "en" | "es") => {
    setLanguage(lang);
    setShowDropdown(false);
  };

  return (
    <div className="relative ml-4">
      <Button
        variant="link"
        size="xs"
        onPress={() => setShowDropdown(!showDropdown)}
        className="flex items-center"
      >
        <ButtonText className="text-lg">
          {language === "en" ? t("english") : t("spanish")}
        </ButtonText>
        <ButtonIcon as={ChevronDownIcon} className="ml-1" />
      </Button>

      {showDropdown && (
        <div className="absolute top-full left-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 z-50">
          <Button
            variant="link"
            size="xs"
            onPress={() => handleLanguageChange("en")}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            <ButtonText className="text-text-primary">English</ButtonText>
          </Button>
          <Button
            variant="link"
            size="xs"
            onPress={() => handleLanguageChange("es")}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            <ButtonText className="text-text-primary">Español</ButtonText>
          </Button>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
