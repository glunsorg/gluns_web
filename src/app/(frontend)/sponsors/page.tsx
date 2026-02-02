import React from 'react'
import Sponsorship from '@/components/sponsors/Sponsors'

export const metadata = {
  title: 'GLUNS Sponsors & Partners | Model United Nations Kenya, Africa & Worldwide',
  description:
    'Discover how to become a sponsor or partner of GLUNS (Global Leaders United Nations Symposium). Support Model United Nations conferences, youth leadership programs, and global diplomacy initiatives in Kenya, across Africa, and internationally.',
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}`),

  openGraph: {
    title: 'GLUNS Sponsors & Partners – Supporting MUN in Kenya, Africa & Worldwide',
    description:
      'Join GLUNS as a sponsor or partner to empower students through Model United Nations conferences and youth leadership programs in Kenya, Africa, and globally.',
    url: `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/sponsors`,
    siteName: 'GLUNS',
    images: [
      {
        url: '/seo/sponsors.jpg',
        width: 1200,
        height: 630,
        alt: 'GLUNS Sponsors and Partners – Model United Nations',
      },
    ],
    type: 'website',
    locale: 'en_KE',
  },

  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/sponsors`,
  },

  keywords: [
    // Brand
    'GLUNS',
    'Global Leaders United Nations Symposium',

    // Sponsorship
    'GLUNS sponsors',
    'MUN sponsorship Kenya',
    'Model UN sponsorship',
    'Partner with GLUNS',
    'Corporate sponsorship MUN',

    // Geographic relevance
    'Model United Nations Kenya',
    'MUN Kenya',
    'Model United Nations Africa',
    'MUN Africa',
    'International Model United Nations',

    // Programs
    'Youth leadership programs',
    'Student diplomacy',
    'Global affairs education',
    'High school Model UN',
  ],
}

export default function page() {
  return <Sponsorship />
}
