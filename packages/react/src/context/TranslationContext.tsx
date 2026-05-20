import React from "react";

const TranslationContext = React.createContext<
  Record<string, string> | undefined
>(undefined);

export const TranslationProvider: React.FC<{
  value: Record<string, string> | undefined;
  children: React.ReactNode;
}> = ({ value, children }) => (
  <TranslationContext.Provider value={value}>
    {children}
  </TranslationContext.Provider>
);

export const useCustomTranslationsContext = () =>
  React.useContext(TranslationContext);
