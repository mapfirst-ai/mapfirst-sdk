import type { Property } from ".";
import "./markers.css";
import { ClusterDisplayItem } from "./utils/clustering";

export function createDotMarkerElement(
  item: Extract<ClusterDisplayItem, { kind: "dot" }>,
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
  const isPending =
    isAccommodation && marker.pricing?.offer?.availability !== "available";

  // Create container div to match primary marker structure
  const container = document.createElement("div");
  container.className = "mapfirst-dot-marker-container";
  container.style.zIndex = isSelected ? "20" : isPrimaryType ? "3" : "1";

  const button = document.createElement("div");
  button.className = isPending
    ? "mapfirst-dot-marker-button mapfirst-dot-marker-button-pending"
    : `mapfirst-dot-marker-button mapfirst-dot-marker-button-active${
        isSelected
          ? " mapfirst-dot-marker-selected"
          : !isPrimaryType
          ? " mapfirst-dot-marker-non-primary"
          : ""
      }`;
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
