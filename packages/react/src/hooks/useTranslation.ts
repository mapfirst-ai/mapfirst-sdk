import { useCallback, useState } from "react";

export type Locale = "en" | "es" | "de" | "fr" | "it" | "pt";

type TranslationFunction = (
  key: string,
  params?: Record<string, any>
) => string;
type FormatCurrencyFunction = (value: number, currency?: string) => string;

const defaultTranslations: Record<string, string> = {
  "smartFilter.placeholder":
    "Search for hotels, restaurants, or attractions...",
  "smartFilter.typingPrompt": "Type to search...",
  "smartFilter.nav.previous": "Previous filters",
  "smartFilter.nav.next": "Next filters",
  "smartFilter.toast.locationRequired": "Please select a location first",
  "smartFilter.clearAll": "Clear all",
  "smartFilter.minRating.suffix": "+",
  "smartFilter.minRating.label": "{{value}}+",
  "smartFilter.minRating.remove": "Remove rating filter",
  "smartFilter.minRating.setTo": "Set rating to {{rating}}",
  "smartFilter.priceRange.label": "Price Range",
  "smartFilter.priceRange.remove": "Remove price filter",
  "smartFilter.priceRange.edit": "Edit price",
  "smartFilter.transformedQuery.remove": "Remove search query",
  "smartFilter.transformedQuery.edit": "Edit search query",
  "smartFilter.restaurantPriceLevel.label": "Price Level",
  "smartFilter.restaurantPriceLevel.remove": "Remove price level filter",
  "smartFilter.restaurantPriceLevel.none": "Any",
  "smartFilter.restaurantPriceLevel.options.cheapEats": "Cheap Eats",
  "smartFilter.restaurantPriceLevel.options.midRange": "Mid Range",
  "smartFilter.restaurantPriceLevel.options.fineDining": "Fine Dining",
};

const formatCurrencyDefault: FormatCurrencyFunction = (
  value,
  currency = "USD"
) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Simple translation hook with default English translations.
 * Can be extended with custom translations and locales.
 */
export const useTranslation = (
  customTranslations?: Record<string, string>,
  customFormatCurrency?: FormatCurrencyFunction
) => {
  const [locale, setLocale] = useState<Locale>("en");

  const t: TranslationFunction = useCallback(
    (key: string, params?: Record<string, any>) => {
      const translations = { ...defaultTranslations, ...customTranslations };
      let translation = translations[key] || key;

      if (params) {
        Object.keys(params).forEach((paramKey) => {
          translation = translation.replace(
            new RegExp(`{{${paramKey}}}`, "g"),
            String(params[paramKey])
          );
        });
      }

      return translation;
    },
    [customTranslations]
  );

  const formatCurrency = useCallback(
    (value: number, currency?: string) => {
      if (customFormatCurrency) {
        return customFormatCurrency(value, currency);
      }
      return formatCurrencyDefault(value, currency);
    },
    [customFormatCurrency]
  );

  return {
    t,
    locale,
    setLocale,
    formatCurrency,
  };
};
