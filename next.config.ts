import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    agentFeedback: true,
    instantInsights: {
      // In mock mode MswProvider renders nothing until the service worker is ready,
      // so implicit instant-navigation validation would flag every page as dropped.
      validationLevel:
        process.env.NEXT_PUBLIC_API_MOCKING === "enabled" ? "manual-warning" : "warning",
    },
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    resolveAlias: {
      "msw/browser": { browser: "msw/browser", default: false },
    },
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      ...(isServer ? { "msw/browser": false } : { "msw/node": false }),
    };
    return config;
  },
};

export default nextConfig;