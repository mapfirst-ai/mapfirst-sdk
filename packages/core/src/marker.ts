import type { Property } from ".";
import { fetchImages } from ".";
import "./markers.css";
import { ClusterDisplayItem } from "./utils/clustering";
import {
  LOADING_SPINNER_HTML,
  getPrimaryMarkerPillClass,
  getPrimaryMarkerZIndex,
} from "./marker-style-utils";

const AWARD_SVG = `<svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M12 3.953a7.442 7.442 0 1 0 .001 14.884A7.442 7.442 0 0 0 12 3.953m0 14.05a6.61 6.61 0 1 1 0-13.218 6.61 6.61 0 0 1 0 13.219M10.343 11.9a.91.91 0 1 1-1.821 0 .91.91 0 0 1 1.821 0m5.134 0a.91.91 0 1 1-1.821 0 .91.91 0 0 1 1.82 0m.82-1.897.84-.913h-1.863A5.8 5.8 0 0 0 12 8.08a5.77 5.77 0 0 0-3.27 1.008H6.862l.84.913a2.567 2.567 0 1 0 3.475 3.78l.823.896.823-.895a2.568 2.568 0 1 0 3.474-3.78m-6.865 3.634a1.738 1.738 0 1 1 0-3.476 1.738 1.738 0 0 1 0 3.476M12 11.85c0-1.143-.832-2.124-1.929-2.543A5 5 0 0 1 12 8.92a5 5 0 0 1 1.928.386c-1.096.42-1.927 1.4-1.927 2.543m2.566 1.787a1.738 1.738 0 1 1 .001-3.476 1.738 1.738 0 0 1 0 3.476m-8.456 3.719s-.377-.946-1.396-1.903c-1.02-.957-2.303-1.132-2.303-1.132s.457 1.02 1.54 2.04c1.086 1.017 2.159.995 2.159.995m2.568 1.41s-.524-.511-1.479-.883-1.861-.191-1.861-.191.598.54 1.615.935c1.016.397 1.725.139 1.725.139m2.493.505s-.545-.224-1.357-.196-1.415.47-1.415.47.608.222 1.473.193 1.3-.467 1.3-.467m-6.186-4.203s-.175-1.008-.974-2.154c-.8-1.147-2.015-1.578-2.015-1.578s.238 1.098 1.089 2.319c.85 1.22 1.9 1.413 1.9 1.413m-1.003-3.071s.195-1.021-.134-2.393c-.328-1.371-1.294-2.21-1.294-2.21s-.17 1.128.18 2.589c.35 1.46 1.248 2.014 1.248 2.014"></path><path d="M17.887 17.355s.377-.946 1.396-1.903c1.02-.957 2.303-1.132 2.303-1.132s-.457 1.02-1.54 2.04c-1.086 1.017-2.159.995-2.159.995m-2.567 1.41s.524-.511 1.479-.883 1.861-.191 1.861-.191-.598.54-1.615.935c-1.016.397-1.725.139-1.725.139m-2.493.505s.545-.224 1.357-.196 1.415.47 1.415.47-.608.222-1.473.193-1.3-.467-1.3-.467m6.186-4.203s.175-1.008.974-2.154c.8-1.147 2.015-1.578 2.015-1.578s-.238 1.098-1.089 2.319c-.85 1.22-1.9 1.413-1.9 1.413m1.003-3.071s-.195-1.021.133-2.393c.33-1.371 1.293-2.21 1.293-2.21s.17 1.128-.18 2.589c-.349 1.46-1.246 2.014-1.246 2.014M12 20.047a.413.413 0 1 0 0-.827.413.413 0 0 0 0 .827"></path></svg>`;

const AWARD_BACK_SVG = `<svg viewBox="0 0 24 24" width="32" height="32"><path d="M12 3.953a7.442 7.442 0 1 0 .001 14.884A7.442 7.442 0 0 0 12 3.953m0 14.05a6.61 6.61 0 1 1 0-13.218 6.61 6.61 0 0 1 0 13.219M10.343 11.9a.91.91 0 1 1-1.821 0 .91.91 0 0 1 1.821 0m5.134 0a.91.91 0 1 1-1.821 0 .91.91 0 0 1 1.82 0m.82-1.897.84-.913h-1.863A5.8 5.8 0 0 0 12 8.08a5.77 5.77 0 0 0-3.27 1.008H6.862l.84.913a2.567 2.567 0 1 0 3.475 3.78l.823.896.823-.895a2.568 2.568 0 1 0 3.474-3.78m-6.865 3.634a1.738 1.738 0 1 1 0-3.476 1.738 1.738 0 0 1 0 3.476M12 11.85c0-1.143-.832-2.124-1.929-2.543A5 5 0 0 1 12 8.92a5 5 0 0 1 1.928.386c-1.096.42-1.927 1.4-1.927 2.543m2.566 1.787a1.738 1.738 0 1 1 .001-3.476 1.738 1.738 0 0 1 0 3.476m-8.456 3.719s-.377-.946-1.396-1.903c-1.02-.957-2.303-1.132-2.303-1.132s.457 1.02 1.54 2.04c1.086 1.017 2.159.995 2.159.995m2.568 1.41s-.524-.511-1.479-.883-1.861-.191-1.861-.191.598.54 1.615.935c1.016.397 1.725.139 1.725.139m2.493.505s-.545-.224-1.357-.196-1.415.47-1.415.47.608.222 1.473.193 1.3-.467 1.3-.467m-6.186-4.203s-.175-1.008-.974-2.154c-.8-1.147-2.015-1.578-2.015-1.578s.238 1.098 1.089 2.319c.85 1.22 1.9 1.413 1.9 1.413m-1.003-3.071s.195-1.021-.134-2.393c-.328-1.371-1.294-2.21-1.294-2.21s-.17 1.128.18 2.589c.35 1.46 1.248 2.014 1.248 2.014"></path><path d="M17.887 17.355s.377-.946 1.396-1.903c1.02-.957 2.303-1.132 2.303-1.132s-.457 1.02-1.54 2.04c-1.086 1.017-2.159.995-2.159.995m-2.567 1.41s.524-.511 1.479-.883 1.861-.191 1.861-.191-.598.54-1.615.935c-1.016.397-1.725.139-1.725.139m-2.493.505s.545-.224 1.357-.196 1.415.47 1.415.47-.608.222-1.473.193-1.3-.467-1.3-.467m6.186-4.203s.175-1.008.974-2.154c.8-1.147 2.015-1.578 2.015-1.578s-.238 1.098-1.089 2.319c-.85 1.22-1.9 1.413-1.9 1.413m1.003-3.071s-.195-1.021.133-2.393c.33-1.371 1.293-2.21 1.293-2.21s.17 1.128-.18 2.589c-.349 1.46-1.246 2.014-1.246 2.014M12 20.047a.413.413 0 1 0 0-.827.413.413 0 0 0 0 .827"></path></svg>`;

const EAT_DRINK_SVG = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.051 6.549v.003l1.134 1.14 3.241-3.25.003-.002 1.134 1.136-3.243 3.252 1.134 1.14a1 1 0 0 0 .09-.008c.293-.05.573-.324.72-.474l.005-.006 2.596-2.603L22 8.016l-2.597 2.604a3.73 3.73 0 0 1-1.982 1.015 4.3 4.3 0 0 1-3.162-.657l-.023-.016-.026-.018-1.366 1.407 8.509 8.512L20.219 22l-.002-.002-6.654-6.663-2.597 2.76-7.3-7.315C1.967 8.948 1.531 6.274 2.524 4.198c.241-.504.566-.973.978-1.386l8.154 8.416 1.418-1.423-.039-.045c-.858-1.002-1.048-2.368-.62-3.595a4.15 4.15 0 0 1 .983-1.561L16 2l1.135 1.138-2.598 2.602-.047.045c-.16.151-.394.374-.433.678zM3.809 5.523c-.362 1.319-.037 2.905 1.06 4.103L10.93 15.7l1.408-1.496zM2.205 20.697 3.34 21.84l4.543-4.552-1.135-1.143z"/></svg>`;

const ATTRACTION_SVG = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.56 7.5H3.75a.25.25 0 0 0-.25.25v10c0 .138.112.25.25.25h16.5a.25.25 0 0 0 .25-.25v-10a.25.25 0 0 0-.25-.25h-3.81l-2-2H9.56zM8.94 4h6.12l2 2h3.19c.966 0 1.75.784 1.75 1.75v10a1.75 1.75 0 0 1-1.75 1.75H3.75A1.75 1.75 0 0 1 2 17.75v-10C2 6.784 2.784 6 3.75 6h3.19z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M12 9.25a2.75 2.75 0 1 0 0 5.5 2.75 2.75 0 0 0 0-5.5M7.75 12a4.25 4.25 0 1 1 8.5 0 4.25 4.25 0 0 1-8.5 0"/></svg>`;

const STAR_BASE_STYLE =
  "display:inline-block;width:8px;height:8px;border:1px solid #03852e;border-radius:9999px;";
const STAR_HALF_STYLE = "linear-gradient(90deg, #03852e 50%, transparent 50%)";
type CardStarKind = "full" | "half" | "empty";
const STAR_KIND_CACHE = new Map<string, CardStarKind[]>();

export function setupHoverCard(
  root: HTMLElement,
  pill: HTMLElement,
  marker: Property,
  isSelected: boolean,
) {
  // Check if hover card is already set up
  if (root.dataset.hasHoverCard === "true") return;
  root.dataset.hasHoverCard = "true";

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
        // Load image when card is shown
        loadCardImage(propertyCard, marker);
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

function getDefaultImageForType(type: string): string {
  const normalizedType = type
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/&/g, "");
  return `https://api.mapfirst.ai/static/images/${normalizedType}.webp`;
}

function createPropertyCard(marker: Property): HTMLElement {
  const url = marker.pricing?.offer?.clickUrl ?? marker.url;
  const rating = marker.rating || 0;
  const reviews = marker.reviews || 0;
  const displayPrice =
    marker.pricing?.offer?.displayPrice ?? marker.price_level;
  const defaultImageUrl = getDefaultImageForType(marker.type);

  const card = document.createElement(url ? "a" : "div");
  card.className = "mapfirst-property-hover-card";
  card.setAttribute("data-marker-id", marker.tripadvisor_id.toString());

  if (url) {
    (card as HTMLAnchorElement).href = url;
    (card as HTMLAnchorElement).target = "_blank";
  }

  const imageContainer = document.createElement("div");
  imageContainer.className =
    "mapfirst-property-hover-image mapfirst-property-hover-image-placeholder";
  imageContainer.dataset.tripadvisorId = marker.tripadvisor_id.toString();
  imageContainer.dataset.defaultImage = defaultImageUrl;

  const details = document.createElement("div");
  details.className = "mapfirst-property-hover-details";

  const name = document.createElement("div");
  name.className = "mapfirst-property-hover-name";
  name.textContent = marker.name ?? "";

  const ratingContainer = document.createElement("div");
  ratingContainer.className = "mapfirst-property-hover-rating";

  const ratingValue = document.createElement("span");
  ratingValue.className = "rating-value";
  ratingValue.textContent = rating.toFixed(1);

  const stars = document.createElement("span");
  stars.className = "stars";
  stars.appendChild(renderCardStars(rating));

  const reviewsText = document.createElement("span");
  reviewsText.className = "reviews";
  reviewsText.textContent = `(${reviews})`;

  ratingContainer.append(ratingValue, stars, reviewsText);
  details.append(name, ratingContainer);

  if (marker.type === "Accommodation" && displayPrice) {
    const price = document.createElement("div");
    price.className = "mapfirst-property-hover-price";
    price.append("Starting at ");
    const strong = document.createElement("strong");
    strong.textContent = displayPrice;
    price.appendChild(strong);
    details.appendChild(price);
  }

  if (url) {
    const learnMore = document.createElement("span");
    learnMore.className = "mapfirst-property-hover-learn-more";
    learnMore.textContent = "Learn More";
    details.appendChild(learnMore);
  }

  card.append(imageContainer, details);

  return card;
}

function renderCardStars(rating: number): DocumentFragment {
  const fragment = document.createDocumentFragment();
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const cacheKey = `${fullStars}:${hasHalfStar}`;
  const cached = STAR_KIND_CACHE.get(cacheKey);
  if (cached) {
    for (const star of cached) {
      fragment.appendChild(createCardStar(star));
    }
    return fragment;
  }

  const stars: CardStarKind[] = [];
  for (let i = 0; i < fullStars; i += 1) {
    stars.push("full");
  }
  if (hasHalfStar) {
    stars.push("half");
  }
  const remainingStars = 5 - Math.ceil(rating);
  for (let i = 0; i < remainingStars; i += 1) {
    stars.push("empty");
  }

  STAR_KIND_CACHE.set(cacheKey, stars);
  for (const star of stars) {
    fragment.appendChild(createCardStar(star));
  }
  return fragment;
}

function createCardStar(kind: CardStarKind): HTMLElement {
  const star = document.createElement("span");
  star.style.cssText = STAR_BASE_STYLE;

  if (kind === "full") {
    star.style.backgroundColor = "#03852e";
  } else if (kind === "half") {
    star.style.background = STAR_HALF_STYLE;
  }

  return star;
}

function loadCardImage(card: HTMLElement, marker: Property) {
  const imgContainer = card.querySelector(
    ".mapfirst-property-hover-image",
  ) as HTMLElement;

  // Check if image was already loaded
  if (
    imgContainer &&
    marker.tripadvisor_id &&
    !imgContainer.dataset.imageLoaded
  ) {
    imgContainer.dataset.imageLoaded = "loading";
    const defaultImageUrl = imgContainer.dataset.defaultImage;

    fetchImages(marker.tripadvisor_id, 1)
      .then((imageUrl) => {
        if (imageUrl && imgContainer) {
          setCardImage(imgContainer, imageUrl, marker.name);
          imgContainer.classList.remove(
            "mapfirst-property-hover-image-placeholder",
          );
          imgContainer.dataset.imageLoaded = "true";
        } else {
          throw new Error("No image URL");
        }
      })
      .catch(() => {
        // Load default type-based image on error
        if (defaultImageUrl && imgContainer) {
          setCardImage(imgContainer, defaultImageUrl, marker.name);
          imgContainer.classList.remove(
            "mapfirst-property-hover-image-placeholder",
          );
          imgContainer.dataset.imageLoaded = "false";
        }
      });
  }
}

function setCardImage(
  container: HTMLElement,
  imageUrl: string,
  alt: string | undefined,
) {
  const img = document.createElement("img");
  img.src = imageUrl;
  img.alt = alt ?? "";
  img.style.width = "100%";
  img.style.height = "100%";
  img.style.objectFit = "cover";

  container.innerHTML = "";
  container.appendChild(img);
}

function positionCard(
  card: HTMLElement,
  markerElement: HTMLElement,
  mapContainer: HTMLElement,
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

export type MarkerOptions = {
  showLabel?: boolean;
  hideBadge?: boolean;
  showTail?: boolean;
  hideNonPrimary?: boolean;
  disableHoverCard?: boolean;
  /** URL of a custom badge image to show on Accommodation markers (takes priority over awards/rating). */
  badgeImageUrl?: string;
};

export function createPrimaryMarkerElement(
  item: Extract<ClusterDisplayItem, { kind: "primary" }>,
  primaryType: string,
  selectedMarkerId: number | null,
  onMarkerClick?: (marker: Property) => void,
  markerOptions?: MarkerOptions,
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
  const selectedAward = marker.awards?.length
    ? [...marker.awards].sort((a, b) => {
        if ((b.year ?? 0) !== (a.year ?? 0)) {
          return (b.year ?? 0) - (a.year ?? 0);
        }
        const aIsCertificate = a.type === "Certificate of Excellence" ? 0 : 1;
        const bIsCertificate = b.type === "Certificate of Excellence" ? 0 : 1;
        return aIsCertificate - bIsCertificate;
      })[0]
    : undefined;

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
  if (markerOptions?.showTail && isPrimaryType) {
    root.classList.add("mapfirst-marker-has-tail");
  }
  root.style.zIndex = String(getPrimaryMarkerZIndex(isPrimaryType, isSelected));

  // Get URL for the marker
  const markerUrl = markerOptions?.disableHoverCard
    ? undefined
    : (marker.pricing?.offer?.clickUrl ?? marker.url);

  const pill = document.createElement(markerUrl ? "a" : "div");
  if (markerUrl) {
    (pill as HTMLAnchorElement).href = markerUrl;
    (pill as HTMLAnchorElement).target = "_blank";
    pill.style.textDecoration = "none";
  }
  pill.className = getPrimaryMarkerPillClass(
    isPending,
    isPrimaryType,
    isSelected,
  );
  pill.dataset.type = marker.type ?? "";
  if (markerOptions?.showTail && isPrimaryType && !isPending) {
    pill.classList.add("mapfirst-marker-tail");
  }
  // pill.title = marker.name ?? String(marker.tripadvisor_id);

  // Badge: custom image > awards > rating
  if (!isPending && !markerOptions?.hideBadge) {
    if (markerOptions?.badgeImageUrl && isAccommodation) {
      const badge = document.createElement("div");
      badge.className = "mapfirst-marker-badge";
      if (!isPrimaryType) {
        badge.style.opacity = "0.2";
      }
      const img = document.createElement("img");
      img.src = markerOptions.badgeImageUrl;
      img.alt = "Award";
      img.className = "mapfirst-marker-badge-img";
      badge.appendChild(img);
      pill.appendChild(badge);
    } else if (marker.awards?.length || ratingLabel) {
      const badge = document.createElement("div");
      badge.className = "mapfirst-marker-badge";
      if (!isPrimaryType) {
        badge.style.opacity = "0.2";
      }

      if (selectedAward?.type) {
        const awardContainer = document.createElement("div");
        awardContainer.className = "mapfirst-marker-award-container";

        const backLayer = document.createElement("div");
        backLayer.className = "mapfirst-marker-award-back";
        backLayer.innerHTML = AWARD_BACK_SVG;

        const colorDot = document.createElement("div");
        const awardTypeKey =
          selectedAward.type === "Certificate of Excellence" ? "1" : "0";
        colorDot.className = `mapfirst-marker-award-dot mapfirst-marker-award-dot-type-${awardTypeKey}`;

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
  }

  // Content
  const content = document.createElement("span");
  content.className = "mapfirst-marker-content";
  if (isAccommodation) {
    if (marker.pricing?.offer?.displayPrice) {
      content.innerHTML = marker.pricing.offer.displayPrice;
      content.dataset.price = marker.pricing.offer.displayPrice;
    } else {
      content.innerHTML = LOADING_SPINNER_HTML;
      content.dataset.price = "";
    }
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
  if (!isPending && !markerOptions?.disableHoverCard) {
    setupHoverCard(root, pill, marker, isSelected);
  }

  root.appendChild(pill);

  // Optional label: hotel name + rating to the right of the pill
  if (markerOptions?.showLabel && isPrimaryType && !isPending) {
    const label = document.createElement("div");
    label.className = "mapfirst-marker-label";

    const nameLine = document.createElement("div");
    nameLine.className = "mapfirst-marker-label-name";
    nameLine.textContent = marker.name ?? "";

    label.appendChild(nameLine);

    if (ratingLabel) {
      const ratingLine = document.createElement("div");
      ratingLine.className = "mapfirst-marker-label-rating";
      const reviewCount =
        typeof marker.reviews === "number"
          ? marker.reviews.toLocaleString()
          : "";
      ratingLine.textContent = reviewCount
        ? `${ratingLabel} • (${reviewCount})`
        : ratingLabel;
      label.appendChild(ratingLine);
    }

    pill.appendChild(label);
  }

  return root;
}
