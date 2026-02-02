import React from 'react'
import CommitteeHero from '@/components/committeepage/CommitteeHero'
import CommitteeList from '@/components/committeepage/CommitteeList'

export const metadata = {
  title: 'GLUNS Committees | Model United Nations (MUN) Kenya, Africa & Worldwide',
  description:
    'Explore all GLUNS Model United Nations (MUN) committees. Learn about our high school and youth leadership committees in Kenya, across Africa, and internationally, and discover opportunities to participate in global diplomacy simulations.',
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}`),

  openGraph: {
    title: 'GLUNS Committees – Model United Nations in Kenya, Africa & Worldwide',
    description:
      'Browse all GLUNS committees and learn about student leadership, diplomacy, and Model United Nations programs across Kenya, Africa, and internationally.',
    url: `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/committee`,
    siteName: 'GLUNS',
    images: [
      {
        url: '/seo/committee.jpg',
        width: 1200,
        height: 630,
        alt: 'GLUNS Model United Nations Committees',
      },
    ],
    type: 'website',
    locale: 'en_KE',
  },

  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/committee`,
  },

  keywords: [
    // Brand
    'GLUNS',
    'Global Leaders United Nations Symposium',

    // Core Topic
    'Model United Nations committees',
    'MUN committees',
    'High school Model UN',

    // Geography
    'Model United Nations Kenya',
    'MUN Kenya',
    'Model United Nations Africa',
    'MUN Africa',
    'International Model United Nations',

    // Leadership / Education
    'Youth leadership programs',
    'Student diplomacy',
    'Global affairs education',
    'Leadership simulations',
  ],
}

export default function page() {
  return (
    <>
      <CommitteeHero />
      <CommitteeList />
    </>
  )
}
