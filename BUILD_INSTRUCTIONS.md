# Building the MapFirst SDK After SmartFilter Addition

## Overview

After adding the SmartFilter component and related files, you need to rebuild the packages to generate TypeScript declarations and make the new exports available.

## Build Steps

### 1. Navigate to SDK Root

```bash
cd /Users/sandeshveerani/Documents/mapfirst-sdk
```

### 2. Install Dependencies (if needed)

```bash
pnpm install
```

### 3. Build Core Package

The core package must be built first since react depends on it:

```bash
cd packages/core
pnpm build
```

Or from root:

```bash
pnpm --filter @mapfirst.ai/core build
```

### 4. Build React Package

```bash
cd packages/react
pnpm build
```

Or from root:

```bash
pnpm --filter @mapfirst.ai/react build
```

### 5. Build All Packages (Alternative)

From the root directory:

```bash
pnpm build
```

## Verifying the Build

After building, check that the following exist:

### Core Package

```bash
ls packages/core/dist/
# Should contain: index.js, index.mjs, index.d.ts, and other files
```

Verify exports in `packages/core/dist/index.d.ts`:

```typescript
export type {
  Property,
  PropertyType,
  PriceLevel,
  Price,
  FilterSchema,
  Locale,
} from "./types";
```

### React Package

```bash
ls packages/react/dist/
# Should contain: index.js, index.mjs, index.d.ts, and other files
```

Verify SmartFilter export in `packages/react/dist/index.d.ts`:

```typescript
export { SmartFilter } from "./components/SmartFilter";
export type { SmartFilterProps } from "./components/SmartFilter";
```

## TypeScript Errors Should Resolve

After building, the TypeScript errors you see in the IDE should resolve:

- ✅ `PriceLevel` will be recognized from `@mapfirst.ai/core`
- ✅ `FilterSchema` will be recognized from `@mapfirst.ai/core`
- ✅ `SmartFilter` will be recognized from `@mapfirst.ai/react`
- ✅ All component imports will work correctly

## Common Issues

### "Module not found" errors

**Solution**: Make sure packages are built in the correct order (core → react)

### TypeScript can't find types

**Solution**:

1. Restart TypeScript server in your IDE
2. Delete `node_modules/.cache` if it exists
3. Run `pnpm install` again

### Import errors in example files

**Solution**: The EXAMPLE.tsx file is for reference only. Import from the built packages in your actual application.

## Testing the Build

Create a simple test file to verify everything works:

```tsx
// test-smartfilter.tsx
import { SmartFilter, useMapFirstCore } from "@mapfirst.ai/react";
import type { Filter } from "@mapfirst.ai/react";
import { useState } from "react";

function Test() {
  const { mapFirst, state } = useMapFirstCore({
    initialLocationData: { city: "Test", country: "Test" },
  });

  const [filters, setFilters] = useState<Filter[]>([]);

  return (
    <SmartFilter
      mapFirst={mapFirst}
      filters={filters}
      onSearch={async () => {}}
      onFilterChange={setFilters}
    />
  );
}
```

If this compiles without errors, the build was successful!

## Development Workflow

For active development:

### Watch Mode (Recommended)

Terminal 1 - Core:

```bash
cd packages/core
pnpm dev
```

Terminal 2 - React:

```bash
cd packages/react
pnpm dev
```

This will rebuild automatically when you save files.

### Manual Build

After making changes:

```bash
# From root
pnpm build
```

## Publishing (When Ready)

1. Update version in `packages/react/package.json`
2. Build packages: `pnpm build`
3. Publish: `pnpm publish --filter @mapfirst.ai/react`

## Summary

The key point is that **TypeScript needs the compiled `.d.ts` files** to understand the exports. Once you build the packages, all imports will work correctly and TypeScript errors will disappear.

```bash
# Quick build command from root
pnpm build

# Or individual packages
pnpm --filter @mapfirst.ai/core build
pnpm --filter @mapfirst.ai/react build
```
