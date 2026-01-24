import React from 'react'
import Image from 'next/image'
import darkMode from 'public/logos/6.png'
import lightMode from 'public/logos/bluelogo.png'

export default function Logo() {
  return (
    <div>
      <Image src={lightMode} alt="GLUNS logo" className="h-80 object-contain dark:hidden" />
      <Image src={darkMode} alt="GLUNS logo" className="h-80 object-contain hidden dark:block" />
    </div>
  )
}
