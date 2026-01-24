import React from 'react'
import SecHero from '@/components/secretariatpage/SecHero'
import SecListServer from '@/components/secretariatpage/SecList.server'
export default function page() {
  return (
    <>
      <SecHero />
      <SecListServer />
    </>
  )
}
