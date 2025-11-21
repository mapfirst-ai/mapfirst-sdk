import React, {
  FunctionComponent,
  useState,
  FocusEvent,
  CSSProperties,
} from "react";
import { CloseIcon, StarIcon } from "../Icons";
import { useTranslation } from "../../hooks/useTranslation";
import { formatRatingValue } from "./utils";

const chipContainerStyles: CSSProperties = {
  position: "relative",
  backgroundColor: "white",
  color: "black",
  fontSize: "14px",
  borderRadius: "9999px",
  padding: "0 16px",
  paddingRight: "20px",
  border: "1px solid #03852e",
  display: "flex",
  gap: "8px",
  alignItems: "center",
  justifyContent: "center",
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

const starContainerStyles: CSSProperties = {
  display: "flex",
  gap: "1px",
  userSelect: "none",
};

const circleBaseStyles: CSSProperties = {
  display: "block",
  width: "12px",
  height: "12px",
  borderRadius: "50%",
  border: "1px solid #03852e",
  pointerEvents: "none",
};

const buttonBaseStyles: CSSProperties = {
  position: "absolute",
  top: 0,
  height: "100%",
  cursor: "pointer",
  backgroundColor: "transparent",
  border: "none",
  padding: 0,
};

export const MinRatingFilterChip: FunctionComponent<{
  star?: boolean;
  rating: number;
  onChange: (rating: number) => void;
  onRemove: () => void;
}> = ({ rating, onChange, onRemove, star = false }) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [removeHover, setRemoveHover] = useState(false);
  const { t } = useTranslation();

  const displayRating = hoverRating ?? rating;
  const formatLabel = (value: number) =>
    star && value
      ? value.toString()
      : t("smartFilter.minRating.label", { value: formatRatingValue(value) });
  const removeLabel = t("smartFilter.minRating.remove");
  const setLabel = (value: number) =>
    t("smartFilter.minRating.setTo", { rating: formatRatingValue(value) });

  const getFillForStar = (index: number) => {
    const starNumber = index + 1;
    if (displayRating >= starNumber) {
      return "full" as const;
    }
    if (displayRating >= starNumber - 0.5) {
      return "half" as const;
    }
    return "empty" as const;
  };

  const handleSelect = (nextRating: number) => {
    setHoverRating(null);
    if (nextRating === rating) {
      return;
    }
    onChange(nextRating);
  };

  const handleBlur = (event: FocusEvent<HTMLButtonElement>) => {
    const related = event.relatedTarget as HTMLElement | null;
    if (
      !related ||
      !(event.currentTarget as HTMLElement)
        .closest("[data-min-rating-chip]")
        ?.contains(related)
    ) {
      setHoverRating(null);
    }
  };

  return (
    <div style={chipContainerStyles} data-min-rating-chip>
      <div
        style={{ display: "flex", alignItems: "center", gap: "4px" }}
        onMouseLeave={() => setHoverRating(null)}
      >
        <div style={starContainerStyles}>
          {Array.from({ length: 5 }).map((_, index) => {
            const fillState = getFillForStar(index);
            const starNumber = index + 1;
            const halfValue = starNumber - 0.5;

            if (star) {
              return (
                <div
                  key={index}
                  style={{
                    position: "relative",
                    width: "16px",
                    height: "16px",
                  }}
                >
                  <StarIcon
                    fill={displayRating >= starNumber ? "#03852e" : "none"}
                    style={{
                      width: "16px",
                      height: "16px",
                      pointerEvents: "none",
                    }}
                  />
                  <button
                    type="button"
                    style={{
                      ...buttonBaseStyles,
                      left: 0,
                      width: "50%",
                      borderRadius: "50% 0 0 50%",
                    }}
                    onMouseEnter={() => setHoverRating(halfValue)}
                    onFocus={() => setHoverRating(halfValue)}
                    onBlur={handleBlur}
                    onClick={() => handleSelect(halfValue)}
                    aria-label={setLabel(halfValue)}
                    title={formatLabel(halfValue)}
                  />
                  <button
                    type="button"
                    style={{
                      ...buttonBaseStyles,
                      left: "50%",
                      width: "50%",
                      borderRadius: "0 50% 50% 0",
                    }}
                    onMouseEnter={() => setHoverRating(starNumber)}
                    onFocus={() => setHoverRating(starNumber)}
                    onBlur={handleBlur}
                    onClick={() => handleSelect(starNumber)}
                    aria-label={setLabel(starNumber)}
                    title={formatLabel(starNumber)}
                  />
                </div>
              );
            }

            const circleStyles: CSSProperties =
              fillState === "full"
                ? { ...circleBaseStyles, backgroundColor: "#03852e" }
                : circleBaseStyles;

            const halfCircleStyles: CSSProperties = {
              ...circleBaseStyles,
              background:
                "linear-gradient(90deg, #03852e 50%, transparent 50%)",
            };

            return (
              <div
                key={index}
                style={{ position: "relative", width: "12px", height: "12px" }}
              >
                <span
                  style={fillState === "half" ? halfCircleStyles : circleStyles}
                />
                <button
                  type="button"
                  style={{
                    ...buttonBaseStyles,
                    left: 0,
                    width: "50%",
                    borderRadius: "50% 0 0 50%",
                    outline: "2px solid transparent",
                    outlineOffset: "1px",
                  }}
                  onMouseEnter={() => setHoverRating(halfValue)}
                  onFocus={() => setHoverRating(halfValue)}
                  onBlur={handleBlur}
                  onClick={() => handleSelect(halfValue)}
                  aria-label={setLabel(halfValue)}
                  title={formatLabel(halfValue)}
                />
                <button
                  type="button"
                  style={{
                    ...buttonBaseStyles,
                    left: "50%",
                    width: "50%",
                    borderRadius: "0 50% 50% 0",
                    outline: "2px solid transparent",
                    outlineOffset: "1px",
                  }}
                  onMouseEnter={() => setHoverRating(starNumber)}
                  onFocus={() => setHoverRating(starNumber)}
                  onBlur={handleBlur}
                  onClick={() => handleSelect(starNumber)}
                  aria-label={setLabel(starNumber)}
                  title={formatLabel(starNumber)}
                />
              </div>
            );
          })}
        </div>
        <span style={{ whiteSpace: "nowrap" }}>
          {formatLabel(displayRating)}
        </span>
      </div>
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
    </div>
  );
};
