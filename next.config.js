/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {protocol: 'https',hostname: 'images.pexels.com',port: '',pathname: '/photos/**',},
      {protocol: 'http',hostname: 'localhost',port: '3001',pathname: '/**',},
      {protocol: 'http',hostname: 'localhost',port: '8080',pathname: '/**',},
      {protocol: 'http',hostname: '127.0.0.1',port: '8080',pathname: '/**',},
      {protocol: 'http',hostname: 'expo.site.img.utour.xin',port: '',pathname: '/**',},
      {protocol: 'https',hostname: 'res.bracexpo.com',port: '',pathname: '/**',},
    ],
    domains: ['res.bracexpo.com','localhost:8080'],
    deviceSizes: [640,750,828,1080,1200,1920,2048,3840],
    imageSizes: [16,32,48,64,96,128,256,384],
    minimumCacheTTL: 60,
  },
}

module.exports = nextConfig
