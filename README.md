# MapFirst SDK

[![npm version - @mapfirst.ai/react](https://img.shields.io/npm/v/@mapfirst.ai/react.svg)](https://www.npmjs.com/package/@mapfirst.ai/react)
[![npm version - @mapfirst.ai/core](https://img.shields.io/npm/v/@mapfirst.ai/core.svg)](https://www.npmjs.com/package/@mapfirst.ai/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A powerful mapping SDK that provides intelligent property search with AI-powered filters across multiple map platforms. Build sophisticated map-based applications with ease using MapLibre GL JS, Google Maps, or Mapbox GL JS.

## 🚀 Features

- **Multi-Platform Support**: Seamlessly works with MapLibre GL JS, Google Maps, and Mapbox GL JS
- **Smart Search**: AI-powered search with natural language queries
- **Interactive Filters**: Dynamic filter chips with real-time updates
- **React & Vanilla JS**: Full support for React applications and plain HTML/JavaScript
- **TypeScript**: Full type safety with comprehensive TypeScript definitions
- **Responsive Design**: Mobile-first, adapts to any screen size
- **Accessible**: Full keyboard navigation and ARIA support
- **i18n Ready**: Built-in internationalization support

## 📦 Packages

This monorepo contains the following packages:

- **[@mapfirst/core](./packages/core)** - Core SDK with map adapters for MapLibre, Google Maps, and Mapbox
- **[@mapfirst/react](./packages/react)** - React hooks and components including SmartFilter

## 🎯 Quick Start

### React

```bash
npm install @mapfirst/react @mapfirst/core
```

```tsx
import { useMapFirst, SmartFilter } from "@mapfirst/react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

function MapComponent() {
  const {
    instance: mapFirst,
    state,
    attachMapLibre,
  } = useMapFirst({
    initialLocationData: {
      city: "Paris",
      country: "France",
      currency: "EUR",
    },
  });

  // Initialize and attach your map
  // Display properties with state.properties
}
```

### HTML/JavaScript

```html
<script src="https://unpkg.com/@mapfirst.ai/core@latest/dist/index.global.js"></script>
<script>
  const mapFirst = new MapFirstCore.MapFirstCore({
    initialLocationData: {
      city: "Paris",
      country: "France",
      currency: "EUR",
    },
  });
</script>
```

## 📚 Documentation

Visit our comprehensive documentation at [docs.mapfirst.ai](https://docs.mapfirst.ai/)

- [Getting Started with React](https://docs.mapfirst.ai/docs/getting-started/react)
- [Getting Started with HTML](https://docs.mapfirst.ai/docs/getting-started/html)
- [SmartFilter Component](https://docs.mapfirst.ai/docs/components/smart-filter)
- [API Reference](https://docs.mapfirst.ai/docs/api/use-mapfirst)
- [Examples](https://docs.mapfirst.ai/docs/examples/basic-map)

## 🛠️ Development

This project uses [pnpm](https://pnpm.io/) for package management and is structured as a monorepo.

### Prerequisites

- Node.js >= 20.0
- pnpm >= 8.0

### Setup

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run documentation site
cd mapfirst-sdk-docs
pnpm start
```

### Project Structure

```
mapfirst-sdk/
├── packages/
│   ├── core/          # Core SDK
│   └── react/         # React components and hooks
├── mapfirst-sdk-docs/ # Documentation site (Docusaurus)
└── package.json       # Root workspace configuration
```

### Building Packages

```bash
# Build all packages
pnpm build

# Build specific package
cd packages/core && pnpm build
cd packages/react && pnpm build
```

### Publishing

```bash
# Publish core package
pnpm publish:core

# Publish react package
pnpm publish:react

# Publish all packages
pnpm publish:all
```

## 🎨 Examples

Check out our example applications:

- [mapfirst-sdk-example](https://github.com/mapfirst-ai/mapfirst-sdk-example) - Complete Next.js application with all features
- [HTML Example](./mapfirst-html-example) - Vanilla JavaScript implementation

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Website](https://mapfirst.ai)
- [Documentation](https://docs.mapfirst.ai/)
- [NPM - @mapfirst/core](https://www.npmjs.com/package/@mapfirst.ai/core)
- [NPM - @mapfirst/react](https://www.npmjs.com/package/@mapfirst.ai/react)
- [GitHub Issues](https://github.com/mapfirst-ai/mapfirst-sdk/issues)
- [GitHub Discussions](https://github.com/mapfirst-ai/mapfirst-sdk/discussions)

## 💬 Support

- 📧 Email: support@mapfirst.ai
- 💬 [GitHub Discussions](https://github.com/mapfirst-ai/mapfirst-sdk/discussions)
- 🐛 [GitHub Issues](https://github.com/mapfirst-ai/mapfirst-sdk/issues)

## 🙏 Acknowledgments

Built with:

- [MapLibre GL JS](https://maplibre.org/)
- [Mapbox GL JS](https://www.mapbox.com/)
- [Google Maps Platform](https://developers.google.com/maps)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Docusaurus](https://docusaurus.io/)

---

Made with ❤️ by the MapFirst team
