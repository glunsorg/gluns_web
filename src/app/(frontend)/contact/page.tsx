import React from 'react'
import ContactHero from '@/components/contactpage/ContactHero'
import ContactForm from '@/components/contactpage/ContactForm'
import ContactInfo from '@/components/contactpage/ContactInfo'
import ContactCTA from '@/components/contactpage/ContactCTA'

export const metadata = {
  title: 'Contact GLUNS | Model United Nations (MUN) Kenya, Africa & Worldwide',
  description:
    'Contact GLUNS (Global Leaders United Nations Symposium) for inquiries about Model United Nations conferences in Kenya, across Africa, and internationally. Reach out for global delegate registration, school partnerships, sponsorships, and youth leadership programs worldwide.',
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}`),

  openGraph: {
    title: 'Contact GLUNS - Global Model United Nations in Kenya, Africa & Worldwide',
    description:
      'Get in touch with GLUNS, a leading global Model United Nations (MUN) organization operating in Kenya, across Africa, and internationally. Contact us for conferences, student participation, school collaborations, and global leadership programs.',
    url: `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/contact-us`,
    images: [
      {
        url: '/seo/contactus.jpg',
        width: 1200,
        height: 630,
        alt: 'GLUNS - Global Leaders United Nations Symposium',
      },
    ],
    type: 'website',
    locale: 'en_KE',
  },

  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/contact-us`,
  },

  keywords: [
    // Core Brand
    'GLUNS',
    'Global Leaders United Nations Symposium',

    // Kenya
    'Model United Nations Kenya',
    'MUN Kenya',

    // Africa
    'Model United Nations Africa',
    'MUN Africa',

    // International / Global
    'International Model United Nations',
    'Global MUN conferences',
    'Model UN worldwide',
    'International student diplomacy',

    // Programs
    'Youth leadership programs',
    'High school Model United Nations',
    'Global youth leadership',
  ],
}

export default function page() {
  return (
    <>
      <ContactHero />

      {/* Main Content */}
      <div className="py-10 md:py-12 -mt-6 md:-mt-7 bg-white rounded-t-4xl relative z-30 overflow-hidden">
        <section className="relative">
          <div className="max-w-7xl 2xl:max-w-full mx-auto px-10 md:px-12 lg:px-12">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
              <ContactForm />
              <ContactInfo />
            </div>
          </div>
        </section>
      </div>

      <ContactCTA />
    </>
  )
}
