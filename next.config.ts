import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";
import { networkInterfaces } from "node:os";

export default function nextConfig(phase: string): NextConfig {
  if (phase !== PHASE_DEVELOPMENT_SERVER) {
    return {};
  }

  const localIPs = Object.values(networkInterfaces())
    .flat()
    .filter(
      (network): network is NonNullable<typeof network> =>
        Boolean(
          network &&
            network.family === "IPv4" &&
            !network.internal
        )
    )
    .map((network) => network.address);

  return {
    allowedDevOrigins: [...new Set(localIPs)],
  };
}