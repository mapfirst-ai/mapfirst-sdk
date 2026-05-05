// src/index.tsx
import React6 from "react";
import {
  MapFirstCore,
  LeafletAdapter
} from "@mapfirst.ai/core";
import {
  processApiFilters,
  convertToApiFilters,
  PropertiesFetchError,
  fetchImages,
  fetchProperties,
  MapFirstCore as MapFirstCore2,
  LeafletAdapter as LeafletAdapter2,
  isWebGLSupported
} from "@mapfirst.ai/core";

// src/components/SmartFilter.tsx
import { useCallback as useCallback3 } from "react";

// src/components/smart-filter/FilterChips.tsx
import React5 from "react";

// src/components/smart-filter/CloseButton.tsx
import React from "react";

// src/components/Icons.tsx
import { jsx, jsxs } from "react/jsx-runtime";
var SearchIcon = ({ className, style }) => /* @__PURE__ */ jsxs(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className,
    style: { width: "1em", height: "1em", ...style },
    children: [
      /* @__PURE__ */ jsx("circle", { cx: "11", cy: "11", r: "8" }),
      /* @__PURE__ */ jsx("path", { d: "m21 21-4.35-4.35" })
    ]
  }
);
var CloseIcon = ({ className, style }) => /* @__PURE__ */ jsxs(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className,
    style: { width: "1em", height: "1em", ...style },
    children: [
      /* @__PURE__ */ jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
      /* @__PURE__ */ jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
    ]
  }
);
var EditIcon = ({ className, style }) => /* @__PURE__ */ jsxs(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className,
    style: { width: "1em", height: "1em", ...style },
    children: [
      /* @__PURE__ */ jsx("path", { d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }),
      /* @__PURE__ */ jsx("path", { d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" })
    ]
  }
);
var NextIcon = ({ className, style }) => /* @__PURE__ */ jsx(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className,
    style: { width: "1em", height: "1em", ...style },
    children: /* @__PURE__ */ jsx("polyline", { points: "9 18 15 12 9 6" })
  }
);
var StarIcon = ({
  className,
  style,
  fill = "none"
}) => /* @__PURE__ */ jsx(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill,
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className,
    style: { width: "1em", height: "1em", ...style },
    children: /* @__PURE__ */ jsx("polygon", { points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" })
  }
);

// src/components/smart-filter/CloseButton.tsx
import { jsx as jsx2 } from "react/jsx-runtime";
var closeButtonStyles = {
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
  transition: "background-color 0.2s"
};
var iconStyles = {
  width: "17px",
  height: "17px"
};
var CloseButton = ({ onClick, style }) => {
  const [isHovering, setIsHovering] = React.useState(false);
  return /* @__PURE__ */ jsx2(
    "button",
    {
      style: {
        ...closeButtonStyles,
        backgroundColor: isHovering ? "#e5e5e5" : "white",
        ...style
      },
      onClick,
      onMouseEnter: () => setIsHovering(true),
      onMouseLeave: () => setIsHovering(false),
      "aria-label": "Remove filter",
      children: /* @__PURE__ */ jsx2(CloseIcon, { style: iconStyles })
    }
  );
};

// src/components/smart-filter/Chip.tsx
import { jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
var chipStyles = {
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
  height: "34px"
};
var Chip = ({ label, icon, remove, style }) => {
  return /* @__PURE__ */ jsxs2("div", { style: { ...chipStyles, ...style }, children: [
    icon && /* @__PURE__ */ jsx3("span", { style: { display: "flex", alignItems: "center" }, children: icon }),
    /* @__PURE__ */ jsx3("span", { style: { whiteSpace: "nowrap" }, children: label }),
    /* @__PURE__ */ jsx3(CloseButton, { onClick: remove })
  ] });
};

// src/components/smart-filter/MinRatingFilterChip.tsx
import {
  useState as useState2
} from "react";

// src/hooks/useTranslation.ts
import { useCallback, useMemo, useState } from "react";
var defaultTranslations = {
  "smartFilter.typingPrompt": "Search for hotels, restaurants, or attractions...",
  "smartFilter.nav.previous": "Previous filters",
  "smartFilter.nav.next": "Next filters",
  "smartFilter.toast.locationRequired": "Please select a location first",
  "smartFilter.clearAll": "Clear all",
  "smartFilter.minRating.suffix": "+",
  "smartFilter.minRating.label": "{{value}}+",
  "smartFilter.minRating.remove": "Remove rating filter",
  "smartFilter.minRating.setTo": "Set rating to {{rating}}",
  "smartFilter.priceRange.label": "Price Range",
  "smartFilter.priceRange.remove": "Remove price filter",
  "smartFilter.priceRange.edit": "Edit price",
  "smartFilter.transformedQuery.remove": "Remove search query",
  "smartFilter.transformedQuery.edit": "Edit search query",
  "smartFilter.restaurantPriceLevel.label": "Price Level",
  "smartFilter.restaurantPriceLevel.remove": "Remove price level filter",
  "smartFilter.restaurantPriceLevel.none": "Any",
  "smartFilter.restaurantPriceLevel.options.cheapEats": "Cheap Eats",
  "smartFilter.restaurantPriceLevel.options.midRange": "Mid Range",
  "smartFilter.restaurantPriceLevel.options.fineDining": "Fine Dining"
};
var formatCurrencyDefault = (value, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};
var useTranslation = (customTranslations, customFormatCurrency) => {
  const [locale, setLocale] = useState("en");
  const translations = useMemo(
    () => ({ ...defaultTranslations, ...customTranslations }),
    [customTranslations]
  );
  const t = useCallback(
    (key, params) => {
      let translation = translations[key] || key;
      if (params) {
        Object.keys(params).forEach((paramKey) => {
          translation = translation.replace(
            new RegExp(`{{${paramKey}}}`, "g"),
            String(params[paramKey])
          );
        });
      }
      return translation;
    },
    [translations]
  );
  const formatCurrency = useCallback(
    (value, currency) => {
      if (customFormatCurrency) {
        return customFormatCurrency(value, currency);
      }
      return formatCurrencyDefault(value, currency);
    },
    [customFormatCurrency]
  );
  return {
    t,
    locale,
    setLocale,
    formatCurrency
  };
};

// src/components/smart-filter/utils.tsx
import { jsx as jsx4, jsxs as jsxs3 } from "react/jsx-runtime";
var STAR_BASE_STYLES = {
  display: "block",
  width: "12px",
  height: "12px",
  borderRadius: "50%",
  border: "1px solid #03852e",
  pointerEvents: "none"
};
var STAR_FULL_STYLES = {
  ...STAR_BASE_STYLES,
  backgroundColor: "#03852e"
};
var STAR_HALF_STYLES = {
  ...STAR_BASE_STYLES,
  background: "linear-gradient(90deg, #03852e 50%, transparent 50%)"
};
var MIN_RATING_LABEL_STYLES = {
  display: "flex",
  alignItems: "center",
  gap: "4px"
};
var MIN_RATING_STARS_WRAPPER_STYLES = {
  display: "flex",
  gap: "1px",
  userSelect: "none"
};
var renderStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  for (let i = 0; i < fullStars; i += 1) {
    stars.push(/* @__PURE__ */ jsx4("span", { style: STAR_FULL_STYLES }, `full-${i}`));
  }
  if (hasHalfStar) {
    stars.push(/* @__PURE__ */ jsx4("span", { style: STAR_HALF_STYLES }, "half"));
  }
  const remainingStars = Math.max(0, 5 - Math.ceil(rating));
  for (let i = 0; i < remainingStars; i += 1) {
    stars.push(/* @__PURE__ */ jsx4("span", { style: STAR_BASE_STYLES }, `empty-${i}`));
  }
  return stars;
};
var createMinRatingFilterLabel = (rating, suffix) => /* @__PURE__ */ jsxs3("span", { style: MIN_RATING_LABEL_STYLES, children: [
  /* @__PURE__ */ jsx4("span", { style: MIN_RATING_STARS_WRAPPER_STYLES, children: renderStars(rating) }),
  " ",
  suffix
] });
var formatRatingValue = (rating) => rating.toFixed(1);
var createPriceRangeFilterLabel = (min, max, currency, formatCurrencyFn) => `${formatCurrencyFn(min, currency)} - ${formatCurrencyFn(
  max != null ? max : 0,
  currency
)}`;

// src/components/smart-filter/MinRatingFilterChip.tsx
import { jsx as jsx5, jsxs as jsxs4 } from "react/jsx-runtime";
var chipContainerStyles = {
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
  height: "34px"
};
var starContainerStyles = {
  display: "flex",
  gap: "1px",
  userSelect: "none"
};
var circleBaseStyles = {
  display: "block",
  width: "12px",
  height: "12px",
  borderRadius: "50%",
  border: "1px solid #03852e",
  pointerEvents: "none"
};
var buttonBaseStyles = {
  position: "absolute",
  top: 0,
  height: "100%",
  cursor: "pointer",
  backgroundColor: "transparent",
  border: "none",
  padding: 0
};
var MinRatingFilterChip = ({ rating, onChange, onRemove, star = false }) => {
  const [hoverRating, setHoverRating] = useState2(null);
  const { t } = useTranslation();
  const displayRating = hoverRating != null ? hoverRating : rating;
  const formatLabel = (value) => star && value ? value.toString() : t("smartFilter.minRating.label", { value: formatRatingValue(value) });
  const removeLabel = t("smartFilter.minRating.remove");
  const setLabel = (value) => t("smartFilter.minRating.setTo", { rating: formatRatingValue(value) });
  const getFillForStar = (index) => {
    const starNumber = index + 1;
    if (displayRating >= starNumber) {
      return "full";
    }
    if (displayRating >= starNumber - 0.5) {
      return "half";
    }
    return "empty";
  };
  const handleSelect = (nextRating) => {
    setHoverRating(null);
    if (nextRating === rating) {
      return;
    }
    onChange(nextRating);
  };
  const handleBlur = (event) => {
    var _a;
    const related = event.relatedTarget;
    if (!related || !((_a = event.currentTarget.closest("[data-min-rating-chip]")) == null ? void 0 : _a.contains(related))) {
      setHoverRating(null);
    }
  };
  return /* @__PURE__ */ jsxs4("div", { style: chipContainerStyles, "data-min-rating-chip": true, children: [
    /* @__PURE__ */ jsxs4(
      "div",
      {
        style: { display: "flex", alignItems: "center", gap: "4px" },
        onMouseLeave: () => setHoverRating(null),
        children: [
          /* @__PURE__ */ jsx5("div", { style: starContainerStyles, children: Array.from({ length: 5 }).map((_, index) => {
            const fillState = getFillForStar(index);
            const starNumber = index + 1;
            const halfValue = starNumber - 0.5;
            if (star) {
              return /* @__PURE__ */ jsxs4(
                "div",
                {
                  style: {
                    position: "relative",
                    width: "16px",
                    height: "16px"
                  },
                  children: [
                    /* @__PURE__ */ jsx5(
                      StarIcon,
                      {
                        fill: displayRating >= starNumber ? "#03852e" : "none",
                        style: {
                          width: "16px",
                          height: "16px",
                          pointerEvents: "none"
                        }
                      }
                    ),
                    /* @__PURE__ */ jsx5(
                      "button",
                      {
                        type: "button",
                        style: {
                          ...buttonBaseStyles,
                          left: 0,
                          width: "50%",
                          borderRadius: "50% 0 0 50%"
                        },
                        onMouseEnter: () => setHoverRating(halfValue),
                        onFocus: () => setHoverRating(halfValue),
                        onBlur: handleBlur,
                        onClick: () => handleSelect(halfValue),
                        "aria-label": setLabel(halfValue),
                        title: formatLabel(halfValue)
                      }
                    ),
                    /* @__PURE__ */ jsx5(
                      "button",
                      {
                        type: "button",
                        style: {
                          ...buttonBaseStyles,
                          left: "50%",
                          width: "50%",
                          borderRadius: "0 50% 50% 0"
                        },
                        onMouseEnter: () => setHoverRating(starNumber),
                        onFocus: () => setHoverRating(starNumber),
                        onBlur: handleBlur,
                        onClick: () => handleSelect(starNumber),
                        "aria-label": setLabel(starNumber),
                        title: formatLabel(starNumber)
                      }
                    )
                  ]
                },
                index
              );
            }
            const circleStyles = fillState === "full" ? { ...circleBaseStyles, backgroundColor: "#03852e" } : circleBaseStyles;
            const halfCircleStyles = {
              ...circleBaseStyles,
              background: "linear-gradient(90deg, #03852e 50%, transparent 50%)"
            };
            return /* @__PURE__ */ jsxs4(
              "div",
              {
                style: { position: "relative", width: "12px", height: "12px" },
                children: [
                  /* @__PURE__ */ jsx5(
                    "span",
                    {
                      style: fillState === "half" ? halfCircleStyles : circleStyles
                    }
                  ),
                  /* @__PURE__ */ jsx5(
                    "button",
                    {
                      type: "button",
                      style: {
                        ...buttonBaseStyles,
                        left: 0,
                        width: "50%",
                        borderRadius: "50% 0 0 50%",
                        outline: "2px solid transparent",
                        outlineOffset: "1px"
                      },
                      onMouseEnter: () => setHoverRating(halfValue),
                      onFocus: () => setHoverRating(halfValue),
                      onBlur: handleBlur,
                      onClick: () => handleSelect(halfValue),
                      "aria-label": setLabel(halfValue),
                      title: formatLabel(halfValue)
                    }
                  ),
                  /* @__PURE__ */ jsx5(
                    "button",
                    {
                      type: "button",
                      style: {
                        ...buttonBaseStyles,
                        left: "50%",
                        width: "50%",
                        borderRadius: "0 50% 50% 0",
                        outline: "2px solid transparent",
                        outlineOffset: "1px"
                      },
                      onMouseEnter: () => setHoverRating(starNumber),
                      onFocus: () => setHoverRating(starNumber),
                      onBlur: handleBlur,
                      onClick: () => handleSelect(starNumber),
                      "aria-label": setLabel(starNumber),
                      title: formatLabel(starNumber)
                    }
                  )
                ]
              },
              index
            );
          }) }),
          /* @__PURE__ */ jsx5("span", { style: { whiteSpace: "nowrap" }, children: formatLabel(displayRating) })
        ]
      }
    ),
    /* @__PURE__ */ jsx5(CloseButton, { onClick: onRemove })
  ] });
};

// src/components/smart-filter/PriceRangeFilterChip.tsx
import {
  useEffect,
  useState as useState3
} from "react";
import { Fragment, jsx as jsx6, jsxs as jsxs5 } from "react/jsx-runtime";
var chipStyles2 = {
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
  height: "34px"
};
var inputStyles = {
  outline: "none",
  fontSize: "16px",
  backgroundColor: "transparent",
  borderRadius: "2px",
  padding: "2px 8px",
  width: "64px",
  textAlign: "center",
  border: "none"
};
var editButtonStyles = {
  padding: "4px",
  borderRadius: "50%",
  cursor: "pointer",
  transition: "background-color 0.2s",
  border: "none",
  backgroundColor: "transparent",
  color: "#737373",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};
var PriceBoundaryChip = ({
  label,
  value,
  placeholder,
  currency,
  isOptional = false,
  showRemoveButton = false,
  editLabel,
  showAddWhenEmpty = false,
  onCommit,
  onRemove
}) => {
  const [draft, setDraft] = useState3(
    value !== void 0 ? String(value) : ""
  );
  const [isEditing, setIsEditing] = useState3(false);
  const [editHover, setEditHover] = useState3(false);
  const hasValue = value !== void 0;
  useEffect(() => {
    setDraft(value !== void 0 ? String(value) : "");
    setIsEditing(false);
  }, [value]);
  const resetDraft = () => {
    setDraft(value !== void 0 ? String(value) : "");
  };
  const commitValue = () => {
    if (draft.trim() === "") {
      if (isOptional) {
        onCommit(void 0);
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
  const handleChange = (event) => {
    const next = event.target.value.replace(/[^\d]/g, "");
    setDraft(next);
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.currentTarget.blur();
      setIsEditing(false);
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      resetDraft();
      event.currentTarget.blur();
      setIsEditing(false);
      return;
    }
    const allowed = event.key.length === 1 && /[0-9]/.test(event.key) || event.key === "Backspace" || event.key === "Delete" || event.key === "Tab" || event.key === "ArrowLeft" || event.key === "ArrowRight" || event.key === "Home" || event.key === "End";
    if (!allowed) {
      event.preventDefault();
    }
  };
  return /* @__PURE__ */ jsxs5("div", { style: chipStyles2, children: [
    /* @__PURE__ */ jsx6(
      "span",
      {
        style: {
          fontSize: "10px",
          textTransform: "uppercase",
          fontWeight: 600,
          letterSpacing: "0.05em"
        },
        children: label
      }
    ),
    isEditing ? /* @__PURE__ */ jsx6(
      "input",
      {
        value: draft,
        onChange: handleChange,
        onBlur: () => {
          commitValue();
          setIsEditing(false);
        },
        onKeyDown: handleKeyDown,
        placeholder,
        inputMode: "numeric",
        pattern: "[0-9]*",
        "aria-label": label,
        style: inputStyles,
        autoFocus: true
      }
    ) : hasValue ? /* @__PURE__ */ jsxs5("span", { style: { fontSize: "16px" }, children: [
      currency,
      value
    ] }) : showAddWhenEmpty ? /* @__PURE__ */ jsx6(
      "button",
      {
        type: "button",
        style: {
          fontSize: "16px",
          color: "#737373",
          cursor: "pointer",
          border: "none",
          backgroundColor: "transparent",
          padding: 0
        },
        onClick: () => setIsEditing(true),
        "aria-label": editLabel,
        children: "+"
      }
    ) : /* @__PURE__ */ jsx6("span", { style: { fontSize: "16px", color: "#737373" }, children: "-" }),
    (!showAddWhenEmpty || showAddWhenEmpty && isEditing) && /* @__PURE__ */ jsx6("span", { style: { color: "#737373", fontSize: "12px" }, children: currency }),
    !isEditing && (!showAddWhenEmpty || hasValue) && /* @__PURE__ */ jsx6(
      "button",
      {
        type: "button",
        style: {
          ...editButtonStyles,
          backgroundColor: editHover ? "#e5e5e5" : "transparent"
        },
        "aria-label": editLabel,
        title: editLabel,
        onClick: () => setIsEditing(true),
        onMouseEnter: () => setEditHover(true),
        onMouseLeave: () => setEditHover(false),
        children: /* @__PURE__ */ jsx6(EditIcon, {})
      }
    ),
    showRemoveButton && /* @__PURE__ */ jsx6(CloseButton, { onClick: onRemove })
  ] });
};
var PriceRangeFilterChip = ({ priceRange, currency, onChange, onRemove }) => {
  const { t } = useTranslation();
  const minLabel = "Min";
  const maxChipLabel = "Max";
  const editLabel = t("smartFilter.priceRange.edit");
  const handleBoundaryCommit = (boundary, nextValue) => {
    const nextRange = {
      min: priceRange.min,
      max: priceRange.max
    };
    if (boundary === "min") {
      nextRange.min = nextValue;
      if (nextValue !== void 0 && priceRange.max !== void 0 && nextValue > priceRange.max) {
        nextRange.max = nextValue;
      }
    } else {
      nextRange.max = nextValue;
      if (nextValue !== void 0 && priceRange.min !== void 0 && nextValue < priceRange.min) {
        nextRange.min = nextValue;
      }
    }
    if (nextRange.min !== priceRange.min || nextRange.max !== priceRange.max) {
      onChange(nextRange);
    }
  };
  return /* @__PURE__ */ jsxs5(Fragment, { children: [
    /* @__PURE__ */ jsx6(
      PriceBoundaryChip,
      {
        label: minLabel,
        value: priceRange.min,
        currency,
        editLabel,
        showRemoveButton: priceRange.min !== void 0 && priceRange.min !== 0,
        onCommit: (value) => handleBoundaryCommit("min", value),
        onRemove
      }
    ),
    /* @__PURE__ */ jsx6(
      PriceBoundaryChip,
      {
        label: maxChipLabel,
        value: priceRange.max,
        currency,
        isOptional: true,
        showRemoveButton: priceRange.max !== void 0,
        editLabel,
        showAddWhenEmpty: true,
        onCommit: (value) => handleBoundaryCommit("max", value),
        onRemove
      }
    )
  ] });
};

// src/components/smart-filter/RestaurantPriceLevelChip.tsx
import { jsx as jsx7, jsxs as jsxs6 } from "react/jsx-runtime";
var chipStyles3 = {
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
  height: "34px"
};
var PRICE_LEVEL_OPTIONS = [
  { value: "Cheap Eats", key: "cheapEats" },
  { value: "Mid Range", key: "midRange" },
  { value: "Fine Dining", key: "fineDining" }
];
var RestaurantPriceLevelChip = ({ values, onChange, onRemove }) => {
  const { t } = useTranslation();
  const label = t("smartFilter.restaurantPriceLevel.label");
  const removeLabel = t("smartFilter.restaurantPriceLevel.remove");
  const noneSelectedLabel = t("smartFilter.restaurantPriceLevel.none");
  const handleChange = (event) => {
    const { value, checked } = event.target;
    const valueAsPriceLevel = value;
    const selection = new Set(values);
    if (checked) {
      selection.add(valueAsPriceLevel);
    } else {
      selection.delete(valueAsPriceLevel);
    }
    const orderedSelection = PRICE_LEVEL_OPTIONS.filter(
      (option) => selection.has(option.value)
    ).map((option) => option.value);
    onChange(orderedSelection);
  };
  return /* @__PURE__ */ jsxs6("div", { style: chipStyles3, children: [
    /* @__PURE__ */ jsxs6(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flexWrap: "wrap"
        },
        children: [
          /* @__PURE__ */ jsx7(
            "span",
            {
              style: {
                fontSize: "10px",
                textTransform: "uppercase",
                fontWeight: 600,
                letterSpacing: "0.05em"
              },
              children: label
            }
          ),
          /* @__PURE__ */ jsxs6("div", { style: { display: "flex", gap: "12px" }, children: [
            PRICE_LEVEL_OPTIONS.map((option) => {
              const optionLabel = t(
                `smartFilter.restaurantPriceLevel.options.${option.key}`
              );
              const checkboxId = `price-level-${option.key}`;
              return /* @__PURE__ */ jsxs6(
                "label",
                {
                  htmlFor: checkboxId,
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "12px",
                    cursor: "pointer"
                  },
                  children: [
                    /* @__PURE__ */ jsx7(
                      "input",
                      {
                        id: checkboxId,
                        type: "checkbox",
                        value: option.value,
                        checked: values.includes(option.value),
                        onChange: handleChange,
                        style: { accentColor: "#03852e", cursor: "pointer" }
                      }
                    ),
                    /* @__PURE__ */ jsx7("span", { children: optionLabel })
                  ]
                },
                option.value
              );
            }),
            values.length === 0 && /* @__PURE__ */ jsx7("span", { style: { fontSize: "12px", color: "#737373" }, children: noneSelectedLabel })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsx7(CloseButton, { onClick: onRemove })
  ] });
};

// src/components/smart-filter/TransformedQueryChip.tsx
import {
  useEffect as useEffect2,
  useRef,
  useState as useState4
} from "react";
import { jsx as jsx8, jsxs as jsxs7 } from "react/jsx-runtime";
var chipStyles4 = {
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
  height: "34px"
};
var inputStyles2 = {
  backgroundColor: "#ececec",
  borderRadius: "2px",
  padding: "2px 8px",
  outline: "none",
  fontSize: "16px",
  minWidth: "8ch",
  border: "none"
};
var editButtonStyles2 = {
  padding: "4px",
  borderRadius: "50%",
  cursor: "pointer",
  transition: "background-color 0.2s",
  color: "#737373",
  border: "none",
  backgroundColor: "transparent",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};
var TransformedQueryChip = ({ value, onChange, onRemove }) => {
  const inputRef = useRef(null);
  const [draft, setDraft] = useState4(value);
  const [isEditing, setIsEditing] = useState4(false);
  const [editHover, setEditHover] = useState4(false);
  const { t } = useTranslation();
  const removeLabel = t("smartFilter.transformedQuery.remove");
  const editLabel = t("smartFilter.transformedQuery.edit");
  useEffect2(() => {
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
  const handleChange = (event) => {
    setDraft(event.target.value);
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.currentTarget.blur();
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      setDraft(value);
      event.currentTarget.blur();
      return;
    }
  };
  return /* @__PURE__ */ jsxs7("div", { style: chipStyles4, children: [
    /* @__PURE__ */ jsx8(SearchIcon, { style: { width: "16px", height: "16px", color: "#03852e" } }),
    isEditing ? /* @__PURE__ */ jsx8(
      "input",
      {
        ref: inputRef,
        value: draft,
        onChange: handleChange,
        onBlur: () => {
          applyChanges();
          setIsEditing(false);
        },
        onKeyDown: handleKeyDown,
        "aria-label": editLabel,
        style: inputStyles2,
        autoFocus: true
      }
    ) : /* @__PURE__ */ jsx8("span", { style: { fontSize: "16px" }, children: value }),
    !isEditing && /* @__PURE__ */ jsx8(
      "button",
      {
        type: "button",
        style: {
          ...editButtonStyles2,
          backgroundColor: editHover ? "#e5e5e5" : "transparent"
        },
        "aria-label": editLabel,
        title: editLabel,
        onClick: () => setIsEditing(true),
        onMouseEnter: () => setEditHover(true),
        onMouseLeave: () => setEditHover(false),
        children: /* @__PURE__ */ jsx8(EditIcon, {})
      }
    ),
    /* @__PURE__ */ jsx8(CloseButton, { onClick: onRemove })
  ] });
};

// src/hooks/useFilterScroll.ts
import { useCallback as useCallback2, useEffect as useEffect3, useRef as useRef2, useState as useState5 } from "react";
var useFilterScroll = (dependency) => {
  const scrollerRef = useRef2(null);
  const [atStart, setAtStart] = useState5(true);
  const [atEnd, setAtEnd] = useState5(true);
  const updateScrollButtons = useCallback2(() => {
    const el = scrollerRef.current;
    if (!el) {
      setAtStart(true);
      setAtEnd(true);
      return;
    }
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setAtStart(scrollLeft <= 0);
    setAtEnd(scrollLeft + clientWidth >= scrollWidth - 1);
  }, []);
  useEffect3(() => {
    const el = scrollerRef.current;
    updateScrollButtons();
    if (!el) {
      return;
    }
    const handleScroll = () => updateScrollButtons();
    el.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateScrollButtons);
    return () => {
      el.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [dependency, updateScrollButtons]);
  const scrollByDir = useCallback2((dir) => {
    const el = scrollerRef.current;
    if (!el) {
      return;
    }
    const delta = el.clientWidth * 0.7;
    el.scrollBy({
      left: dir === "next" ? delta : -delta,
      behavior: "smooth"
    });
  }, []);
  return {
    scrollerRef,
    atStart,
    atEnd,
    scrollByDir
  };
};

// src/components/smart-filter/FilterChips.tsx
import { jsx as jsx9, jsxs as jsxs8 } from "react/jsx-runtime";
var containerStyles = {
  position: "relative",
  width: "100%"
};
var scrollContainerBase = {
  display: "flex",
  gap: "8px",
  overflowX: "auto",
  alignItems: "center",
  width: "100%",
  scrollbarWidth: "none",
  msOverflowStyle: "none"
};
var gradientStyles = {
  pointerEvents: "none",
  position: "absolute",
  top: 0,
  bottom: 0,
  width: "40px"
};
var navButtonStyles = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  backgroundColor: "white",
  color: "#003c30",
  border: "1px solid #003c30",
  padding: "4px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  cursor: "pointer"
};
var FilterChips = ({
  filters,
  currency,
  minRatingSuffix: _minRatingSuffix,
  clearAllLabel,
  previousFiltersLabel,
  nextFiltersLabel,
  formatCurrency: _formatCurrency,
  onFilterChange,
  onResetFilters: _onResetFilters,
  onClearAll
}) => {
  const { scrollerRef, atStart, atEnd, scrollByDir } = useFilterScroll(
    filters.length
  );
  const [navHover, setNavHover] = React5.useState(null);
  const [clearHover, setClearHover] = React5.useState(false);
  const removeFilter = React5.useCallback(
    (filterId) => {
      void onFilterChange(filters.filter((f) => f.id !== filterId));
    },
    [filters, onFilterChange]
  );
  const patchFilter = React5.useCallback(
    (filterId, patch) => {
      const nextFilters = filters.map(
        (f) => f.id === filterId ? { ...f, ...patch } : f
      );
      void onFilterChange(nextFilters);
    },
    [filters, onFilterChange]
  );
  return /* @__PURE__ */ jsxs8("div", { style: containerStyles, children: [
    /* @__PURE__ */ jsxs8(
      "div",
      {
        ref: scrollerRef,
        style: {
          ...scrollContainerBase,
          padding: "8px",
          // Hide scrollbar for webkit browsers
          WebkitOverflowScrolling: "touch"
        },
        children: [
          /* @__PURE__ */ jsx9("style", { children: `
            div::-webkit-scrollbar {
              display: none;
            }
          ` }),
          filters.map((filter) => {
            var _a, _b;
            const renderStandardChip = () => /* @__PURE__ */ jsx9(
              Chip,
              {
                label: filter.label,
                icon: filter.icon,
                remove: () => removeFilter(filter.id)
              },
              filter.id
            );
            if (filter.type === "minRating" || filter.type === "starRating") {
              const currentRating = (_a = filter.numericValue) != null ? _a : Number(filter.value);
              if (!Number.isFinite(currentRating)) {
                return renderStandardChip();
              }
              return /* @__PURE__ */ jsx9(
                MinRatingFilterChip,
                {
                  star: filter.type === "starRating",
                  rating: currentRating,
                  onChange: (nextRating) => {
                    patchFilter(filter.id, {
                      numericValue: nextRating,
                      value: String(nextRating)
                    });
                  },
                  onRemove: () => removeFilter(filter.id)
                },
                filter.id
              );
            }
            if (filter.type === "priceRange" && filter.priceRange) {
              return /* @__PURE__ */ jsx9(
                PriceRangeFilterChip,
                {
                  priceRange: filter.priceRange,
                  currency,
                  onChange: (nextRange) => {
                    patchFilter(filter.id, { priceRange: nextRange });
                  },
                  onRemove: () => removeFilter(filter.id)
                },
                filter.id
              );
            }
            if (filter.type === "transformed_query") {
              return /* @__PURE__ */ jsx9(
                TransformedQueryChip,
                {
                  value: filter.value,
                  onChange: (nextValue) => {
                    patchFilter(filter.id, { value: nextValue });
                  },
                  onRemove: () => removeFilter(filter.id)
                },
                filter.id
              );
            }
            if (filter.type === "selected_restaurant_price_levels") {
              return /* @__PURE__ */ jsx9(
                RestaurantPriceLevelChip,
                {
                  values: (_b = filter.priceLevels) != null ? _b : [],
                  onChange: (nextLevels) => {
                    patchFilter(filter.id, { priceLevels: nextLevels });
                  },
                  onRemove: () => removeFilter(filter.id)
                },
                filter.id
              );
            }
            return renderStandardChip();
          }),
          /* @__PURE__ */ jsx9(
            "button",
            {
              style: {
                flexShrink: 0,
                padding: "4px 16px",
                borderRadius: "9999px",
                cursor: "pointer",
                fontSize: "14px",
                userSelect: "none",
                backgroundColor: clearHover ? "#eee" : "white",
                color: "black",
                border: "1px solid #03852e"
              },
              onClick: onClearAll,
              onMouseEnter: () => setClearHover(true),
              onMouseLeave: () => setClearHover(false),
              children: clearAllLabel
            }
          )
        ]
      }
    ),
    !atStart && /* @__PURE__ */ jsx9(
      "div",
      {
        "aria-hidden": "true",
        style: {
          ...gradientStyles,
          left: 0,
          background: "linear-gradient(to right, white, transparent)"
        }
      }
    ),
    !atEnd && /* @__PURE__ */ jsx9(
      "div",
      {
        "aria-hidden": "true",
        style: {
          ...gradientStyles,
          right: 0,
          background: "linear-gradient(to left, white, transparent)"
        }
      }
    ),
    !atStart && /* @__PURE__ */ jsx9(
      "button",
      {
        type: "button",
        "aria-label": previousFiltersLabel,
        style: {
          ...navButtonStyles,
          left: "4px",
          transform: "translateY(-50%) rotate(180deg)",
          backgroundColor: navHover === "prev" ? "#e5e5e5" : "white"
        },
        onClick: () => scrollByDir("prev"),
        onMouseEnter: () => setNavHover("prev"),
        onMouseLeave: () => setNavHover(null),
        children: /* @__PURE__ */ jsx9(NextIcon, { style: { width: "20px", height: "20px" } })
      }
    ),
    !atEnd && /* @__PURE__ */ jsx9(
      "button",
      {
        type: "button",
        "aria-label": nextFiltersLabel,
        style: {
          ...navButtonStyles,
          right: "4px",
          backgroundColor: navHover === "next" ? "#e5e5e5" : "white"
        },
        onClick: () => scrollByDir("next"),
        onMouseEnter: () => setNavHover("next"),
        onMouseLeave: () => setNavHover(null),
        children: /* @__PURE__ */ jsx9(NextIcon, { style: { width: "20px", height: "20px" } })
      }
    )
  ] });
};

// src/components/SmartFilter.tsx
import { jsx as jsx10 } from "react/jsx-runtime";
var containerStyles2 = {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  width: "100%"
};
var SmartFilter = ({
  filters,
  isSearching = false,
  onFilterChange,
  customTranslations,
  currency = "USD",
  containerStyle,
  style
}) => {
  const { t, formatCurrency } = useTranslation(customTranslations);
  const minRatingSuffix = t("smartFilter.minRating.suffix");
  const previousFiltersLabel = t("smartFilter.nav.previous");
  const nextFiltersLabel = t("smartFilter.nav.next");
  const clearAllLabel = t("smartFilter.clearAll");
  const handleFilterChange = useCallback3(
    async (nextFilters, clearAll) => {
      if (isSearching) {
        return;
      }
      try {
        await onFilterChange(nextFilters);
      } catch (error) {
        console.error("Filter change error:", error);
      }
    },
    [isSearching, onFilterChange]
  );
  const resetFilters = useCallback3(() => {
    void handleFilterChange([]);
  }, [handleFilterChange]);
  const clearAllFilters = useCallback3(() => {
    void handleFilterChange([], true);
  }, [handleFilterChange]);
  return /* @__PURE__ */ jsx10("div", { style: { ...containerStyles2, ...containerStyle, ...style }, children: filters.length > 0 && /* @__PURE__ */ jsx10(
    FilterChips,
    {
      filters,
      currency,
      minRatingSuffix,
      clearAllLabel,
      previousFiltersLabel,
      nextFiltersLabel,
      formatCurrency,
      onFilterChange: handleFilterChange,
      onResetFilters: resetFilters,
      onClearAll: clearAllFilters
    }
  ) });
};

// src/index.tsx
function forwardCallback(optionsRef, key, ...args) {
  var _a;
  const callback = (_a = optionsRef.current.callbacks) == null ? void 0 : _a[key];
  callback == null ? void 0 : callback(...args);
}
function attachMapOnce(instanceRef, attachedRef, map, config) {
  if (!instanceRef.current || !map || attachedRef.current) {
    return;
  }
  instanceRef.current.attachMap(map, config);
  attachedRef.current = true;
}
function useMapFirst(options) {
  const optionsRef = React6.useRef(options);
  React6.useEffect(() => {
    optionsRef.current = options;
  });
  const callbacksRef = React6.useRef({});
  const instanceRef = React6.useRef(null);
  if (instanceRef.current === null) {
    instanceRef.current = new MapFirstCore({
      adapter: null,
      ...optionsRef.current,
      callbacks: callbacksRef.current
    });
  }
  const [state, setState] = React6.useState(
    () => instanceRef.current.getState()
  );
  React6.useEffect(() => {
    if (!instanceRef.current) {
      callbacksRef.current = {};
      instanceRef.current = new MapFirstCore({
        adapter: null,
        ...optionsRef.current,
        callbacks: callbacksRef.current
      });
      setState(instanceRef.current.getState());
      mapLibreAttachedRef.current = false;
      googleMapsAttachedRef.current = false;
      mapboxAttachedRef.current = false;
    }
    const cb = callbacksRef.current;
    cb.onPropertiesChange = (properties) => {
      setState((prev) => ({ ...prev, properties }));
      forwardCallback(optionsRef, "onPropertiesChange", properties);
    };
    cb.onSelectedPropertyChange = (id) => {
      setState((prev) => ({ ...prev, selectedPropertyId: id }));
      forwardCallback(optionsRef, "onSelectedPropertyChange", id);
    };
    cb.onPrimaryTypeChange = (type) => {
      setState((prev) => ({ ...prev, primary: type }));
      forwardCallback(optionsRef, "onPrimaryTypeChange", type);
    };
    cb.onFiltersChange = (filters) => {
      setState((prev) => ({ ...prev, filters }));
      forwardCallback(optionsRef, "onFiltersChange", filters);
    };
    cb.onBoundsChange = (bounds) => {
      setState((prev) => ({ ...prev, bounds }));
      forwardCallback(optionsRef, "onBoundsChange", bounds);
    };
    cb.onPendingBoundsChange = (pendingBounds) => {
      setState((prev) => ({ ...prev, pendingBounds }));
      forwardCallback(optionsRef, "onPendingBoundsChange", pendingBounds);
    };
    cb.onCenterChange = (center, zoom) => {
      setState((prev) => ({ ...prev, center, zoom }));
      forwardCallback(optionsRef, "onCenterChange", center, zoom);
    };
    cb.onZoomChange = (zoom) => {
      setState((prev) => ({ ...prev, zoom }));
      forwardCallback(optionsRef, "onZoomChange", zoom);
    };
    cb.onActiveLocationChange = (location) => {
      setState((prev) => ({ ...prev, activeLocation: location }));
      forwardCallback(optionsRef, "onActiveLocationChange", location);
    };
    cb.onLoadingStateChange = (loading) => {
      setState((prev) => ({ ...prev, initialLoading: loading }));
      forwardCallback(optionsRef, "onLoadingStateChange", loading);
    };
    cb.onSearchingStateChange = (searching) => {
      setState((prev) => ({ ...prev, isSearching: searching }));
      forwardCallback(optionsRef, "onSearchingStateChange", searching);
    };
    cb.onFirstCallDoneChange = (firstCallDone) => {
      setState((prev) => ({ ...prev, firstCallDone }));
      forwardCallback(optionsRef, "onFirstCallDoneChange", firstCallDone);
    };
    cb.onIsFlyToAnimatingChange = (animating) => {
      setState((prev) => ({ ...prev, isFlyToAnimating: animating }));
      forwardCallback(optionsRef, "onIsFlyToAnimatingChange", animating);
    };
    cb.onError = (error, context) => {
      forwardCallback(optionsRef, "onError", error, context);
    };
    return () => {
      var _a;
      const existingCb = callbacksRef.current;
      Object.keys(existingCb).forEach(
        (k) => delete existingCb[k]
      );
      (_a = instanceRef.current) == null ? void 0 : _a.destroy();
      instanceRef.current = null;
    };
  }, []);
  const setPrimaryType = React6.useCallback((type) => {
    if (instanceRef.current) {
      instanceRef.current.setPrimaryType(type);
    }
  }, []);
  const setSelectedMarker = React6.useCallback((id) => {
    if (instanceRef.current) {
      instanceRef.current.setSelectedMarker(id);
    }
  }, []);
  const setUseApi = React6.useCallback(
    (useApi, autoLoad = true) => {
      if (instanceRef.current) {
        instanceRef.current.setUseApi(useApi, autoLoad);
      }
    },
    []
  );
  const propertiesSearch = React6.useCallback(
    async (options2) => {
      if (!instanceRef.current) {
        throw new Error("MapFirst instance not available");
      }
      return await instanceRef.current.runPropertiesSearch(options2);
    },
    []
  );
  const smartFilterSearch = React6.useCallback(
    async (options2) => {
      if (!instanceRef.current) {
        throw new Error("MapFirst instance not available");
      }
      return await instanceRef.current.runSmartFilterSearch(options2);
    },
    []
  );
  const boundsSearch = React6.useCallback(async () => {
    if (!instanceRef.current) {
      return null;
    }
    return await instanceRef.current.performBoundsSearch();
  }, []);
  const mapLibreAttachedRef = React6.useRef(false);
  const attachMapLibre = React6.useCallback(
    (map, maplibregl, options2) => {
      attachMapOnce(instanceRef, mapLibreAttachedRef, map, {
        platform: "maplibre",
        maplibregl,
        onMarkerClick: options2 == null ? void 0 : options2.onMarkerClick,
        markerOptions: options2 == null ? void 0 : options2.markerOptions
      });
    },
    []
  );
  const googleMapsAttachedRef = React6.useRef(false);
  const attachGoogle = React6.useCallback(
    (map, google, options2) => {
      attachMapOnce(instanceRef, googleMapsAttachedRef, map, {
        platform: "google",
        google,
        onMarkerClick: options2 == null ? void 0 : options2.onMarkerClick,
        markerOptions: options2 == null ? void 0 : options2.markerOptions
      });
    },
    []
  );
  const mapboxAttachedRef = React6.useRef(false);
  const attachMapbox = React6.useCallback(
    (map, mapboxgl, options2) => {
      attachMapOnce(instanceRef, mapboxAttachedRef, map, {
        platform: "mapbox",
        mapboxgl,
        onMarkerClick: options2 == null ? void 0 : options2.onMarkerClick,
        markerOptions: options2 == null ? void 0 : options2.markerOptions
      });
    },
    []
  );
  const leafletAttachedRef = React6.useRef(false);
  const attachLeaflet = React6.useCallback(
    (map, leaflet, options2) => {
      if (!instanceRef.current || !map || leafletAttachedRef.current) return;
      const adapter = new LeafletAdapter(map);
      adapter.initialize({
        leaflet,
        onMarkerClick: (marker) => {
          var _a, _b, _c, _d, _e, _f;
          if (marker.location) {
            (_a = instanceRef.current) == null ? void 0 : _a.flyMapTo(
              marker.location.lon,
              marker.location.lat,
              14
            );
          }
          if (marker.type !== ((_b = instanceRef.current) == null ? void 0 : _b.primaryType)) {
            (_c = instanceRef.current) == null ? void 0 : _c.setPrimaryType(marker.type);
          }
          (_e = instanceRef.current) == null ? void 0 : _e.setSelectedMarker(
            marker.tripadvisor_id === ((_d = instanceRef.current) == null ? void 0 : _d.selectedMarkerId) ? null : marker.tripadvisor_id
          );
          (_f = options2 == null ? void 0 : options2.onMarkerClick) == null ? void 0 : _f.call(options2, marker);
        },
        markerOptions: options2 == null ? void 0 : options2.markerOptions,
        onRefresh: () => {
          var _a;
          return (_a = instanceRef.current) == null ? void 0 : _a.refresh();
        },
        onMapMoveEnd: (bounds) => {
          var _a;
          return (_a = instanceRef.current) == null ? void 0 : _a.setBounds(bounds);
        }
      });
      instanceRef.current.adapter = adapter;
      instanceRef.current.isMapAttached = true;
      instanceRef.current.currentPlatform = "leaflet";
      instanceRef.current.refresh();
      leafletAttachedRef.current = true;
    },
    []
  );
  return {
    instance: instanceRef.current,
    state,
    setPrimaryType,
    setSelectedMarker,
    setUseApi,
    propertiesSearch,
    smartFilterSearch,
    boundsSearch,
    attachMapLibre,
    attachGoogle,
    attachMapbox,
    attachLeaflet
  };
}
export {
  Chip,
  CloseIcon,
  EditIcon,
  FilterChips,
  LeafletAdapter2 as LeafletAdapter,
  MapFirstCore2 as MapFirstCore,
  MinRatingFilterChip,
  NextIcon,
  PriceRangeFilterChip,
  PropertiesFetchError,
  RestaurantPriceLevelChip,
  SearchIcon,
  SmartFilter,
  StarIcon,
  TransformedQueryChip,
  convertToApiFilters,
  createMinRatingFilterLabel,
  createPriceRangeFilterLabel,
  fetchImages,
  fetchProperties,
  formatRatingValue,
  isWebGLSupported,
  processApiFilters,
  renderStars,
  useFilterScroll,
  useMapFirst,
  useTranslation
};
