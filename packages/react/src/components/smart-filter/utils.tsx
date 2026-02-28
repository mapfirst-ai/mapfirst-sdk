import type { ReactNode, CSSProperties } from "react";

const STAR_BASE_STYLES: CSSProperties = {
  display: "block",
  width: "12px",
  height: "12px",
  borderRadius: "50%",
  border: "1px solid #03852e",
  pointerEvents: "none",
};

const STAR_FULL_STYLES: CSSProperties = {
  ...STAR_BASE_STYLES,
  backgroundColor: "#03852e",
};

const STAR_HALF_STYLES: CSSProperties = {
  ...STAR_BASE_STYLES,
  background: "linear-gradient(90deg, #03852e 50%, transparent 50%)",
};

const MIN_RATING_LABEL_STYLES: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "4px",
};

const MIN_RATING_STARS_WRAPPER_STYLES: CSSProperties = {
  display: "flex",
  gap: "1px",
  userSelect: "none",
};

export const renderStars = (rating: number): ReactNode[] => {
  const stars: ReactNode[] = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i += 1) {
    stars.push(<span key={`full-${i}`} style={STAR_FULL_STYLES} />);
  }

  if (hasHalfStar) {
    stars.push(<span key="half" style={STAR_HALF_STYLES} />);
  }

  const remainingStars = Math.max(0, 5 - Math.ceil(rating));
  for (let i = 0; i < remainingStars; i += 1) {
    stars.push(<span key={`empty-${i}`} style={STAR_BASE_STYLES} />);
  }

  return stars;
};

export const createMinRatingFilterLabel = (
  rating: number,
  suffix?: string
): ReactNode => (
  <span style={MIN_RATING_LABEL_STYLES}>
    <span style={MIN_RATING_STARS_WRAPPER_STYLES}>
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
