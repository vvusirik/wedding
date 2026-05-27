import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow LAN devices (e.g. phone) to load dev resources so client JS hydrates.
  allowedDevOrigins: ["192.168.1.170"],
};

export default nextConfig;
