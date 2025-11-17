import * as react_jsx_runtime from 'react/jsx-runtime';
import React from 'react';
import { MapFirstOptions, MapFirstCore, Property } from '@mapfirst/core';

/**
 * Simple hook that creates the MapFirstCore instance whenever options change.
 * Consumers can call instance.current?.setMarkers(...) or instance.current?.refresh().
 */
declare function useMapFirst(options: MapFirstOptions | null): React.RefObject<MapFirstCore | null>;
/**
 * Helper component that simply renders the markers it receives so non-React environments
 * can verify data flows before wiring the SDK into a map.
 */
declare function MarkerDebugList({ markers }: {
    markers: Property[];
}): react_jsx_runtime.JSX.Element;

export { MarkerDebugList, useMapFirst };
