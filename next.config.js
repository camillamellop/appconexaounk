const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: "NetworkFirst",
      options: {
        cacheName: "offlineCache",
        expiration: { maxEntries: 200 },
      },
    },
  ],
})

/** @type {import("next").NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Prevent client bundle from trying to polyfill Node-only modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        assert: false,
        buffer: false,
        crypto: false,
        dns: false,
        fs: false,
        http: false,
        https: false,
        net: false,
        os: false,
        path: false,
        stream: false,
        tls: false,
        url: false,
        zlib: false,
        child_process: false,
        pg: false, // ⬅️ avoid bundling the pg driver in client
      }
    }
    return config
  },
}

module.exports = withPWA(nextConfig)
