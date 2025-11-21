import React, { CSSProperties, ReactNode } from "react";
import { CloseButton } from "./CloseButton";

export interface ChipProps {
  label: string | ReactNode;
  icon?: ReactNode;
  remove: () => void;
  style?: CSSProperties;
}

const chipStyles: CSSProperties = {
  position: "relative",
  backgroundColor: "white",
  color: "black",
  fontSize: "14px",
  borderRadius: "9999px",
  padding: "0 16px",
  paddingRight: "20px",
  border: "1px solid #03852e",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  flexShrink: 0,
  height: "34px",
};

export const Chip: React.FC<ChipProps> = ({ label, icon, remove, style }) => {
  return (
    <div style={{ ...chipStyles, ...style }}>
      {icon && (
        <span style={{ display: "flex", alignItems: "center" }}>{icon}</span>
      )}
      <span style={{ whiteSpace: "nowrap" }}>{label}</span>
      <CloseButton onClick={remove} />
    </div>
  );
};
