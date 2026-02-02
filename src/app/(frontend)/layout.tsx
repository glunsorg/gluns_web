import React from 'react'
import './styles.css'
import Navbar from '@/components/navigation/Navbar'
import Footer from '@/components/navigation/Footer'
import { Barlow_Condensed } from 'next/font/google'

const barlow = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-barlow',
})

export const metadata = {
  title:
    'GLUNS | Global Leaders United Nations Symposium – Model United Nations Kenya, Africa & Worldwide',
  description:
    'GLUNS (Global Leaders United Nations Symposium) organizes premier Model United Nations (MUN) conferences and youth leadership programs in Kenya, across Africa, and internationally. Join students in diplomacy, debate, and global engagement.',
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}`),

  openGraph: {
    title: 'GLUNS – Model United Nations in Kenya, Africa & Internationally',
    description:
      'Explore GLUNS, a leading Model United Nations (MUN) organization hosting conferences, committees, and youth leadership programs across Kenya, Africa, and globally.',
    url: `${process.env.NEXT_PUBLIC_PAYLOAD_URL}`,
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
    canonical: `${process.env.NEXT_PUBLIC_PAYLOAD_URL}`,
  },

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
        <main>
          <Navbar />
          {children}
          <Footer />
        </main>
      </body>
    </html>
  )
}
