import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // pdfkit loads its built-in fonts through internal "#standard-fonts/..."
  // imports. If Next bundles it, those imports break on the server
  // ("Cannot find module '#standard-fonts/Helvetica'"). Keep it external so
  // it is loaded from node_modules exactly as published.
  serverExternalPackages: ['pdfkit'],
  // Your Next.js config here
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },

  images: {
    remotePatterns:[
      {
        protocol:'https',
        hostname:'images.unsplash.com'
      },
       {
        protocol:'http',
        hostname:'localhost'
      },
       {
        protocol:'https',
        hostname:'www.gluns.org'
      },
      {
        protocol:'https',
        hostname:'gluns.org'
      },
       {
        protocol: 'https',
        hostname: 'www.gluns.org',
        pathname: '/api/**',
      },
      {
      protocol: 'http',
      hostname: 'www.gluns.org',
      pathname: '/api/**',
    },
    ]
  }
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
