import React from "react";
import {
  MapFirstCore,
  type MapFirstOptions,
  type Property,
} from "@mapfirst/core";

/**
 * Simple hook that creates the MapFirstCore instance whenever options change.
 * Consumers can call instance.current?.setMarkers(...) or instance.current?.refresh().
 */
export function useMapFirst(options: MapFirstOptions | null) {
  const instanceRef = React.useRef<MapFirstCore | null>(null);

  React.useEffect(() => {
    if (!options) {
      return undefined;
    }
    const instance = new MapFirstCore(options);
    instanceRef.current = instance;

    return () => {
      instanceRef.current = null;
    };
  }, [options]);

  return instanceRef;
}

/**
 * Helper component that simply renders the markers it receives so non-React environments
 * can verify data flows before wiring the SDK into a map.
 */
export function MarkerDebugList({ markers }: { markers: Property[] }) {
  return (
    <div style={{ fontFamily: "sans-serif", fontSize: 14 }}>
      <strong>Markers</strong>
      <ul>
        {markers.map((marker) => (
          <li key={String(marker.tripadvisor_id)}>
            {marker.name} — {marker.location?.lat?.toFixed(3) ?? "n/a"},{" "}
            {marker.location?.lon?.toFixed(3) ?? "n/a"}
          </li>
        ))}
      </ul>
    </div>
  );
}
