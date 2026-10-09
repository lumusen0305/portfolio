import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static talk decks live under /public/talks/<name>/index.html. The folder URL must keep its
  // trailing slash so the deck's relative asset paths resolve, hence trailingSlash on the whole site
  // (the portfolio only has "/", so nothing else changes).
  trailingSlash: true,
  async rewrites() {
    return [{ source: "/talks/:deck/", destination: "/talks/:deck/index.html" }];
  },
  // Let a phone on the same WiFi load dev resources via the LAN IP.
  // (Next 16 blocks cross-origin dev assets by default; this allowlists the host.)
  allowedDevOrigins: ["192.168.0.62"],
  images: {
    // Project cover art lives in /public/img/projects as trusted, first-party SVGs.
    // next/image refuses to serve SVG unless explicitly allowed; the CSP below
    // sandboxes them (no scripts) since they are our own static assets.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
