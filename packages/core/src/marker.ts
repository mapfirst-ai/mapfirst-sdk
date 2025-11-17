import type { ClusterDisplayItem, Property } from ".";

export function createPrimaryMarkerElement(
  item: Extract<ClusterDisplayItem, { kind: "primary" }>,
  onMarkerClick?: (marker: Property) => void
) {
  if (typeof document === "undefined") {
    return null;
  }
  const root = document.createElement("div");
  root.style.display = "flex";
  root.style.flexDirection = "column";
  root.style.alignItems = "center";
  root.style.pointerEvents = "auto";

  const pill = document.createElement("button");
  pill.type = "button";
  pill.style.background = "#012b11";
  pill.style.color = "#ffffff";
  pill.style.border = "none";
  pill.style.borderRadius = "999px";
  pill.style.padding = "6px 12px";
  pill.style.fontSize = "12px";
  pill.style.fontWeight = "600";
  pill.style.fontFamily = "system-ui, -apple-system, sans-serif";
  pill.style.boxShadow = "0 15px 30px rgba(15, 23, 42, 0.45)";
  pill.style.cursor = "pointer";
  pill.style.display = "flex";
  pill.style.flexDirection = "column";
  pill.style.gap = "2px";
  pill.style.whiteSpace = "nowrap";
  pill.style.overflow = "hidden";
  pill.style.textOverflow = "ellipsis";
  pill.style.zIndex = "2";
  pill.title = item.marker.name ?? String(item.marker.tripadvisor_id);

  const title = document.createElement("span");
  title.textContent = item.marker.pricing?.offer?.displayPrice ?? "No Price";
  title.style.textAlign = "left";
  pill.appendChild(title);

  //   if (subtitle) {
  //     const subtitleEl = document.createElement("span");
  //     subtitleEl.textContent = subtitle;
  //     subtitleEl.style.fontSize = "11px";
  //     subtitleEl.style.fontWeight = "500";
  //     subtitleEl.style.opacity = "0.85";
  //     subtitleEl.style.textAlign = "left";
  //     pill.appendChild(subtitleEl);
  //   }

  pill.addEventListener("click", (evt) => {
    evt.stopPropagation();
    onMarkerClick?.(item.marker);
  });

  const pointer = document.createElement("span");
  pointer.style.width = "0";
  pointer.style.height = "0";
  pointer.style.borderLeft = "6px solid transparent";
  pointer.style.borderRight = "6px solid transparent";
  pointer.style.borderTop = `8px solid #012b11`;
  pointer.style.marginTop = "4px";

  root.appendChild(pill);
  root.appendChild(pointer);
  return root;
}
