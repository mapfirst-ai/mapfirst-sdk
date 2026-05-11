---
sidebar_position: 2
---

# HTML/JavaScript Setup

No framework? No problem. MapFirst SDK works in any HTML page with a simple `<script>` tag. This guide walks you through setting up a fully interactive map with property search — zero build tools required.

:::info When to use this approach
Choose the HTML/JavaScript setup if you're working with a static site, a CMS like WordPress, a server-rendered app (PHP, Django, Rails), or just want a quick prototype. For React apps, see the [React Setup](./react) guide instead.
:::

---

## Step 1 — Add a Basic Map

Here's a complete, copy-paste example that gives you a working map with search in a single HTML file:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MapFirst SDK Example</title>

    <!-- MapLibre GL JS -->
    <link
      href="https://unpkg.com/maplibre-gl@^5.12.0/dist/maplibre-gl.css"
      rel="stylesheet"
    />
    <script src="https://unpkg.com/maplibre-gl@^5.12.0/dist/maplibre-gl.js"></script>

    <!-- MapFirst SDK -->
    <script src="https://unpkg.com/@mapfirst.ai/core@latest/dist/index.global.js"></script>

    <style>
      body {
        margin: 0;
        padding: 0;
      }
      #map {
        width: 100vw;
        height: 100vh;
      }
      .controls {
        position: absolute;
        top: 20px;
        left: 20px;
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        z-index: 1000;
      }
    </style>
  </head>
  <body>
    <div class="controls">
      <input id="search-input" type="text" placeholder="Search hotels" />
      <button id="search-btn">Search</button>
      <p>Properties: <span id="count">0</span></p>
    </div>

    <div id="map"></div>

    <script>
      const { MapFirstCore } = window.MapFirstCore;

      // Initialize map
      const map = new maplibregl.Map({
        container: "map",
        style: "https://api.mapfirst.ai/static/style.json",
        center: [2.3522, 48.8566],
        zoom: 12,
      });

      map.on("load", function () {
        // Initialize MapFirst
        const mapFirst = new MapFirstCore({
          apiKey: "your-api-key",
          initialLocationData: {
            city: "Paris",
            country: "France",
            currency: "EUR",
          },
          callbacks: {
            onPropertiesChange: function (properties) {
              document.getElementById("count").textContent = properties.length;
            },
          },
        });

        // Attach map
        mapFirst.attachMap(map, {
          platform: "maplibre",
          maplibregl: maplibregl,
        });

        // Search button
        const searchBtn = document.getElementById("search-btn");
        const searchInput = document.getElementById("search-input");

        searchBtn.addEventListener("click", async function () {
          const query = searchInput.value.trim();
          searchBtn.textContent = "Searching...";
          searchBtn.disabled = true;

          try {
            if (query) {
              await mapFirst.runSmartFilterSearch({ query });
            } else {
              await mapFirst.runPropertiesSearch({
                body: {
                  city: "Paris",
                  country: "France",
                  filters: {
                    checkIn: "2024-06-01",
                    checkOut: "2024-06-07",
                    numAdults: 2,
                    currency: "EUR",
                  },
                },
              });
            }
          } finally {
            searchBtn.textContent = "Search";
            searchBtn.disabled = false;
          }
        });
      });
    </script>
  </body>
</html>
```

:::tip Want property type definitions?
See the [Property type reference](../api/core#property) for the full `Property` interface and all related types.
:::

---

## Step 2 — Try Other Map Providers

### Mapbox GL JS

```html
<!DOCTYPE html>
<html>
  <head>
    <link
      href="https://unpkg.com/mapbox-gl/dist/mapbox-gl.css"
      rel="stylesheet"
    />
    <script src="https://unpkg.com/mapbox-gl/dist/mapbox-gl.js"></script>
    <script src="https://unpkg.com/@mapfirst.ai/core@latest/dist/index.global.js"></script>
  </head>
  <body>
    <div id="map" style="width: 100vw; height: 100vh;"></div>

    <script>
      const { MapFirstCore } = window.MapFirstCore;

      mapboxgl.accessToken = "YOUR_MAPBOX_TOKEN";

      const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v12",
        center: [2.3522, 48.8566],
        zoom: 12,
      });

      map.on("load", function () {
        const mapFirst = new MapFirstCore({
          apiKey: "your-api-key",
          initialLocationData: {
            city: "Paris",
            country: "France",
            currency: "EUR",
          },
        });

        mapFirst.attachMap(map, {
          platform: "mapbox",
          mapboxgl: mapboxgl,
        });
      });
    </script>
  </body>
</html>
```

### Google Maps

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="https://unpkg.com/@mapfirst.ai/core@latest/dist/index.global.js"></script>
    <style>
      #map {
        width: 100vw;
        height: 100vh;
      }
    </style>
  </head>
  <body>
    <div id="map"></div>

    <script>
      function initMap() {
        const { MapFirstCore } = window.MapFirstCore;

        const map = new google.maps.Map(document.getElementById("map"), {
          center: { lat: 48.8566, lng: 2.3522 },
          zoom: 12,
          mapId: "YOUR_MAP_ID",
        });

        const mapFirst = new MapFirstCore({
          initialLocationData: {
            city: "Paris",
            country: "France",
            currency: "EUR",
          },
        });

        mapFirst.attachMap(map, {
          platform: "google",
          google: window.google.maps,
        });
      }
    </script>

    <script
      src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap&libraries=marker"
      async
      defer
    ></script>
  </body>
</html>
```

---

## Step 3 — Learn the Core Methods

Here's a quick reference of the methods you'll use most often.

### Search by Location

```javascript
await mapFirst.runPropertiesSearch({
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
```

### AI-Powered Smart Search

Search with natural language — the SDK extracts filters automatically:

```javascript
await mapFirst.runSmartFilterSearch({
  query: "hotels near eiffel tower with pool",
});
```

### Search Visible Area

Search within whatever the user is currently looking at on the map:

```javascript
await mapFirst.performBoundsSearch();
```

### Listen to Events

Pass callbacks to react to state changes in real time:

```javascript
const mapFirst = new MapFirstCore({
  apiKey: "your-api-key",
  initialLocationData: {
    city: "Paris",
    country: "France",
    currency: "EUR",
  },
  callbacks: {
    onPropertiesChange: function (properties) {
      console.log("Properties:", properties.length);
    },
    onSearchingStateChange: function (isSearching) {
      console.log("Searching:", isSearching);
    },
    onSelectedPropertyChange: function (id) {
      console.log("Selected:", id);
    },
  },
});
```

### Control the Map

Navigate, switch property types, and manage selections programmatically:

```javascript
// Fly to location
mapFirst.flyMapTo(2.2945, 48.8584, 15);

// Set property type
mapFirst.setPrimaryType("Restaurant");

// Select marker
mapFirst.setSelectedMarker(123456);
```

---

## Full Example — Search UI with Filters

Here's a more complete example with a search panel, property type selector, date pickers, and result count:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MapFirst Full Example</title>

    <link
      href="https://unpkg.com/maplibre-gl@^5.12.0/dist/maplibre-gl.css"
      rel="stylesheet"
    />
    <script src="https://unpkg.com/maplibre-gl@^5.12.0/dist/maplibre-gl.js"></script>
    <script src="https://unpkg.com/@mapfirst.ai/core@latest/dist/index.global.js"></script>

    <style>
      * {
        box-sizing: border-box;
      }
      body {
        margin: 0;
        font-family: system-ui, sans-serif;
      }
      #map {
        width: 100vw;
        height: 100vh;
      }

      .search-panel {
        position: absolute;
        top: 20px;
        left: 20px;
        width: 300px;
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        z-index: 1000;
      }

      .search-panel input,
      .search-panel select,
      .search-panel button {
        width: 100%;
        padding: 10px;
        margin-bottom: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
      }

      .search-panel button {
        background: #3b82f6;
        color: white;
        border: none;
        cursor: pointer;
        font-weight: 600;
      }

      .search-panel button:hover {
        background: #2563eb;
      }

      .search-panel button:disabled {
        background: #94a3b8;
        cursor: not-allowed;
      }

      .property-count {
        margin-top: 10px;
        padding: 10px;
        background: #f1f5f9;
        border-radius: 4px;
        text-align: center;
        font-weight: 600;
      }
    </style>
  </head>
  <body>
    <div class="search-panel">
      <h3 style="margin-top: 0;">Search Properties</h3>

      <input type="text" id="city" placeholder="City" value="Paris" />
      <input type="text" id="country" placeholder="Country" value="France" />

      <select id="property-type">
        <option value="Accommodation">Hotels</option>
        <option value="Restaurant">Restaurants</option>
        <option value="Attraction">Attractions</option>
      </select>

      <input type="date" id="check-in" />
      <input type="date" id="check-out" />

      <button id="search-btn">Search</button>

      <div class="property-count">
        <div id="loading" style="display: none;">Searching...</div>
        <div id="count" style="display: none;">
          Found: <span id="property-count">0</span> properties
        </div>
      </div>
    </div>

    <div id="map"></div>

    <script>
      const { MapFirstCore } = window.MapFirstCore;

      // Set default dates
      const today = new Date();
      const checkIn = new Date(today);
      checkIn.setDate(today.getDate() + 10);
      const checkOut = new Date(checkIn);
      checkOut.setDate(checkIn.getDate() + 3);

      document.getElementById("check-in").valueAsDate = checkIn;
      document.getElementById("check-out").valueAsDate = checkOut;

      // Initialize map
      const map = new maplibregl.Map({
        container: "map",
        style: "https://api.mapfirst.ai/static/style.json",
        center: [2.3522, 48.8566],
        zoom: 12,
      });

      let mapFirst = null;

      map.on("load", function () {
        mapFirst = new MapFirstCore({
          apiKey: "your-api-key",
          initialLocationData: {
            city: "Paris",
            country: "France",
            currency: "EUR",
          },
          callbacks: {
            onPropertiesChange: function (properties) {
              document.getElementById("property-count").textContent =
                properties.length;
              document.getElementById("count").style.display = "block";
            },
            onSearchingStateChange: function (isSearching) {
              document.getElementById("loading").style.display = isSearching
                ? "block"
                : "none";
              document.getElementById("count").style.display = isSearching
                ? "none"
                : "block";
              document.getElementById("search-btn").disabled = isSearching;
            },
          },
        });

        mapFirst.attachMap(map, {
          platform: "maplibre",
          maplibregl: maplibregl,
          onMarkerClick: function (property) {
            alert(property.name + "\nRating: " + (property.rating || "N/A"));
          },
        });

        // Handle property type change
        document
          .getElementById("property-type")
          .addEventListener("change", function (e) {
            mapFirst.setPrimaryType(e.target.value);
          });

        // Handle search
        document
          .getElementById("search-btn")
          .addEventListener("click", function () {
            const city = document.getElementById("city").value;
            const country = document.getElementById("country").value;
            const checkInDate = document.getElementById("check-in").value;
            const checkOutDate = document.getElementById("check-out").value;

            mapFirst.runPropertiesSearch({
              body: {
                city: city,
                country: country,
                filters: {
                  checkIn: checkInDate,
                  checkOut: checkOutDate,
                  numAdults: 2,
                  numRooms: 1,
                  currency: "EUR",
                },
              },
            });
          });
      });
    </script>
  </body>
</html>
```

---

## Troubleshooting

:::caution SDK not loading?
Make sure the `<script>` tag for `@mapfirst.ai/core` is loaded **before** your code runs. The SDK attaches itself to `window.MapFirstCore`:

```html
<script src="https://unpkg.com/@mapfirst.ai/core@latest/dist/index.global.js"></script>
<script>
  if (window.MapFirstCore) {
    const { MapFirstCore } = window.MapFirstCore;
    // Your code here
  }
</script>
```

:::

### Map not displaying?

Ensure the map container has **explicit dimensions**. Without a height, the map will collapse to zero:

```css
#map {
  width: 100vw;
  height: 100vh;
}
```

### Console errors?

Check your browser console for specific error messages. Common causes:

- **Missing API keys** — Mapbox and Google Maps require their own API keys in addition to your MapFirst key.
- **Wrong library version** — MapFirst SDK requires MapLibre GL JS v5+ or Mapbox GL JS v2+.
- **Network issues** — CDN resources may be blocked by ad blockers or corporate firewalls.
- **CORS errors** — Make sure you're loading the SDK from the official CDN (`unpkg.com`).

---

## Next Steps

Now that you have a working map, explore these guides to build richer experiences:

- **[API Reference](../api/core)** — Complete `MapFirstCore` class documentation.
- **[Searching Guide](../guides/searching)** — Learn location search, smart search, and bounds search.
- **[Customizing Markers](../guides/customizing-markers)** — Style markers with CSS to match your brand.
- **[Fetching Images](../guides/fetching-images)** — Display property photos from Tripadvisor.
- **[Examples](../examples/basic-map)** — More complete examples to copy and adapt.
