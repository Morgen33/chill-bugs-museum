import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    return [
      {
        source: "/share/wall/:address/:room",
        destination: "/share/hang/:address/:room",
        permanent: true,
      },
      {
        source: "/share/wall/:address/:room/opengraph-image",
        destination: "/share/hang/:address/:room/card.png",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.seadn.io", pathname: "/**" },
      { protocol: "https", hostname: "i2.seadn.io", pathname: "/**" },
      { protocol: "https", hostname: "i2c.seadn.io", pathname: "/**" },
      { protocol: "https", hostname: "openseauserdata.com", pathname: "/**" },
      { protocol: "https", hostname: "raw.seadn.io", pathname: "/**" },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      { protocol: "https", hostname: "ipfs.io", pathname: "/**" },
      { protocol: "https", hostname: "nft-cdn.alchemy.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
