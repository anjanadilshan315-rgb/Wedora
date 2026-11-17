import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
  },
  // Runtime databases and local browser QA artifacts must stay out of server bundles.
  outputFileTracingExcludes: {
    "/*": ["./.data/**/*"],
  },
};

export default nextConfig;
