# Bounds Search Implementation Summary

## Overview

Implemented `performBoundsSearch` functionality in both the core SDK and React package to enable "Search this area" functionality when users move the map.

## Changes Made

### Core SDK (`@mapfirst.ai/core`)

**New Method: `performBoundsSearch()`**

- Location: `/packages/core/src/index.ts`
- Returns: `Promise<APIResponse | null>`
- Functionality:
  - Checks if `pendingBounds` exists
  - Performs a properties search with the pending bounds
  - Applies price filtering if present
  - Updates `bounds` and `tempBounds` to the searched bounds
  - Clears `pendingBounds` after successful search

```typescript
async performBoundsSearch(): Promise<APIResponse | null> {
  if (!this.state.pendingBounds) {
    return null;
  }

  const filters = this.getFilters();
  const body: InitialRequestBody = {
    bounds: this.state.pendingBounds,
    filters,
  };

  const priceFilter = filters?.price ?? undefined;

  const result = await this.runPropertiesSearch({
    body,
    beforeApplyProperties: () => {
      return { price: priceFilter ?? null };
    },
  });

  if (result) {
    this.setBounds(this.state.pendingBounds);
    this.setTempBounds(this.state.pendingBounds);
    this.setPendingBounds(null);
  }

  return result;
}
```

### React Package (`@mapfirst.ai/react`)

**New Hook: `useMapFirstBoundsSearch()`**

- Location: `/packages/react/src/index.tsx`
- Returns: `{ performBoundsSearch, isSearching, error }`
- Functionality:
  - Wraps the core `performBoundsSearch` method
  - Provides React state for loading and error handling
  - Automatically manages search state

```typescript
export function useMapFirstBoundsSearch(mapFirst: MapFirstCore | null) {
  const [isSearching, setIsSearching] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const performBoundsSearch = React.useCallback(async () => {
    if (!mapFirst) return null;

    setIsSearching(true);
    setError(null);

    try {
      const result = await mapFirst.performBoundsSearch();
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsSearching(false);
    }
  }, [mapFirst]);

  return { performBoundsSearch, isSearching, error };
}
```

## State Management

The SDK tracks three types of bounds:

1. **`bounds`** - Last successfully searched bounds
2. **`pendingBounds`** - New bounds when user moves map (triggers "Search this area")
3. **`tempBounds`** - Temporary bounds during animations

## Usage Pattern

```tsx
import { useMapFirstCore, useMapFirstBoundsSearch } from "@mapfirst.ai/react";

function MapComponent() {
  const { mapFirst, state } = useMapFirstCore({
    /* options */
  });
  const { performBoundsSearch, isSearching } =
    useMapFirstBoundsSearch(mapFirst);

  return (
    <>
      {/* Show button when pendingBounds exists */}
      {state.pendingBounds && !isSearching && (
        <button onClick={() => performBoundsSearch()}>Search this area</button>
      )}

      {/* Map and properties display */}
    </>
  );
}
```

## Integration Points

### Setting Pending Bounds

When the map moves, call `setPendingBounds()`:

```typescript
map.on("moveend", () => {
  const bounds = map.getBounds();
  mapFirst.setPendingBounds({
    sw: { lat: bounds.getSouth(), lng: bounds.getWest() },
    ne: { lat: bounds.getNorth(), lng: bounds.getEast() },
  });
});
```

### PropertyList Example (from ta-widget-next)

```tsx
{
  pendingBounds && !isSearching && (
    <button onClick={() => performBoundsSearch()}>
      {t("hotelList.searchThisArea")}
    </button>
  );
}
```

## Documentation

Created comprehensive documentation:

- `/packages/react/BOUNDS_SEARCH_EXAMPLE.md` - Complete usage guide with examples

## Build Status

✅ Core package built successfully (v0.0.9)
✅ React package built successfully (v0.0.9)
✅ Type definitions generated correctly
✅ All exports verified

## Files Modified

1. `/packages/core/src/index.ts` - Added `performBoundsSearch()` method
2. `/packages/react/src/index.tsx` - Added `useMapFirstBoundsSearch()` hook
3. `/packages/react/package.json` - Updated to use workspace protocol for core dependency

## Files Created

1. `/packages/react/BOUNDS_SEARCH_EXAMPLE.md` - Complete usage documentation

## Next Steps

To use this in your application:

1. Update to latest SDK versions:

   ```bash
   pnpm add @mapfirst.ai/core@latest @mapfirst.ai/react@latest
   ```

2. Implement map movement detection and set `pendingBounds`

3. Use the `useMapFirstBoundsSearch` hook to show a "Search this area" button

4. Call `performBoundsSearch()` when the user clicks the button

## Compatibility

- Works with all supported map platforms (Mapbox, MapLibre, Google Maps)
- Compatible with existing filter and search functionality
- Maintains price range filtering during bounds searches
- Follows the same patterns as the original ta-widget-next implementation
