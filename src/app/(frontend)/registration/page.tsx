export const dynamic = 'force-dynamic'

import React from 'react'
import RegisterHero from '@/components/registrationPage/RegisterHero'
import RegistrationForms from '@/components/registrationPage/RegistrationForms'
import BlankPage from '@/components/errorpages/BlankPage'

// meta data
export const metadata = {
  title: 'Events & Programs Registration | GLUNS Model United Nations Kenya, Africa & Worldwide',
  description:
    'Register for upcoming GLUNS Model United Nations (MUN) events and conferences in Kenya, across Africa, and internationally. Join students from around the world in diplomacy, debate, and leadership.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_PAYLOAD_URL || process.env.PAYLOAD_URL || 'http://localhost:3000',
  ),

  openGraph: {
    title: 'GLUNS Events & Programs Registration – Model United Nations Worldwide',
    description:
      'Discover upcoming GLUNS Model United Nations conferences and events in Kenya, across Africa, and internationally. Join students from around the world in diplomacy, debate, and leadership.',
    url: `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/registration`,
    images: [
      {
        url: '/seo/events.jpg',
        width: 1200,
        height: 630,
        alt: 'GLUNS Model United Nations Events and Conferences',
      },
    ],
    type: 'website',
    locale: 'en_KE',
  },

  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/registration`,
  },

  keywords: [
    // Brand
    'GLUNS',
    'Global Leaders United Nations Symposium',

    // Core
    'Model United Nations events',
    'Model UN conferences',
    'MUN conferences',

    // Kenya
    'Model United Nations Kenya',
    'MUN Kenya',
    'MUN conferences Kenya',

    // Africa
    'Model United Nations Africa',
    'MUN Africa',
    'African MUN conferences',

    // International
    'International Model United Nations',
    'Global MUN conferences',
    'Worldwide MUN events',

    // Audience
    'High school Model United Nations',
    'Youth leadership conferences',
    'Student diplomacy events',
  ],
}

export default function page() {
  return (
    <>
      <RegisterHero />
      {/* <RegistrationForms /> */}
      <BlankPage />
    </>
  )
}
