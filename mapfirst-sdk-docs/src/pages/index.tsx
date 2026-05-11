import type { ReactNode } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import CodeBlock from "@theme/CodeBlock";

import styles from "./index.module.css";

const quickStartCode = `import { useMapFirst } from "@mapfirst.ai/react";
import maplibregl from "maplibre-gl";

function MyMap() {
  const { attachMapLibre, state } = useMapFirst({
    apiKey: "your-api-key",
    initialLocationData: {
      city: "Paris",
      country: "France",
      currency: "EUR",
    },
  });

  useEffect(() => {
    const map = new maplibregl.Map({
      container: "map",
      style: "https://api.mapfirst.ai/static/style.json",
      center: [2.3522, 48.8566],
      zoom: 12,
    });

    map.on("load", () => {
      attachMapLibre(map, maplibregl, {
        onMarkerClick: (property) => console.log(property),
      });
    });

    return () => map.remove();
  }, []);

  return <div id="map" style={{ height: "100vh" }} />;
}`;

const features = [
  {
    icon: "🗺️",
    title: "Multi-Platform Maps",
    description:
      "One SDK, three map providers. Works seamlessly with MapLibre GL JS, Mapbox GL JS, and Google Maps — switch with a single line of code.",
  },
  {
    icon: "🤖",
    title: "AI-Powered Search",
    description:
      'Search properties using natural language. Just type "romantic hotels near the Eiffel Tower with a pool" and let AI do the rest.',
  },
  {
    icon: "⚛️",
    title: "React & Vanilla JS",
    description:
      "Use the useMapFirst hook in React apps, or drop in a <script> tag for vanilla JavaScript. Full flexibility, zero lock-in.",
  },
  {
    icon: "🏷️",
    title: "Smart Filters",
    description:
      "Dynamic, interactive filter chips generated from AI search results. Users can toggle, remove, and refine with instant updates.",
  },
  {
    icon: "📍",
    title: "Rich Property Data",
    description:
      "Access ratings, reviews, pricing, images, and awards from Tripadvisor. Everything you need to build compelling property cards.",
  },
  {
    icon: "📱",
    title: "Responsive & Accessible",
    description:
      "Mobile-first design with full keyboard navigation and ARIA support. Beautiful on every screen size, usable by everyone.",
  },
];

const platforms = [
  {
    name: "MapLibre GL JS",
    tagline: "Open-source & free",
    icon: "🌍",
  },
  {
    name: "Mapbox GL JS",
    tagline: "Premium mapping",
    icon: "🗺️",
  },
  {
    name: "Google Maps",
    tagline: "Industry standard",
    icon: "📍",
  },
];

const steps = [
  {
    step: "01",
    title: "Install the SDK",
    description: "Add the packages to your project with npm, pnpm, or yarn.",
    code: "npm install @mapfirst.ai/react maplibre-gl",
  },
  {
    step: "02",
    title: "Initialize & Attach",
    description:
      "Create a map instance and connect it to MapFirst with one hook call.",
    code: 'const { attachMapLibre } = useMapFirst({ apiKey: "..." });',
  },
  {
    step: "03",
    title: "Search & Display",
    description:
      "Search properties by location, filters, or natural language — markers appear automatically.",
    code: 'await propertiesSearch({ body: { city: "Paris", ... } });',
  },
];

function HomepageHero() {
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className={styles.heroInner}>
        <div className={styles.heroTagline}>
          <span>✨</span> Open-Source Mapping SDK
        </div>
        <Heading as="h1" className={styles.heroTitle}>
          Build intelligent
          <br />
          <span className={styles.heroTitleAccent}>map experiences</span>
        </Heading>
        <p className={styles.heroSubtitle}>
          MapFirst SDK gives you AI-powered property search, smart filters, and
          multi-platform map support — all in a single, developer-friendly
          package.
        </p>
        <div className={styles.buttons}>
          <Link
            className={clsx("button button--lg", styles.primaryBtn)}
            to="/docs/intro"
          >
            Get Started →
          </Link>
          <Link
            className={clsx("button button--lg", styles.secondaryBtn)}
            to="/playground"
          >
            Try the Playground
          </Link>
        </div>
        <div className={styles.heroStats}>
          <div className={styles.stat}>
            <div className={styles.statValue}>3</div>
            <div className={styles.statLabel}>Map Platforms</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statValue}>AI</div>
            <div className={styles.statLabel}>Powered Search</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statValue}>TS</div>
            <div className={styles.statLabel}>Type-Safe</div>
          </div>
        </div>
      </div>
    </header>
  );
}

function InstallBanner() {
  return (
    <section className={styles.installBanner}>
      <div className={clsx("container", styles.installInner)}>
        <div className={styles.installCode}>
          <span className={styles.installPrompt}>$</span>{" "}
          <span className={styles.installCmd}>npm install</span>{" "}
          <span className={styles.installPkg}>
            @mapfirst.ai/react maplibre-gl
          </span>
        </div>
      </div>
    </section>
  );
}

function PlatformShowcase() {
  return (
    <section className={styles.platforms}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Integrations</span>
          <Heading as="h2" className={styles.sectionTitle}>
            One SDK. Three map platforms.
          </Heading>
          <p className={styles.sectionSubtitle}>
            Write your code once and deploy on any map provider. Switch between
            platforms without rewriting your application logic.
          </p>
        </div>
        <div className={styles.platformGrid}>
          {platforms.map((platform) => (
            <div key={platform.name} className={styles.platformCard}>
              <div className={styles.platformIcon}>{platform.icon}</div>
              <Heading as="h3" className={styles.platformName}>
                {platform.name}
              </Heading>
              <span className={styles.platformTag}>{platform.tagline}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Features</span>
          <Heading as="h2" className={styles.sectionTitle}>
            Everything you need to build
            <br />
            location-based apps
          </Heading>
          <p className={styles.sectionSubtitle}>
            From smart search to custom markers, MapFirst SDK handles the hard
            parts so you can focus on building great user experiences.
          </p>
        </div>
        <div className={styles.featureGrid}>
          {features.map((feature) => (
            <div key={feature.title} className={styles.featureCard}>
              <div className={styles.featureIcon}>{feature.icon}</div>
              <Heading as="h3" className={styles.featureTitle}>
                {feature.title}
              </Heading>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CodePreview() {
  return (
    <section className={styles.codePreview}>
      <div className="container">
        <div className={styles.codePreviewInner}>
          <div className={styles.codePreviewText}>
            <span className={styles.sectionLabel}>Quick Start</span>
            <Heading as="h2" className={styles.codePreviewTitle}>
              Up and running
              <br />
              in minutes
            </Heading>
            <p className={styles.codePreviewDesc}>
              Initialize a map, attach the SDK, and start searching for
              properties — all with a few lines of code. The{" "}
              <code>useMapFirst</code> hook handles state management, marker
              rendering, and API calls automatically.
            </p>
            <div className={styles.codeCheckList}>
              <div className={styles.codeCheckItem}>
                <span className={styles.checkIcon}>✓</span>
                Automatic marker management
              </div>
              <div className={styles.codeCheckItem}>
                <span className={styles.checkIcon}>✓</span>
                Built-in state management
              </div>
              <div className={styles.codeCheckItem}>
                <span className={styles.checkIcon}>✓</span>
                Type-safe with full TypeScript support
              </div>
              <div className={styles.codeCheckItem}>
                <span className={styles.checkIcon}>✓</span>
                Works with SSR frameworks (Next.js, Remix)
              </div>
            </div>
            <Link
              className={clsx("button button--lg", styles.primaryBtn)}
              to="/docs/getting-started/react"
              style={{ marginTop: "1.5rem", alignSelf: "flex-start" }}
            >
              View Full Guide →
            </Link>
          </div>
          <div className={styles.codeBlock}>
            <CodeBlock language="tsx" title="MapComponent.tsx">
              {quickStartCode}
            </CodeBlock>
          </div>
        </div>
      </div>
    </section>
  );
}

function StepsSection() {
  return (
    <section className={styles.steps}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>How It Works</span>
          <Heading as="h2" className={styles.sectionTitle}>
            Three steps to your first map
          </Heading>
          <p className={styles.sectionSubtitle}>
            Go from zero to a fully functional, searchable map in under five
            minutes.
          </p>
        </div>
        <div className={styles.stepsGrid}>
          {steps.map((s) => (
            <div key={s.step} className={styles.step}>
              <div className={styles.stepNumber}>{s.step}</div>
              <Heading as="h3" className={styles.stepTitle}>
                {s.title}
              </Heading>
              <p className={styles.stepDescription}>{s.description}</p>
              <div className={styles.stepCode}>
                <code>{s.code}</code>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className={styles.cta}>
      <div className="container">
        <div className={styles.ctaInner}>
          <Heading as="h2" className={styles.ctaTitle}>
            Ready to build something amazing?
          </Heading>
          <p className={styles.ctaDescription}>
            Start building intelligent, map-powered applications today. Free to
            use, open-source, and backed by a growing community.
          </p>
          <div className={styles.ctaButtons}>
            <Link
              className={clsx("button button--lg", styles.primaryBtn)}
              to="/docs/intro"
            >
              Read the Docs
            </Link>
            <Link
              className={clsx("button button--lg", styles.secondaryBtn)}
              to="https://github.com/mapfirst-ai/mapfirst-sdk"
            >
              ⭐ Star on GitHub
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title="Build Intelligent Map Experiences"
      description="MapFirst SDK — AI-powered property search, smart filters, and multi-platform map support for React and vanilla JavaScript."
    >
      <HomepageHero />
      <InstallBanner />
      <main>
        <PlatformShowcase />
        <FeaturesSection />
        <CodePreview />
        <StepsSection />
        <CTASection />
      </main>
    </Layout>
  );
}
