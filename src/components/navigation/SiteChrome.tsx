'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Navbar from '@/components/navigation/Navbar'
import Footer from '@/components/navigation/Footer'

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideSiteChrome = pathname?.startsWith('/delegation-portal')

  return (
    <main>
      {!hideSiteChrome && <Navbar />}
      {children}
      {!hideSiteChrome && <Footer />}
    </main>
  )
}
