---
sidebar_position: 4
---

# Fetching Property Images

Learn how to fetch and display TripAdvisor images for properties using the MapFirst SDK.

## Overview

The SDK provides a `fetchImages` function that retrieves high-quality images from TripAdvisor for any property. This is useful for:

- Displaying property previews in cards or lists
- Creating image galleries
- Showing property details in modals or sidebars
- Building custom UI components

## Import

```typescript
import { fetchImages } from "@mapfirst.ai/core";
```

## Basic Usage

### Fetch a Single Image

```typescript
const imageUrl = await fetchImages(tripadvisorId, 1);

if (imageUrl) {
  console.log("Image URL:", imageUrl);
} else {
  console.log("No image found");
}
```

### Fetch Multiple Images

```typescript
// Fetch up to 5 images
const imageUrl = await fetchImages(tripadvisorId, 5);
```

## React Example

### Property Card with Image

```tsx
import React, { useState, useEffect } from "react";
import { fetchImages, type Property } from "@mapfirst.ai/core";

function PropertyCard({ property }: { property: Property }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
          setLoading(false);
        }
      }
    }

    loadImage();

    return () => {
      cancelled = true;
    };
  }, [property.tripadvisor_id]);

  return (
    <div className="property-card">
      {loading ? (
        <div className="image-placeholder">Loading...</div>
      ) : imageUrl ? (
        <img src={imageUrl} alt={property.name} />
      ) : (
        <div className="image-placeholder">No image available</div>
      )}
      <h3>{property.name}</h3>
      <p>Rating: {property.rating}/5</p>
    </div>
  );
}
```

### Image with Fallback

```tsx
import React, { useState, useEffect } from "react";
import { fetchImages, type Property } from "@mapfirst.ai/core";

function PropertyImage({ property }: { property: Property }) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadImage() {
      try {
        const url = await fetchImages(property.tripadvisor_id, 1);
        if (!cancelled) {
          if (url) {
            setImageSrc(url);
          } else {
            setImageError(true);
          }
        }
      } catch {
        if (!cancelled) {
          setImageError(true);
        }
      }
    }

    loadImage();

    return () => {
      cancelled = true;
    };
  }, [property.tripadvisor_id]);

  // Fallback image based on property type
  const getFallbackImage = () => {
    const typeMap = {
      Accommodation: "/img/accommodation.webp",
      "Eat & Drink": "/img/restaurant.webp",
      Attraction: "/img/attraction.webp",
    };
    return typeMap[property.type] || "/img/default.webp";
  };

  return (
    <img
      src={
        imageSrc ||
        (imageError
          ? getFallbackImage()
          : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E")
      }
      alt={property.name}
      onError={() => {
        setImageError(true);
        setImageSrc(getFallbackImage());
      }}
    />
  );
}
```

## Vanilla JavaScript Example

```javascript
// HTML
<div id="property-list"></div>

<script>
  const { fetchImages } = window.MapFirstCore;

  async function displayProperty(property) {
    const container = document.getElementById("property-list");
    const card = document.createElement("div");
    card.className = "property-card";

    // Create image element with placeholder
    const img = document.createElement("img");
    img.alt = property.name;
    img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E";

    // Fetch and update image
    try {
      const imageUrl = await fetchImages(property.tripadvisor_id, 1);
      if (imageUrl) {
        img.src = imageUrl;
      } else {
        // Fallback to default image
        img.src = `/img/${property.type.toLowerCase().replace(/ /g, '-')}.webp`;
      }
    } catch (error) {
      console.error("Failed to load image:", error);
      img.src = "/img/default.webp";
    }

    card.appendChild(img);

    const title = document.createElement("h3");
    title.textContent = property.name;
    card.appendChild(title);

    container.appendChild(card);
  }
</script>
```

## Image Gallery Example

```tsx
import React, { useState, useEffect } from "react";
import { fetchImages, type Property } from "@mapfirst.ai/core";

function PropertyGallery({ property }: { property: Property }) {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadImages() {
      try {
        // Fetch up to 10 images
        const imageUrl = await fetchImages(property.tripadvisor_id, 10);
        if (!cancelled && imageUrl) {
          // Note: fetchImages currently returns only the first image URL
          // For multiple images, you may need to make separate calls or
          // parse the full response from the API
          setImages([imageUrl]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadImages();

    return () => {
      cancelled = true;
    };
  }, [property.tripadvisor_id]);

  if (loading) {
    return <div>Loading gallery...</div>;
  }

  if (images.length === 0) {
    return <div>No images available</div>;
  }

  return (
    <div className="gallery">
      {images.map((url, index) => (
        <img key={index} src={url} alt={`${property.name} - ${index + 1}`} />
      ))}
    </div>
  );
}
```

## API Reference

### fetchImages

Fetches property images from TripAdvisor.

```typescript
fetchImages(
  tripadvisorId: number,
  limit?: number
): Promise<string | null>
```

**Parameters:**

- `tripadvisorId` - The TripAdvisor ID of the property (from `property.tripadvisor_id`)
- `limit` - Maximum number of images to fetch (default: 1)

**Returns:**

- `Promise<string | null>` - URL of the first image, or `null` if no images found

**Example:**

```typescript
const property = {
  tripadvisor_id: 123456,
  name: "Hotel Example",
  // ...other properties
};

const imageUrl = await fetchImages(property.tripadvisor_id, 1);

if (imageUrl) {
  console.log("Image URL:", imageUrl);
} else {
  console.log("No image available");
}
```

## Best Practices

### 1. Handle Loading States

Always show a loading indicator while fetching images:

```tsx
{
  loading ? (
    <div className="skeleton-loader" />
  ) : (
    <img src={imageUrl} alt={property.name} />
  );
}
```

### 2. Provide Fallback Images

Always have fallback images for when TripAdvisor images aren't available:

```tsx
const fallbackImage = imageError
  ? `/img/${property.type}.webp`
  : greyPlaceholder;
```

### 3. Cancel Requests in useEffect

Always clean up asynchronous operations:

```tsx
useEffect(() => {
  let cancelled = false;

  async function load() {
    const url = await fetchImages(id);
    if (!cancelled) setImageUrl(url);
  }

  load();

  return () => {
    cancelled = true;
  };
}, [id]);
```

### 4. Lazy Load Images

For lists with many properties, consider lazy loading images:

```tsx
import { useIntersectionObserver } from "./hooks";

function PropertyImage({ property }) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const ref = useRef(null);

  useIntersectionObserver(ref, () => {
    setShouldLoad(true);
  });

  useEffect(() => {
    if (!shouldLoad) return;
    // Fetch image...
  }, [shouldLoad]);

  return <div ref={ref}>...</div>;
}
```

### 5. Cache Images

Consider caching fetched image URLs to avoid redundant API calls:

```tsx
const imageCache = new Map<number, string>();

async function getCachedImage(id: number) {
  if (imageCache.has(id)) {
    return imageCache.get(id);
  }

  const url = await fetchImages(id);
  if (url) {
    imageCache.set(id, url);
  }
  return url;
}
```

## Styling Examples

### Responsive Card

```css
.property-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.property-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.image-placeholder {
  width: 100%;
  height: 200px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
```

## See Also

- [Property Type Reference](../api/core#property)
- [useMapFirst Hook](../api/use-mapfirst)
- [Searching Guide](./searching)
