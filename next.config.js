/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config) => {
    // Fabric.js pulls in jsdom -> ws -> native binary modules (canvas, utf-8-validate, bufferutil)
    // that can't be bundled for the browser. Alias them to empty modules.
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
      jsdom: false,
      ws: false,
      'utf-8-validate': false,
      bufferutil: false,
    };
    // Ignore any remaining .node native binaries
    config.module.rules.push({
      test: /\.node$/,
      use: 'ignore-loader',
    });
    return config;
  },
};

module.exports = nextConfig;
