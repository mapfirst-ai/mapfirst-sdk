import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)
import "dotenv/config";

const config: Config = {
  title: "MapFirst SDK Docs",
  tagline: "Build powerful location-based applications",

  headTags: [
    {
      tagName: "link",
      attributes: {
        rel: "icon",
        href: "/img/light-logo.png",
        media: "(prefers-color-scheme: light)",
      },
    },
    {
      tagName: "link",
      attributes: {
        rel: "icon",
        href: "/img/dark-logo.png",
        media: "(prefers-color-scheme: dark)",
      },
    },
  ],

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: "https://mapfirst-ai.github.io",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  organizationName: "mapfirst-ai",
  projectName: "mapfirst-sdk",

  // Custom fields for environment variables
  customFields: {
    mapboxAccessToken: process.env.MAPBOX_ACCESS_TOKEN,
  },

  onBrokenLinks: "throw",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  plugins: ["@cmfcmf/docusaurus-search-local"],

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          editUrl:
            "https://github.com/mapfirst-ai/mapfirst-sdk/tree/main/mapfirst-sdk-docs/",
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },
          editUrl:
            "https://github.com/mapfirst-ai/mapfirst-sdk/tree/main/mapfirst-sdk-docs/",
          // Useful options to enforce blogging best practices
          onInlineTags: "warn",
          onInlineAuthors: "warn",
          onUntruncatedBlogPosts: "warn",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
        googleTagManager: {
          containerId: "G-YJ4W52R4KM",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: "img/docusaurus-social-card.jpg",
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      logo: {
        alt: "MapFirst SDK Logo",
        src: "img/logo.png",
        href: "https://mapfirst.ai",
        target: "_self",
      },
      items: [
        {
          to: "/",
          label: "Home",
          position: "left",
          activeBasePath: "never",
        },
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "Documentation",
        },
        { to: "/blog", label: "Blog", position: "left" },
        { to: "/playground", label: "Playground", position: "left" },
        {
          href: "https://www.mapfirst.ai/publishers",
          label: "Publishers",
          position: "right",
        },
        {
          href: "https://www.mapfirst.ai/advertisers",
          label: "Advertisers",
          position: "right",
        },
        {
          href: "https://github.com/mapfirst-ai/mapfirst-sdk",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Getting Started",
              to: "/docs/intro",
            },
            {
              label: "React Guide",
              to: "/docs/getting-started/react",
            },
            {
              label: "HTML Guide",
              to: "/docs/getting-started/html",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "GitHub Discussions",
              href: "https://github.com/mapfirst-ai/mapfirst-sdk/discussions",
            },
            {
              label: "Issues",
              href: "https://github.com/mapfirst-ai/mapfirst-sdk/issues",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "Blog",
              to: "/blog",
            },
            {
              label: "GitHub",
              href: "https://github.com/mapfirst-ai/mapfirst-sdk",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} MapFirst. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
