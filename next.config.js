/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    // Pages folded into /about in the 2026 redesign.
    return ["/craft", "/thinking", "/now"].map((source) => ({ source, destination: "/about", permanent: true }));
  },
};
module.exports = nextConfig;
