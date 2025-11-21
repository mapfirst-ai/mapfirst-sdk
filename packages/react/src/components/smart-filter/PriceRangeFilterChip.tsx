import React, {
  ChangeEvent,
  FunctionComponent,
  KeyboardEvent,
  useEffect,
  useState,
  CSSProperties,
} from "react";
import { CloseIcon, EditIcon } from "../Icons";
import { useTranslation } from "../../hooks/useTranslation";
import type { PriceRangeValue } from "./types";

type Boundary = "min" | "max";

const chipStyles: CSSProperties = {
  position: "relative",
  backgroundColor: "white",
  color: "black",
  fontSize: "14px",
  borderRadius: "9999px",
  padding: "0 16px",
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
  transition: "background-color 0.2s",
};

const inputStyles: CSSProperties = {
  outline: "none",
  fontSize: "16px",
  backgroundColor: "transparent",
  borderRadius: "2px",
  padding: "2px 8px",
  width: "64px",
  textAlign: "center",
  border: "none",
};

const editButtonStyles: CSSProperties = {
  padding: "4px",
  borderRadius: "50%",
  cursor: "pointer",
  transition: "background-color 0.2s",
  border: "none",
  backgroundColor: "transparent",
  color: "#737373",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

interface PriceBoundaryChipProps {
  boundary: Boundary;
  label: string;
  value?: number;
  placeholder?: string;
  currency: string;
  isOptional?: boolean;
  showRemoveButton?: boolean;
  removeLabel?: string;
  editLabel?: string;
  showAddWhenEmpty?: boolean;
  onCommit: (value?: number) => void;
  onRemove: () => void;
}

const PriceBoundaryChip: FunctionComponent<PriceBoundaryChipProps> = ({
  boundary,
  label,
  value,
  placeholder,
  currency,
  isOptional = false,
  showRemoveButton = false,
  removeLabel,
  editLabel,
  showAddWhenEmpty = false,
  onCommit,
  onRemove,
}) => {
  const [draft, setDraft] = useState<string>(
    value !== undefined ? String(value) : ""
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editHover, setEditHover] = useState(false);
  const [removeHover, setRemoveHover] = useState(false);
  const hasValue = value !== undefined;

  useEffect(() => {
    setDraft(value !== undefined ? String(value) : "");
    setIsEditing(false);
  }, [value]);

  const resetDraft = () => {
    setDraft(value !== undefined ? String(value) : "");
  };

  const commitValue = () => {
    if (draft.trim() === "") {
      if (isOptional) {
        onCommit(undefined);
        setDraft("");
        return;
      }
      resetDraft();
      return;
    }

    const parsed = Number(draft);
    if (!Number.isFinite(parsed)) {
      resetDraft();
      return;
    }

    const normalized = Math.max(0, parsed);
    if (normalized === value) {
      resetDraft();
      return;
    }
    onCommit(normalized);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value.replace(/[^\d]/g, "");
    setDraft(next);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      (event.currentTarget as HTMLInputElement).blur();
      setIsEditing(false);
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      resetDraft();
      (event.currentTarget as HTMLInputElement).blur();
      setIsEditing(false);
      return;
    }

    const allowed =
      (event.key.length === 1 && /[0-9]/.test(event.key)) ||
      event.key === "Backspace" ||
      event.key === "Delete" ||
      event.key === "Tab" ||
      event.key === "ArrowLeft" ||
      event.key === "ArrowRight" ||
      event.key === "Home" ||
      event.key === "End";

    if (!allowed) {
      event.preventDefault();
    }
  };

  return (
    <div style={chipStyles}>
      <span
        style={{
          fontSize: "10px",
          textTransform: "uppercase",
          fontWeight: 600,
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </span>
      {isEditing ? (
        <input
          value={draft}
          onChange={handleChange}
          onBlur={() => {
            commitValue();
            setIsEditing(false);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          inputMode="numeric"
          pattern="[0-9]*"
          aria-label={label}
          style={inputStyles}
          autoFocus
        />
      ) : hasValue ? (
        <span style={{ fontSize: "16px" }}>
          {currency}
          {value}
        </span>
      ) : showAddWhenEmpty ? (
        <button
          type="button"
          style={{
            fontSize: "16px",
            color: "#737373",
            cursor: "pointer",
            border: "none",
            backgroundColor: "transparent",
            padding: 0,
          }}
          onClick={() => setIsEditing(true)}
          aria-label={editLabel}
        >
          +
        </button>
      ) : (
        <span style={{ fontSize: "16px", color: "#737373" }}>-</span>
      )}
      {(!showAddWhenEmpty || (showAddWhenEmpty && isEditing)) && (
        <span style={{ color: "#737373", fontSize: "12px" }}>{currency}</span>
      )}
      {!isEditing && (!showAddWhenEmpty || hasValue) && (
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
      {showRemoveButton && (
        <button
          style={{
            ...removeButtonStyles,
            backgroundColor: removeHover ? "#e5e5e5" : "white",
          }}
          onClick={onRemove}
          onMouseEnter={() => setRemoveHover(true)}
          onMouseLeave={() => setRemoveHover(false)}
          aria-label={removeLabel}
          title={removeLabel}
        >
          <CloseIcon style={{ width: "17px", height: "17px" }} />
        </button>
      )}
    </div>
  );
};

export const PriceRangeFilterChip: FunctionComponent<{
  priceRange: PriceRangeValue;
  currency: string;
  onChange: (range: PriceRangeValue) => void;
  onRemove: () => void;
}> = ({ priceRange, currency, onChange, onRemove }) => {
  const { t } = useTranslation();

  const minLabel = "Min";
  const maxChipLabel = "Max";
  const removeLabel = t("smartFilter.priceRange.remove");
  const editLabel = t("smartFilter.priceRange.edit");

  const handleBoundaryCommit = (boundary: Boundary, nextValue?: number) => {
    const nextRange: PriceRangeValue = {
      min: priceRange.min,
      max: priceRange.max,
    };

    if (boundary === "min") {
      nextRange.min = nextValue;
      if (
        nextValue !== undefined &&
        priceRange.max !== undefined &&
        nextValue > priceRange.max
      ) {
        nextRange.max = nextValue;
      }
    } else {
      nextRange.max = nextValue;
      if (
        nextValue !== undefined &&
        priceRange.min !== undefined &&
        nextValue < priceRange.min
      ) {
        nextRange.min = nextValue;
      }
    }

    if (nextRange.min !== priceRange.min || nextRange.max !== priceRange.max) {
      onChange(nextRange);
    }
  };

  return (
    <>
      <PriceBoundaryChip
        boundary="min"
        label={minLabel}
        value={priceRange.min}
        currency={currency}
        editLabel={editLabel}
        showRemoveButton={priceRange.min !== undefined && priceRange.min !== 0}
        onCommit={(value) => handleBoundaryCommit("min", value)}
        onRemove={onRemove}
      />
      <PriceBoundaryChip
        boundary="max"
        label={maxChipLabel}
        value={priceRange.max}
        currency={currency}
        isOptional
        showRemoveButton={priceRange.max !== undefined}
        removeLabel={removeLabel}
        editLabel={editLabel}
        showAddWhenEmpty
        onCommit={(value) => handleBoundaryCommit("max", value)}
        onRemove={onRemove}
      />
    </>
  );
};
