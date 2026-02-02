import React from 'react'
import AboutHero from '@/components/aboutpage/AboutHero'
import Mission from '@/components/aboutpage/Mission'
import Functions from '@/components/aboutpage/Functions'
import Commitment from '@/components/aboutpage/Commitment'
import CTA from '@/components/homepage/CTA'

export const metadata = {
  title: 'About GLUNS | Global Leaders United Nations Symposium',
  description:
    'Learn about GLUNS (Global Leaders United Nations Symposium), a leading Model United Nations organization based in Kenya with a strong presence across Africa and internationally. Discover our mission to empower youth through diplomacy, leadership, and global engagement.',
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}`),

  openGraph: {
    title: 'About GLUNS - A Global Model United Nations Organization',
    description:
      'GLUNS (Global Leaders United Nations Symposium) is a globally oriented Model United Nations organization headquartered in Kenya, empowering students across Africa and the world through diplomacy, leadership, and international collaboration.',
    url: `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/about-us`,
    images: [
      {
        url: '/seo/aboutus.jpg',
        width: 1200,
        height: 630,
        alt: 'About GLUNS - Global Leaders United Nations Symposium',
      },
    ],
    type: 'website',
    locale: 'en_KE',
  },

  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/about-us`,
  },

  keywords: [
    // Brand
    'GLUNS',
    'Global Leaders United Nations Symposium',

    // Core MUN
    'Model United Nations',
    'Model UN organization',

    // Kenya
    'Model United Nations Kenya',
    'MUN Kenya',

    // Africa
    'Model United Nations Africa',
    'MUN Africa',

    // International
    'International Model United Nations',
    'Global MUN organization',
    'Model UN worldwide',

    // Mission / Authority
    'Youth leadership development',
    'Student diplomacy programs',
    'Global education initiatives',
    'International relations education',
  ],
}

export default function page() {
  return (
    <>
      <AboutHero />
      <Mission />
      <Functions />
      <Commitment />
      <CTA />
    </>
  )
}
