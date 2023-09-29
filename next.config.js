/** @type {import('next').NextConfig} */

const withVideos = require('next-videos')

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  // assetPrefix: 'http://localhost:3000/',
  // assetPrefix: 'https://forest-point.vercel.app/',
  ignoreDuringBuilds: true
}

module.exports = withVideos(nextConfig) 
