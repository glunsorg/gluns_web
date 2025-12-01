import React from 'react'
import './styles.css'
import Navbar from '@/components/navigation/Navbar'
import {Barlow_Condensed} from 'next/font/google'

const barlow = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['100','200','300','400','500','600','700','800','900'],
  variable: '--font-barlow',
})

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body className={`${barlow.className} font-sans bg-white text-black`}>
        <main>
          <Navbar />
          {children}</main>
      </body>
    </html>
  )
}
