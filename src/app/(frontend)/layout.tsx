export const dynamic = 'force-dynamic'

import React from 'react'
import './styles.css'
import { Barlow_Condensed } from 'next/font/google'
import SiteChrome from '@/components/navigation/SiteChrome'
import type { Metadata } from 'next'
import { getSiteUrl } from '@/lib/utils'

const barlow = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-barlow',
})

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  title:
    'GLUNS | Global Leaders United Nations Symposium – Model United Nations Kenya, Africa & Worldwide',
  description:
    'GLUNS (Global Leaders United Nations Symposium) organizes premier Model United Nations (MUN) conferences and youth leadership programs in Kenya, across Africa, and internationally. Join students in diplomacy, debate, and global engagement.',
  metadataBase: new URL(siteUrl),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },

  openGraph: {
    title: 'GLUNS – Model United Nations in Kenya, Africa & Internationally',
    description:
      'Explore GLUNS, a leading Model United Nations (MUN) organization hosting conferences, committees, and youth leadership programs across Kenya, Africa, and globally.',
    url: siteUrl,
    siteName: 'GLUNS',
    images: [
      {
        url: '/seo/homepage.jpg',
        width: 1200,
        height: 630,
        alt: 'GLUNS – Model United Nations Conferences and Youth Leadership',
      },
    ],
    type: 'website',
    locale: 'en_KE',
  },

  alternates: {
    canonical: siteUrl,
  },

  twitter: {
    card: 'summary_large_image',
    title: 'GLUNS – Model United Nations in Kenya, Africa & Internationally',
    description:
      'Model United Nations conferences and youth leadership programmes from GLUNS.',
    images: ['/seo/homepage.jpg'],
  },

  category: 'education',

  keywords: [
    // Brand
    'GLUNS',
    'Global Leaders United Nations Symposium',

    // Core MUN
    'Model United Nations',
    'Model UN',
    'MUN',

    // Geographic relevance
    'Model United Nations Kenya',
    'MUN Kenya',
    'Model United Nations Africa',
    'MUN Africa',
    'International Model United Nations',

    // Programs / Authority
    'Youth leadership programs',
    'High school Model UN',
    'Student diplomacy',
    'Global affairs education',
    'Leadership and debate',
    'International youth engagement',
  ],
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body className={`${barlow.className} font-sans bg-white text-black`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'EducationalOrganization',
              name: 'Global Leaders United Nations Symposium',
              alternateName: 'GLUNS',
              url: siteUrl,
              logo: `${siteUrl}/logos/white.png`,
              description:
                'GLUNS organizes Model United Nations conferences and youth leadership programmes in Kenya, Africa, and internationally.',
              areaServed: ['Kenya', 'Africa', 'Worldwide'],
            }),
          }}
        />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  )
}
