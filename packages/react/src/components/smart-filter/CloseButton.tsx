import React, { CSSProperties } from "react";
import { useIcons } from "../../context/IconsContext";

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
  border: "1px solid #012b11",
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
  const { CloseIcon } = useIcons();

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
