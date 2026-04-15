"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.tsx
var index_exports = {};
__export(index_exports, {
  Chip: () => Chip,
  CloseIcon: () => CloseIcon,
  EditIcon: () => EditIcon,
  FilterChips: () => FilterChips,
  MapFirstCore: () => import_core2.MapFirstCore,
  MinRatingFilterChip: () => MinRatingFilterChip,
  NextIcon: () => NextIcon,
  PriceRangeFilterChip: () => PriceRangeFilterChip,
  PropertiesFetchError: () => import_core2.PropertiesFetchError,
  RestaurantPriceLevelChip: () => RestaurantPriceLevelChip,
  SearchIcon: () => SearchIcon,
  SmartFilter: () => SmartFilter,
  StarIcon: () => StarIcon,
  TransformedQueryChip: () => TransformedQueryChip,
  convertToApiFilters: () => import_core2.convertToApiFilters,
  createMinRatingFilterLabel: () => createMinRatingFilterLabel,
  createPriceRangeFilterLabel: () => createPriceRangeFilterLabel,
  fetchImages: () => import_core2.fetchImages,
  fetchProperties: () => import_core2.fetchProperties,
  formatRatingValue: () => formatRatingValue,
  processApiFilters: () => import_core2.processApiFilters,
  renderStars: () => renderStars,
  useFilterScroll: () => useFilterScroll,
  useMapFirst: () => useMapFirst,
  useTranslation: () => useTranslation
});
module.exports = __toCommonJS(index_exports);
var import_react9 = __toESM(require("react"));
var import_core = require("@mapfirst.ai/core");
var import_core2 = require("@mapfirst.ai/core");

// src/components/SmartFilter.tsx
var import_react8 = require("react");

// src/components/smart-filter/FilterChips.tsx
var import_react7 = __toESM(require("react"));

// src/components/smart-filter/CloseButton.tsx
var import_react = __toESM(require("react"));

// src/components/Icons.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var SearchIcon = ({ className, style }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
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
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "11", cy: "11", r: "8" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m21 21-4.35-4.35" })
    ]
  }
);
var CloseIcon = ({ className, style }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
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
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
    ]
  }
);
var EditIcon = ({ className, style }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
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
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" })
    ]
  }
);
var NextIcon = ({ className, style }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
    children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", { points: "9 18 15 12 9 6" })
  }
);
var StarIcon = ({
  className,
  style,
  fill = "none"
}) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
    children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", { points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" })
  }
);

// src/components/smart-filter/CloseButton.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
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
  const [isHovering, setIsHovering] = import_react.default.useState(false);
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
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
      children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(CloseIcon, { style: iconStyles })
    }
  );
};

// src/components/smart-filter/Chip.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
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
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { ...chipStyles, ...style }, children: [
    icon && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: { display: "flex", alignItems: "center" }, children: icon }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: { whiteSpace: "nowrap" }, children: label }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(CloseButton, { onClick: remove })
  ] });
};

// src/components/smart-filter/MinRatingFilterChip.tsx
var import_react3 = require("react");

// src/hooks/useTranslation.ts
var import_react2 = require("react");
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
  const [locale, setLocale] = (0, import_react2.useState)("en");
  const translations = (0, import_react2.useMemo)(
    () => ({ ...defaultTranslations, ...customTranslations }),
    [customTranslations]
  );
  const t = (0, import_react2.useCallback)(
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
  const formatCurrency = (0, import_react2.useCallback)(
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
var import_jsx_runtime4 = require("react/jsx-runtime");
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
    stars.push(/* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { style: STAR_FULL_STYLES }, `full-${i}`));
  }
  if (hasHalfStar) {
    stars.push(/* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { style: STAR_HALF_STYLES }, "half"));
  }
  const remainingStars = Math.max(0, 5 - Math.ceil(rating));
  for (let i = 0; i < remainingStars; i += 1) {
    stars.push(/* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { style: STAR_BASE_STYLES }, `empty-${i}`));
  }
  return stars;
};
var createMinRatingFilterLabel = (rating, suffix) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { style: MIN_RATING_LABEL_STYLES, children: [
  /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { style: MIN_RATING_STARS_WRAPPER_STYLES, children: renderStars(rating) }),
  " ",
  suffix
] });
var formatRatingValue = (rating) => rating.toFixed(1);
var createPriceRangeFilterLabel = (min, max, currency, formatCurrencyFn) => `${formatCurrencyFn(min, currency)} - ${formatCurrencyFn(
  max != null ? max : 0,
  currency
)}`;

// src/components/smart-filter/MinRatingFilterChip.tsx
var import_jsx_runtime5 = require("react/jsx-runtime");
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
  const [hoverRating, setHoverRating] = (0, import_react3.useState)(null);
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
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { style: chipContainerStyles, "data-min-rating-chip": true, children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
      "div",
      {
        style: { display: "flex", alignItems: "center", gap: "4px" },
        onMouseLeave: () => setHoverRating(null),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { style: starContainerStyles, children: Array.from({ length: 5 }).map((_, index) => {
            const fillState = getFillForStar(index);
            const starNumber = index + 1;
            const halfValue = starNumber - 0.5;
            if (star) {
              return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
                "div",
                {
                  style: {
                    position: "relative",
                    width: "16px",
                    height: "16px"
                  },
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
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
                    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
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
                    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
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
            return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
              "div",
              {
                style: { position: "relative", width: "12px", height: "12px" },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                    "span",
                    {
                      style: fillState === "half" ? halfCircleStyles : circleStyles
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
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
                  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
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
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { style: { whiteSpace: "nowrap" }, children: formatLabel(displayRating) })
        ]
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(CloseButton, { onClick: onRemove })
  ] });
};

// src/components/smart-filter/PriceRangeFilterChip.tsx
var import_react4 = require("react");
var import_jsx_runtime6 = require("react/jsx-runtime");
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
  const [draft, setDraft] = (0, import_react4.useState)(
    value !== void 0 ? String(value) : ""
  );
  const [isEditing, setIsEditing] = (0, import_react4.useState)(false);
  const [editHover, setEditHover] = (0, import_react4.useState)(false);
  const hasValue = value !== void 0;
  (0, import_react4.useEffect)(() => {
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
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { style: chipStyles2, children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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
    isEditing ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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
    ) : hasValue ? /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { style: { fontSize: "16px" }, children: [
      currency,
      value
    ] }) : showAddWhenEmpty ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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
    ) : /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { style: { fontSize: "16px", color: "#737373" }, children: "-" }),
    (!showAddWhenEmpty || showAddWhenEmpty && isEditing) && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { style: { color: "#737373", fontSize: "12px" }, children: currency }),
    !isEditing && (!showAddWhenEmpty || hasValue) && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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
        children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(EditIcon, {})
      }
    ),
    showRemoveButton && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(CloseButton, { onClick: onRemove })
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
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_jsx_runtime6.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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
var import_jsx_runtime7 = require("react/jsx-runtime");
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
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { style: chipStyles3, children: [
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flexWrap: "wrap"
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
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
          /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { style: { display: "flex", gap: "12px" }, children: [
            PRICE_LEVEL_OPTIONS.map((option) => {
              const optionLabel = t(
                `smartFilter.restaurantPriceLevel.options.${option.key}`
              );
              const checkboxId = `price-level-${option.key}`;
              return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
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
                    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
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
                    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { children: optionLabel })
                  ]
                },
                option.value
              );
            }),
            values.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { style: { fontSize: "12px", color: "#737373" }, children: noneSelectedLabel })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(CloseButton, { onClick: onRemove })
  ] });
};

// src/components/smart-filter/TransformedQueryChip.tsx
var import_react5 = require("react");
var import_jsx_runtime8 = require("react/jsx-runtime");
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
  const inputRef = (0, import_react5.useRef)(null);
  const [draft, setDraft] = (0, import_react5.useState)(value);
  const [isEditing, setIsEditing] = (0, import_react5.useState)(false);
  const [editHover, setEditHover] = (0, import_react5.useState)(false);
  const { t } = useTranslation();
  const removeLabel = t("smartFilter.transformedQuery.remove");
  const editLabel = t("smartFilter.transformedQuery.edit");
  (0, import_react5.useEffect)(() => {
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
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { style: chipStyles4, children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(SearchIcon, { style: { width: "16px", height: "16px", color: "#03852e" } }),
    isEditing ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
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
    ) : /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { style: { fontSize: "16px" }, children: value }),
    !isEditing && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
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
        children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(EditIcon, {})
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(CloseButton, { onClick: onRemove })
  ] });
};

// src/hooks/useFilterScroll.ts
var import_react6 = require("react");
var useFilterScroll = (dependency) => {
  const scrollerRef = (0, import_react6.useRef)(null);
  const [atStart, setAtStart] = (0, import_react6.useState)(true);
  const [atEnd, setAtEnd] = (0, import_react6.useState)(true);
  const updateScrollButtons = (0, import_react6.useCallback)(() => {
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
  (0, import_react6.useEffect)(() => {
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
  const scrollByDir = (0, import_react6.useCallback)((dir) => {
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
var import_jsx_runtime9 = require("react/jsx-runtime");
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
  const [navHover, setNavHover] = import_react7.default.useState(null);
  const [clearHover, setClearHover] = import_react7.default.useState(false);
  const removeFilter = import_react7.default.useCallback(
    (filterId) => {
      void onFilterChange(filters.filter((f) => f.id !== filterId));
    },
    [filters, onFilterChange]
  );
  const patchFilter = import_react7.default.useCallback(
    (filterId, patch) => {
      const nextFilters = filters.map(
        (f) => f.id === filterId ? { ...f, ...patch } : f
      );
      void onFilterChange(nextFilters);
    },
    [filters, onFilterChange]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { style: containerStyles, children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
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
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("style", { children: `
            div::-webkit-scrollbar {
              display: none;
            }
          ` }),
          filters.map((filter) => {
            var _a, _b;
            const renderStandardChip = () => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
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
              return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
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
              return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
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
              return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
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
              return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
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
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
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
    !atStart && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
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
    !atEnd && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
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
    !atStart && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
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
        children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(NextIcon, { style: { width: "20px", height: "20px" } })
      }
    ),
    !atEnd && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
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
        children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(NextIcon, { style: { width: "20px", height: "20px" } })
      }
    )
  ] });
};

// src/components/SmartFilter.tsx
var import_jsx_runtime10 = require("react/jsx-runtime");
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
  const handleFilterChange = (0, import_react8.useCallback)(
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
  const resetFilters = (0, import_react8.useCallback)(() => {
    void handleFilterChange([]);
  }, [handleFilterChange]);
  const clearAllFilters = (0, import_react8.useCallback)(() => {
    void handleFilterChange([], true);
  }, [handleFilterChange]);
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { style: { ...containerStyles2, ...containerStyle, ...style }, children: filters.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
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
  const optionsRef = import_react9.default.useRef(options);
  import_react9.default.useEffect(() => {
    optionsRef.current = options;
  });
  const callbacksRef = import_react9.default.useRef({});
  const instanceRef = import_react9.default.useRef(null);
  if (instanceRef.current === null) {
    instanceRef.current = new import_core.MapFirstCore({
      adapter: null,
      ...optionsRef.current,
      callbacks: callbacksRef.current
    });
  }
  const [state, setState] = import_react9.default.useState(
    () => instanceRef.current.getState()
  );
  import_react9.default.useEffect(() => {
    if (!instanceRef.current) {
      callbacksRef.current = {};
      instanceRef.current = new import_core.MapFirstCore({
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
  const setPrimaryType = import_react9.default.useCallback((type) => {
    if (instanceRef.current) {
      instanceRef.current.setPrimaryType(type);
    }
  }, []);
  const setSelectedMarker = import_react9.default.useCallback((id) => {
    if (instanceRef.current) {
      instanceRef.current.setSelectedMarker(id);
    }
  }, []);
  const setUseApi = import_react9.default.useCallback(
    (useApi, autoLoad = true) => {
      if (instanceRef.current) {
        instanceRef.current.setUseApi(useApi, autoLoad);
      }
    },
    []
  );
  const propertiesSearch = import_react9.default.useCallback(
    async (options2) => {
      if (!instanceRef.current) {
        throw new Error("MapFirst instance not available");
      }
      return await instanceRef.current.runPropertiesSearch(options2);
    },
    []
  );
  const smartFilterSearch = import_react9.default.useCallback(
    async (options2) => {
      if (!instanceRef.current) {
        throw new Error("MapFirst instance not available");
      }
      return await instanceRef.current.runSmartFilterSearch(options2);
    },
    []
  );
  const boundsSearch = import_react9.default.useCallback(async () => {
    if (!instanceRef.current) {
      return null;
    }
    return await instanceRef.current.performBoundsSearch();
  }, []);
  const mapLibreAttachedRef = import_react9.default.useRef(false);
  const attachMapLibre = import_react9.default.useCallback(
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
  const googleMapsAttachedRef = import_react9.default.useRef(false);
  const attachGoogle = import_react9.default.useCallback(
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
  const mapboxAttachedRef = import_react9.default.useRef(false);
  const attachMapbox = import_react9.default.useCallback(
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
    attachMapbox
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Chip,
  CloseIcon,
  EditIcon,
  FilterChips,
  MapFirstCore,
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
  processApiFilters,
  renderStars,
  useFilterScroll,
  useMapFirst,
  useTranslation
});
