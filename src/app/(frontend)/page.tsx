import React from 'react'
import Hero from '@/components/homepage/Hero'
import About from '@/components/homepage/About'
import Why from '@/components/homepage/Why'
import Committee from '@/components/homepage/Committee'
import Process from '@/components/homepage/Process'
import Events from '@/components/homepage/Events'
import CTA from '@/components/homepage/CTA'
import WelcomeNote from '@/components/homepage/WelcomeNote'

export default function page() {
  return (
    <>
      <Hero />
      <About />
      <Why />
      <Committee />
      <Process />
      <Events />
      <WelcomeNote />
      <CTA />
    </>
  )
}
