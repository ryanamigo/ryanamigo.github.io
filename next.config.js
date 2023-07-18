/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ryan-1308859712.cos.ap-beijing.myqcloud.com',
        
      }
    ]
  },
  compiler: {
    styledComponents: true
  },
  reactStrictMode: true,
}

module.exports = nextConfig
