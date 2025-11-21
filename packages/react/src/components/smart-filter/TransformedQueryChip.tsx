import React, {
  ChangeEvent,
  FunctionComponent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
  CSSProperties,
} from "react";
import { EditIcon, SearchIcon } from "../Icons";
import { CloseButton } from "./CloseButton";
import { useTranslation } from "../../hooks/useTranslation";

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
  userSelect: "none",
  height: "34px",
};

const inputStyles: CSSProperties = {
  backgroundColor: "#ececec",
  borderRadius: "2px",
  padding: "2px 8px",
  outline: "none",
  fontSize: "16px",
  minWidth: "8ch",
  border: "none",
};

const editButtonStyles: CSSProperties = {
  padding: "4px",
  borderRadius: "50%",
  cursor: "pointer",
  transition: "background-color 0.2s",
  color: "#737373",
  border: "none",
  backgroundColor: "transparent",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export interface TransformedQueryChipProps {
  value: string;
  onChange: (nextValue: string) => void;
  onRemove: () => void;
}

export const TransformedQueryChip: FunctionComponent<
  TransformedQueryChipProps
> = ({ value, onChange, onRemove }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [draft, setDraft] = useState(value);
  const [isEditing, setIsEditing] = useState(false);
  const [editHover, setEditHover] = useState(false);
  const { t } = useTranslation();

  const removeLabel = t("smartFilter.transformedQuery.remove");
  const editLabel = t("smartFilter.transformedQuery.edit");

  useEffect(() => {
    setDraft(value);
    setIsEditing(false);
  }, [value]);

  const applyChanges = () => {
    const nextValue = draft.trim();
    if (!nextValue.length) {
      setDraft(value);
      return;
    }
    if (nextValue === value) {
      return;
    }
    onChange(nextValue);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDraft(event.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      (event.currentTarget as HTMLInputElement).blur();
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setDraft(value);
      (event.currentTarget as HTMLInputElement).blur();
      return;
    }
  };

  return (
    <div style={chipStyles}>
      <SearchIcon style={{ width: "16px", height: "16px", color: "#03852e" }} />
      {isEditing ? (
        <input
          ref={inputRef}
          value={draft}
          onChange={handleChange}
          onBlur={() => {
            applyChanges();
            setIsEditing(false);
          }}
          onKeyDown={handleKeyDown}
          aria-label={editLabel}
          style={inputStyles}
          autoFocus
        />
      ) : (
        <span style={{ fontSize: "16px" }}>{value}</span>
      )}
      {!isEditing && (
        <button
          type="button"
          style={{
            ...editButtonStyles,
            backgroundColor: editHover ? "#e5e5e5" : "transparent",
          }}
          aria-label={editLabel}
          title={editLabel}
          onClick={() => setIsEditing(true)}
          onMouseEnter={() => setEditHover(true)}
          onMouseLeave={() => setEditHover(false)}
        >
          <EditIcon />
        </button>
      )}
      <CloseButton onClick={onRemove} />
    </div>
  );
};
