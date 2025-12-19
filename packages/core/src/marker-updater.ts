import type { Property } from "./types";
import { setupHoverCard } from "./marker";

const LOADING_VIDEO_HTML = `<video class="mapfirst-marker-loading-video" src="https://api.mapfirst.ai/static/images/loading.webm" autoplay loop muted></video>`;

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
  isPending: boolean,
  marker?: Property
) {
  const wasPending =
    element
      .querySelector(".mapfirst-marker-pill")
      ?.classList.contains("mapfirst-marker-pill-pending") ?? false;
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

  // If transitioning from pending to non-pending, setup hover card
  if (wasPending && !isPending && marker) {
    const pill = root.querySelector(".mapfirst-marker-pill");
    if (pill instanceof HTMLElement) {
      setupHoverCard(root, pill, marker, isSelected);
    }
  }

  // Update content (price) if marker data is provided
  if (marker && marker.type === "Accommodation") {
    const content = root.querySelector(".mapfirst-marker-content");
    if (content instanceof HTMLElement) {
      const displayPrice = marker.pricing?.offer?.displayPrice;
      const currentPrice = content.dataset.price;

      // Only update if price has changed
      if (currentPrice !== displayPrice) {
        if (displayPrice) {
          content.innerHTML = displayPrice;
          content.dataset.price = displayPrice;
        } else {
          content.innerHTML = LOADING_VIDEO_HTML;
          content.dataset.price = "";
        }
      }
    }
  }

  // Update hover card content if it exists
  if (marker) {
    const hoverCard = document.querySelector(
      `.mapfirst-property-hover-card[data-marker-id="${marker.tripadvisor_id}"]`
    );
    if (hoverCard) {
      const rating = marker.rating || 0;
      const reviews = marker.reviews || 0;
      const displayPrice =
        marker.pricing?.offer?.displayPrice ?? marker.price_level;

      const ratingValueEl = hoverCard.querySelector(".rating-value");
      if (ratingValueEl) {
        const newRating = rating.toFixed(1);
        if (ratingValueEl.textContent !== newRating) {
          ratingValueEl.textContent = newRating;
        }
      }

      const reviewsEl = hoverCard.querySelector(".reviews");
      if (reviewsEl) {
        const newReviews = `(${reviews})`;
        if (reviewsEl.textContent !== newReviews) {
          reviewsEl.textContent = newReviews;
        }
      }

      if (marker.type === "Accommodation" && displayPrice) {
        let priceEl = hoverCard.querySelector(".mapfirst-property-hover-price");
        if (!priceEl) {
          // Create price element if it doesn't exist
          priceEl = document.createElement("div");
          priceEl.className = "mapfirst-property-hover-price";
          const detailsEl = hoverCard.querySelector(
            ".mapfirst-property-hover-details"
          );
          const learnMoreEl = hoverCard.querySelector(
            ".mapfirst-property-hover-learn-more"
          );
          if (detailsEl) {
            if (learnMoreEl) {
              detailsEl.insertBefore(priceEl, learnMoreEl);
            } else {
              detailsEl.appendChild(priceEl);
            }
          }
        }
        if (priceEl) {
          const newPriceHtml = `Starting at <strong>${displayPrice}</strong>`;
          if (priceEl.innerHTML !== newPriceHtml) {
            priceEl.innerHTML = newPriceHtml;
          }
        }
      }

      // Update click URL if provided
      const url = marker.pricing?.offer?.clickUrl ?? marker.url;
      if (
        url &&
        hoverCard instanceof HTMLAnchorElement &&
        hoverCard.href !== url
      ) {
        hoverCard.href = url;
      }
    }
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
