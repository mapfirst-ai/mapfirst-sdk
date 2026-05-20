import type { Property } from ".";
import "./markers.css";
import { ClusterDisplayItem } from "./utils/clustering";
import { setupHoverCard, type MarkerOptions } from "./marker";
import {
  getDotMarkerButtonClass,
  getDotMarkerZIndex,
} from "./marker-style-utils";

export function createDotMarkerElement(
  item: Extract<ClusterDisplayItem, { kind: "dot" }>,
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
  const isPending =
    isAccommodation && marker.pricing?.offer?.availability !== "available";

  // Create container div to match primary marker structure
  const container = document.createElement("div");
  container.className = "mapfirst-dot-marker-container";
  container.style.zIndex = String(
    getDotMarkerZIndex(isPrimaryType, isSelected),
  );

  const button = document.createElement("div");
  button.className = getDotMarkerButtonClass(
    isPending,
    isPrimaryType,
    isSelected,
  );
  button.title = marker.name ?? String(marker.tripadvisor_id);

  button.addEventListener("click", (evt) => {
    evt.stopPropagation();
    if (!isPending) {
      onMarkerClick?.(marker);
    }
  });

  container.appendChild(button);

  // Add hover card for non-pending markers
  if (!isPending && !markerOptions?.disableHoverCard) {
    setupHoverCard(container, button, marker, isSelected);
  }

  return container;
}
