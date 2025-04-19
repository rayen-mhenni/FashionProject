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
    domains: [
      "localhost:3003",
      "localhost",
      "robohash.org",
      "res.cloudinary.com",
      "dptvo-store.com",
      "threadlogic.com",
      "celio.tn",
      "127.0.0.1",
      "dummyimage.com",
      "www.fotomag.shop",
      "fotomag.shop",
      "*"
    ],
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
