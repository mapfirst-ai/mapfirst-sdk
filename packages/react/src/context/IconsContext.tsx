import React, { CSSProperties } from "react";
import { CloseIcon, EditIcon, NextIcon, SearchIcon } from "../components/Icons";

export interface IconProps {
  className?: string;
  style?: CSSProperties;
}

export interface IconsContextValue {
  CloseIcon: React.FC<IconProps>;
  EditIcon: React.FC<IconProps>;
  NextIcon: React.FC<IconProps>;
  SearchIcon: React.FC<IconProps>;
}

const defaultIcons: IconsContextValue = {
  CloseIcon,
  EditIcon,
  NextIcon,
  SearchIcon,
};

const IconsContext = React.createContext<IconsContextValue>(defaultIcons);

export const IconsProvider: React.FC<{
  value?: Partial<IconsContextValue>;
  children: React.ReactNode;
}> = ({ value, children }) => (
  <IconsContext.Provider value={value ? { ...defaultIcons, ...value } : defaultIcons}>
    {children}
  </IconsContext.Provider>
);

export const useIcons = () => React.useContext(IconsContext);
