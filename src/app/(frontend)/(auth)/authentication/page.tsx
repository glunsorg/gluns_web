import React from 'react'
import AuthSection from '@/components/authentication/AuthSection'

export const metadata = {
  title: 'GLUNS Login & Sign Up | Model United Nations Kenya, Africa & Worldwide',
  description:
    'Access the GLUNS portal to sign up or log in. Manage your student delegation, register for Model United Nations (MUN) conferences, and participate in youth leadership programs in Kenya, Africa, and internationally.',
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}`),

  openGraph: {
    title: 'GLUNS Authentication – Sign Up or Log In to Model United Nations Portal',
    description:
      'Sign up or log in to the GLUNS portal to register your school or student delegation for Model United Nations conferences and youth leadership programs across Kenya, Africa, and globally.',
    url: `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/auth`,
    siteName: 'GLUNS',
    images: [
      {
        url: '/seo/homepage.jpg',
        width: 1200,
        height: 630,
        alt: 'GLUNS Login & Sign Up – Model United Nations Portal',
      },
    ],
    type: 'website',
    locale: 'en_KE',
  },

  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/auth`,
  },

  keywords: [
    // Brand
    'GLUNS',
    'Global Leaders United Nations Symposium',

    // Authentication / Portal
    'GLUNS login',
    'GLUNS sign up',
    'Delegation login',
    'Model UN portal access',
    'MUN registration portal',

    // Geography
    'Model United Nations Kenya',
    'MUN Kenya',
    'Model United Nations Africa',
    'MUN Africa',
    'International Model United Nations',

    // Programs / Youth
    'High school MUN',
    'Student delegation management',
    'Youth leadership programs',
    'Student diplomacy',
  ],
}

export default function page() {
  return (
    <>
      <AuthSection />
    </>
  )
}
