import React from 'react'
import EventsHero from '@/components/eventspage/EventsHero'
import EventsList from '@/components/eventspage/EventsList'

export const metadata = {
  title: 'Events & Conferences | GLUNS Model United Nations Kenya, Africa & Worldwide',
  description:
    'Explore upcoming GLUNS Model United Nations (MUN) events and conferences in Kenya, across Africa, and internationally. Discover high school and youth diplomacy conferences, leadership summits, and global engagement opportunities.',
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}`),

  openGraph: {
    title: 'GLUNS Events & Conferences – Model United Nations Worldwide',
    description:
      'Discover upcoming GLUNS Model United Nations conferences and events in Kenya, across Africa, and internationally. Join students from around the world in diplomacy, debate, and leadership.',
    url: `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/events`,
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
    canonical: `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/events`,
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
      <EventsHero />
      <EventsList />
    </>
  )
}
