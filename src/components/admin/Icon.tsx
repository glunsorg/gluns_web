import React from 'react'
import Image from 'next/image'
import logoDark from 'public/logos/4.png'
import logo from 'public/logos/2.png'

export default function Icon() {
  return (
    <div className="flex justify-center items-center">
      <Image src={logo} width={800} height={800} alt="GLUNS logo" className="dark:hidden" />
      <Image
        src={logoDark}
        width={800}
        height={800}
        alt="GLUNS logo"
        className="hidden dark:block"
      />
    </div>
  )
}
