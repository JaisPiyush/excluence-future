/** @type {import('next').NextConfig} */
// const CadencePlugin = require('cadence-webpack-plugin');

const nextConfig = {
  reactStrictMode: true,
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    // Important: return the modified config
    config.module.rules.push({
      test: /\.cdc/,
      type: "asset/source",
    });
    // config.plugins.push(
    //   new CadencePlugin()
    // );
    return config
  },
}

module.exports = nextConfig;
