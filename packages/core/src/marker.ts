import type { Property } from ".";
import "./markers.css";
import { ClusterDisplayItem } from "./utils/clustering";

const AWARD_SVG = `<svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M12 3.953a7.442 7.442 0 1 0 .001 14.884A7.442 7.442 0 0 0 12 3.953m0 14.05a6.61 6.61 0 1 1 0-13.218 6.61 6.61 0 0 1 0 13.219M10.343 11.9a.91.91 0 1 1-1.821 0 .91.91 0 0 1 1.821 0m5.134 0a.91.91 0 1 1-1.821 0 .91.91 0 0 1 1.82 0m.82-1.897.84-.913h-1.863A5.8 5.8 0 0 0 12 8.08a5.77 5.77 0 0 0-3.27 1.008H6.862l.84.913a2.567 2.567 0 1 0 3.475 3.78l.823.896.823-.895a2.568 2.568 0 1 0 3.474-3.78m-6.865 3.634a1.738 1.738 0 1 1 0-3.476 1.738 1.738 0 0 1 0 3.476M12 11.85c0-1.143-.832-2.124-1.929-2.543A5 5 0 0 1 12 8.92a5 5 0 0 1 1.928.386c-1.096.42-1.927 1.4-1.927 2.543m2.566 1.787a1.738 1.738 0 1 1 .001-3.476 1.738 1.738 0 0 1 0 3.476m-8.456 3.719s-.377-.946-1.396-1.903c-1.02-.957-2.303-1.132-2.303-1.132s.457 1.02 1.54 2.04c1.086 1.017 2.159.995 2.159.995m2.568 1.41s-.524-.511-1.479-.883-1.861-.191-1.861-.191.598.54 1.615.935c1.016.397 1.725.139 1.725.139m2.493.505s-.545-.224-1.357-.196-1.415.47-1.415.47.608.222 1.473.193 1.3-.467 1.3-.467m-6.186-4.203s-.175-1.008-.974-2.154c-.8-1.147-2.015-1.578-2.015-1.578s.238 1.098 1.089 2.319c.85 1.22 1.9 1.413 1.9 1.413m-1.003-3.071s.195-1.021-.134-2.393c-.328-1.371-1.294-2.21-1.294-2.21s-.17 1.128.18 2.589c.35 1.46 1.248 2.014 1.248 2.014"></path><path d="M17.887 17.355s.377-.946 1.396-1.903c1.02-.957 2.303-1.132 2.303-1.132s-.457 1.02-1.54 2.04c-1.086 1.017-2.159.995-2.159.995m-2.567 1.41s.524-.511 1.479-.883 1.861-.191 1.861-.191-.598.54-1.615.935c-1.016.397-1.725.139-1.725.139m-2.493.505s.545-.224 1.357-.196 1.415.47 1.415.47-.608.222-1.473.193-1.3-.467-1.3-.467m6.186-4.203s.175-1.008.974-2.154c.8-1.147 2.015-1.578 2.015-1.578s-.238 1.098-1.089 2.319c-.85 1.22-1.9 1.413-1.9 1.413m1.003-3.071s-.195-1.021.133-2.393c.33-1.371 1.293-2.21 1.293-2.21s.17 1.128-.18 2.589c-.349 1.46-1.246 2.014-1.246 2.014M12 20.047a.413.413 0 1 0 0-.827.413.413 0 0 0 0 .827"></path></svg>`;

const AWARD_BACK_SVG = `<svg viewBox="0 0 24 24" width="32" height="32"><path d="M12 3.953a7.442 7.442 0 1 0 .001 14.884A7.442 7.442 0 0 0 12 3.953m0 14.05a6.61 6.61 0 1 1 0-13.218 6.61 6.61 0 0 1 0 13.219M10.343 11.9a.91.91 0 1 1-1.821 0 .91.91 0 0 1 1.821 0m5.134 0a.91.91 0 1 1-1.821 0 .91.91 0 0 1 1.82 0m.82-1.897.84-.913h-1.863A5.8 5.8 0 0 0 12 8.08a5.77 5.77 0 0 0-3.27 1.008H6.862l.84.913a2.567 2.567 0 1 0 3.475 3.78l.823.896.823-.895a2.568 2.568 0 1 0 3.474-3.78m-6.865 3.634a1.738 1.738 0 1 1 0-3.476 1.738 1.738 0 0 1 0 3.476M12 11.85c0-1.143-.832-2.124-1.929-2.543A5 5 0 0 1 12 8.92a5 5 0 0 1 1.928.386c-1.096.42-1.927 1.4-1.927 2.543m2.566 1.787a1.738 1.738 0 1 1 .001-3.476 1.738 1.738 0 0 1 0 3.476m-8.456 3.719s-.377-.946-1.396-1.903c-1.02-.957-2.303-1.132-2.303-1.132s.457 1.02 1.54 2.04c1.086 1.017 2.159.995 2.159.995m2.568 1.41s-.524-.511-1.479-.883-1.861-.191-1.861-.191.598.54 1.615.935c1.016.397 1.725.139 1.725.139m2.493.505s-.545-.224-1.357-.196-1.415.47-1.415.47.608.222 1.473.193 1.3-.467 1.3-.467m-6.186-4.203s-.175-1.008-.974-2.154c-.8-1.147-2.015-1.578-2.015-1.578s.238 1.098 1.089 2.319c.85 1.22 1.9 1.413 1.9 1.413m-1.003-3.071s.195-1.021-.134-2.393c-.328-1.371-1.294-2.21-1.294-2.21s-.17 1.128.18 2.589c.35 1.46 1.248 2.014 1.248 2.014"></path><path d="M17.887 17.355s.377-.946 1.396-1.903c1.02-.957 2.303-1.132 2.303-1.132s-.457 1.02-1.54 2.04c-1.086 1.017-2.159.995-2.159.995m-2.567 1.41s.524-.511 1.479-.883 1.861-.191 1.861-.191-.598.54-1.615.935c-1.016.397-1.725.139-1.725.139m-2.493.505s.545-.224 1.357-.196 1.415.47 1.415.47-.608.222-1.473.193-1.3-.467-1.3-.467m6.186-4.203s.175-1.008.974-2.154c.8-1.147 2.015-1.578 2.015-1.578s-.238 1.098-1.089 2.319c-.85 1.22-1.9 1.413-1.9 1.413m1.003-3.071s-.195-1.021.133-2.393c.33-1.371 1.293-2.21 1.293-2.21s.17 1.128-.18 2.589c-.349 1.46-1.246 2.014-1.246 2.014M12 20.047a.413.413 0 1 0 0-.827.413.413 0 0 0 0 .827"></path></svg>`;

const EAT_DRINK_SVG = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.051 6.549v.003l1.134 1.14 3.241-3.25.003-.002 1.134 1.136-3.243 3.252 1.134 1.14a1 1 0 0 0 .09-.008c.293-.05.573-.324.72-.474l.005-.006 2.596-2.603L22 8.016l-2.597 2.604a3.73 3.73 0 0 1-1.982 1.015 4.3 4.3 0 0 1-3.162-.657l-.023-.016-.026-.018-1.366 1.407 8.509 8.512L20.219 22l-.002-.002-6.654-6.663-2.597 2.76-7.3-7.315C1.967 8.948 1.531 6.274 2.524 4.198c.241-.504.566-.973.978-1.386l8.154 8.416 1.418-1.423-.039-.045c-.858-1.002-1.048-2.368-.62-3.595a4.15 4.15 0 0 1 .983-1.561L16 2l1.135 1.138-2.598 2.602-.047.045c-.16.151-.394.374-.433.678zM3.809 5.523c-.362 1.319-.037 2.905 1.06 4.103L10.93 15.7l1.408-1.496zM2.205 20.697 3.34 21.84l4.543-4.552-1.135-1.143z"/></svg>`;

const ATTRACTION_SVG = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.56 7.5H3.75a.25.25 0 0 0-.25.25v10c0 .138.112.25.25.25h16.5a.25.25 0 0 0 .25-.25v-10a.25.25 0 0 0-.25-.25h-3.81l-2-2H9.56zM8.94 4h6.12l2 2h3.19c.966 0 1.75.784 1.75 1.75v10a1.75 1.75 0 0 1-1.75 1.75H3.75A1.75 1.75 0 0 1 2 17.75v-10C2 6.784 2.784 6 3.75 6h3.19z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M12 9.25a2.75 2.75 0 1 0 0 5.5 2.75 2.75 0 0 0 0-5.5M7.75 12a4.25 4.25 0 1 1 8.5 0 4.25 4.25 0 0 1-8.5 0"/></svg>`;

function getDefaultImageForType(type: string): string {
  const normalizedType = type
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/&/g, "");
  return `/img/${normalizedType}.webp`;
}

function createPropertyCard(marker: Property): HTMLElement {
  const card = document.createElement("div");
  card.className = "mapfirst-property-hover-card";

  const rating = marker.rating || 0;
  const reviews = marker.reviews || 0;
  const displayPrice =
    marker.pricing?.offer?.displayPrice ?? marker.price_level;
  const url = marker.pricing?.offer?.clickUrl ?? marker.urls?.tripadvisor.main;

  // Generate star rating
  const renderStars = () => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(`<span style="color: #03852e">●</span>`);
    }
    if (hasHalfStar) {
      stars.push(`<span style="color: #03852e">◐</span>`);
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(`<span style="color: #ccc">○</span>`);
    }
    return stars.join("");
  };

  const imageUrl = getDefaultImageForType(marker.type);

  card.innerHTML = `
    <img 
      src="${imageUrl}" 
      alt="${marker.name}"
      onerror="this.src='/images/placeholder.jpg'"
    />
    <div class="mapfirst-property-hover-details">
      <div class="mapfirst-property-hover-name">${marker.name}</div>
      <div class="mapfirst-property-hover-rating">
        <span class="rating-value">${rating.toFixed(1)}</span>
        <span class="stars">${renderStars()}</span>
        <span class="reviews">(${reviews})</span>
      </div>
      ${
        marker.type === "Accommodation" && displayPrice
          ? `
        <div class="mapfirst-property-hover-price">
          Starting at <strong>${displayPrice}</strong>
        </div>
      `
          : ""
      }
      ${
        url
          ? `
        <a
          href="${url}"
          target="_blank"
          rel="noopener noreferrer"
          class="mapfirst-property-hover-learn-more"
        >
          Learn More
        </a>
      `
          : ""
      }
    </div>
  `;

  return card;
}

function positionCard(
  card: HTMLElement,
  markerElement: HTMLElement,
  mapContainer: HTMLElement
) {
  // Get marker position and dimensions
  const markerRect = markerElement.getBoundingClientRect();
  const containerRect = mapContainer.getBoundingClientRect();

  const cardWidth = 270; // Fixed card width
  const cardHeight = 120; // Approximate card height
  const offset = 12; // Gap between marker and card

  // Calculate available space on each side
  const spaceRight = containerRect.right - markerRect.right;
  const spaceLeft = markerRect.left - containerRect.left;
  const spaceBottom = containerRect.bottom - markerRect.bottom;
  const spaceTop = markerRect.top - containerRect.top;

  // Default position: bottom center
  let left =
    markerRect.left - containerRect.left + markerRect.width / 2 - cardWidth / 2;
  let top = markerRect.top - containerRect.top + markerRect.height + offset;

  // Horizontal adjustment if card would overflow
  if (left < 0) {
    left = 8; // Small margin from left edge
  } else if (left + cardWidth > containerRect.width) {
    left = containerRect.width - cardWidth - 8; // Small margin from right edge
  }

  // Vertical adjustment if not enough space below
  if (spaceBottom < cardHeight + offset && spaceTop > spaceBottom) {
    // Position above if more space above
    top = markerRect.top - containerRect.top - cardHeight - offset;
  }

  card.style.left = `${left}px`;
  card.style.top = `${top}px`;
}

export function createPrimaryMarkerElement(
  item: Extract<ClusterDisplayItem, { kind: "primary" }>,
  primaryType: string,
  selectedMarkerId: number | null,
  onMarkerClick?: (marker: Property) => void
) {
  if (typeof document === "undefined") {
    return null;
  }

  const marker = item.marker;
  const isPrimaryType = marker.type === primaryType;
  const isSelected = selectedMarkerId === marker.tripadvisor_id;
  const isAccommodation = marker.type === "Accommodation";
  const hasPrice = marker.pricing?.offer?.displayPrice;
  const isPending = isAccommodation && !hasPrice;

  // Rating
  const ratingLabel = (() => {
    if (marker.rating === undefined || marker.rating === null) return null;
    const numeric =
      typeof marker.rating === "number" ? marker.rating : Number(marker.rating);
    if (Number.isNaN(numeric) || numeric <= 0) return null;
    return numeric.toFixed(1);
  })();

  const root = document.createElement("div");
  root.className = "mapfirst-marker-root";
  root.style.zIndex = isSelected ? "20" : isPrimaryType ? "12" : "11";

  const pill = document.createElement("div");
  pill.className = isPending
    ? "mapfirst-marker-pill mapfirst-marker-pill-pending"
    : `mapfirst-marker-pill mapfirst-marker-pill-active${
        isSelected
          ? " mapfirst-marker-selected"
          : !isPrimaryType
          ? " mapfirst-marker-non-primary"
          : ""
      }`;
  // pill.title = marker.name ?? String(marker.tripadvisor_id);

  // Awards or Rating badge
  if (!isPending && (marker.awards?.length || ratingLabel)) {
    const badge = document.createElement("div");
    badge.className = "mapfirst-marker-badge";
    if (!isPrimaryType) {
      badge.style.opacity = "0.2";
    }
    badge.className = "mapfirst-marker-badge";

    if (marker.awards?.length && marker.awards[0].type) {
      const awardContainer = document.createElement("div");
      awardContainer.className = "mapfirst-marker-award-container";

      const backLayer = document.createElement("div");
      backLayer.className = "mapfirst-marker-award-back";
      backLayer.innerHTML = AWARD_BACK_SVG;

      const colorDot = document.createElement("div");
      colorDot.className = `mapfirst-marker-award-dot mapfirst-marker-award-dot-type-${marker.awards[0].type}`;

      const frontLayer = document.createElement("div");
      frontLayer.className = "mapfirst-marker-award-front";
      frontLayer.innerHTML = AWARD_SVG;

      awardContainer.appendChild(backLayer);
      awardContainer.appendChild(colorDot);
      awardContainer.appendChild(frontLayer);
      badge.appendChild(awardContainer);
    } else if (ratingLabel) {
      badge.className = "mapfirst-marker-badge mapfirst-marker-rating-badge";
      badge.textContent = ratingLabel;
    }

    pill.appendChild(badge);
  }

  // Content
  const content = document.createElement("span");
  content.className = "mapfirst-marker-content";
  if (isAccommodation) {
    content.textContent = marker.pricing?.offer?.displayPrice ?? "—";
  } else if (marker.type === "Eat & Drink") {
    content.innerHTML = EAT_DRINK_SVG;
  } else if (marker.type === "Attraction") {
    content.innerHTML = ATTRACTION_SVG;
  }
  pill.appendChild(content);

  pill.addEventListener("click", (evt) => {
    evt.stopPropagation();
    if (!isPending) {
      onMarkerClick?.(marker);
    }
  });

  // Add hover card
  if (!isPending) {
    const propertyCard = createPropertyCard(marker);
    let hoverTimeout: ReturnType<typeof setTimeout> | null = null;
    let hideTimeout: ReturnType<typeof setTimeout> | null = null;
    let positionUpdateFrame: number | null = null;

    const cleanupCard = () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        hoverTimeout = null;
      }
      if (hideTimeout) {
        clearTimeout(hideTimeout);
        hideTimeout = null;
      }
      if (positionUpdateFrame) {
        cancelAnimationFrame(positionUpdateFrame);
        positionUpdateFrame = null;
      }
      if (propertyCard.parentElement) {
        propertyCard.remove();
      }
    };

    const updateCardPosition = () => {
      if (propertyCard.parentElement) {
        let mapContainer = root.parentElement;
        while (
          mapContainer &&
          getComputedStyle(mapContainer).position === "static"
        ) {
          mapContainer = mapContainer.parentElement;
        }

        if (mapContainer) {
          positionCard(propertyCard, root, mapContainer);
          positionUpdateFrame = requestAnimationFrame(updateCardPosition);
        }
      }
    };

    const showCard = (immediate = false) => {
      if (hideTimeout) {
        clearTimeout(hideTimeout);
        hideTimeout = null;
      }

      const doShow = () => {
        // Find map container
        let mapContainer = root.parentElement;
        while (
          mapContainer &&
          getComputedStyle(mapContainer).position === "static"
        ) {
          mapContainer = mapContainer.parentElement;
        }

        if (mapContainer) {
          mapContainer.appendChild(propertyCard);
          positionCard(propertyCard, root, mapContainer);
          // Start continuous position updates
          positionUpdateFrame = requestAnimationFrame(updateCardPosition);
        }
      };

      if (immediate) {
        doShow();
      } else {
        hoverTimeout = setTimeout(doShow, 300); // Delay to avoid showing on quick hovers
      }
    };

    const hideCard = () => {
      // Don't hide if marker is selected
      if (isSelected) return;

      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        hoverTimeout = null;
      }
      if (positionUpdateFrame) {
        cancelAnimationFrame(positionUpdateFrame);
        positionUpdateFrame = null;
      }
      hideTimeout = setTimeout(() => {
        if (propertyCard.parentElement) {
          propertyCard.remove();
        }
      }, 100); // Small delay to allow mouse to enter card
    };

    // Show card immediately if marker is selected
    if (isSelected) {
      showCard(true);
    }

    pill.addEventListener("mouseenter", () => showCard(false));
    pill.addEventListener("mouseleave", hideCard);

    // Keep card visible when hovering over it
    propertyCard.addEventListener("mouseenter", () => {
      if (hideTimeout) {
        clearTimeout(hideTimeout);
        hideTimeout = null;
      }
      // Resume position updates if stopped
      if (!positionUpdateFrame && propertyCard.parentElement) {
        positionUpdateFrame = requestAnimationFrame(updateCardPosition);
      }
    });

    propertyCard.addEventListener("mouseleave", hideCard);

    // Cleanup card when marker is removed from DOM
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const removedNode of mutation.removedNodes) {
          if (removedNode === root || removedNode.contains(root)) {
            cleanupCard();
            observer.disconnect();
            return;
          }
        }
      }
    });

    // Start observing when the root is added to the DOM
    if (root.parentElement) {
      observer.observe(root.parentElement, { childList: true, subtree: true });
    } else {
      // If not yet in DOM, wait for it
      const checkParent = setInterval(() => {
        if (root.parentElement) {
          observer.observe(root.parentElement, {
            childList: true,
            subtree: true,
          });
          clearInterval(checkParent);
        }
      }, 100);
    }
  }

  root.appendChild(pill);
  return root;
}
