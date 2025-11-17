import type { ClusterDisplayItem, Property } from ".";

export function createDotMarkerElement(
  item: Extract<ClusterDisplayItem, { kind: "dot" }>,
  onMarkerClick?: (marker: Property) => void
) {
  if (typeof document === "undefined") {
    return null;
  }
  const button = document.createElement("button");
  button.type = "button";
  button.style.width = "14px";
  button.style.height = "14px";
  button.style.borderRadius = "999px";
  button.style.border = "2px solid #ffffff";
  button.style.background = "#012b11";
  button.style.boxShadow = "0 6px 16px rgba(15, 23, 42, 0.4)";
  button.style.cursor = "pointer";
  button.title = item.marker.name ?? String(item.marker.tripadvisor_id);

  button.addEventListener("click", (evt) => {
    evt.stopPropagation();
    onMarkerClick?.(item.marker);
  });

  return button;
}
