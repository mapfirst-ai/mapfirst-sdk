import type { ClusterDisplayItem, Property } from ".";

export function createDotMarkerElement(
  item: Extract<ClusterDisplayItem, { kind: "dot" }>,
  onMarkerClick?: (marker: Property) => void
) {
  if (typeof document === "undefined") {
    return null;
  }

  const marker = item.marker;
  const isAccommodation = marker.type === "Accommodation";
  const isPending =
    isAccommodation && marker.pricing?.offer?.availability !== "available";

  // Create container div to match primary marker structure
  const container = document.createElement("div");
  container.style.display = "flex";
  container.style.zIndex = "10";
  container.style.alignItems = "center";
  container.style.justifyContent = "center";
  container.style.pointerEvents = "auto";

  const button = document.createElement("button");
  button.type = "button";
  button.style.width = "20px";
  button.style.height = "20px";
  button.style.borderRadius = "999px";
  button.style.border = "2px solid #ffffff";
  button.style.boxShadow = "0 2px 4px rgba(107, 114, 128, 0.4)";
  button.style.transition = "transform 0.2s";
  button.style.outline = "none";
  button.style.transformOrigin = "center center";
  button.title = marker.name ?? String(marker.tripadvisor_id);

  if (isPending) {
    button.style.background = "#d1d5db"; // gray-300
    button.style.cursor = "default";
  } else {
    button.style.background = "#012b11";
    button.style.cursor = "pointer";
  }

  button.addEventListener("mouseenter", () => {
    if (!isPending) {
      button.style.transform = "scale(1.2)";
    }
  });

  button.addEventListener("mouseleave", () => {
    button.style.transform = "scale(1)";
  });

  button.addEventListener("focus", () => {
    if (!isPending) {
      button.style.outline = "2px solid #ffffff";
      button.style.outlineOffset = "2px";
    }
  });

  button.addEventListener("blur", () => {
    button.style.outline = "none";
  });

  button.addEventListener("click", (evt) => {
    evt.stopPropagation();
    if (!isPending) {
      onMarkerClick?.(marker);
    }
  });

  container.appendChild(button);
  return container;
}
