import type { Property } from ".";
import "./markers.css";
import { ClusterDisplayItem } from "./utils/clustering";

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
  container.className = "mapfirst-dot-marker-container";

  const button = document.createElement("button");
  button.type = "button";
  button.className = isPending
    ? "mapfirst-dot-marker-button mapfirst-dot-marker-button-pending"
    : "mapfirst-dot-marker-button mapfirst-dot-marker-button-active";
  button.title = marker.name ?? String(marker.tripadvisor_id);

  button.addEventListener("click", (evt) => {
    evt.stopPropagation();
    if (!isPending) {
      onMarkerClick?.(marker);
    }
  });

  container.appendChild(button);
  return container;
}
