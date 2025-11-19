/**
 * Utility functions to update marker DOM elements without recreating them
 */

/**
 * Updates the z-index and CSS classes of a primary marker element
 */
export function updatePrimaryMarkerElement(
  element: HTMLElement,
  isPrimaryType: boolean,
  isSelected: boolean,
  isPending: boolean
) {
  // Update root z-index
  const root = element;
  root.style.zIndex = isSelected ? "20" : isPrimaryType ? "12" : "11";

  // Update pill classes
  const pill = root.querySelector(".mapfirst-marker-pill");
  if (pill) {
    if (isPending) {
      pill.className = "mapfirst-marker-pill mapfirst-marker-pill-pending";
    } else {
      pill.className = `mapfirst-marker-pill mapfirst-marker-pill-active${
        isSelected
          ? " mapfirst-marker-selected"
          : !isPrimaryType
          ? " mapfirst-marker-non-primary"
          : ""
      }`;
    }
  }

  // Update badge opacity for non-primary markers
  const badge = root.querySelector(".mapfirst-marker-badge");
  if (badge instanceof HTMLElement) {
    badge.style.opacity = !isPrimaryType && !isSelected ? "0.2" : "";
  }
}

/**
 * Updates the z-index and CSS classes of a dot marker element
 */
export function updateDotMarkerElement(
  element: HTMLElement,
  isPrimaryType: boolean,
  isSelected: boolean,
  isPending: boolean
) {
  // Update container z-index
  const container = element;
  container.style.zIndex = isSelected ? "20" : isPrimaryType ? "3" : "1";

  // Update button classes
  const button = container.querySelector(".mapfirst-dot-marker-button");
  if (button) {
    if (isPending) {
      button.className =
        "mapfirst-dot-marker-button mapfirst-dot-marker-button-pending";
    } else {
      button.className = `mapfirst-dot-marker-button mapfirst-dot-marker-button-active${
        isSelected
          ? " mapfirst-dot-marker-selected"
          : !isPrimaryType
          ? " mapfirst-dot-marker-non-primary"
          : ""
      }`;
    }
  }
}

/**
 * Extracts the tripadvisor_id from a marker key
 */
export function extractMarkerIdFromKey(key: string): number | null {
  const match = key.match(/^(?:primary|dot)-(\d+)-/);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Extracts the state flags from a marker key
 */
export function extractStateFromKey(key: string): {
  isPrimary: boolean;
  isSelected: boolean;
} {
  const match = key.match(/-p([01])-s([01])$/);
  if (!match) {
    return { isPrimary: true, isSelected: false };
  }
  return {
    isPrimary: match[1] === "1",
    isSelected: match[2] === "1",
  };
}
