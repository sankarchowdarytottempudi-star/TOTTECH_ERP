import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["147.93.168.203"],
  serverExternalPackages: ["pdfkit", "qrcode"],
  turbopack: {},
};

export default nextConfig;
