/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "asuekkbhmixsnrgjxmlm.supabase.co",
      },
      {
        protocol: "https",
        hostname: "pub-a51402cc9e374169b51e20457622d401.r2.dev",
      },
    ],
  },
  webpack: (config) => {
    // react-pdf/pdfjs reference an optional native `canvas` dep that breaks the build.
    config.resolve.alias.canvas = false;
    return config;
  },
};

module.exports = nextConfig;
