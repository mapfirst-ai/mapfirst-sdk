import React, { ChangeEvent, FunctionComponent, CSSProperties } from "react";
import { CloseIcon } from "../Icons";
import { useTranslation } from "../../hooks/useTranslation";
import type { PriceLevel } from "@mapfirst.ai/core";

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
  gap: "16px",
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

const PRICE_LEVEL_OPTIONS = [
  { value: "Cheap Eats" as PriceLevel, key: "cheapEats" },
  { value: "Mid Range" as PriceLevel, key: "midRange" },
  { value: "Fine Dining" as PriceLevel, key: "fineDining" },
] as const;

export interface RestaurantPriceLevelChipProps {
  values: PriceLevel[];
  onChange: (values: PriceLevel[]) => void;
  onRemove: () => void;
}

export const RestaurantPriceLevelChip: FunctionComponent<
  RestaurantPriceLevelChipProps
> = ({ values, onChange, onRemove }) => {
  const { t } = useTranslation();
  const [removeHover, setRemoveHover] = React.useState(false);

  const label = t("smartFilter.restaurantPriceLevel.label");
  const removeLabel = t("smartFilter.restaurantPriceLevel.remove");
  const noneSelectedLabel = t("smartFilter.restaurantPriceLevel.none");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    const valueAsPriceLevel = value as PriceLevel;
    const selection = new Set(values);
    if (checked) {
      selection.add(valueAsPriceLevel);
    } else {
      selection.delete(valueAsPriceLevel);
    }
    const orderedSelection = PRICE_LEVEL_OPTIONS.filter((option) =>
      selection.has(option.value)
    ).map((option) => option.value);
    onChange(orderedSelection);
  };

  return (
    <div style={chipStyles}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flexWrap: "wrap",
        }}
      >
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
        <div style={{ display: "flex", gap: "12px" }}>
          {PRICE_LEVEL_OPTIONS.map((option) => {
            const optionLabel = t(
              `smartFilter.restaurantPriceLevel.options.${option.key}`
            );
            const checkboxId = `price-level-${option.key}`;
            return (
              <label
                key={option.value}
                htmlFor={checkboxId}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                <input
                  id={checkboxId}
                  type="checkbox"
                  value={option.value}
                  checked={values.includes(option.value)}
                  onChange={handleChange}
                  style={{ accentColor: "#03852e", cursor: "pointer" }}
                />
                <span>{optionLabel}</span>
              </label>
            );
          })}
          {values.length === 0 && (
            <span style={{ fontSize: "12px", color: "#737373" }}>
              {noneSelectedLabel}
            </span>
          )}
        </div>
      </div>

      <button
        style={{
          ...removeButtonStyles,
          backgroundColor: removeHover ? "#e5e5e5" : "white",
        }}
        onClick={onRemove}
        onMouseEnter={() => setRemoveHover(true)}
        onMouseLeave={() => setRemoveHover(false)}
        aria-label={removeLabel ?? label}
        title={removeLabel ?? label}
      >
        <CloseIcon style={{ width: "17px", height: "17px" }} />
      </button>
    </div>
  );
};
