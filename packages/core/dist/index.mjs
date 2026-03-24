// #style-inject:#style-inject
function styleInject(css, { insertAt } = {}) {
  if (!css || typeof document === "undefined") return;
  const head = document.head || document.getElementsByTagName("head")[0];
  const style = document.createElement("style");
  style.type = "text/css";
  if (insertAt === "top") {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

// src/markers.css
styleInject(".mapfirst-marker-root {\n  display: flex;\n  z-index: 20;\n  flex-direction: column;\n  align-items: center;\n  pointer-events: auto;\n}\n.mapfirst-marker-pill {\n  border: 2px solid;\n  border-radius: 999px;\n  padding: 8px 8px;\n  font-size: 16px;\n  font-weight: 600;\n  font-family:\n    system-ui,\n    -apple-system,\n    sans-serif;\n  box-shadow: 0 4px 6px rgba(107, 114, 128, 0.5);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  position: relative;\n  transition: transform 0.2s;\n  transform-origin: center bottom;\n}\n.mapfirst-marker-pill-pending {\n  background: rgba(255, 255, 255, 0.5);\n  backdrop-filter: blur(4px);\n  border-color: transparent;\n  cursor: default;\n}\n.mapfirst-marker-pill-active {\n  background: #012b11;\n  border-color: #ffffff;\n  color: #ffffff;\n  cursor: pointer;\n}\n.mapfirst-marker-pill-active.mapfirst-marker-non-primary {\n  background: rgba(255, 255, 255, 0.7);\n  border-color: rgba(3, 133, 46, 0.5);\n  color: rgba(3, 133, 46, 0.5);\n  padding: 4px;\n}\n.mapfirst-marker-pill-active.mapfirst-marker-selected {\n  background: #ffffff;\n  border-color: #03852e;\n  color: #03852e;\n  transform: scale(1.2);\n}\n.mapfirst-marker-pill-active:hover {\n  transform: scale(1.2);\n}\n.mapfirst-marker-badge {\n  position: absolute;\n  top: -12px;\n  right: -20px;\n}\n.mapfirst-marker-award-container {\n  position: relative;\n  width: 32px;\n  height: 32px;\n}\n.mapfirst-marker-award-back {\n  position: absolute;\n  stroke: #f5f5f5;\n  stroke-width: 2px;\n}\n.mapfirst-marker-award-dot {\n  position: absolute;\n  top: 6.2px;\n  left: 6.3px;\n  width: 18.5px;\n  height: 18.5px;\n  border-radius: 50%;\n  z-index: 1;\n}\n.mapfirst-marker-award-dot-type-0 {\n  background: #ffef0e;\n}\n.mapfirst-marker-award-dot-type-1 {\n  background: #01ea5b;\n}\n.mapfirst-marker-award-front {\n  position: relative;\n  z-index: 2;\n  color: #012b11;\n}\n.mapfirst-marker-rating-badge {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 999px;\n  background: #03852e;\n  color: #ffffff;\n  font-size: 12px;\n  line-height: 1;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);\n  padding: 2px 6px;\n  border: 2px solid #ffffff;\n  font-weight: 400;\n}\n.mapfirst-marker-content {\n  display: flex;\n  align-items: center;\n}\n.mapfirst-marker-loading-video {\n  width: 20px;\n  height: 20px;\n  display: block;\n}\n.mapfirst-dot-marker-container {\n  display: flex;\n  z-index: 10;\n  align-items: center;\n  justify-content: center;\n  pointer-events: auto;\n}\n.mapfirst-dot-marker-button {\n  width: 20px;\n  height: 20px;\n  border-radius: 999px;\n  border: 2px solid #ffffff;\n  box-shadow: 0 2px 4px rgba(107, 114, 128, 0.4);\n  transition: transform 0.2s;\n  outline: none;\n  transform-origin: center center;\n}\n.mapfirst-dot-marker-button-active {\n  background: #012b11;\n  cursor: pointer;\n}\n.mapfirst-dot-marker-button-active.mapfirst-dot-marker-non-primary {\n  background: rgba(255, 255, 255, 0.7);\n  border-color: rgba(3, 133, 46, 0.2);\n}\n.mapfirst-dot-marker-button-active.mapfirst-dot-marker-selected {\n  background: #ffffff;\n  border-color: #03852e;\n}\n.mapfirst-dot-marker-button-active:hover {\n  transform: scale(1.2);\n}\n.mapfirst-dot-marker-button-active:focus {\n  outline: 2px solid #ffffff;\n  outline-offset: 2px;\n}\n.mapfirst-dot-marker-button-pending {\n  background: #012b11;\n  animation: loading-pulse 1.5s infinite;\n}\n@keyframes loading-pulse {\n  50% {\n    opacity: 0.5;\n  }\n}\n.mapfirst-property-hover-card {\n  position: absolute;\n  width: 270px;\n  background: #ffffff;\n  border-radius: 8px;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\n  overflow: hidden;\n  display: flex;\n  pointer-events: auto;\n  z-index: 9999;\n  transition: opacity 0.2s;\n  height: 120px;\n  text-decoration: none;\n  color: inherit;\n}\n.mapfirst-property-hover-card img {\n  width: 120px;\n  height: 120px;\n  object-fit: cover;\n  flex-shrink: 0;\n}\n.mapfirst-property-hover-image {\n  width: 120px;\n  height: 120px;\n  flex-shrink: 0;\n}\n.mapfirst-property-hover-image-placeholder {\n  background-color: #e5e7eb;\n}\n.mapfirst-property-hover-details {\n  display: flex;\n  flex-direction: column;\n  padding: 8px 12px;\n  flex: 1;\n  gap: 4px;\n}\n.mapfirst-property-hover-name {\n  font-size: 12px;\n  font-weight: 600;\n  color: #1a1a1a;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  line-height: 1.3;\n}\n.mapfirst-property-hover-rating {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n  font-size: 12px;\n}\n.mapfirst-property-hover-rating .rating-value {\n  font-weight: 600;\n  color: #1a1a1a;\n}\n.mapfirst-property-hover-rating .stars {\n  display: flex;\n  gap: 1px;\n  font-size: 10px;\n  line-height: 1;\n  align-items: center;\n}\n.mapfirst-property-hover-rating .reviews {\n  color: #666;\n  font-size: 11px;\n}\n.mapfirst-property-hover-price {\n  font-size: 12px;\n  color: #666;\n  margin-top: 2px;\n}\n.mapfirst-property-hover-price strong {\n  color: #1a1a1a;\n  font-weight: 600;\n}\n.mapfirst-property-hover-learn-more {\n  font-size: 12px;\n  color: #03852e;\n  text-decoration: none;\n  font-weight: 500;\n  margin-top: auto;\n  pointer-events: auto;\n  display: inline-block;\n}\n.mapfirst-property-hover-learn-more:hover {\n  text-decoration: underline;\n}\n.mapfirst-user-location-marker-container {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  pointer-events: none;\n  z-index: 1000;\n}\n.mapfirst-user-location-dot {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.25));\n}\n.mapfirst-user-location-dot svg {\n  animation: mapfirst-location-pulse 2s infinite;\n}\n@keyframes mapfirst-location-pulse {\n  0% {\n    filter: drop-shadow(0 0 0 rgba(59, 130, 246, 0.4));\n  }\n  70% {\n    filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.4));\n  }\n  100% {\n    filter: drop-shadow(0 0 0 rgba(59, 130, 246, 0));\n  }\n}\n");

// src/marker-style-utils.ts
var PRIMARY_Z_INDEX = {
  selected: 20,
  primary: 12,
  secondary: 11
};
var DOT_Z_INDEX = {
  selected: 20,
  primary: 3,
  secondary: 1
};
var LOADING_VIDEO_HTML = `<video class="mapfirst-marker-loading-video" src="https://api.mapfirst.ai/static/images/loading.webm" autoplay loop muted></video>`;
function getPrimaryMarkerZIndex(isPrimaryType, isSelected) {
  if (isSelected) return PRIMARY_Z_INDEX.selected;
  return isPrimaryType ? PRIMARY_Z_INDEX.primary : PRIMARY_Z_INDEX.secondary;
}
function getDotMarkerZIndex(isPrimaryType, isSelected) {
  if (isSelected) return DOT_Z_INDEX.selected;
  return isPrimaryType ? DOT_Z_INDEX.primary : DOT_Z_INDEX.secondary;
}
function getPrimaryMarkerPillClass(isPending, isPrimaryType, isSelected) {
  if (isPending) {
    return "mapfirst-marker-pill mapfirst-marker-pill-pending";
  }
  return `mapfirst-marker-pill mapfirst-marker-pill-active${isSelected ? " mapfirst-marker-selected" : !isPrimaryType ? " mapfirst-marker-non-primary" : ""}`;
}
function getDotMarkerButtonClass(isPending, isPrimaryType, isSelected) {
  if (isPending) {
    return "mapfirst-dot-marker-button mapfirst-dot-marker-button-pending";
  }
  return `mapfirst-dot-marker-button mapfirst-dot-marker-button-active${isSelected ? " mapfirst-dot-marker-selected" : !isPrimaryType ? " mapfirst-dot-marker-non-primary" : ""}`;
}

// src/marker.ts
var AWARD_SVG = `<svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M12 3.953a7.442 7.442 0 1 0 .001 14.884A7.442 7.442 0 0 0 12 3.953m0 14.05a6.61 6.61 0 1 1 0-13.218 6.61 6.61 0 0 1 0 13.219M10.343 11.9a.91.91 0 1 1-1.821 0 .91.91 0 0 1 1.821 0m5.134 0a.91.91 0 1 1-1.821 0 .91.91 0 0 1 1.82 0m.82-1.897.84-.913h-1.863A5.8 5.8 0 0 0 12 8.08a5.77 5.77 0 0 0-3.27 1.008H6.862l.84.913a2.567 2.567 0 1 0 3.475 3.78l.823.896.823-.895a2.568 2.568 0 1 0 3.474-3.78m-6.865 3.634a1.738 1.738 0 1 1 0-3.476 1.738 1.738 0 0 1 0 3.476M12 11.85c0-1.143-.832-2.124-1.929-2.543A5 5 0 0 1 12 8.92a5 5 0 0 1 1.928.386c-1.096.42-1.927 1.4-1.927 2.543m2.566 1.787a1.738 1.738 0 1 1 .001-3.476 1.738 1.738 0 0 1 0 3.476m-8.456 3.719s-.377-.946-1.396-1.903c-1.02-.957-2.303-1.132-2.303-1.132s.457 1.02 1.54 2.04c1.086 1.017 2.159.995 2.159.995m2.568 1.41s-.524-.511-1.479-.883-1.861-.191-1.861-.191.598.54 1.615.935c1.016.397 1.725.139 1.725.139m2.493.505s-.545-.224-1.357-.196-1.415.47-1.415.47.608.222 1.473.193 1.3-.467 1.3-.467m-6.186-4.203s-.175-1.008-.974-2.154c-.8-1.147-2.015-1.578-2.015-1.578s.238 1.098 1.089 2.319c.85 1.22 1.9 1.413 1.9 1.413m-1.003-3.071s.195-1.021-.134-2.393c-.328-1.371-1.294-2.21-1.294-2.21s-.17 1.128.18 2.589c.35 1.46 1.248 2.014 1.248 2.014"></path><path d="M17.887 17.355s.377-.946 1.396-1.903c1.02-.957 2.303-1.132 2.303-1.132s-.457 1.02-1.54 2.04c-1.086 1.017-2.159.995-2.159.995m-2.567 1.41s.524-.511 1.479-.883 1.861-.191 1.861-.191-.598.54-1.615.935c-1.016.397-1.725.139-1.725.139m-2.493.505s.545-.224 1.357-.196 1.415.47 1.415.47-.608.222-1.473.193-1.3-.467-1.3-.467m6.186-4.203s.175-1.008.974-2.154c.8-1.147 2.015-1.578 2.015-1.578s-.238 1.098-1.089 2.319c-.85 1.22-1.9 1.413-1.9 1.413m1.003-3.071s-.195-1.021.133-2.393c.33-1.371 1.293-2.21 1.293-2.21s.17 1.128-.18 2.589c-.349 1.46-1.246 2.014-1.246 2.014M12 20.047a.413.413 0 1 0 0-.827.413.413 0 0 0 0 .827"></path></svg>`;
var AWARD_BACK_SVG = `<svg viewBox="0 0 24 24" width="32" height="32"><path d="M12 3.953a7.442 7.442 0 1 0 .001 14.884A7.442 7.442 0 0 0 12 3.953m0 14.05a6.61 6.61 0 1 1 0-13.218 6.61 6.61 0 0 1 0 13.219M10.343 11.9a.91.91 0 1 1-1.821 0 .91.91 0 0 1 1.821 0m5.134 0a.91.91 0 1 1-1.821 0 .91.91 0 0 1 1.82 0m.82-1.897.84-.913h-1.863A5.8 5.8 0 0 0 12 8.08a5.77 5.77 0 0 0-3.27 1.008H6.862l.84.913a2.567 2.567 0 1 0 3.475 3.78l.823.896.823-.895a2.568 2.568 0 1 0 3.474-3.78m-6.865 3.634a1.738 1.738 0 1 1 0-3.476 1.738 1.738 0 0 1 0 3.476M12 11.85c0-1.143-.832-2.124-1.929-2.543A5 5 0 0 1 12 8.92a5 5 0 0 1 1.928.386c-1.096.42-1.927 1.4-1.927 2.543m2.566 1.787a1.738 1.738 0 1 1 .001-3.476 1.738 1.738 0 0 1 0 3.476m-8.456 3.719s-.377-.946-1.396-1.903c-1.02-.957-2.303-1.132-2.303-1.132s.457 1.02 1.54 2.04c1.086 1.017 2.159.995 2.159.995m2.568 1.41s-.524-.511-1.479-.883-1.861-.191-1.861-.191.598.54 1.615.935c1.016.397 1.725.139 1.725.139m2.493.505s-.545-.224-1.357-.196-1.415.47-1.415.47.608.222 1.473.193 1.3-.467 1.3-.467m-6.186-4.203s-.175-1.008-.974-2.154c-.8-1.147-2.015-1.578-2.015-1.578s.238 1.098 1.089 2.319c.85 1.22 1.9 1.413 1.9 1.413m-1.003-3.071s.195-1.021-.134-2.393c-.328-1.371-1.294-2.21-1.294-2.21s-.17 1.128.18 2.589c.35 1.46 1.248 2.014 1.248 2.014"></path><path d="M17.887 17.355s.377-.946 1.396-1.903c1.02-.957 2.303-1.132 2.303-1.132s-.457 1.02-1.54 2.04c-1.086 1.017-2.159.995-2.159.995m-2.567 1.41s.524-.511 1.479-.883 1.861-.191 1.861-.191-.598.54-1.615.935c-1.016.397-1.725.139-1.725.139m-2.493.505s.545-.224 1.357-.196 1.415.47 1.415.47-.608.222-1.473.193-1.3-.467-1.3-.467m6.186-4.203s.175-1.008.974-2.154c.8-1.147 2.015-1.578 2.015-1.578s-.238 1.098-1.089 2.319c-.85 1.22-1.9 1.413-1.9 1.413m1.003-3.071s-.195-1.021.133-2.393c.33-1.371 1.293-2.21 1.293-2.21s.17 1.128-.18 2.589c-.349 1.46-1.246 2.014-1.246 2.014M12 20.047a.413.413 0 1 0 0-.827.413.413 0 0 0 0 .827"></path></svg>`;
var EAT_DRINK_SVG = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.051 6.549v.003l1.134 1.14 3.241-3.25.003-.002 1.134 1.136-3.243 3.252 1.134 1.14a1 1 0 0 0 .09-.008c.293-.05.573-.324.72-.474l.005-.006 2.596-2.603L22 8.016l-2.597 2.604a3.73 3.73 0 0 1-1.982 1.015 4.3 4.3 0 0 1-3.162-.657l-.023-.016-.026-.018-1.366 1.407 8.509 8.512L20.219 22l-.002-.002-6.654-6.663-2.597 2.76-7.3-7.315C1.967 8.948 1.531 6.274 2.524 4.198c.241-.504.566-.973.978-1.386l8.154 8.416 1.418-1.423-.039-.045c-.858-1.002-1.048-2.368-.62-3.595a4.15 4.15 0 0 1 .983-1.561L16 2l1.135 1.138-2.598 2.602-.047.045c-.16.151-.394.374-.433.678zM3.809 5.523c-.362 1.319-.037 2.905 1.06 4.103L10.93 15.7l1.408-1.496zM2.205 20.697 3.34 21.84l4.543-4.552-1.135-1.143z"/></svg>`;
var ATTRACTION_SVG = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.56 7.5H3.75a.25.25 0 0 0-.25.25v10c0 .138.112.25.25.25h16.5a.25.25 0 0 0 .25-.25v-10a.25.25 0 0 0-.25-.25h-3.81l-2-2H9.56zM8.94 4h6.12l2 2h3.19c.966 0 1.75.784 1.75 1.75v10a1.75 1.75 0 0 1-1.75 1.75H3.75A1.75 1.75 0 0 1 2 17.75v-10C2 6.784 2.784 6 3.75 6h3.19z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M12 9.25a2.75 2.75 0 1 0 0 5.5 2.75 2.75 0 0 0 0-5.5M7.75 12a4.25 4.25 0 1 1 8.5 0 4.25 4.25 0 0 1-8.5 0"/></svg>`;
var STAR_BASE_STYLE = "display:inline-block;width:8px;height:8px;border:1px solid #03852e;border-radius:9999px;";
var STAR_HALF_STYLE = "linear-gradient(90deg, #03852e 50%, transparent 50%)";
var STAR_KIND_CACHE = /* @__PURE__ */ new Map();
function setupHoverCard(root, pill, marker, isSelected) {
  if (root.dataset.hasHoverCard === "true") return;
  root.dataset.hasHoverCard = "true";
  const propertyCard = createPropertyCard(marker);
  let hoverTimeout = null;
  let hideTimeout = null;
  let positionUpdateFrame = null;
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
      while (mapContainer && getComputedStyle(mapContainer).position === "static") {
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
      let mapContainer = root.parentElement;
      while (mapContainer && getComputedStyle(mapContainer).position === "static") {
        mapContainer = mapContainer.parentElement;
      }
      if (mapContainer) {
        mapContainer.appendChild(propertyCard);
        positionCard(propertyCard, root, mapContainer);
        loadCardImage(propertyCard, marker);
        positionUpdateFrame = requestAnimationFrame(updateCardPosition);
      }
    };
    if (immediate) {
      doShow();
    } else {
      hoverTimeout = setTimeout(doShow, 300);
    }
  };
  const hideCard = () => {
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
    }, 100);
  };
  if (isSelected) {
    showCard(true);
  }
  pill.addEventListener("mouseenter", () => showCard(false));
  pill.addEventListener("mouseleave", hideCard);
  propertyCard.addEventListener("mouseenter", () => {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      hideTimeout = null;
    }
    if (!positionUpdateFrame && propertyCard.parentElement) {
      positionUpdateFrame = requestAnimationFrame(updateCardPosition);
    }
  });
  propertyCard.addEventListener("mouseleave", hideCard);
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
  if (root.parentElement) {
    observer.observe(root.parentElement, { childList: true, subtree: true });
  } else {
    const checkParent = setInterval(() => {
      if (root.parentElement) {
        observer.observe(root.parentElement, {
          childList: true,
          subtree: true
        });
        clearInterval(checkParent);
      }
    }, 100);
  }
}
function getDefaultImageForType(type) {
  const normalizedType = type.toLowerCase().replace(/\s+/g, "").replace(/&/g, "");
  return `https://api.mapfirst.ai/static/images/${normalizedType}.webp`;
}
function createPropertyCard(marker) {
  var _a, _b, _c, _d, _e, _f, _g;
  const url = (_c = (_b = (_a = marker.pricing) == null ? void 0 : _a.offer) == null ? void 0 : _b.clickUrl) != null ? _c : marker.url;
  const rating = marker.rating || 0;
  const reviews = marker.reviews || 0;
  const displayPrice = (_f = (_e = (_d = marker.pricing) == null ? void 0 : _d.offer) == null ? void 0 : _e.displayPrice) != null ? _f : marker.price_level;
  const defaultImageUrl = getDefaultImageForType(marker.type);
  const card = document.createElement(url ? "a" : "div");
  card.className = "mapfirst-property-hover-card";
  card.setAttribute("data-marker-id", marker.tripadvisor_id.toString());
  if (url) {
    card.href = url;
    card.target = "_blank";
  }
  const imageContainer = document.createElement("div");
  imageContainer.className = "mapfirst-property-hover-image mapfirst-property-hover-image-placeholder";
  imageContainer.dataset.tripadvisorId = marker.tripadvisor_id.toString();
  imageContainer.dataset.defaultImage = defaultImageUrl;
  const details = document.createElement("div");
  details.className = "mapfirst-property-hover-details";
  const name = document.createElement("div");
  name.className = "mapfirst-property-hover-name";
  name.textContent = (_g = marker.name) != null ? _g : "";
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
function renderCardStars(rating) {
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
  const stars = [];
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
function createCardStar(kind) {
  const star = document.createElement("span");
  star.style.cssText = STAR_BASE_STYLE;
  if (kind === "full") {
    star.style.backgroundColor = "#03852e";
  } else if (kind === "half") {
    star.style.background = STAR_HALF_STYLE;
  }
  return star;
}
function loadCardImage(card, marker) {
  const imgContainer = card.querySelector(
    ".mapfirst-property-hover-image"
  );
  if (imgContainer && marker.tripadvisor_id && !imgContainer.dataset.imageLoaded) {
    imgContainer.dataset.imageLoaded = "loading";
    const defaultImageUrl = imgContainer.dataset.defaultImage;
    fetchImages(marker.tripadvisor_id, 1).then((imageUrl) => {
      if (imageUrl && imgContainer) {
        setCardImage(imgContainer, imageUrl, marker.name);
        imgContainer.classList.remove(
          "mapfirst-property-hover-image-placeholder"
        );
        imgContainer.dataset.imageLoaded = "true";
      } else {
        throw new Error("No image URL");
      }
    }).catch(() => {
      if (defaultImageUrl && imgContainer) {
        setCardImage(imgContainer, defaultImageUrl, marker.name);
        imgContainer.classList.remove(
          "mapfirst-property-hover-image-placeholder"
        );
        imgContainer.dataset.imageLoaded = "false";
      }
    });
  }
}
function setCardImage(container, imageUrl, alt) {
  const img = document.createElement("img");
  img.src = imageUrl;
  img.alt = alt != null ? alt : "";
  img.style.width = "100%";
  img.style.height = "100%";
  img.style.objectFit = "cover";
  container.innerHTML = "";
  container.appendChild(img);
}
function positionCard(card, markerElement, mapContainer) {
  const markerRect = markerElement.getBoundingClientRect();
  const containerRect = mapContainer.getBoundingClientRect();
  const cardWidth = 270;
  const cardHeight = 120;
  const offset = 12;
  const spaceRight = containerRect.right - markerRect.right;
  const spaceLeft = markerRect.left - containerRect.left;
  const spaceBottom = containerRect.bottom - markerRect.bottom;
  const spaceTop = markerRect.top - containerRect.top;
  let left = markerRect.left - containerRect.left + markerRect.width / 2 - cardWidth / 2;
  let top = markerRect.top - containerRect.top + markerRect.height + offset;
  if (left < 0) {
    left = 8;
  } else if (left + cardWidth > containerRect.width) {
    left = containerRect.width - cardWidth - 8;
  }
  if (spaceBottom < cardHeight + offset && spaceTop > spaceBottom) {
    top = markerRect.top - containerRect.top - cardHeight - offset;
  }
  card.style.left = `${left}px`;
  card.style.top = `${top}px`;
}
function createPrimaryMarkerElement(item, primaryType, selectedMarkerId, onMarkerClick) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i;
  if (typeof document === "undefined") {
    return null;
  }
  const marker = item.marker;
  const isPrimaryType = marker.type === primaryType;
  const isSelected = selectedMarkerId === marker.tripadvisor_id;
  const isAccommodation = marker.type === "Accommodation";
  const hasPrice = (_b = (_a = marker.pricing) == null ? void 0 : _a.offer) == null ? void 0 : _b.displayPrice;
  const isPending = isAccommodation && !hasPrice;
  const ratingLabel = (() => {
    if (marker.rating === void 0 || marker.rating === null) return null;
    const numeric = typeof marker.rating === "number" ? marker.rating : Number(marker.rating);
    if (Number.isNaN(numeric) || numeric <= 0) return null;
    return numeric.toFixed(1);
  })();
  const root = document.createElement("div");
  root.className = "mapfirst-marker-root";
  root.style.zIndex = String(getPrimaryMarkerZIndex(isPrimaryType, isSelected));
  const markerUrl = (_e = (_d = (_c = marker.pricing) == null ? void 0 : _c.offer) == null ? void 0 : _d.clickUrl) != null ? _e : marker.url;
  const pill = document.createElement(markerUrl ? "a" : "div");
  if (markerUrl) {
    pill.href = markerUrl;
    pill.target = "_blank";
    pill.style.textDecoration = "none";
  }
  pill.className = getPrimaryMarkerPillClass(
    isPending,
    isPrimaryType,
    isSelected
  );
  if (!isPending && (((_f = marker.awards) == null ? void 0 : _f.length) || ratingLabel)) {
    const badge = document.createElement("div");
    badge.className = "mapfirst-marker-badge";
    if (!isPrimaryType) {
      badge.style.opacity = "0.2";
    }
    badge.className = "mapfirst-marker-badge";
    if (((_g = marker.awards) == null ? void 0 : _g.length) && marker.awards[0].type) {
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
  const content = document.createElement("span");
  content.className = "mapfirst-marker-content";
  if (isAccommodation) {
    if ((_i = (_h = marker.pricing) == null ? void 0 : _h.offer) == null ? void 0 : _i.displayPrice) {
      content.innerHTML = marker.pricing.offer.displayPrice;
      content.dataset.price = marker.pricing.offer.displayPrice;
    } else {
      content.innerHTML = LOADING_VIDEO_HTML;
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
      onMarkerClick == null ? void 0 : onMarkerClick(marker);
    }
  });
  if (!isPending) {
    setupHoverCard(root, pill, marker, isSelected);
  }
  root.appendChild(pill);
  return root;
}

// src/dotmarker.ts
function createDotMarkerElement(item, primaryType, selectedMarkerId, onMarkerClick) {
  var _a, _b, _c;
  if (typeof document === "undefined") {
    return null;
  }
  const marker = item.marker;
  const isPrimaryType = marker.type === primaryType;
  const isSelected = selectedMarkerId === marker.tripadvisor_id;
  const isAccommodation = marker.type === "Accommodation";
  const isPending = isAccommodation && ((_b = (_a = marker.pricing) == null ? void 0 : _a.offer) == null ? void 0 : _b.availability) !== "available";
  const container = document.createElement("div");
  container.className = "mapfirst-dot-marker-container";
  container.style.zIndex = String(getDotMarkerZIndex(isPrimaryType, isSelected));
  const button = document.createElement("div");
  button.className = getDotMarkerButtonClass(
    isPending,
    isPrimaryType,
    isSelected
  );
  button.title = (_c = marker.name) != null ? _c : String(marker.tripadvisor_id);
  button.addEventListener("click", (evt) => {
    evt.stopPropagation();
    if (!isPending) {
      onMarkerClick == null ? void 0 : onMarkerClick(marker);
    }
  });
  container.appendChild(button);
  if (!isPending) {
    setupHoverCard(container, button, marker, isSelected);
  }
  return container;
}

// src/user-location-marker.ts
function createUserLocationMarkerElement() {
  if (typeof document === "undefined") {
    throw new Error(
      "createUserLocationMarkerElement requires a DOM environment"
    );
  }
  const container = document.createElement("div");
  container.className = "mapfirst-user-location-marker-container";
  container.style.zIndex = String(1e3);
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

// src/marker-updater.ts
function updatePrimaryMarkerElement(element, isPrimaryType, isSelected, isPending, marker) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
  const wasPending = (_b = (_a = element.querySelector(".mapfirst-marker-pill")) == null ? void 0 : _a.classList.contains("mapfirst-marker-pill-pending")) != null ? _b : false;
  const root = element;
  root.style.zIndex = String(getPrimaryMarkerZIndex(isPrimaryType, isSelected));
  const pill = root.querySelector(".mapfirst-marker-pill");
  if (pill) {
    pill.className = getPrimaryMarkerPillClass(
      isPending,
      isPrimaryType,
      isSelected
    );
  }
  const badge = root.querySelector(".mapfirst-marker-badge");
  if (badge instanceof HTMLElement) {
    badge.style.opacity = !isPrimaryType && !isSelected ? "0.2" : "";
  }
  if (wasPending && !isPending && marker) {
    const pill2 = root.querySelector(".mapfirst-marker-pill");
    if (pill2 instanceof HTMLElement) {
      setupHoverCard(root, pill2, marker, isSelected);
    }
  }
  if (marker && marker.type === "Accommodation") {
    const content = root.querySelector(".mapfirst-marker-content");
    if (content instanceof HTMLElement) {
      const displayPrice = (_d = (_c = marker.pricing) == null ? void 0 : _c.offer) == null ? void 0 : _d.displayPrice;
      const currentPrice = content.dataset.price;
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
  if (marker) {
    const hoverCard = document.querySelector(
      `.mapfirst-property-hover-card[data-marker-id="${marker.tripadvisor_id}"]`
    );
    if (hoverCard) {
      const rating = marker.rating || 0;
      const reviews = marker.reviews || 0;
      const displayPrice = (_g = (_f = (_e = marker.pricing) == null ? void 0 : _e.offer) == null ? void 0 : _f.displayPrice) != null ? _g : marker.price_level;
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
      const url = (_j = (_i = (_h = marker.pricing) == null ? void 0 : _h.offer) == null ? void 0 : _i.clickUrl) != null ? _j : marker.url;
      if (url && hoverCard instanceof HTMLAnchorElement && hoverCard.href !== url) {
        hoverCard.href = url;
      }
    }
  }
}
function updateDotMarkerElement(element, isPrimaryType, isSelected, isPending) {
  const container = element;
  container.style.zIndex = String(getDotMarkerZIndex(isPrimaryType, isSelected));
  const button = container.querySelector(".mapfirst-dot-marker-button");
  if (button) {
    button.className = getDotMarkerButtonClass(
      isPending,
      isPrimaryType,
      isSelected
    );
  }
}
function extractMarkerIdFromKey(key) {
  const match = key.match(/^(?:primary|dot)-(\d+)-/);
  return match ? parseInt(match[1], 10) : null;
}

// src/adapters/markermanager.ts
var BaseMarkerManager = class {
  constructor(mapInstance, onMarkerClick) {
    this.markerCache = /* @__PURE__ */ new Map();
    this.primaryType = "Accommodation";
    this.selectedMarkerId = null;
    this.mapInstance = mapInstance;
    this.onMarkerClick = onMarkerClick;
  }
  render(items, primaryType, selectedMarkerId) {
    if (primaryType && primaryType !== this.primaryType) {
      this.primaryType = primaryType;
    }
    if (selectedMarkerId !== void 0) {
      this.selectedMarkerId = selectedMarkerId;
    }
    const newKeys = new Set(items.map((item) => item.key));
    for (const [key, entry] of this.markerCache.entries()) {
      if (!newKeys.has(key)) {
        this.removeMarkerFromMap(entry.marker);
        this.markerCache.delete(key);
      }
    }
    for (const item of items) {
      const coords = safeLatLon(item.marker.location);
      if (!coords) continue;
      const existing = this.markerCache.get(item.key);
      if (existing) {
        const displayState = this.getDisplayState(item);
        this.updateMarkerElement(existing.marker, item, displayState);
        try {
          this.updateMarkerPosition(existing.marker, coords);
        } catch {
          this.removeMarkerFromMap(existing.marker);
          this.markerCache.delete(item.key);
          this.createAndAddMarker(item, coords);
        }
      } else {
        const existingMatch = this.findMatchingMarkerEntry(item);
        const existingEntry = existingMatch == null ? void 0 : existingMatch.entry;
        const existingKey = existingMatch == null ? void 0 : existingMatch.key;
        if (existingEntry && existingKey) {
          const displayState = this.getDisplayState(item);
          this.updateMarkerElement(existingEntry.marker, item, displayState);
          this.updateMarkerZIndex(
            existingEntry.marker,
            item,
            displayState.isPrimaryType,
            displayState.isSelected
          );
          this.markerCache.delete(existingKey);
          this.markerCache.set(item.key, {
            ...existingEntry,
            key: item.key,
            parentId: item.kind === "dot" ? item.parentId : void 0
          });
          try {
            this.updateMarkerPosition(existingEntry.marker, coords);
          } catch {
          }
        } else {
          this.createAndAddMarker(item, coords);
        }
      }
    }
  }
  destroy() {
    for (const entry of this.markerCache.values()) {
      this.removeMarkerFromMap(entry.marker);
    }
    this.markerCache.clear();
  }
  createAndAddMarker(item, coords) {
    const element = item.kind === "primary" ? createPrimaryMarkerElement(
      item,
      this.primaryType,
      this.selectedMarkerId,
      this.onMarkerClick
    ) : createDotMarkerElement(
      item,
      this.primaryType,
      this.selectedMarkerId,
      this.onMarkerClick
    );
    if (!element) return;
    const displayState = this.getDisplayState(item);
    try {
      const marker = this.createMarker(
        element,
        coords,
        item,
        displayState.isPrimaryType,
        displayState.isSelected
      );
      if (marker) {
        this.markerCache.set(item.key, {
          key: item.key,
          marker,
          kind: item.kind,
          parentId: item.kind === "dot" ? item.parentId : void 0
        });
      }
    } catch (error) {
      console.error("Error creating marker", error);
    }
  }
  updateMarkerZIndex(marker, item, isPrimaryType, isSelected) {
  }
  getDisplayState(item) {
    var _a, _b, _c, _d;
    const isPrimaryType = item.marker.type === this.primaryType;
    const isSelected = this.selectedMarkerId === item.marker.tripadvisor_id;
    const isAccommodation = item.marker.type === "Accommodation";
    const isPending = item.kind === "primary" ? isAccommodation && !((_b = (_a = item.marker.pricing) == null ? void 0 : _a.offer) == null ? void 0 : _b.displayPrice) : isAccommodation && ((_d = (_c = item.marker.pricing) == null ? void 0 : _c.offer) == null ? void 0 : _d.availability) !== "available";
    return { isPrimaryType, isSelected, isPending };
  }
  updateMarkerElement(marker, item, displayState) {
    const element = this.getMarkerElement(marker);
    if (!element) {
      return;
    }
    if (item.kind === "primary") {
      updatePrimaryMarkerElement(
        element,
        displayState.isPrimaryType,
        displayState.isSelected,
        displayState.isPending,
        item.marker
      );
      return;
    }
    updateDotMarkerElement(
      element,
      displayState.isPrimaryType,
      displayState.isSelected,
      displayState.isPending
    );
  }
  findMatchingMarkerEntry(item) {
    const markerId = item.marker.tripadvisor_id;
    for (const [key, entry] of this.markerCache.entries()) {
      if (extractMarkerIdFromKey(key) === markerId && entry.kind === item.kind) {
        return { key, entry };
      }
    }
    return null;
  }
  /**
   * Update user location marker rendering
   */
  renderUserLocation(userLocation) {
    const existingKey = "__user-location__";
    const existing = this.markerCache.get(existingKey);
    if (existing) {
      this.removeMarkerFromMap(existing.marker);
      this.markerCache.delete(existingKey);
    }
    if (!userLocation) {
      return;
    }
    const element = createUserLocationMarkerElement();
    if (element) {
      try {
        const marker = this.createMarker(
          element,
          { lon: userLocation.lng, lat: userLocation.lat },
          {
            kind: "dot",
            key: existingKey,
            marker: {
              tripadvisor_id: -1,
              // Special ID for user location
              type: "Attraction",
              name: "Your Location",
              location: { lat: userLocation.lat, lon: userLocation.lng }
            }
          },
          false,
          false
        );
        if (marker) {
          this.markerCache.set(existingKey, {
            key: existingKey,
            marker,
            kind: "dot"
          });
        }
      } catch (error) {
        console.error("Error creating user location marker", error);
      }
    }
  }
};
function safeLatLon(location) {
  if (typeof (location == null ? void 0 : location.lon) !== "number" || typeof (location == null ? void 0 : location.lat) !== "number") {
    return null;
  }
  if (Number.isNaN(location.lon) || Number.isNaN(location.lat)) {
    return null;
  }
  return { lon: location.lon, lat: location.lat };
}

// src/adapters/mapgl/markermanager.ts
var BaseMapGLMarkerManager = class extends BaseMarkerManager {
  constructor(options) {
    var _a;
    super(options.mapInstance, options.onMarkerClick);
    this.MarkerCtor = (_a = options.namespace) == null ? void 0 : _a.Marker;
  }
  render(items, primaryType, selectedMarkerId) {
    if (!this.MarkerCtor) {
      return;
    }
    super.render(items, primaryType, selectedMarkerId);
  }
  createMarker(element, coords, item) {
    if (!this.MarkerCtor) return null;
    return new this.MarkerCtor({
      element,
      anchor: item.kind === "primary" ? "bottom" : "center"
    }).setLngLat([coords.lon, coords.lat]).addTo(this.mapInstance);
  }
  removeMarkerFromMap(marker) {
    try {
      marker.remove();
    } catch {
    }
  }
  updateMarkerPosition(marker, coords) {
    marker.setLngLat([coords.lon, coords.lat]);
  }
  getMarkerElement(marker) {
    return marker.getElement();
  }
};

// src/adapters/maplibre/markermanager.ts
var MapLibreMarkerManager = class extends BaseMapGLMarkerManager {
  constructor(options) {
    super({
      mapInstance: options.mapInstance,
      namespace: options.maplibregl,
      onMarkerClick: options.onMarkerClick
    });
  }
};

// src/adapters/google/markermanager.ts
var GoogleMapsMarkerManager = class extends BaseMarkerManager {
  constructor(options) {
    super(options.mapInstance, options.onMarkerClick);
    this.google = options.google;
  }
  render(items, primaryType, selectedMarkerId) {
    var _a, _b;
    if (!((_b = (_a = this.google) == null ? void 0 : _a.marker) == null ? void 0 : _b.AdvancedMarkerElement)) {
      console.warn("AdvancedMarkerElement not available");
      return;
    }
    super.render(items, primaryType, selectedMarkerId);
  }
  createMarker(element, coords, item, isPrimaryType, isSelected) {
    var _a, _b;
    if (!((_b = (_a = this.google) == null ? void 0 : _a.marker) == null ? void 0 : _b.AdvancedMarkerElement)) return null;
    const zIndex = item.kind === "primary" ? getPrimaryMarkerZIndex(isPrimaryType, isSelected) : getDotMarkerZIndex(isPrimaryType, isSelected);
    return new this.google.marker.AdvancedMarkerElement({
      map: this.mapInstance,
      position: { lat: coords.lat, lng: coords.lon },
      content: element,
      zIndex
    });
  }
  removeMarkerFromMap(marker) {
    try {
      marker.map = null;
    } catch (error) {
      console.error("Error removing marker", error);
    }
  }
  updateMarkerPosition(marker, coords) {
    marker.position = { lat: coords.lat, lng: coords.lon };
  }
  getMarkerElement(marker) {
    const element = marker.content;
    return element instanceof HTMLElement ? element : null;
  }
  updateMarkerZIndex(marker, item, isPrimaryType, isSelected) {
    marker.zIndex = item.kind === "primary" ? getPrimaryMarkerZIndex(isPrimaryType, isSelected) : getDotMarkerZIndex(isPrimaryType, isSelected);
  }
};

// src/adapters/mapbox/markermanager.ts
var MapboxMarkerManager = class extends BaseMapGLMarkerManager {
  constructor(options) {
    super({
      mapInstance: options.mapInstance,
      namespace: options.mapboxgl,
      onMarkerClick: options.onMarkerClick
    });
  }
};

// src/adapters/index.ts
var MapAdapter = class {
  constructor(map) {
    this.map = map;
  }
  /**
   * Get the underlying map instance
   * @returns {any} The native map instance
   */
  getMap() {
    return this.map;
  }
  /**
   * Set up impression tracking when map becomes visible
   * @param {() => void} onImpression Callback to invoke when map is visible
   */
  setupImpressionTracking(onImpression) {
    if (typeof window === "undefined" || !window.IntersectionObserver) {
      return;
    }
    const container = this.getContainer();
    if (!container) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onImpression();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(container);
    const cleanup = () => observer.disconnect();
    const originalCleanup = this.cleanup.bind(this);
    this.cleanup = () => {
      cleanup();
      originalCleanup();
    };
  }
};

// src/adapters/mapgl/adapter.ts
var MAP_GL_REFRESH_EVENTS = ["move", "zoom", "dragend", "pitch", "rotate"];
var BaseMapGLAdapter = class extends MapAdapter {
  constructor(map, markerManagerFactory) {
    super(map);
    this.markerManagerFactory = markerManagerFactory;
    this.cleanupFns = [];
  }
  initialize(options) {
    this.markerManager = this.markerManagerFactory({
      mapInstance: this.map,
      namespace: this.getNamespace(options),
      onMarkerClick: options.onMarkerClick
    });
    if (options.onRefresh) {
      this.attachEventListeners(options.onRefresh);
    }
    if (options.onMapMoveEnd) {
      this.attachBoundsTracking(options.onMapMoveEnd);
    }
    return this.markerManager;
  }
  attachBoundsTracking(onMapMoveEnd) {
    if (!this.map || typeof this.map.on !== "function") {
      return;
    }
    const handleMoveEnd = () => {
      const bounds = this.getMapBounds();
      onMapMoveEnd(bounds);
    };
    const handleLoad = () => {
      const bounds = this.getMapBounds();
      onMapMoveEnd(bounds);
    };
    if (this.map.loaded && this.map.loaded()) {
      handleLoad();
    } else {
      this.map.once("load", handleLoad);
      this.cleanupFns.push(() => {
        if (typeof this.map.off === "function") {
          this.map.off("load", handleLoad);
        }
      });
    }
    this.map.on("moveend", handleMoveEnd);
    this.cleanupFns.push(() => {
      if (typeof this.map.off === "function") {
        this.map.off("moveend", handleMoveEnd);
      }
    });
  }
  attachEventListeners(onRefresh) {
    if (!this.map || typeof this.map.on !== "function") {
      return;
    }
    MAP_GL_REFRESH_EVENTS.forEach((eventName) => {
      this.map.on(eventName, onRefresh);
      this.cleanupFns.push(() => {
        if (typeof this.map.off === "function") {
          this.map.off(eventName, onRefresh);
        }
      });
    });
  }
  getMarkerManager() {
    return this.markerManager;
  }
  getContainer() {
    var _a, _b;
    return ((_b = (_a = this.map) == null ? void 0 : _a.getContainer) == null ? void 0 : _b.call(_a)) || null;
  }
  cleanup() {
    for (const cleanup of this.cleanupFns) {
      try {
        cleanup();
      } catch {
      }
    }
    this.cleanupFns.length = 0;
  }
  getMap() {
    return this.map;
  }
  getCenter() {
    const center = this.map.getCenter();
    return { lng: center.lng, lat: center.lat };
  }
  getZoom() {
    return this.map.getZoom();
  }
  getBearing() {
    return this.map.getBearing();
  }
  getPitch() {
    return this.map.getPitch();
  }
  getMapBounds() {
    const bounds = this.map.getBounds();
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    return {
      sw: { lat: sw.lat, lng: sw.lng },
      ne: { lat: ne.lat, lng: ne.lng }
    };
  }
  project(lngLat) {
    return this.map.project({ lng: lngLat[0], lat: lngLat[1] });
  }
  on(event, handler) {
    this.map.on(event, handler);
  }
  off(event, handler) {
    this.map.off(event, handler);
  }
  resize() {
    this.map.resize();
  }
  remove() {
    this.cleanup();
    this.map.remove();
  }
};

// src/adapters/maplibre/index.ts
var MapLibreAdapter = class extends BaseMapGLAdapter {
  constructor(map) {
    super(map, ({ mapInstance, namespace, onMarkerClick }) => {
      return new MapLibreMarkerManager({
        mapInstance,
        maplibregl: namespace,
        onMarkerClick
      });
    });
  }
  getNamespace(options) {
    return options.maplibregl;
  }
};

// src/adapters/google/index.ts
var GoogleMapsAdapter = class extends MapAdapter {
  constructor(map) {
    super(map);
    this.cleanupFns = [];
    this.initializeOverlayView();
  }
  initialize(options) {
    this.markerManager = new GoogleMapsMarkerManager({
      mapInstance: this.map,
      google: options.google,
      onMarkerClick: options.onMarkerClick
    });
    if (options.onRefresh) {
      this.attachEventListeners(options.onRefresh);
    }
    if (options.onMapMoveEnd) {
      this.attachBoundsTracking(options.onMapMoveEnd, options.google);
    }
    return this.markerManager;
  }
  attachBoundsTracking(onMapMoveEnd, google) {
    if (!this.map) {
      return;
    }
    const handleIdle = () => {
      const bounds = this.getMapBounds();
      onMapMoveEnd(bounds);
    };
    handleIdle();
    const listener = google.event.addListener(this.map, "idle", handleIdle);
    this.cleanupFns.push(() => {
      google.event.removeListener(listener);
    });
  }
  attachEventListeners(onRefresh) {
    const events = [
      "center_changed",
      "zoom_changed",
      "drag",
      "heading_changed",
      "tilt_changed"
    ];
    const listeners = [];
    events.forEach((eventName) => {
      const listener = this.map.addListener(eventName, onRefresh);
      listeners.push(listener);
    });
    this.cleanupFns.push(() => {
      listeners.forEach((listener) => {
        try {
          listener.remove();
        } catch {
        }
      });
    });
  }
  getMarkerManager() {
    return this.markerManager;
  }
  getContainer() {
    var _a, _b;
    return ((_b = (_a = this.map) == null ? void 0 : _a.getDiv) == null ? void 0 : _b.call(_a)) || null;
  }
  cleanup() {
    for (const cleanup of this.cleanupFns) {
      try {
        cleanup();
      } catch {
      }
    }
    this.cleanupFns.length = 0;
  }
  initializeOverlayView() {
    var _a;
    const googleMaps = (_a = globalThis.google) == null ? void 0 : _a.maps;
    if (!googleMaps) return;
    const OverlayView = googleMaps.OverlayView;
    if (!OverlayView) return;
    this.overlayView = new OverlayView();
    this.overlayView.draw = function() {
    };
    this.overlayView.setMap(this.map);
  }
  getMap() {
    return this.map;
  }
  getCenter() {
    const center = this.map.getCenter();
    if (!center) {
      return { lng: 0, lat: 0 };
    }
    return { lng: center.lng(), lat: center.lat() };
  }
  getZoom() {
    var _a;
    return (_a = this.map.getZoom()) != null ? _a : 0;
  }
  getBearing() {
    var _a;
    return (_a = this.map.getHeading()) != null ? _a : 0;
  }
  getPitch() {
    var _a;
    return (_a = this.map.getTilt()) != null ? _a : 0;
  }
  getMapBounds() {
    const bounds = this.map.getBounds();
    if (!bounds) {
      return {
        sw: { lat: 0, lng: 0 },
        ne: { lat: 0, lng: 0 }
      };
    }
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    return {
      sw: { lat: sw.lat(), lng: sw.lng() },
      ne: { lat: ne.lat(), lng: ne.lng() }
    };
  }
  project(lngLat) {
    var _a;
    if (!this.overlayView) {
      return { x: 0, y: 0 };
    }
    const projection = this.overlayView.getProjection();
    if (!projection) {
      return { x: 0, y: 0 };
    }
    const googleMaps = (_a = globalThis.google) == null ? void 0 : _a.maps;
    if (!googleMaps) {
      return { x: 0, y: 0 };
    }
    const latLng = new googleMaps.LatLng(lngLat[1], lngLat[0]);
    const point = projection.fromLatLngToContainerPixel(latLng);
    if (!point) {
      return { x: 0, y: 0 };
    }
    return {
      x: point.x,
      y: point.y
    };
  }
  on(event, handler) {
    this.map.addListener(event, handler);
  }
  off(event, handler) {
    var _a;
    const googleMaps = (_a = globalThis.google) == null ? void 0 : _a.maps;
    if (googleMaps == null ? void 0 : googleMaps.event) {
      googleMaps.event.clearListeners(this.map, event);
    }
  }
  resize() {
    var _a;
    const googleMaps = (_a = globalThis.google) == null ? void 0 : _a.maps;
    if (googleMaps == null ? void 0 : googleMaps.event) {
      googleMaps.event.trigger(this.map, "resize");
    }
  }
  remove() {
    this.cleanup();
    if (this.overlayView) {
      this.overlayView.setMap(null);
      this.overlayView = null;
    }
  }
};

// src/adapters/mapbox/index.ts
var MapboxAdapter = class extends BaseMapGLAdapter {
  constructor(map) {
    super(map, ({ mapInstance, namespace, onMarkerClick }) => {
      return new MapboxMarkerManager({
        mapInstance,
        mapboxgl: namespace,
        onMarkerClick
      });
    });
  }
  getNamespace(options) {
    return options.mapboxgl;
  }
};

// src/utils/clustering.ts
function extractViewState(mapInstance) {
  const center = mapInstance.getCenter();
  return {
    longitude: center.lng,
    latitude: center.lat,
    zoom: mapInstance.getZoom(),
    bearing: mapInstance.getBearing(),
    pitch: mapInstance.getPitch()
  };
}
var COLLISION_THRESHOLD_PX_ZOOM_BREAKPOINTS = [
  { zoom: 6, threshold: 120 },
  { zoom: 8, threshold: 108 },
  { zoom: 10, threshold: 92 },
  { zoom: 12, threshold: 80 },
  { zoom: 14, threshold: 68 },
  { zoom: 16, threshold: 56 }
];
function resolveCollisionThreshold(zoom) {
  for (const breakpoint of COLLISION_THRESHOLD_PX_ZOOM_BREAKPOINTS) {
    if (zoom <= breakpoint.zoom) {
      return breakpoint.threshold;
    }
  }
  return 48;
}
function clusterMarkers({
  primaryType,
  markers,
  map,
  selectedMarkerId,
  zoom,
  collisionThresholdPx,
  dotCollisionThresholdPx
}) {
  if (!markers.length) return [];
  if (!map) {
    return markers.map((marker) => createSimplePrimaryClusterItem(marker));
  }
  const projected = markers.map((marker, index) => {
    const location = marker.location;
    if (typeof (location == null ? void 0 : location.lon) !== "number" || typeof (location == null ? void 0 : location.lat) !== "number") {
      return null;
    }
    const { x, y } = map.project([location.lon, location.lat]);
    return { marker, x, y };
  }).filter((value) => Boolean(value)).map((value, index) => ({ ...value, index }));
  if (!projected.length) {
    return [];
  }
  const threshold = resolveCollisionThreshold(zoom);
  const dotThreshold = resolveDotCollisionThreshold(zoom);
  const parent = projected.map((_, idx) => idx);
  const find = (i) => {
    if (parent[i] === i) return i;
    parent[i] = find(parent[i]);
    return parent[i];
  };
  const union = (a, b) => {
    const rootA = find(a);
    const rootB = find(b);
    if (rootA === rootB) return;
    parent[rootB] = rootA;
  };
  for (let i = 0; i < projected.length; i += 1) {
    for (let j = i + 1; j < projected.length; j += 1) {
      const dx = projected[i].x - projected[j].x;
      const dy = projected[i].y - projected[j].y;
      if (Math.hypot(dx, dy) <= threshold) {
        union(i, j);
      }
    }
  }
  const groups = /* @__PURE__ */ new Map();
  for (const item of projected) {
    const root = find(item.index);
    const group = groups.get(root);
    if (group) {
      group.push(item);
    } else {
      groups.set(root, [item]);
    }
  }
  const clustered = [];
  groups.forEach((groupItems) => {
    if (groupItems.length === 1) {
      const [{ marker }] = groupItems;
      clustered.push(
        createPrimaryClusterItem(marker, primaryType, selectedMarkerId)
      );
      return;
    }
    const sorted = [...groupItems].sort(
      (a, b) => compareMarkers(b.marker, a.marker, primaryType)
    );
    const [primary, ...rest] = sorted;
    clustered.push(
      createPrimaryClusterItem(primary.marker, primaryType, selectedMarkerId)
    );
    if (!rest.length) return;
    const dotCandidates = [];
    const remainder = [];
    rest.forEach((item) => {
      if (selectedMarkerId && item.marker.tripadvisor_id === selectedMarkerId) {
        clustered.push(createPrimaryClusterItem(item.marker, primaryType, true));
        return;
      }
      if (distancePx(primary, item) <= dotThreshold) {
        dotCandidates.push(item);
      } else {
        remainder.push(item);
      }
    });
    dotCandidates.forEach((item) => {
      clustered.push(createDotClusterItem(item.marker, primaryType, primary));
    });
    if (remainder.length) {
      const followUp = clusterMarkers({
        markers: remainder.map((item) => item.marker),
        map,
        selectedMarkerId,
        zoom,
        primaryType,
        collisionThresholdPx,
        dotCollisionThresholdPx
      });
      clustered.push(...followUp);
    }
  });
  return clustered;
}
function createSimplePrimaryClusterItem(marker) {
  return {
    kind: "primary",
    marker,
    key: `primary-${marker.tripadvisor_id}`
  };
}
function createPrimaryClusterItem(marker, primaryType, selected) {
  const isPrimary = marker.type === primaryType;
  const isSelected = typeof selected === "boolean" ? selected : selected === marker.tripadvisor_id;
  return {
    kind: "primary",
    marker,
    key: buildClusterKey("primary", marker, isPrimary, isSelected)
  };
}
function createDotClusterItem(marker, primaryType, parent) {
  const isPrimary = marker.type === primaryType;
  return {
    kind: "dot",
    marker,
    key: buildClusterKey("dot", marker, isPrimary, false),
    parentId: parent.marker.tripadvisor_id
  };
}
function buildClusterKey(kind, marker, isPrimary, isSelected) {
  var _a;
  return `${kind}-${marker.tripadvisor_id}-p${isPrimary ? 1 : 0}-s${isSelected ? 1 : 0}-${(_a = marker.pricing) == null ? void 0 : _a.availability}`;
}
function distancePx(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}
function resolveDotCollisionThreshold(zoom) {
  const base = resolveCollisionThreshold(zoom);
  return Math.max(48, base);
}
function compareMarkers(a, b, primaryType) {
  var _a, _b;
  const aIsPrimary = a.type === primaryType;
  const bIsPrimary = b.type === primaryType;
  if (aIsPrimary && !bIsPrimary) return 1;
  if (!aIsPrimary && bIsPrimary) return -1;
  const ratingDiff = resolveRating(a) - resolveRating(b);
  if (ratingDiff !== 0) return ratingDiff;
  const priceDiff = resolvePrice(a) - resolvePrice(b);
  if (priceDiff !== 0) return priceDiff;
  const reviewsDiff = ((_a = a.reviews) != null ? _a : 0) - ((_b = b.reviews) != null ? _b : 0);
  if (reviewsDiff !== 0) return reviewsDiff;
  return a.tripadvisor_id - b.tripadvisor_id;
}
function resolveRating(marker) {
  if (typeof marker.rating === "number") return marker.rating;
  if (marker.rating === void 0 || marker.rating === null) return -Infinity;
  const parsed = Number(marker.rating);
  return Number.isNaN(parsed) ? -Infinity : parsed;
}
function resolvePrice(marker) {
  var _a, _b, _c;
  if (!((_b = (_a = marker.pricing) == null ? void 0 : _a.offer) == null ? void 0 : _b.price)) return -Infinity;
  const numeric = Number(
    ((_c = marker.pricing.offer.displayPrice) != null ? _c : "0").replace(/[^0-9.,-]+/g, "").replace(/,/g, "")
  );
  return Number.isNaN(numeric) ? -Infinity : numeric;
}

// src/utils/geolocation.ts
async function getLocationWhenGranted() {
  if (!navigator.permissions || !navigator.geolocation) {
    throw new Error("Geolocation or Permissions API not supported");
  }
  const status = await navigator.permissions.query({ name: "geolocation" });
  const fetchLocation = () => new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      // Prefer a fast, cached coordinate when available.
      enableHighAccuracy: false,
      timeout: 1e4,
      maximumAge: 5 * 60 * 1e3
    });
  });
  if (status.state === "granted") {
    return fetchLocation();
  }
  if (status.state === "denied") {
    throw new Error("Location permission denied");
  }
  return fetchLocation();
}
async function getLocationIfAlreadyGranted(timeoutMs = 5e3) {
  try {
    if (!navigator.permissions || !navigator.geolocation) {
      return null;
    }
    const status = await navigator.permissions.query({ name: "geolocation" });
    if (status.state !== "granted") {
      return null;
    }
    const position = await Promise.race([
      new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          // Startup flow should return quickly on refresh when cached data exists.
          enableHighAccuracy: false,
          timeout: timeoutMs,
          maximumAge: 5 * 60 * 1e3
        });
      }),
      new Promise(
        (_, reject) => setTimeout(() => reject(new Error("Geolocation timeout")), timeoutMs)
      )
    ]);
    return {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
  } catch (error) {
    return null;
  }
}
async function getCurrentLocation(timeoutMs = 5e3) {
  try {
    const position = await Promise.race([
      getLocationWhenGranted(),
      new Promise(
        (_, reject) => setTimeout(() => reject(new Error("Geolocation timeout")), timeoutMs)
      )
    ]);
    return {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
  } catch (error) {
    return null;
  }
}
async function subscribeToLocationPermissionChanges(handlers) {
  if (!navigator.permissions) {
    return () => {
    };
  }
  try {
    const status = await navigator.permissions.query({ name: "geolocation" });
    status.onchange = () => {
      var _a, _b;
      if (status.state === "granted") {
        void ((_a = handlers.onGranted) == null ? void 0 : _a.call(handlers));
      } else if (status.state === "denied") {
        void ((_b = handlers.onDenied) == null ? void 0 : _b.call(handlers));
      }
    };
    return () => {
      status.onchange = null;
    };
  } catch {
    return () => {
    };
  }
}

// src/utils/filters.ts
function processApiFilters(apiFilters) {
  const filters = [];
  const addBasicFilters = (values, type, prefix) => {
    if (!values || !Array.isArray(values)) return;
    values.forEach((value) => {
      filters.push({
        id: `${prefix}-${value}`,
        label: value,
        type,
        value
      });
    });
  };
  addBasicFilters(apiFilters.amenities, "amenity", "amenity");
  addBasicFilters(apiFilters.hotelStyle, "hotelStyle", "hotelStyle");
  if (apiFilters.price) {
    filters.push({
      id: "priceRange",
      label: "Price Range",
      type: "priceRange",
      value: `${apiFilters.price.min}-${apiFilters.price.max}`,
      priceRange: apiFilters.price
    });
  }
  if (typeof apiFilters.minRating === "number" && Number.isFinite(apiFilters.minRating)) {
    filters.push({
      id: "minRating",
      label: `${apiFilters.minRating}+`,
      type: "minRating",
      value: String(apiFilters.minRating),
      numericValue: apiFilters.minRating
    });
  }
  if (typeof apiFilters.starRating === "number" && Number.isFinite(apiFilters.starRating)) {
    filters.push({
      id: "starRating",
      label: `${apiFilters.starRating} Stars`,
      type: "starRating",
      value: String(apiFilters.starRating),
      numericValue: apiFilters.starRating
    });
  }
  if (apiFilters.transformed_query) {
    filters.push({
      id: "transformed_query",
      label: apiFilters.transformed_query,
      type: "transformed_query",
      value: apiFilters.transformed_query
    });
  }
  if (apiFilters.selected_restaurant_price_levels) {
    const joinedPriceLevels = apiFilters.selected_restaurant_price_levels.join(
      ", "
    );
    filters.push({
      id: "selected_restaurant_price_levels",
      label: joinedPriceLevels,
      type: "selected_restaurant_price_levels",
      value: joinedPriceLevels,
      priceLevels: apiFilters.selected_restaurant_price_levels
    });
  }
  return filters;
}
function convertToApiFilters(filters) {
  return filters.map((filter) => {
    const apiFilter = {
      id: filter.id,
      label: typeof filter.label === "string" ? filter.label : String(filter.label || ""),
      type: filter.type,
      value: filter.value
    };
    if (filter.numericValue !== void 0) {
      apiFilter.numericValue = filter.numericValue;
    }
    if (filter.priceRange) {
      const min = filter.priceRange.min;
      const max = filter.priceRange.max;
      if (min !== void 0) {
        apiFilter.priceRange = {
          min,
          ...max !== void 0 && { max }
        };
      }
    }
    if (filter.priceLevels) {
      apiFilter.priceLevels = filter.priceLevels;
    }
    return apiFilter;
  });
}

// src/index.ts
var API_URLS = {
  prod: "https://api.mapfirst.ai",
  test: "https://api.mapfirst.ai/test"
};
var API_DISABLED_ERROR_MESSAGE = "API usage is disabled";
var USE_API_FALSE_PLATFORM_ERROR = "When useApi is false, only maplibre platform is supported. Google Maps and Mapbox require API usage.";
var USE_API_FALSE_PLATFORM_WARNING = "When useApi is false, only maplibre platform is supported. Please switch to maplibre.";
function getDocumentReferrer() {
  try {
    return document.referrer || void 0;
  } catch (error) {
    console.error(error);
    return void 0;
  }
}
function createSdkHeaders(apiKey, referrer) {
  return {
    "Content-Type": "application/json",
    "X-Source": "SDK",
    ...apiKey && { "X-API-Key": apiKey },
    ...referrer && { "X-Referer": referrer }
  };
}
var PropertiesFetchError = class extends Error {
  constructor({
    message,
    status,
    code
  }) {
    super(message);
    this.name = "PropertiesFetchError";
    this.status = status;
    this.code = code;
  }
};
async function fetchImages(tripadvisorId, limit = 1) {
  try {
    const response = await fetch(
      `https://l4detuz832.execute-api.us-east-1.amazonaws.com/dev/photo?id=${tripadvisorId}&limit=${limit}`
    );
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    if (data.photos && data.photos.length > 0) {
      const imageUrl = data.photos[0]["FullSizeURL"].url;
      const imageResponse = await fetch(imageUrl);
      if (imageResponse.ok) {
        return imageUrl;
      }
    }
    return null;
  } catch (error) {
    console.debug("Failed to fetch images:", error);
    return null;
  }
}
async function fetchProperties(url, body, apiKey, { signal } = {}) {
  var _a, _b;
  const referrer = getDocumentReferrer();
  const response = await fetch(url, {
    method: "POST",
    headers: createSdkHeaders(apiKey, referrer),
    body: JSON.stringify(body),
    signal
  });
  if (!response.ok) {
    let message = `Unexpected response: ${response.status}`;
    let code;
    try {
      const errorBody = await response.json();
      message = (_b = (_a = errorBody.detail) != null ? _a : errorBody.error) != null ? _b : message;
      code = errorBody.code;
    } catch {
    }
    throw new PropertiesFetchError({ message, status: response.status, code });
  }
  return await response.json();
}
function toISO(date) {
  if (typeof date === "string") return date;
  return date.toISOString().slice(0, 10);
}
var DEFAULT_PRIMARY_TYPE = "Accommodation";
function getDefaultDates() {
  const dayMs = 24 * 60 * 60 * 1e3;
  const base = new Date(Date.now() + 10 * dayMs);
  const daysUntilSaturday = (6 - base.getDay() + 7) % 7;
  const checkIn = new Date(base.getTime() + daysUntilSaturday * dayMs);
  const startDay = checkIn.getDay();
  const daysUntilWeekend = startDay === 0 ? 6 : 6 - startDay;
  const checkOut = new Date(checkIn.getTime() + (daysUntilWeekend + 1) * dayMs);
  return { checkIn, checkOut };
}
var MapFirstCore = class {
  constructor(options) {
    this.options = options;
    this.adapter = null;
    this.properties = [];
    this.selectedMarkerId = null;
    this.destroyed = false;
    this.clusterItems = [];
    this.isMapAttached = false;
    this.stopLocationPermissionListener = null;
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u;
    this.properties = [...(_a = options.properties) != null ? _a : []];
    this.primaryType = options.primaryType;
    this.selectedMarkerId = (_b = options.selectedMarkerId) != null ? _b : null;
    this.useApi = (_c = options.useApi) != null ? _c : true;
    this.environment = (_d = options.environment) != null ? _d : "prod";
    this.apiUrl = (_e = options.apiUrl) != null ? _e : API_URLS[this.environment];
    this.apiKey = options.apiKey;
    this.requestBody = options.requestBody;
    this.currentPlatform = options.platform;
    this.assertPlatformSupportForNoApi(options.platform, "throw");
    const isGoogleMaps = isGoogleMapsOptions(options);
    this.fitBoundsPadding = {
      top: (_g = (_f = options.fitBoundsPadding) == null ? void 0 : _f.top) != null ? _g : isGoogleMaps ? 0 : 50,
      bottom: (_i = (_h = options.fitBoundsPadding) == null ? void 0 : _h.bottom) != null ? _i : isGoogleMaps ? 0 : 160,
      left: (_k = (_j = options.fitBoundsPadding) == null ? void 0 : _j.left) != null ? _k : isGoogleMaps ? 0 : 50,
      right: (_m = (_l = options.fitBoundsPadding) == null ? void 0 : _l.right) != null ? _m : isGoogleMaps ? 0 : 50
    };
    const defaultDates = getDefaultDates();
    this.state = {
      center: ((_n = options.initialLocationData) == null ? void 0 : _n.latitude) && options.initialLocationData.longitude ? [
        options.initialLocationData.latitude,
        options.initialLocationData.longitude
      ] : [0, 0],
      zoom: (_p = (_o = options.initialLocationData) == null ? void 0 : _o.zoom) != null ? _p : 0,
      bounds: (_r = (_q = options.initialLocationData) == null ? void 0 : _q.bounds) != null ? _r : null,
      pendingBounds: null,
      tempBounds: null,
      properties: this.properties,
      primary: (_s = this.primaryType) != null ? _s : DEFAULT_PRIMARY_TYPE,
      selectedPropertyId: this.selectedMarkerId,
      initialLoading: true,
      isSearching: false,
      firstCallDone: false,
      filters: {
        checkIn: defaultDates.checkIn,
        checkOut: defaultDates.checkOut,
        numAdults: 2,
        numRooms: 1,
        ...((_t = options.initialLocationData) == null ? void 0 : _t.currency) && {
          currency: options.initialLocationData.currency
        }
      },
      activeLocation: {
        country: "",
        location_id: null,
        locationName: "",
        coordinates: [0, 0]
      },
      userLocation: null,
      isFlyToAnimating: false,
      ...options.state
    };
    this.callbacks = (_u = options.callbacks) != null ? _u : {};
    if (this.hasMapInstance(options)) {
      this.adapter = this.createAdapter(options);
      this.isMapAttached = true;
      this.refresh();
    }
    if (options.initialLocationData) {
      this.initializeFromLocationData(options.initialLocationData);
    } else if (this.requestBody && this.isMapAttached) {
      this.autoLoadProperties();
    }
  }
  hasMapInstance(options) {
    if ("adapter" in options && options.adapter) return true;
    if ("mapInstance" in options && options.mapInstance) return true;
    return false;
  }
  assertPlatformSupportForNoApi(platform, mode) {
    if (this.useApi || !platform || platform === "maplibre") {
      return;
    }
    if (mode === "throw") {
      throw new Error(USE_API_FALSE_PLATFORM_ERROR);
    }
    console.warn(USE_API_FALSE_PLATFORM_WARNING);
  }
  ensureApiEnabled(method, onError) {
    if (this.useApi) return true;
    console.warn(`${method} requires API usage. Set useApi to true.`);
    onError == null ? void 0 : onError(new Error(API_DISABLED_ERROR_MESSAGE));
    return false;
  }
  async initializeFromLocationData(locationData) {
    var _a;
    if (!this.ensureApiEnabled("initializeFromLocationData")) {
      return;
    }
    try {
      const {
        city,
        state,
        country,
        query,
        latitude,
        longitude,
        radius,
        bounds
      } = locationData;
      const requestBody = {
        filters: this.getFilters(),
        initial: true,
        query,
        latitude,
        longitude,
        radius,
        bounds
      };
      const location = [city, state].filter(Boolean).join(", ");
      if (country || location) {
        const geoResponse = await fetch(
          `${this.apiUrl}/geo-lookup2?${new URLSearchParams({
            ...country && { country_code: country },
            ...location && { q: location }
          }).toString()}`,
          {
            headers: {
              ...this.apiKey && {
                "X-API-Key": this.apiKey
              }
            }
          }
        );
        if (geoResponse.ok) {
          const place = await geoResponse.json();
          requestBody.city = !["country", "island", "state"].includes(
            place.type
          ) ? place.name : void 0;
          requestBody.state = place.type === "state" ? place.name : !["country", "island", "county"].includes(place.type) ? place.state : void 0;
          requestBody.country = ["country", "island"].includes(place.type) ? place.name : place.country;
          requestBody.location_id = place.id;
          requestBody.latitude = place.lat;
          requestBody.longitude = place.lon;
          this.setActiveLocation({
            city,
            state,
            country,
            location_id: (_a = place.id) != null ? _a : null,
            locationName: [city, state, country].filter(Boolean).join(", "),
            ...place.lon && place.lat && { coordinates: [place.lat, place.lon] }
          });
          if (place.lon && place.lat) {
            this.setState({
              center: [place.lat, place.lon],
              zoom: city ? 12 : state ? 8 : 5
            });
          }
        } else {
          this.handleError(
            new Error(`Geo mapping fetch failed: ${geoResponse.statusText}`),
            "initializeFromLocationData"
          );
        }
      }
      this.requestBody = requestBody;
      if (this.isMapAttached) {
        await this.autoLoadProperties();
      }
    } catch (error) {
      this.handleError(error, "initializeFromLocationData");
    }
  }
  async autoLoadProperties() {
    if (!this.ensureApiEnabled("autoLoadProperties")) {
      return;
    }
    if (!this.requestBody) return;
    const defaultRequestBody = {
      filters: this.getFilters(),
      initial: true,
      ...this.requestBody
    };
    await this.runPropertiesSearch({
      body: defaultRequestBody,
      onError: (error) => {
        var _a, _b;
        this.handleError(error, "autoLoadProperties");
        (_b = (_a = this.callbacks).onPropertiesLoadError) == null ? void 0 : _b.call(_a, error);
      }
    });
  }
  attachMap(mapInstance, config) {
    var _a;
    this.assertPlatformSupportForNoApi(config.platform, "throw");
    if (this.isMapAttached) {
      console.warn("Map is already attached. Destroying previous adapter.");
      (_a = this.stopLocationPermissionListener) == null ? void 0 : _a.call(this);
      this.stopLocationPermissionListener = null;
      if (this.adapter) {
        const markerManager = this.adapter.getMarkerManager();
        markerManager == null ? void 0 : markerManager.destroy();
        this.adapter.cleanup();
      }
    }
    const adapterConfig = {
      ...this.options,
      platform: config.platform,
      mapInstance,
      maplibregl: config.maplibregl,
      google: config.google,
      mapboxgl: config.mapboxgl,
      onMarkerClick: config.onMarkerClick
    };
    this.currentPlatform = config.platform;
    this.adapter = this.createAdapter(adapterConfig);
    this.isMapAttached = true;
    this.refresh();
    if (this.options.currentLocationMarker) {
      this.initializeCurrentLocationMarker();
      void this.setupCurrentLocationPermissionListener();
    }
    if (this.requestBody && !this.state.firstCallDone) {
      this.autoLoadProperties();
    }
  }
  createAdapter(options) {
    if (isMapLibreOptions(options) && options.mapInstance) {
      return this.initializeAdapter(new MapLibreAdapter(options.mapInstance), {
        maplibregl: options.maplibregl,
        onMarkerClick: options.onMarkerClick
      });
    }
    if (isGoogleMapsOptions(options) && options.mapInstance) {
      return this.initializeAdapter(
        new GoogleMapsAdapter(options.mapInstance),
        { google: options.google, onMarkerClick: options.onMarkerClick }
      );
    }
    if (isMapboxOptions(options) && options.mapInstance) {
      return this.initializeAdapter(new MapboxAdapter(options.mapInstance), {
        mapboxgl: options.mapboxgl,
        onMarkerClick: options.onMarkerClick
      });
    }
    if ("adapter" in options && options.adapter) {
      return options.adapter;
    }
    return null;
  }
  initializeAdapter(adapter, config) {
    adapter.initialize({
      ...config,
      onMarkerClick: (marker) => {
        var _a;
        if (marker.location) {
          this.flyMapTo(marker.location.lon, marker.location.lat, 14);
        }
        if (marker.type !== this.primaryType) {
          this.setPrimaryType(marker.type);
        }
        this.setSelectedMarker(
          marker.tripadvisor_id === this.selectedMarkerId ? null : marker.tripadvisor_id
        );
        (_a = config.onMarkerClick) == null ? void 0 : _a.call(config, marker);
      },
      onRefresh: () => this.refresh(),
      onMapMoveEnd: (bounds) => {
        if (this.state.tempBounds === null) {
          this.setTempBounds(bounds);
          this.setPendingBounds(null);
        } else {
          this.handleMapMoveEnd(bounds);
        }
      }
    });
    if (this.useApi) {
      adapter.setupImpressionTracking(() => {
      });
    }
    return adapter;
  }
  _setProperties(properties) {
    var _a, _b;
    this.ensureAlive();
    this.properties = [...properties.filter((x) => !!x.location)];
    this.updateState({
      properties: this.properties
    });
    (_b = (_a = this.callbacks).onPropertiesChange) == null ? void 0 : _b.call(_a, properties);
    this.refresh();
  }
  addProperty(property) {
    var _a, _b;
    this.ensureAlive();
    this.properties = [...this.properties, property];
    this.updateState({ properties: this.properties });
    (_b = (_a = this.callbacks).onPropertiesChange) == null ? void 0 : _b.call(_a, this.properties);
    this.refresh();
  }
  clearProperties() {
    var _a, _b;
    this.ensureAlive();
    this.properties = [];
    this.updateState({ properties: [] });
    (_b = (_a = this.callbacks).onPropertiesChange) == null ? void 0 : _b.call(_a, []);
    this.refresh();
  }
  setPrimaryType(primary) {
    var _a, _b;
    this.ensureAlive();
    if (this.primaryType === primary) return;
    this.primaryType = primary;
    this.updateState({ primary });
    (_b = (_a = this.callbacks).onPrimaryTypeChange) == null ? void 0 : _b.call(_a, primary);
    this.refresh();
  }
  setSelectedMarker(markerId) {
    var _a, _b;
    this.ensureAlive();
    if (this.selectedMarkerId === markerId) return;
    if (markerId !== null) {
      const marker = this.properties.find((p) => p.tripadvisor_id === markerId);
      if (marker && marker.type !== this.primaryType) {
        this.setPrimaryType(marker.type);
      }
    }
    this.selectedMarkerId = markerId;
    this.updateState({ selectedPropertyId: markerId });
    (_b = (_a = this.callbacks).onSelectedPropertyChange) == null ? void 0 : _b.call(_a, markerId);
    this.refresh();
  }
  /**
   * Initialize current location marker fetching.
   * Retrieves user location and renders blue dot marker on map.
   */
  async initializeCurrentLocationMarker() {
    try {
      await this.syncUserLocationIfGranted({ maxAttempts: 3, timeoutMs: 1e4 });
    } catch (error) {
      console.debug("Current location marker initialization failed:", error);
    }
  }
  /**
   * Try to resolve and set user location when permission is already granted.
   * Retries help with transient startup timing issues where coordinates are not
   * immediately available even though permission is granted.
   */
  async syncUserLocationIfGranted({
    maxAttempts = 1,
    timeoutMs = 1e4,
    retryDelayMs = 1200
  } = {}) {
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      if (this.destroyed) return false;
      const location = await getLocationIfAlreadyGranted(timeoutMs);
      if (location) {
        this.setUserLocation(location);
        return true;
      }
      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
      }
    }
    return false;
  }
  /**
   * Observe permission transitions and update location marker automatically.
   */
  async setupCurrentLocationPermissionListener() {
    var _a;
    (_a = this.stopLocationPermissionListener) == null ? void 0 : _a.call(this);
    this.stopLocationPermissionListener = null;
    this.stopLocationPermissionListener = await subscribeToLocationPermissionChanges({
      onGranted: async () => {
        if (this.destroyed) return;
        await this.syncUserLocationIfGranted({ maxAttempts: 2, timeoutMs: 1e4 });
      },
      onDenied: () => {
        if (this.destroyed) return;
        this.setUserLocation(null);
      }
    });
  }
  /**
   * Update the user's current location and render the marker.
   */
  setUserLocation(location) {
    var _a, _b;
    this.ensureAlive();
    if (this.state.userLocation === location) return;
    this.updateState({ userLocation: location });
    (_b = (_a = this.callbacks).onUserLocationChange) == null ? void 0 : _b.call(_a, location);
    this.refresh();
  }
  /**
   * Sync user location after the app has handled permission UI.
   * This method never prompts for permission; it only reads coordinates if
   * permission is already granted.
   */
  async onLocationPermissionResult(granted) {
    this.ensureAlive();
    if (!granted) {
      this.setUserLocation(null);
      return false;
    }
    return await this.syncUserLocationIfGranted({
      maxAttempts: 2,
      timeoutMs: 1e4
    });
  }
  // State management methods
  getState() {
    return { ...this.state };
  }
  // Centralized error handler
  handleError(error, context = "MapFirstCore") {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorObj = error instanceof Error ? error : new Error(errorMessage);
    console.error(`[${context}]`, errorMessage);
    if (this.callbacks.onError) {
      this.callbacks.onError(errorObj, context);
    }
  }
  updateState(update) {
    this.state = { ...this.state, ...update };
  }
  setState(newState) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t;
    const prevState = { ...this.state };
    this.updateState(newState);
    if (newState.center !== void 0 && newState.center !== prevState.center) {
      (_b = (_a = this.callbacks).onCenterChange) == null ? void 0 : _b.call(_a, newState.center, this.state.zoom);
    }
    if (newState.zoom !== void 0 && newState.zoom !== prevState.zoom) {
      (_d = (_c = this.callbacks).onZoomChange) == null ? void 0 : _d.call(_c, newState.zoom);
    }
    if (newState.bounds !== void 0 && newState.bounds !== prevState.bounds) {
      (_f = (_e = this.callbacks).onBoundsChange) == null ? void 0 : _f.call(_e, newState.bounds);
    }
    if (newState.pendingBounds !== void 0 && newState.pendingBounds !== prevState.pendingBounds) {
      (_h = (_g = this.callbacks).onPendingBoundsChange) == null ? void 0 : _h.call(_g, newState.pendingBounds);
    }
    if (newState.filters !== void 0 && newState.filters !== prevState.filters) {
      (_j = (_i = this.callbacks).onFiltersChange) == null ? void 0 : _j.call(_i, newState.filters);
    }
    if (newState.activeLocation !== void 0 && newState.activeLocation !== prevState.activeLocation) {
      (_l = (_k = this.callbacks).onActiveLocationChange) == null ? void 0 : _l.call(_k, newState.activeLocation);
    }
    if (newState.initialLoading !== void 0 && newState.initialLoading !== prevState.initialLoading) {
      (_n = (_m = this.callbacks).onLoadingStateChange) == null ? void 0 : _n.call(_m, newState.initialLoading);
    }
    if (newState.isSearching !== void 0 && newState.isSearching !== prevState.isSearching) {
      (_p = (_o = this.callbacks).onSearchingStateChange) == null ? void 0 : _p.call(_o, newState.isSearching);
    }
    if (newState.firstCallDone !== void 0 && newState.firstCallDone !== prevState.firstCallDone) {
      (_r = (_q = this.callbacks).onFirstCallDoneChange) == null ? void 0 : _r.call(_q, newState.firstCallDone);
    }
    if (newState.isFlyToAnimating !== void 0 && newState.isFlyToAnimating !== prevState.isFlyToAnimating) {
      (_t = (_s = this.callbacks).onIsFlyToAnimatingChange) == null ? void 0 : _t.call(_s, newState.isFlyToAnimating);
    }
  }
  setFilters(filters) {
    this.setState({ filters });
  }
  setActiveLocation(location) {
    this.setState({ activeLocation: location });
  }
  setBounds(bounds) {
    this.setState({ bounds });
  }
  setPendingBounds(bounds) {
    this.setState({ pendingBounds: bounds });
  }
  setTempBounds(bounds) {
    this.setState({ tempBounds: bounds });
  }
  setLoading(loading) {
    this.setState({ initialLoading: loading });
  }
  setSearching(searching) {
    this.setState({ isSearching: searching });
  }
  setFlyToAnimating(animating) {
    this.setState({ isFlyToAnimating: animating });
  }
  handleMapMoveEnd(bounds) {
    if (this.state.isFlyToAnimating) {
      this.setState({
        isFlyToAnimating: false,
        tempBounds: bounds,
        pendingBounds: null
      });
      return;
    }
    const tempBounds = this.state.tempBounds;
    if (!tempBounds) {
      this.setState({
        tempBounds: bounds,
        pendingBounds: bounds
      });
      return;
    }
    const delta = 0.01;
    const hasChanged = Math.abs(bounds.sw.lat - tempBounds.sw.lat) > delta || Math.abs(bounds.sw.lng - tempBounds.sw.lng) > delta || Math.abs(bounds.ne.lat - tempBounds.ne.lat) > delta || Math.abs(bounds.ne.lng - tempBounds.ne.lng) > delta;
    if (hasChanged) {
      this.setState({ pendingBounds: bounds });
    } else {
      this.setState({ pendingBounds: null });
    }
  }
  flyMapTo(longitude, latitude, zoom, animation = true) {
    this.ensureAlive();
    this.setState({ center: [latitude, longitude] });
    if (typeof zoom === "number") {
      this.setState({ zoom });
    }
    if (!this.adapter) return;
    const mapInstance = this.adapter.getMap();
    if (!mapInstance) return;
    if (this.currentPlatform === "google") {
      this.setFlyToAnimating(false);
      mapInstance.setCenter({ lat: latitude, lng: longitude });
      if (zoom !== null && typeof zoom === "number") {
        mapInstance.setZoom(zoom != null ? zoom : 13);
      }
      return;
    }
    if (animation === false) {
      this.setFlyToAnimating(false);
      if (mapInstance.jumpTo) {
        mapInstance.jumpTo({
          center: [longitude, latitude],
          ...zoom !== null && { zoom: zoom != null ? zoom : 13 }
        });
      }
      return;
    }
    this.setFlyToAnimating(true);
    if (mapInstance.flyTo) {
      mapInstance.flyTo({
        center: [longitude, latitude],
        ...zoom !== null && { zoom: zoom != null ? zoom : 13 }
      });
    }
  }
  extractPoiPoints(properties, type) {
    return properties.filter(
      (property) => property.location !== void 0 && (type !== void 0 ? property.type === type : true)
    ).map((property) => ({
      lat: property.location.lat,
      lng: property.location.lon
    }));
  }
  flyToPOIs(pois, type, animate = true) {
    var _a, _b;
    this.ensureAlive();
    if (!this.adapter) return;
    const mapInstance = this.adapter.getMap();
    if (!mapInstance) return;
    let points = pois;
    if (!points || points.length === 0) {
      points = this.extractPoiPoints(this.properties, type);
    }
    if (!points || points.length === 0) return;
    if (points.length === 1) {
      const poi = points[0];
      if (this.currentPlatform === "google") {
        mapInstance.setCenter({ lat: poi.lat, lng: poi.lng });
        mapInstance.setZoom(13);
      } else if (mapInstance.flyTo) {
        mapInstance.flyTo({
          center: [poi.lng, poi.lat],
          zoom: 13
        });
      }
    } else {
      if (this.currentPlatform === "google") {
        const LatLngBounds = (_b = (_a = window.google) == null ? void 0 : _a.maps) == null ? void 0 : _b.LatLngBounds;
        if (LatLngBounds) {
          const bounds = new LatLngBounds();
          points.forEach((poi) => {
            bounds.extend({ lat: poi.lat, lng: poi.lng });
          });
          if (animate) {
            this.setFlyToAnimating(true);
          }
          mapInstance.fitBounds(bounds, this.fitBoundsPadding);
        }
      } else if (mapInstance.fitBounds) {
        const bounds = [
          [points[0].lng, points[0].lat],
          [points[0].lng, points[0].lat]
        ];
        points.forEach((poi) => {
          bounds[0][0] = Math.min(bounds[0][0], poi.lng);
          bounds[0][1] = Math.min(bounds[0][1], poi.lat);
          bounds[1][0] = Math.max(bounds[1][0], poi.lng);
          bounds[1][1] = Math.max(bounds[1][1], poi.lat);
        });
        if (animate) {
          this.setFlyToAnimating(true);
        }
        mapInstance.fitBounds(bounds, {
          padding: this.fitBoundsPadding,
          animate
        });
      }
    }
  }
  getFilters() {
    const filters = { ...this.state.filters };
    if (filters.checkIn instanceof Date) {
      filters.checkIn = toISO(filters.checkIn);
    }
    if (filters.checkOut instanceof Date) {
      filters.checkOut = toISO(filters.checkOut);
    }
    return filters;
  }
  async pollForPricing({
    pollingLink,
    maxAttempts = 15,
    delayMs = 2e3,
    isCancelled,
    price,
    limit
  }) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
    this.ensureAlive();
    if (!this.ensureApiEnabled("pollForPricing")) {
      return { completed: false };
    }
    if (!pollingLink) {
      return { completed: false };
    }
    let completed = false;
    let pollData = void 0;
    const filters = this.getFilters();
    if (limit) {
      filters.limit = limit;
    }
    const body = {
      filters,
      pollingLink
    };
    const referrer = getDocumentReferrer();
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      if (isCancelled == null ? void 0 : isCancelled()) {
        return { completed, pollData };
      }
      try {
        const pollResp = await fetch(
          `${this.apiUrl}/ta-polling?pollingNumber=${attempt}`,
          {
            method: "POST",
            body: JSON.stringify(body),
            headers: createSdkHeaders(this.apiKey, referrer)
          }
        );
        if (!pollResp.ok) {
          throw new PropertiesFetchError({
            message: `Poll failed: ${pollResp.status}`,
            status: pollResp.status
          });
        }
        pollData = await pollResp.json();
        if (isCancelled == null ? void 0 : isCancelled()) {
          return { completed, pollData };
        }
        const results = (_b = (_a = pollData == null ? void 0 : pollData.success) == null ? void 0 : _a.results) != null ? _b : [];
        const unsupportedIds = new Set(
          (_e = (_d = (_c = pollData == null ? void 0 : pollData.success) == null ? void 0 : _c.invalidHotelIds) == null ? void 0 : _d.map(Number)) != null ? _e : []
        );
        const unsupportedIds2 = new Set(
          (_h = (_g = (_f = pollData == null ? void 0 : pollData.success) == null ? void 0 : _f.unsupportedHotelIds) == null ? void 0 : _g.map(Number)) != null ? _h : []
        );
        if (results.length > 0 || unsupportedIds.size > 0) {
          this.setProperties((prev) => {
            const updatedProperties = prev.filter(
              (property) => !unsupportedIds.has(property.tripadvisor_id) && !unsupportedIds2.has(property.tripadvisor_id)
            );
            results.forEach((property) => {
              var _a2, _b2, _c2, _d2, _e2, _f2;
              if (!property.location) return;
              if (((_b2 = (_a2 = property.pricing) == null ? void 0 : _a2.offer) == null ? void 0 : _b2.price) && price && (((_d2 = (_c2 = property.pricing) == null ? void 0 : _c2.offer) == null ? void 0 : _d2.price) < (price == null ? void 0 : price.min) || ((_f2 = (_e2 = property.pricing) == null ? void 0 : _e2.offer) == null ? void 0 : _f2.price) > (price == null ? void 0 : price.max))) {
                property.pricing.availability = "unavailable";
              }
              const existingIndex = updatedProperties.findIndex(
                (h) => h.tripadvisor_id === property.tripadvisor_id
              );
              if (existingIndex >= 0) {
                updatedProperties[existingIndex] = property;
              } else {
                updatedProperties.push(property);
              }
            });
            return updatedProperties;
          });
        }
        if ((_i = pollData == null ? void 0 : pollData.success) == null ? void 0 : _i.isComplete) {
          this.setProperties(
            (prev) => prev.filter(
              (property) => {
                var _a2, _b2, _c2, _d2;
                return property.type !== "Accommodation" || ((_b2 = (_a2 = property.pricing) == null ? void 0 : _a2.offer) == null ? void 0 : _b2.availability) === "available" && ((_d2 = (_c2 = property.pricing) == null ? void 0 : _c2.offer) == null ? void 0 : _d2.displayPrice);
              }
            )
          );
          completed = true;
          this.setSearching(false);
          break;
        }
      } catch (error) {
        this.handleError(error, "pollForPricing");
        (_k = (_j = this.callbacks).onPropertiesLoadError) == null ? void 0 : _k.call(_j, error);
        break;
      }
      if (attempt < maxAttempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
    return { completed, pollData };
  }
  setProperties(updater) {
    const updatedProperties = updater(this.properties);
    this._setProperties(updatedProperties);
  }
  mostCommonTypeFromProperties(properties) {
    const typeCounts = properties.reduce(
      (counts, property) => {
        counts[property.type] = (counts[property.type] || 0) + 1;
        return counts;
      },
      {}
    );
    return Object.entries(typeCounts).reduce(
      (a, b) => typeCounts[a[0]] > typeCounts[b[0]] ? a : b
    )[0];
  }
  async runPropertiesSearch({
    body,
    beforeApplyProperties,
    smartFiltersClearable,
    onError
  }) {
    var _a, _b, _c, _d, _e, _f, _g;
    this.ensureAlive();
    if (!this.ensureApiEnabled("runPropertiesSearch", onError)) {
      return null;
    }
    this.setState({ firstCallDone: false });
    this.setSearching(true);
    this.clearProperties();
    try {
      const data = await fetchProperties(
        `${this.apiUrl}/properties`,
        body,
        this.apiKey
      );
      this.updateActiveLocationFromResponse(data);
      let price = null;
      let limit = 30;
      let primary_type = data.filters.primary_type;
      if (data.isComplete) {
        data.properties = data.properties.filter(
          (property) => {
            var _a2, _b2, _c2, _d2;
            return property.type !== "Accommodation" || ((_b2 = (_a2 = property.pricing) == null ? void 0 : _a2.offer) == null ? void 0 : _b2.availability) === "available" && ((_d2 = (_c2 = property.pricing) == null ? void 0 : _c2.offer) == null ? void 0 : _d2.displayPrice);
          }
        );
      }
      if (beforeApplyProperties) {
        const result = beforeApplyProperties(data);
        price = (_a = result.price) != null ? _a : null;
        limit = (_b = result.limit) != null ? _b : 30;
      }
      const flown = data.properties.some((x) => !!x.location);
      const primaryTypePoiPoints = this.extractPoiPoints(
        data.properties,
        data.filters.primary_type
      );
      const filteredProperties = price ? data.properties.map(
        (x) => {
          var _a2, _b2;
          return ((_a2 = x.pricing) == null ? void 0 : _a2.offer) ? {
            ...x,
            ...((_b2 = x.pricing) == null ? void 0 : _b2.offer) && {
              pricing: {
                ...x.pricing,
                availability: x.pricing.offer.price ? x.pricing.offer.price < price.min || x.pricing.offer.price > price.max ? "unavailable" : x.pricing.availability : "unavailable"
              }
            }
          } : x;
        }
      ) : data.properties;
      this._setProperties(filteredProperties);
      if (flown) {
        this.flyToPOIs(primaryTypePoiPoints, void 0, body.initial !== true);
      }
      if (data.filters.primary_type && data.properties.filter(
        (property) => {
          var _a2;
          return property.type === data.filters.primary_type && (property.type === "Accommodation" ? ((_a2 = property.pricing) == null ? void 0 : _a2.availability) !== "unavailable" : true);
        }
      ).length > 0) {
        primary_type = data.filters.primary_type;
        this.setPrimaryType(data.filters.primary_type);
      } else if (data.properties.length > 0) {
        const mostCommonType = this.mostCommonTypeFromProperties(
          data.properties
        );
        this.setPrimaryType(mostCommonType);
        primary_type = mostCommonType;
      }
      this.setState({ firstCallDone: true });
      if (data.isComplete === false && data.pollingLink) {
        const { completed, pollData } = await this.pollForPricing({
          pollingLink: data.pollingLink,
          ...price && { price },
          ...limit && { limit }
        });
        if (completed && ((_c = pollData == null ? void 0 : pollData.success) == null ? void 0 : _c.results) && pollData.success.results.filter(
          (property) => {
            var _a2;
            return property.type === data.filters.primary_type && (property.type === "Accommodation" ? ((_a2 = property.pricing) == null ? void 0 : _a2.availability) !== "unavailable" : true);
          }
        ).length === 0 && primary_type && primary_type !== data.filters.primary_type) {
          const mostCommonType = this.mostCommonTypeFromProperties(
            data.properties
          );
          this.setPrimaryType(mostCommonType);
        }
        if (completed) {
          this.refresh();
        }
      } else if (data.isComplete === true) {
        this.setSearching(false);
      }
      if (!flown) {
        if (((_d = data.filters.location) == null ? void 0 : _d.latitude) && ((_e = data.filters.location) == null ? void 0 : _e.longitude)) {
          this.flyMapTo(
            data.filters.location.longitude,
            data.filters.location.latitude,
            12,
            body.initial !== true
          );
        }
      }
      return data;
    } catch (error) {
      this.handleError(error, "runPropertiesSearch");
      onError == null ? void 0 : onError(error);
      (_g = (_f = this.callbacks).onPropertiesLoadError) == null ? void 0 : _g.call(_f, error);
      this.clearProperties();
      this.setState({ firstCallDone: true });
      this.setSearching(false);
      return null;
    }
  }
  async performBoundsSearch() {
    var _a;
    this.ensureAlive();
    if (!this.ensureApiEnabled("performBoundsSearch")) {
      return null;
    }
    if (!this.state.pendingBounds) {
      return null;
    }
    const filters = this.getFilters();
    const body = {
      bounds: this.state.pendingBounds,
      filters
    };
    const priceFilter = (_a = filters == null ? void 0 : filters.price) != null ? _a : void 0;
    const result = await this.runPropertiesSearch({
      body,
      beforeApplyProperties: () => {
        return { price: priceFilter != null ? priceFilter : null };
      }
    });
    if (result) {
      this.setBounds(this.state.pendingBounds);
      this.setTempBounds(this.state.pendingBounds);
      this.setPendingBounds(null);
    }
    return result;
  }
  updateActiveLocationFromResponse(data) {
    var _a, _b, _c, _d;
    const newLocationId = (_a = data.location_id) != null ? _a : null;
    const newCity = (_c = (_b = data.filters.location) == null ? void 0 : _b.city) != null ? _c : void 0;
    const newCountry = ((_d = data.filters.location) == null ? void 0 : _d.country) || "";
    const newCoordinates = data.filters.location ? [data.filters.location.latitude, data.filters.location.longitude] : void 0;
    if (!newCoordinates) return;
    const currentLocation = this.state.activeLocation;
    if (newLocationId !== (currentLocation == null ? void 0 : currentLocation.location_id) || newCity !== (currentLocation == null ? void 0 : currentLocation.city) || newCountry !== (currentLocation == null ? void 0 : currentLocation.country)) {
      this.setActiveLocation({
        city: newCity,
        country: newCountry,
        location_id: newLocationId,
        locationName: newCity && newCountry ? `${newCity}, ${newCountry}` : newCountry || "",
        coordinates: newCoordinates
      });
    }
  }
  async runSmartFilterSearch({
    query,
    filters,
    onProcessFilters,
    onError
  }) {
    this.ensureAlive();
    if (!this.ensureApiEnabled("runSmartFilterSearch", onError)) {
      return null;
    }
    let filterPayload = this.getFilters();
    const state = this.getState();
    if (filters && filters.length > 0) {
      const amenities = /* @__PURE__ */ new Set();
      const hotelStyle = /* @__PURE__ */ new Set();
      let price;
      let minRating;
      let starRating;
      let primary_type;
      let transformed_query;
      let selected_restaurant_price_levels;
      filters.forEach((filter) => {
        var _a, _b, _c;
        switch (filter.type) {
          case "amenity":
            amenities.add(filter.value);
            break;
          case "hotelStyle":
            hotelStyle.add(filter.value);
            break;
          case "priceRange":
            if (filter.priceRange) {
              price = {
                min: filter.priceRange.min,
                max: (_a = filter.priceRange.max) != null ? _a : 0
              };
            }
            break;
          case "minRating":
            minRating = (_b = filter.numericValue) != null ? _b : Number(filter.value);
            break;
          case "starRating":
            starRating = (_c = filter.numericValue) != null ? _c : Number(filter.value);
            break;
          case "primary_type":
            primary_type = filter.propertyType;
            break;
          case "transformed_query":
            transformed_query = filter.value;
            break;
          case "selected_restaurant_price_levels":
            selected_restaurant_price_levels = filter.priceLevels;
            break;
        }
      });
      filterPayload = {
        ...filterPayload,
        ...amenities.size > 0 && { amenities: Array.from(amenities) },
        ...hotelStyle.size > 0 && { hotelStyle: Array.from(hotelStyle) },
        ...price && { price },
        ...minRating !== void 0 && { minRating },
        ...starRating !== void 0 && { starRating },
        ...primary_type && { primary_type },
        ...transformed_query && { transformed_query },
        ...selected_restaurant_price_levels && {
          selected_restaurant_price_levels
        }
      };
    } else if (!query) {
      filterPayload.minRating = 4;
    }
    const body = {
      filters: filterPayload,
      ...query && { query },
      ...state.bounds ? { bounds: state.bounds } : state.activeLocation.location_id ? { location_id: state.activeLocation.location_id } : state.activeLocation.coordinates ? {
        latitude: state.activeLocation.coordinates[0],
        longitude: state.activeLocation.coordinates[1]
      } : {}
    };
    return this.runPropertiesSearch({
      body,
      beforeApplyProperties: onProcessFilters ? (data) => {
        var _a, _b;
        const result = onProcessFilters(data.filters, data.location_id);
        return {
          price: (_a = result.price) != null ? _a : null,
          limit: (_b = result.limit) != null ? _b : 30
        };
      } : void 0,
      smartFiltersClearable: !!query,
      onError
    });
  }
  getClusters() {
    this.ensureAlive();
    return [...this.clusterItems];
  }
  setUseApi(useApi, autoLoad = true) {
    this.ensureAlive();
    this.useApi = useApi;
    if (!useApi) {
      this.assertPlatformSupportForNoApi(this.currentPlatform, "warn");
    }
    if (!useApi) {
      this.clearProperties();
    }
    if (useApi && autoLoad) {
      if (this.options.initialLocationData) {
        this.initializeFromLocationData(this.options.initialLocationData);
      } else if (this.requestBody && this.isMapAttached) {
        this.autoLoadProperties();
      }
    }
  }
  setApiKey(apiKey) {
    this.ensureAlive();
    const oldKey = this.apiKey;
    this.apiKey = apiKey;
    if (oldKey !== this.apiKey && this.isMapAttached) {
      this.refresh();
      if (this.useApi) {
        if (this.options.initialLocationData) {
          this.initializeFromLocationData(this.options.initialLocationData);
        } else if (this.requestBody) {
          this.autoLoadProperties();
        }
      }
    }
  }
  getApiKey() {
    return this.apiKey;
  }
  refresh() {
    var _a, _b, _c;
    this.ensureAlive();
    if (!this.adapter) return;
    const viewState = this.safeExtractViewState();
    const primaryType = this.resolvePrimaryType();
    this.clusterItems = clusterMarkers({
      primaryType,
      markers: this.properties,
      map: this.adapter,
      selectedMarkerId: this.selectedMarkerId,
      zoom: (_a = viewState == null ? void 0 : viewState.zoom) != null ? _a : 0
    });
    const markerManager = this.adapter.getMarkerManager();
    markerManager.render(this.clusterItems, primaryType, this.selectedMarkerId);
    markerManager.renderUserLocation(this.state.userLocation);
    (_c = (_b = this.options).onClusterUpdate) == null ? void 0 : _c.call(_b, this.clusterItems, viewState);
  }
  destroy() {
    var _a;
    if (this.destroyed) {
      return;
    }
    if (this.adapter) {
      const markerManager = this.adapter.getMarkerManager();
      markerManager.destroy();
      this.adapter.cleanup();
    }
    (_a = this.stopLocationPermissionListener) == null ? void 0 : _a.call(this);
    this.stopLocationPermissionListener = null;
    this.clusterItems = [];
    this.properties = [];
    this.destroyed = true;
    this.isMapAttached = false;
  }
  resolvePrimaryType() {
    var _a, _b, _c;
    return (_c = (_b = this.primaryType) != null ? _b : (_a = this.properties.find((marker) => marker.type)) == null ? void 0 : _a.type) != null ? _c : DEFAULT_PRIMARY_TYPE;
  }
  safeExtractViewState() {
    if (!this.adapter) return null;
    try {
      return extractViewState(this.adapter);
    } catch {
      return null;
    }
  }
  ensureAlive() {
    if (this.destroyed) {
      throw new Error("MapFirstCore instance has been destroyed");
    }
  }
};
function isMapLibreOptions(options) {
  return options.platform === "maplibre";
}
function isGoogleMapsOptions(options) {
  return options.platform === "google";
}
function isMapboxOptions(options) {
  return options.platform === "mapbox";
}
export {
  MapFirstCore,
  PropertiesFetchError,
  convertToApiFilters,
  fetchImages,
  fetchProperties,
  getCurrentLocation,
  getLocationWhenGranted,
  processApiFilters
};
