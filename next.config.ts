import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow LAN devices (e.g. phone) to load dev resources so client JS hydrates.
  allowedDevOrigins: ["192.168.1.170"],
  async redirects() {
    return [
      {
        source: "/savethedate",
        destination: "https://vishanna-savethedate.replit.app/savethedate/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
