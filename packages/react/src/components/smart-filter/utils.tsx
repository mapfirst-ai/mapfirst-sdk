import React, { ReactNode, CSSProperties } from "react";

export const renderStars = (rating: number): ReactNode[] => {
  const stars: ReactNode[] = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  const baseStyles: CSSProperties = {
    display: "block",
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    border: "1px solid #03852e",
    pointerEvents: "none",
  };

  const fullStarStyles: CSSProperties = {
    ...baseStyles,
    backgroundColor: "#03852e",
  };

  const halfStarStyles: CSSProperties = {
    ...baseStyles,
    background: "linear-gradient(90deg, #03852e 50%, transparent 50%)",
  };

  for (let i = 0; i < fullStars; i += 1) {
    stars.push(<span key={`full-${i}`} style={fullStarStyles} />);
  }

  if (hasHalfStar) {
    stars.push(<span key="half" style={halfStarStyles} />);
  }

  const remainingStars = Math.max(0, 5 - Math.ceil(rating));
  for (let i = 0; i < remainingStars; i += 1) {
    stars.push(<span key={`empty-${i}`} style={baseStyles} />);
  }

  return stars;
};

export const createMinRatingFilterLabel = (
  rating: number,
  suffix?: string
): ReactNode => (
  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
    <span
      style={{
        display: "flex",
        gap: "1px",
        userSelect: "none",
      }}
    >
      {renderStars(rating)}
    </span>{" "}
    {suffix}
  </span>
);

export const formatRatingValue = (rating: number): string => rating.toFixed(1);

export const createPriceRangeFilterLabel = (
  min: number,
  max: number | undefined,
  currency: string | undefined,
  formatCurrencyFn: (value: number, currency?: string) => string
): string =>
  `${formatCurrencyFn(min, currency)} - ${formatCurrencyFn(
    max ?? 0,
    currency
  )}`;
