const withPWA = require("next-pwa");

// module.exports = withPWA({
module.exports = {
  i18n: {
    locales: ["en", "my"],
    defaultLocale: "en",
  },
  reactStrictMode: true,
  // swcMinify: true,
  compiler: {
    removeConsole: false,
  },
  images: {
    domains: ["robohash.org", "res.cloudinary.com", "dptvo-store.com", "threadlogic.com", "celio.tn","127.0.0.1"],
  },
  pwa: {
    dest: "public",
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};
// });
