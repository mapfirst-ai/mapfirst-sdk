import "./markers.css";

/**
 * Creates a blue dot marker element for user's current location
 */
export function createUserLocationMarkerElement(): HTMLElement {
  if (typeof document === "undefined") {
    throw new Error(
      "createUserLocationMarkerElement requires a DOM environment",
    );
  }

  const container = document.createElement("div");
  container.className = "mapfirst-user-location-marker-container";
  container.style.zIndex = String(1000); // High z-index to stay visible

  // Blue dot SVG
  const dot = document.createElement("div");
  dot.className = "mapfirst-user-location-dot";
  dot.innerHTML = `
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Outer pulse ring -->
      <circle cx="12" cy="12" r="12" fill="#3B82F6" opacity="0.2"/>
      <!-- Middle ring -->
      <circle cx="12" cy="12" r="9" fill="#3B82F6" opacity="0.3"/>
      <!-- Inner blue dot -->
      <circle cx="12" cy="12" r="5" fill="#3B82F6"/>
      <!-- Center white dot -->
      <circle cx="12" cy="12" r="2" fill="white"/>
    </svg>
  `;

  container.appendChild(dot);
  container.style.position = "absolute";
  container.style.transform = "translate(-50%, -50%)";
  container.style.cursor = "default";

  return container;
}
