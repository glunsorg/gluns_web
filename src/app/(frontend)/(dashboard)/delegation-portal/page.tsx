// /app/(dashboard)/delegation-portal/page.tsx
import React from 'react'
import DelegationApplication from '@/components/delegationportal/delegationapplication/DelegationApplication'

export const metadata = {
  title: 'GLUNS Delegation Portal | Model United Nations Kenya, Africa & Worldwide',
  description:
    'Access the GLUNS Delegation Portal to register your school or student delegation for Model United Nations (MUN) conferences, submit documents, and manage participation in Kenya, across Africa, and internationally.',
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}`),

  openGraph: {
    title: 'GLUNS Delegation Portal – Register for Model United Nations Conferences',
    description:
      'Manage your school or student delegation through the GLUNS Delegation Portal. Participate in Model United Nations conferences and youth leadership programs in Kenya, Africa, and internationally.',
    url: `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/delegation-portal`,
    siteName: 'GLUNS',
    images: [
      {
        url: '/seo/delegation.jpg',
        width: 1200,
        height: 630,
        alt: 'GLUNS Delegation Portal – Model United Nations Registration',
      },
    ],
    type: 'website',
    locale: 'en_KE',
  },

  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/delegation-portal`,
  },

  keywords: [
    // Brand
    'GLUNS',
    'Global Leaders United Nations Symposium',

    // Core functionality
    'Delegation Portal',
    'MUN registration portal',
    'Model UN school registration',
    'Student delegation management',

    // Geography
    'Model United Nations Kenya',
    'MUN Kenya',
    'Model United Nations Africa',
    'MUN Africa',
    'International Model United Nations',

    // Programs / Youth
    'High school MUN',
    'Youth leadership programs',
    'Student diplomacy',
    'Global youth engagement',
  ],
}

export default function DelegationPortalPage() {
  return <DelegationApplication />
}
