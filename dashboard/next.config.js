const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { defaultLoaders }) => {
    // Transpile composition files from the remotion project
    config.module.rules.push({
      test: /\.(tsx?|jsx?)$/,
      include: [path.resolve(__dirname, "../remotion/src")],
      use: defaultLoaders.babel,
    });

    // Force ALL remotion imports (dashboard + remotion/src compositions)
    // to use the same package instance so React context is shared.
    config.resolve.alias["remotion"] = path.resolve(__dirname, "node_modules/remotion");
    config.resolve.alias["@remotion/player"] = path.resolve(__dirname, "node_modules/@remotion/player");

    return config;
  },

  async rewrites() {
    return {
      // Proxy unmatched paths (Remotion static assets like images/audio)
      // to the Remotion Studio server so staticFile() works in the player.
      fallback: [
        { source: "/:path*", destination: "http://localhost:3000/:path*" },
      ],
    };
  },
};

module.exports = nextConfig;
