export const PRIMARY_Z_INDEX = {
  selected: 20,
  primary: 12,
  secondary: 11,
} as const;

export const DOT_Z_INDEX = {
  selected: 20,
  primary: 3,
  secondary: 1,
} as const;

export const LOADING_SPINNER_HTML = `<span class="mapfirst-marker-loading-spinner"></span>`;

export function getPrimaryMarkerZIndex(
  isPrimaryType: boolean,
  isSelected: boolean,
): number {
  if (isSelected) return PRIMARY_Z_INDEX.selected;
  return isPrimaryType ? PRIMARY_Z_INDEX.primary : PRIMARY_Z_INDEX.secondary;
}

export function getDotMarkerZIndex(
  isPrimaryType: boolean,
  isSelected: boolean,
): number {
  if (isSelected) return DOT_Z_INDEX.selected;
  return isPrimaryType ? DOT_Z_INDEX.primary : DOT_Z_INDEX.secondary;
}

export function getPrimaryMarkerPillClass(
  isPending: boolean,
  isPrimaryType: boolean,
  isSelected: boolean,
): string {
  if (isPending) {
    return "mapfirst-marker-pill mapfirst-marker-pill-pending";
  }
  return `mapfirst-marker-pill mapfirst-marker-pill-active${
    isSelected
      ? " mapfirst-marker-selected"
      : !isPrimaryType
        ? " mapfirst-marker-non-primary"
        : ""
  }`;
}

export function getDotMarkerButtonClass(
  isPending: boolean,
  isPrimaryType: boolean,
  isSelected: boolean,
): string {
  if (isPending) {
    return "mapfirst-dot-marker-button mapfirst-dot-marker-button-pending";
  }
  return `mapfirst-dot-marker-button mapfirst-dot-marker-button-active${
    isSelected
      ? " mapfirst-dot-marker-selected"
      : !isPrimaryType
        ? " mapfirst-dot-marker-non-primary"
        : ""
  }`;
}
