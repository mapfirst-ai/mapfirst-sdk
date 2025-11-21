import React, { CSSProperties, ReactNode } from "react";
import { CloseIcon } from "../Icons";

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

const removeButtonStyles: CSSProperties = {
  position: "absolute",
  top: "-8px",
  right: "-8px",
  padding: "2px",
  borderRadius: "50%",
  backgroundColor: "white",
  border: "1px solid #03852e",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "background-color 0.2s",
};

const iconStyles: CSSProperties = {
  width: "17px",
  height: "17px",
};

export const Chip: React.FC<ChipProps> = ({ label, icon, remove, style }) => {
  const [isHovering, setIsHovering] = React.useState(false);

  return (
    <div style={{ ...chipStyles, ...style }}>
      {icon && (
        <span style={{ display: "flex", alignItems: "center" }}>{icon}</span>
      )}
      <span style={{ whiteSpace: "nowrap" }}>{label}</span>
      <button
        style={{
          ...removeButtonStyles,
          backgroundColor: isHovering ? "#e5e5e5" : "white",
        }}
        onClick={remove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        aria-label="Remove filter"
      >
        <CloseIcon style={iconStyles} />
      </button>
    </div>
  );
};
