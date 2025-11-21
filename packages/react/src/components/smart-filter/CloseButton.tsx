import React, { CSSProperties } from "react";
import { CloseIcon } from "../Icons";

export interface CloseButtonProps {
  onClick: () => void;
  style?: CSSProperties;
}

const closeButtonStyles: CSSProperties = {
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

export const CloseButton: React.FC<CloseButtonProps> = ({ onClick, style }) => {
  const [isHovering, setIsHovering] = React.useState(false);

  return (
    <button
      style={{
        ...closeButtonStyles,
        backgroundColor: isHovering ? "#e5e5e5" : "white",
        ...style,
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      aria-label="Remove filter"
    >
      <CloseIcon style={iconStyles} />
    </button>
  );
};
