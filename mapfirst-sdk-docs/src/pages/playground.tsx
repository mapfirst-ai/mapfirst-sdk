import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import Layout from "@theme/Layout";
import Head from "@docusaurus/Head";
import {
  useMapFirst,
  SmartFilter,
  Filter,
  processApiFilters,
  convertToApiFilters,
} from "@mapfirst.ai/react";
import type { MapboxNamespace } from "@mapfirst.ai/core";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import PropertyCarousel from "../components/PropertyCarousel";
import "../css/playground.css";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

export default function Playground() {
  const [mounted, setMounted] = useState(false);
  const { siteConfig } = useDocusaurusContext();

  const mapboxAccessToken =
    (siteConfig.customFields?.mapboxAccessToken as string) || "";
  const googleMapsKey =
    (siteConfig.customFields?.googleMapsApiKey as string) || "";

  if (mapboxAccessToken && mapboxgl.accessToken !== mapboxAccessToken) {
    mapboxgl.accessToken = mapboxAccessToken;
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Layout
      title="Playground"
      description="Interactive MapFirst SDK Playground"
    >
      <Head>
        <script
          src={`https://maps.googleapis.com/maps/api/js?key=${googleMapsKey}&libraries=marker`}
        />
      </Head>

      {mounted && <PlaygroundContent />}
    </Layout>
  );
}

function PlaygroundContent() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [mapPlatform, setMapPlatform] = useState<
    "mapbox" | "maplibre" | "google"
  >("maplibre");
  const [useApi, setUseApi] = useState(true);
  const [styleUrl, setStyleUrl] = useState(
    "https://api.mapfirst.ai/static/style.json"
  );
  const [activeStyleUrl, setActiveStyleUrl] = useState(
    "https://api.mapfirst.ai/static/style.json"
  );
  const [locationInput, setLocationInput] = useState("Paris, France");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const locationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Form state
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Filter[]>([]);
  const [city, setCity] = useState("Paris");
  const [country, setCountry] = useState("France");
  const [currency, setCurrency] = useState("USD");
  //   const [locale, setLocale] = useState("en");
  const [adults, setAdults] = useState(2);
  const [rooms, setRooms] = useState(1);

  // Code view state
  const [showCode, setShowCode] = useState(false);
  const [codeTab, setCodeTab] = useState<"react" | "html">("react");

  // Calculate default dates (10 days from now, 3 night stay)
  const getDefaultDates = () => {
    const today = new Date();
    const checkIn = new Date(today);
    checkIn.setDate(today.getDate() + 10);
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkIn.getDate() + 3);
    return {
      checkIn: checkIn.toISOString().split("T")[0],
      checkOut: checkOut.toISOString().split("T")[0],
    };
  };

  const defaultDates = getDefaultDates();
  const [checkIn, setCheckIn] = useState(defaultDates.checkIn);
  const [checkOut, setCheckOut] = useState(defaultDates.checkOut);

  // Initialize MapFirst hook
  const {
    instance: mapFirst,
    state,
    setSelectedMarker,
    setUseApi: setUseApiFromHook,
    smartFilterSearch,
  } = useMapFirst({
    useApi,
    initialLocationData: {
      city,
      country,
      currency,
    },
    state: {
      filters: {
        checkIn,
        checkOut,
        numAdults: adults,
        numRooms: rooms,
        currency,
      },
    },
    callbacks: {
      onFiltersChange: (filters) => {
        if (filters.numAdults !== undefined) setAdults(filters.numAdults);
        if (filters.numRooms !== undefined) setRooms(filters.numRooms);
        if (filters.currency) setCurrency(filters.currency);
        if (filters.checkIn) {
          const date =
            typeof filters.checkIn === "string"
              ? filters.checkIn.split("T")[0]
              : new Date(filters.checkIn).toISOString().split("T")[0];
          setCheckIn(date);
        }
        if (filters.checkOut) {
          const date =
            typeof filters.checkOut === "string"
              ? filters.checkOut.split("T")[0]
              : new Date(filters.checkOut).toISOString().split("T")[0];
          setCheckOut(date);
        }
      },
      onActiveLocationChange: (location) => {
        if (location.city !== undefined) setCity(location.city || "");
        if (location.country !== undefined) setCountry(location.country || "");
      },
    },
  });

  const pendingBounds = state?.pendingBounds;
  const isSearching = state?.isSearching;
  const selectedMarker = state?.selectedPropertyId ?? null;

  // Memoize properties from state
  const properties = useMemo(() => {
    return state?.properties || [];
  }, [state?.properties]);

  // Location search with Mapbox geocoding
  const handleLocationSearch = async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const token = mapboxgl.accessToken;
    try {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        query
      )}.json?access_token=${token}&limit=5`;
      const res = await fetch(url);
      if (!res.ok) return;
      const data = await res.json();
      setSuggestions(data.features || []);
      setHighlightedIndex(data.features?.length > 0 ? 0 : -1);
      setShowDropdown(true);
    } catch (err) {
      console.error("Location search error:", err);
    }
  };

  const handleLocationInputChange = (value: string) => {
    setLocationInput(value);
    if (locationTimeoutRef.current) {
      clearTimeout(locationTimeoutRef.current);
    }
    locationTimeoutRef.current = setTimeout(() => {
      handleLocationSearch(value);
    }, 300);
  };

  const selectLocation = (feature: any) => {
    const context = feature.context || [];
    const cityContext = context.find((c: any) => c.id.startsWith("place."));
    const countryContext = context.find((c: any) =>
      c.id.startsWith("country.")
    );

    const newCity = cityContext?.text || feature.text;
    const newCountry = countryContext?.text || "";

    setLocationInput(feature.place_name);
    setShowDropdown(false);
    setSuggestions([]);
    setCity(newCity);
    setCountry(newCountry);
  };

  // Initialize map based on platform
  useEffect(() => {
    if (!mapContainerRef.current || !mapFirst) return;

    // Clean up existing map DOM only
    if (map) {
      try {
        if (typeof map.remove === "function") {
          map.remove();
        }
      } catch (e) {
        console.error("Error removing map:", e);
      }
    }

    const container = mapContainerRef.current;
    container.innerHTML = "";
    container.className = "playground-map-canvas";

    let newMap: any = null;

    const attachAndRender = () => {
      if (mapPlatform === "mapbox") {
        mapFirst.attachMap(newMap, {
          platform: "mapbox",
          mapboxgl: mapboxgl as unknown as MapboxNamespace,
        });
        mapFirst.flyToPOIs(undefined, undefined, false);
      } else if (mapPlatform === "maplibre") {
        mapFirst.attachMap(newMap, {
          platform: "maplibre",
          maplibregl,
        });
        mapFirst.flyToPOIs(undefined, undefined, false);
      } else if (mapPlatform === "google") {
        const google = (window as any).google;
        mapFirst.attachMap(newMap, {
          platform: "google",
          google: google.maps,
        });
        mapFirst.flyToPOIs(undefined, undefined, false);
      }
    };

    if (mapPlatform === "mapbox") {
      newMap = new mapboxgl.Map({
        container,
        style: "mapbox://styles/mapbox/streets-v12",
        zoom: 12,
        center: [2.3522, 48.8566],
      });
      newMap.addControl(new mapboxgl.NavigationControl(), "top-left");
      newMap.on("load", attachAndRender);
    } else if (mapPlatform === "maplibre") {
      newMap = new maplibregl.Map({
        container,
        style: activeStyleUrl,
        zoom: 12,
        center: [2.3522, 48.8566],
      });
      newMap.addControl(new maplibregl.NavigationControl(), "top-left");
      newMap.on("load", attachAndRender);
    } else if (mapPlatform === "google" && (window as any).google?.maps) {
      newMap = new (window as any).google.maps.Map(container, {
        zoom: 12,
        center: { lat: 48.8566, lng: 2.3522 },
        mapId: "DEMO_MAPFIRST_GOOGLE",
      });
      // Google Maps is ready immediately
      attachAndRender();
    }

    setMap(newMap);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapPlatform, mapFirst, activeStyleUrl]);

  // Switch to maplibre when useApi is disabled
  useEffect(() => {
    if (!useApi && mapPlatform !== "maplibre") {
      setMapPlatform("maplibre");
    }
  }, [useApi, mapPlatform]);

  // Handle search with SmartFilter
  const handleSearch = async (query: string, currentFilters?: Filter[]) => {
    if (!query.trim()) return;

    try {
      const apiFilters = currentFilters
        ? convertToApiFilters(currentFilters)
        : undefined;

      await smartFilterSearch.search({
        query: query.trim(),
        filters: apiFilters,
        onProcessFilters: (responseFilters) => {
          // Process API response and convert to Filter objects
          const newFilters =
            currentFilters || processApiFilters(responseFilters);
          if (!currentFilters) {
            setFilters(newFilters);
          }
          return {
            smartFilters: convertToApiFilters(newFilters),
            price: responseFilters.price,
            limit: responseFilters.limit ?? 30,
            language: responseFilters.language,
          };
        },
      });
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  // Handle filter changes
  const handleFilterChange = async (updatedFilters: Filter[]) => {
    setFilters(updatedFilters);

    if (isSearching) {
      return;
    }

    // If we have a previous query, re-run the search with updated filters
    if (searchQuery) {
      await handleSearch(searchQuery, updatedFilters);
    }
  };

  // Handle basic search (for search button)
  const handleBasicSearch = useCallback(async () => {
    if (!mapFirst) return;

    try {
      if (searchQuery.trim()) {
        await handleSearch(searchQuery);
      } else {
        await mapFirst.runPropertiesSearch({
          body: {
            city,
            country,
            filters: {
              checkIn,
              checkOut,
              numAdults: adults,
              numRooms: rooms,
              currency,
            },
          },
        });
      }
    } catch (error) {
      console.error("Search error:", error);
    }
  }, [
    mapFirst,
    searchQuery,
    city,
    country,
    checkIn,
    checkOut,
    adults,
    rooms,
    currency,
  ]);

  // Handle bounds search
  const handleBoundsSearch = useCallback(async () => {
    if (!mapFirst) return;
    try {
      await mapFirst.performBoundsSearch();
    } catch (error) {
      console.error("Bounds search error:", error);
    }
  }, [mapFirst]);

  // Handle fly to location
  const handleFlyTo = useCallback(
    (lon: number, lat: number) => {
      if (mapFirst) {
        mapFirst.flyMapTo(lon, lat, 14);
      }
    },
    [mapFirst]
  );

  // Generate code snippets
  const generateReactCode = () => {
    // Get current map center and zoom
    let center = [2.3522, 48.8566];
    let zoom = 12;

    if (map) {
      if (mapPlatform === "google") {
        const googleCenter = map.getCenter();
        center = [googleCenter.lng(), googleCenter.lat()];
        zoom = map.getZoom();
      } else {
        // Mapbox/MapLibre
        const mapCenter = map.getCenter();
        center = [mapCenter.lng, mapCenter.lat];
        zoom = Math.round(map.getZoom() * 10) / 10;
      }
    }

    const mapPlatformConfig = {
      mapbox: {
        import:
          'import mapboxgl from "mapbox-gl";\nimport "mapbox-gl/dist/mapbox-gl.css";',
        init: `mapboxgl.accessToken = "YOUR_MAPBOX_TOKEN";
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v12",
      center: [${center[0].toFixed(4)}, ${center[1].toFixed(4)}],
      zoom: ${zoom},
    });`,
        attach: `mapFirst.attachMap(map, {
        platform: "mapbox",
        mapboxgl: mapboxgl,
      });`,
      },
      maplibre: {
        import:
          'import maplibregl from "maplibre-gl";\nimport "maplibre-gl/dist/maplibre-gl.css";',
        init: `const map = new maplibregl.Map({
      container: "map",
      style: "${activeStyleUrl}",
      center: [${center[0].toFixed(4)}, ${center[1].toFixed(4)}],
      zoom: ${zoom},
    });`,
        attach: `mapFirst.attachMap(map, {
        platform: "maplibre",
        maplibregl: maplibregl,
      });`,
      },
      google: {
        import:
          '// Load Google Maps API in your HTML:\n// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=marker"></script>',
        init: `const map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: ${center[1].toFixed(4)}, lng: ${center[0].toFixed(4)} },
      zoom: ${zoom},
      mapId: "YOUR_MAP_ID", // Required for Advanced Markers
    });`,
        attach: `mapFirst.attachMap(map, {
        platform: "google",
        google: google.maps,
      });`,
      },
    };

    const config = mapPlatformConfig[mapPlatform];

    return `import { useMapFirst, SmartFilter, processApiFilters, convertToApiFilters } from "@mapfirst.ai/react";
${config.import}

function MapComponent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState([]);

  const { instance: mapFirst, state, smartFilterSearch } = useMapFirst({
    initialLocationData: {
      city: "${city}",
      country: "${country}",
      currency: "${currency}",
    },
    state: {
      filters: {
        checkIn: "${checkIn}",
        checkOut: "${checkOut}",
        numAdults: ${adults},
        numRooms: ${rooms},
        currency: "${currency}",
      },
    },
  });

  // Initialize ${mapPlatform} map
  useEffect(() => {
    ${config.init}

    map.on("load", () => {
      ${config.attach}
    });
  }, []);

  // Smart Filter Search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    await smartFilterSearch.search({
      query: searchQuery,
      filters: filters.length ? convertToApiFilters(filters) : undefined,
      onProcessFilters: (responseFilters) => {
        const newFilters = filters.length ? filters : processApiFilters(responseFilters);
        if (!filters.length) setFilters(newFilters);
        return {
          smartFilters: convertToApiFilters(newFilters),
          price: responseFilters.price,
          limit: responseFilters.limit ?? 30,
        };
      },
    });
  };

  const handleFilterChange = async (updatedFilters) => {
    setFilters(updatedFilters);
    if (searchQuery && !state.isSearching) {
      await handleSearch();
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search (e.g., Hotels near beach)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: "8px", width: "300px", marginRight: "10px" }}
        />
        <button onClick={handleSearch} disabled={state.isSearching}>
          {state.isSearching ? "Searching..." : "Search"}
        </button>
      </div>

      {filters.length > 0 && (
        <SmartFilter
          filters={filters}
          isSearching={state.isSearching}
          onFilterChange={handleFilterChange}
          currency="${currency}"
        />
      )}

      <div id="map" style={{ height: "600px", marginBottom: "20px" }} />

      <div>
        <h3>Properties ({state.properties?.length || 0})</h3>
        {state.properties?.map((property) => {
          const price = property.pricing?.offer?.displayPrice || property.price_level;
          return (
            <div key={property.id} style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
              <h4>{property.name}</h4>
              <p>{property.type}</p>
              {price && <p>Price: {price}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}`;
  };

  const generateHtmlCode = () => {
    // Get current map center and zoom
    let center = [2.3522, 48.8566];
    let zoom = 12;

    if (map) {
      if (mapPlatform === "google") {
        const googleCenter = map.getCenter();
        center = [googleCenter.lng(), googleCenter.lat()];
        zoom = map.getZoom();
      } else {
        // Mapbox/MapLibre
        const mapCenter = map.getCenter();
        center = [mapCenter.lng, mapCenter.lat];
        zoom = Math.round(map.getZoom() * 10) / 10;
      }
    }

    const mapPlatformConfig = {
      mapbox: {
        cdn: `<link href="https://unpkg.com/mapbox-gl/dist/mapbox-gl.css" rel="stylesheet" />
  <script src="https://unpkg.com/mapbox-gl/dist/mapbox-gl.js"></script>`,
        init: `mapboxgl.accessToken = "YOUR_MAPBOX_TOKEN";
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v12",
      center: [${center[0].toFixed(4)}, ${center[1].toFixed(4)}],
      zoom: ${zoom},
    });`,
        attach: `mapFirst.attachMap(map, {
        platform: "mapbox",
        mapboxgl: mapboxgl,
      });`,
      },
      maplibre: {
        cdn: `<link href="https://unpkg.com/maplibre-gl@^5.12.0/dist/maplibre-gl.css" rel="stylesheet" />
  <script src="https://unpkg.com/maplibre-gl@^5.12.0/dist/maplibre-gl.js"></script>`,
        init: `const map = new maplibregl.Map({
      container: "map",
      style: "${activeStyleUrl}",
      center: [${center[0].toFixed(4)}, ${center[1].toFixed(4)}],
      zoom: ${zoom},
    });`,
        attach: `mapFirst.attachMap(map, {
        platform: "maplibre",
        maplibregl: maplibregl,
      });`,
      },
      google: {
        cdn: `<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=marker"></script>`,
        init: `const map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: ${center[1].toFixed(4)}, lng: ${center[0].toFixed(4)} },
      zoom: ${zoom},
      mapId: "YOUR_MAP_ID", // Required for Advanced Markers
    });`,
        attach: `mapFirst.attachMap(map, {
        platform: "google",
        google: google.maps,
      });`,
      },
    };

    const config = mapPlatformConfig[mapPlatform];

    return `<!DOCTYPE html>
<html>
<head>
  ${config.cdn}
  <script src="https://unpkg.com/@mapfirst.ai/core@latest/dist/index.global.js"></script>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    #search-container { margin-bottom: 20px; }
    #search-input { padding: 8px; width: 300px; margin-right: 10px; }
    #search-btn { padding: 8px 16px; cursor: pointer; }
    #map { height: 600px; margin-bottom: 20px; }
    .property-card { padding: 10px; border-bottom: 1px solid #ddd; }
  </style>
</head>
<body>
  <div id="search-container">
    <input
      id="search-input"
      type="text"
      placeholder="Search (e.g., Hotels near beach)"
    />
    <button id="search-btn">Search</button>
  </div>

  <div id="map"></div>

  <div id="properties">
    <h3>Properties (<span id="property-count">0</span>)</h3>
    <div id="property-list"></div>
  </div>

  <script>
    const sdkGlobal = window.MapFirstCore;
    if (!sdkGlobal) {
      console.error("MapFirst SDK global bundle not found.");
    }

    const { MapFirstCore: MapFirstCoreClass } = sdkGlobal;

    // Initialize MapFirst
    const mapFirst = new MapFirstCoreClass({
      initialLocationData: {
        city: "${city}",
        country: "${country}",
        currency: "${currency}",
      },
      callbacks: {
        onPropertiesChange: (properties) => {
          renderProperties(properties);
        },
      },
    });

    // Initialize ${mapPlatform} map
    ${config.init}

    map.on("load", () => {
      ${config.attach}
    });

    // Render properties
    function renderProperties(properties) {
      const countEl = document.getElementById("property-count");
      const listEl = document.getElementById("property-list");
      
      countEl.textContent = properties.length;
      listEl.innerHTML = properties
          .map((property) => {
            const price =
              property.pricing?.offer?.displayPrice || property.price_level;
            return \`
        <div class="property-card">
          <h4>\${property.name}</h4>
          <p>\${property.type}</p>
          \${price ? \`<p>Price: \${price}</p>\` : ""}
        </div>
          \`;
          })
          .join("");
    }

    // Search
    const searchInput = document.getElementById("search-input");
    const searchBtn = document.getElementById("search-btn");

    searchBtn.addEventListener("click", () => {
      const query = searchInput.value.trim();
      if (query) {
        searchBtn.textContent = "Searching...";
        searchBtn.disabled = true;

        mapFirst.runSmartFilterSearch({
          query: query,
          onComplete: () => {
            searchBtn.textContent = "Search";
            searchBtn.disabled = false;
          },
        });
      } else {
        mapFirst.runPropertiesSearch({
          body: {
            city: "${city}",
            country: "${country}",
            filters: {
              checkIn: "${checkIn}",
              checkOut: "${checkOut}",
              numAdults: ${adults},
              numRooms: ${rooms},
              currency: "${currency}",
            },
          },
        });
      }
    });

    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        searchBtn.click();
      }
    });
  </script>
</body>
</html>`;
  };

  const copyToClipboard = () => {
    const code = codeTab === "react" ? generateReactCode() : generateHtmlCode();
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="playground-wrapper">
      <aside className="playground-controls">
        <div className="playground-header">
          <h2>Playground Controls</h2>
          <button
            type="button"
            className="playground-code-toggle"
            onClick={() => setShowCode(!showCode)}
            title={showCode ? "Show Controls" : "Show Code"}
          >
            {showCode ? "✕" : "</>"}
          </button>
        </div>

        {showCode ? (
          <div className="playground-code-view">
            <div className="playground-code-tabs">
              <button
                type="button"
                className={codeTab === "react" ? "active" : ""}
                onClick={() => setCodeTab("react")}
              >
                React
              </button>
              <button
                type="button"
                className={codeTab === "html" ? "active" : ""}
                onClick={() => setCodeTab("html")}
              >
                HTML
              </button>
            </div>
            <div className="playground-code-content">
              <pre>
                <code>
                  {codeTab === "react"
                    ? generateReactCode()
                    : generateHtmlCode()}
                </code>
              </pre>
              <button
                type="button"
                className="playground-copy-btn"
                onClick={copyToClipboard}
              >
                Copy
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="playground-control-group">
              <label>
                <input
                  type="checkbox"
                  checked={useApi}
                  onChange={(e) => {
                    const newValue = e.target.checked;
                    setUseApi(newValue);
                    setUseApiFromHook(newValue);
                  }}
                  style={{ marginRight: "8px" }}
                />
                Use API
              </label>
              {!useApi && (
                <div
                  style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}
                >
                  Only MapLibre is available without API
                </div>
              )}
            </div>
            <div className="playground-control-group">
              <label>Map Provider</label>
              <div className="playground-button-group">
                <button
                  type="button"
                  className={mapPlatform === "google" ? "active" : ""}
                  onClick={() => setMapPlatform("google")}
                  disabled={!useApi}
                >
                  Google
                </button>
                <button
                  type="button"
                  className={mapPlatform === "maplibre" ? "active" : ""}
                  onClick={() => setMapPlatform("maplibre")}
                >
                  MapLibre
                </button>
                <button
                  type="button"
                  className={mapPlatform === "mapbox" ? "active" : ""}
                  onClick={() => setMapPlatform("mapbox")}
                  disabled={!useApi}
                >
                  Mapbox
                </button>
              </div>
            </div>
            {mapPlatform === "maplibre" && (
              <div className="playground-control-group">
                <label>MapLibre Style URL</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    value={styleUrl}
                    onChange={(e) => setStyleUrl(e.target.value)}
                    placeholder="https://api.mapfirst.ai/static/style.json"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      try {
                        new URL(styleUrl);
                        setActiveStyleUrl(styleUrl);
                      } catch {
                        alert("Please enter a valid URL");
                      }
                    }}
                    style={{
                      padding: "8px 16px",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
            {useApi && (
              <>
                <div className="playground-control-group">
                  <label>Search Query</label>
                  <input
                    type="text"
                    placeholder="e.g. Hotels near beach"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                {filters.length > 0 && (
                  <div className="playground-control-group">
                    <label>Smart Filters</label>
                    <SmartFilter
                      filters={filters}
                      isSearching={state?.isSearching}
                      onFilterChange={handleFilterChange}
                      currency={currency}
                    />
                  </div>
                )}
                <div className="playground-control-group">
                  <label>Location</label>
                  <div className="playground-location-wrapper">
                    <input
                      type="text"
                      placeholder="Search for a city or place"
                      value={locationInput}
                      onChange={(e) =>
                        handleLocationInputChange(e.target.value)
                      }
                      onFocus={() => {
                        if (suggestions.length > 0) setShowDropdown(true);
                      }}
                      onBlur={() => {
                        setTimeout(() => setShowDropdown(false), 200);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowDown") {
                          e.preventDefault();
                          setHighlightedIndex((idx) =>
                            suggestions.length
                              ? (idx + 1) % suggestions.length
                              : -1
                          );
                        } else if (e.key === "ArrowUp") {
                          e.preventDefault();
                          setHighlightedIndex((idx) =>
                            suggestions.length
                              ? (idx - 1 + suggestions.length) %
                                suggestions.length
                              : -1
                          );
                        } else if (e.key === "Enter") {
                          if (
                            highlightedIndex >= 0 &&
                            highlightedIndex < suggestions.length
                          ) {
                            e.preventDefault();
                            selectLocation(suggestions[highlightedIndex]);
                          }
                        } else if (e.key === "Escape") {
                          setShowDropdown(false);
                        }
                      }}
                    />
                    {showDropdown && suggestions.length > 0 && (
                      <div className="playground-location-dropdown">
                        {suggestions.map((feature, i) => (
                          <button
                            key={feature.id}
                            type="button"
                            className={
                              i === highlightedIndex ? "highlighted" : ""
                            }
                            onMouseDown={(e) => {
                              e.preventDefault();
                              selectLocation(feature);
                            }}
                            onMouseEnter={() => setHighlightedIndex(i)}
                          >
                            <div className="location-name">{feature.text}</div>
                            <div className="location-address">
                              {feature.place_name}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="playground-control-group">
                  <label>Check-in Date</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                  />
                </div>
                <div className="playground-control-group">
                  <label>Check-out Date</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                  />
                </div>
                <div className="playground-control-group">
                  <div className="playground-row">
                    <div>
                      <label>Adults</label>
                      <input
                        type="number"
                        value={adults}
                        onChange={(e) => setAdults(parseInt(e.target.value))}
                        min="1"
                      />
                    </div>
                    <div>
                      <label>Rooms</label>
                      <input
                        type="number"
                        value={rooms}
                        onChange={(e) => setRooms(parseInt(e.target.value))}
                        min="1"
                      />
                    </div>
                  </div>
                </div>
                <div className="playground-control-group">
                  <div className="playground-row">
                    <div>
                      <label>Currency</label>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                      </select>
                    </div>
                    {/* <div>
              <label>Locale</label>
              <select
                value={locale}
                onChange={(e) => setLocale(e.target.value)}
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="it">Italiano</option>
                <option value="pt">Português</option>
                <option value="ja">日本語</option>
                <option value="zh">中文</option>
              </select>
            </div> */}
                  </div>
                </div>{" "}
                <button
                  className="playground-search-btn"
                  onClick={handleBasicSearch}
                  disabled={isSearching}
                >
                  {isSearching ? "Searching..." : "Search"}
                </button>
              </>
            )}
          </>
        )}
      </aside>

      <section className="playground-map-container">
        {/* SmartFilter Component */}
        {pendingBounds && !isSearching && useApi && (
          <button
            className="playground-search-area-btn"
            style={{ display: "block" }}
            onClick={handleBoundsSearch}
            disabled={isSearching}
          >
            {isSearching ? "Searching..." : "Search this area"}
          </button>
        )}
        <div ref={mapContainerRef} className="playground-map-canvas" />

        {/* Property Carousel */}
        {properties.length > 0 && (
          <PropertyCarousel
            properties={properties}
            selectedMarker={selectedMarker}
            onSelectMarker={setSelectedMarker}
            onFlyTo={handleFlyTo}
          />
        )}
      </section>
    </div>
  );
}
