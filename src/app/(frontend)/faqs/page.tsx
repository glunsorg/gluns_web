import React from 'react'
import FaqHero from '@/components/faqspage/FaqHero'
import FAQS from '@/components/faqspage/FAQS'

export const metadata = {
  title: 'GLUNS FAQs | Model United Nations (MUN) Kenya, Africa & Worldwide',
  description:
    'Find answers to frequently asked questions about GLUNS (Global Leaders United Nations Symposium), Model United Nations conferences, committees, events, and youth leadership programs in Kenya, across Africa, and globally.',
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}`),

  openGraph: {
    title: 'GLUNS FAQs – Model United Nations Conferences & Youth Leadership',
    description:
      'Explore GLUNS frequently asked questions to learn about Model United Nations conferences, committees, registration, sponsorships, and youth leadership programs in Kenya, Africa, and internationally.',
    url: `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/faqs`,
    siteName: 'GLUNS',
    images: [
      {
        url: '/seo/faqs.jpg',
        width: 1200,
        height: 630,
        alt: 'GLUNS FAQs – Model United Nations Kenya & Africa',
      },
    ],
    type: 'website',
    locale: 'en_KE',
  },

  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/faqs`,
  },

  keywords: [
    // Brand
    'GLUNS',
    'Global Leaders United Nations Symposium',

    // Core MUN
    'Model United Nations FAQs',
    'MUN questions',
    'MUN Kenya FAQ',
    'Model UN Africa questions',
    'International Model UN FAQ',

    // Topics
    'Delegate registration',
    'MUN committees',
    'Events and conferences',
    'Youth leadership programs',
    'Sponsorship questions',
    'Student diplomacy guidance',
  ],
}

export default function page() {
  return (
    <>
      <FaqHero />
      <FAQS />
    </>
  )
}
