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
        expiration: {
          maxEntries: 200,
        },
      },
    },
  ],
})

/** @type {import('next').NextConfig} */
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
    // Only the server bundle should include Node-specific libraries.
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        assert: false,
        buffer: false,
        child_process: false,
        crypto: false,
        dns: false,
        fs: false,
        http: false,
        https: false,
        net: false,
        os: false,
        path: false,
        pg: false,
        stream: false,
        tls: false,
        url: false,
        zlib: false,
      }
    }
    return config
  },
}

module.exports = withPWA(nextConfig)
