---
sidebar_position: 3
---

# Property Details Example

Example showing how to display detailed property information with images.

## React Example

```tsx
import { useEffect, useRef, useState } from "react";
import { useMapFirst } from "@mapfirst.ai/react";
import { fetchImages, type Property } from "@mapfirst.ai/core";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default function PropertyDetails() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );

  const {
    instance: mapFirst,
    state,
    propertiesSearch,
  } = useMapFirst({
    apiKey: "your-api-key",
    initialLocationData: {
      city: "Paris",
      country: "France",
      currency: "EUR",
    },
    state: {
      filters: {
        checkIn: "2024-06-01",
        checkOut: "2024-06-07",
        numAdults: 2,
        numRooms: 1,
        currency: "EUR",
      },
    },
    callbacks: {
      onSelectedPropertyChange: (id) => {
        if (id) {
          const property = state?.properties.find(
            (p) => p.tripadvisor_id === id
          );
          setSelectedProperty(property || null);
        } else {
          setSelectedProperty(null);
        }
      },
    },
  });

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: "https://api.mapfirst.ai/static/style.json",
      center: [2.3522, 48.8566],
      zoom: 12,
    });

    map.on("load", () => {
      mapFirst?.attachMap(map, {
        platform: "maplibre",
        maplibregl,
      });

      // Auto-search on load
      propertiesSearch.search({
        body: {
          city: "Paris",
          country: "France",
          filters: {
            checkIn: "2024-06-01",
            checkOut: "2024-06-07",
            numAdults: 2,
            numRooms: 1,
            currency: "EUR",
          },
        },
      });
    });

    return () => map.remove();
  }, [mapFirst]);

  return (
    <div style={{ height: "100vh", display: "flex" }}>
      {/* Map */}
      <div ref={mapContainerRef} style={{ flex: 1 }} />

      {/* Property Details Sidebar */}
      {selectedProperty && (
        <PropertyDetailsSidebar
          property={selectedProperty}
          onClose={() => mapFirst?.setSelectedMarker(null)}
        />
      )}
    </div>
  );
}

function PropertyDetailsSidebar({
  property,
  onClose,
}: {
  property: Property;
  onClose: () => void;
}) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadImage() {
      try {
        const url = await fetchImages(property.tripadvisor_id, 1);
        if (!cancelled) {
          setImageUrl(url);
        }
      } finally {
        if (!cancelled) {
          setImageLoading(false);
        }
      }
    }

    loadImage();

    return () => {
      cancelled = true;
    };
  }, [property.tripadvisor_id]);

  const getFallbackImage = () => {
    const typeMap = {
      Accommodation: "/img/accommodation.webp",
      "Eat & Drink": "/img/restaurant.webp",
      Attraction: "/img/attraction.webp",
    };
    return typeMap[property.type] || "/img/default.webp";
  };

  return (
    <div
      style={{
        width: "400px",
        background: "white",
        boxShadow: "-2px 0 8px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "20px",
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "18px" }}>Property Details</h2>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
            padding: 0,
          }}
        >
          ×
        </button>
      </div>

      {/* Image */}
      <div
        style={{
          position: "relative",
          paddingBottom: "56.25%",
          background: "#f1f5f9",
        }}
      >
        {imageLoading ? (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Loading...
          </div>
        ) : (
          <img
            src={imageUrl || getFallbackImage()}
            alt={property.name}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "20px" }}>
        <h3 style={{ marginTop: 0 }}>{property.name}</h3>

        {/* Rating */}
        {property.rating && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "12px",
            }}
          >
            <div style={{ display: "flex", gap: "2px" }}>
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  style={{
                    color:
                      i < Math.floor(property.rating) ? "#fbbf24" : "#e5e7eb",
                  }}
                >
                  ★
                </span>
              ))}
            </div>
            <span style={{ color: "#64748b", fontSize: "14px" }}>
              {property.rating.toFixed(1)} ({property.reviews.toLocaleString()}{" "}
              reviews)
            </span>
          </div>
        )}

        {/* Type Badge */}
        <div style={{ marginBottom: "12px" }}>
          <span
            style={{
              padding: "4px 12px",
              background: "#e0e7ff",
              borderRadius: "12px",
              fontSize: "14px",
              color: "#4f46e5",
            }}
          >
            {property.type}
          </span>
        </div>

        {/* Location */}
        {(property.city || property.country) && (
          <div style={{ marginBottom: "12px", color: "#64748b" }}>
            <strong>Location:</strong> {property.city}
            {property.city && property.country && ", "}
            {property.country}
          </div>
        )}

        {/* Price Level */}
        {property.price_level && (
          <div style={{ marginBottom: "12px", color: "#64748b" }}>
            <strong>Price Level:</strong> {property.price_level}
          </div>
        )}

        {/* Pricing */}
        {property.pricing?.offer && (
          <div
            style={{
              padding: "12px",
              background: "#f0fdf4",
              border: "1px solid #86efac",
              borderRadius: "8px",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontWeight: 600, color: "#16a34a" }}>
                {property.pricing.offer.displayPrice}
              </span>
              <img
                src={property.pricing.offer.logo}
                alt={property.pricing.offer.displayName}
                style={{ height: "20px" }}
              />
            </div>
            {property.pricing.offer.freeCancellationDate && (
              <div
                style={{ fontSize: "12px", color: "#15803d", marginTop: "4px" }}
              >
                Free cancellation until{" "}
                {new Date(
                  property.pricing.offer.freeCancellationDate
                ).toLocaleDateString()}
              </div>
            )}
          </div>
        )}

        {/* Awards */}
        {property.awards && property.awards.length > 0 && (
          <div>
            <strong>Awards:</strong>
            {property.awards.map((award, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginTop: "8px",
                  padding: "8px",
                  background: "#fef3c7",
                  borderRadius: "6px",
                }}
              >
                {award.images[0] && (
                  <img
                    src={award.images[0].url}
                    alt={award.award_type}
                    style={{ height: "24px" }}
                  />
                )}
                <span style={{ fontSize: "14px" }}>
                  {award.award_type} {award.year}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* View on TripAdvisor */}
        {property.url && (
          <a
            href={property.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              marginTop: "16px",
              padding: "12px",
              background: "#3b82f6",
              color: "white",
              textAlign: "center",
              borderRadius: "6px",
              textDecoration: "none",
            }}
          >
            View on TripAdvisor
          </a>
        )}
      </div>
    </div>
  );
}
```

## HTML/JavaScript Example

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Property Details</title>

    <link
      href="https://unpkg.com/maplibre-gl@^5.12.0/dist/maplibre-gl.css"
      rel="stylesheet"
    />
    <script src="https://unpkg.com/maplibre-gl@^5.12.0/dist/maplibre-gl.js"></script>
    <script src="https://unpkg.com/@mapfirst.ai/core@latest/dist/index.global.js"></script>

    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: system-ui, -apple-system, sans-serif;
        height: 100vh;
        display: flex;
      }

      #map {
        flex: 1;
      }

      #sidebar {
        width: 400px;
        background: white;
        box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
        display: none;
        flex-direction: column;
        overflow: auto;
      }

      #sidebar.active {
        display: flex;
      }

      .sidebar-header {
        padding: 20px;
        border-bottom: 1px solid #e2e8f0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .close-btn {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
      }

      .property-image {
        width: 100%;
        height: 225px;
        object-fit: cover;
        background: #f1f5f9;
      }

      .property-content {
        padding: 20px;
      }

      .rating {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 12px 0;
      }

      .stars {
        display: flex;
        gap: 2px;
      }

      .badge {
        padding: 4px 12px;
        background: #e0e7ff;
        border-radius: 12px;
        font-size: 14px;
        color: #4f46e5;
        display: inline-block;
      }

      .pricing-box {
        padding: 12px;
        background: #f0fdf4;
        border: 1px solid #86efac;
        border-radius: 8px;
        margin: 12px 0;
      }

      .cta-button {
        display: block;
        width: 100%;
        padding: 12px;
        background: #3b82f6;
        color: white;
        text-align: center;
        border-radius: 6px;
        text-decoration: none;
        margin-top: 16px;
      }
    </style>
  </head>
  <body>
    <div id="map"></div>

    <div id="sidebar">
      <div class="sidebar-header">
        <h2>Property Details</h2>
        <button class="close-btn" onclick="closeSidebar()">×</button>
      </div>

      <img id="property-image" class="property-image" alt="" />

      <div class="property-content" id="property-content"></div>
    </div>

    <script>
      const { MapFirstCore, fetchImages } = window.MapFirstCore;

      const map = new maplibregl.Map({
        container: "map",
        style: "https://api.mapfirst.ai/static/style.json",
        center: [2.3522, 48.8566],
        zoom: 12,
      });

      let mapFirst;
      let currentProperties = [];

      map.on("load", function () {
        mapFirst = new MapFirstCore({
          apiKey: "your-api-key",
          initialLocationData: {
            city: "Paris",
            country: "France",
            currency: "EUR",
          },
          state: {
            filters: {
              checkIn: "2024-06-01",
              checkOut: "2024-06-07",
              numAdults: 2,
              numRooms: 1,
              currency: "EUR",
            },
          },
          callbacks: {
            onPropertiesChange: function (properties) {
              currentProperties = properties;
            },
            onSelectedPropertyChange: function (id) {
              if (id) {
                const property = currentProperties.find(
                  (p) => p.tripadvisor_id === id
                );
                if (property) {
                  showPropertyDetails(property);
                }
              }
            },
          },
        });

        mapFirst.attachMap(map, {
          platform: "maplibre",
          maplibregl: maplibregl,
        });

        // Auto-search
        mapFirst.runPropertiesSearch({
          body: {
            city: "Paris",
            country: "France",
            filters: {
              checkIn: "2024-06-01",
              checkOut: "2024-06-07",
              numAdults: 2,
              numRooms: 1,
              currency: "EUR",
            },
          },
        });
      });

      async function showPropertyDetails(property) {
        const sidebar = document.getElementById("sidebar");
        const image = document.getElementById("property-image");
        const content = document.getElementById("property-content");

        sidebar.classList.add("active");

        // Load image
        image.src = "";
        const imageUrl = await fetchImages(property.tripadvisor_id, 1);
        image.src =
          imageUrl ||
          `/img/${property.type.toLowerCase().replace(/ /g, "-")}.webp`;

        // Build content
        let html = `
          <h3>${property.name}</h3>
        `;

        if (property.rating) {
          const stars = Array(5)
            .fill(0)
            .map((_, i) => (i < Math.floor(property.rating) ? "★" : "☆"))
            .join("");
          html += `
            <div class="rating">
              <div class="stars" style="color: #fbbf24;">${stars}</div>
              <span style="color: #64748b; font-size: 14px;">
                ${property.rating.toFixed(
                  1
                )} (${property.reviews.toLocaleString()} reviews)
              </span>
            </div>
          `;
        }

        html += `
          <div style="margin: 12px 0;">
            <span class="badge">${property.type}</span>
          </div>
        `;

        if (property.city || property.country) {
          html += `
            <div style="margin: 12px 0; color: #64748b;">
              <strong>Location:</strong> ${property.city || ""}${
            property.city && property.country ? ", " : ""
          }${property.country || ""}
            </div>
          `;
        }

        if (property.price_level) {
          html += `
            <div style="margin: 12px 0; color: #64748b;">
              <strong>Price Level:</strong> ${property.price_level}
            </div>
          `;
        }

        if (property.pricing?.offer) {
          html += `
            <div class="pricing-box">
              <div style="display: flex; justify-content: space-between;">
                <span style="font-weight: 600; color: #16a34a;">
                  ${property.pricing.offer.displayPrice}
                </span>
                <img src="${property.pricing.offer.logo}" alt="${property.pricing.offer.displayName}" style="height: 20px;" />
              </div>
            </div>
          `;
        }

        if (property.url) {
          html += `
            <a href="${property.url}" target="_blank" class="cta-button">
              View on TripAdvisor
            </a>
          `;
        }

        content.innerHTML = html;
      }

      function closeSidebar() {
        document.getElementById("sidebar").classList.remove("active");
        mapFirst.setSelectedMarker(null);
      }
    </script>
  </body>
</html>
```

## Key Features

- **Property Selection** - Click markers to view details
- **Image Loading** - Fetches TripAdvisor images with fallbacks
- **Detailed Information** - Shows ratings, reviews, pricing, awards
- **Responsive Sidebar** - Clean layout with smooth transitions
- **External Links** - Direct links to TripAdvisor

## See Also

- [Fetching Images Guide](../guides/fetching-images)
- [Property Type Reference](../api/core#property)
- [useMapFirst API](../api/use-mapfirst)
