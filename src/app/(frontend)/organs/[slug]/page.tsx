export const dynamic = 'force-dynamic'

import React from 'react'
import config from '@/payload.config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { ArrowUpRight, SlashIcon } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import Link from 'next/link'

import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params

  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs } = await payload.find({
    collection: 'organs',
    where: {
      slug: { equals: slug },
    },
    depth: 2,
  })

  const organ = docs[0]

  if (!organ) {
    return {
      title: 'Organ Not Found | GLUNS',
      description:
        'This GLUNS organ could not be found. Explore our Model United Nations organs and leadership simulations in Kenya, Africa, and internationally.',
    }
  }

  const title = `${organ.name} | GLUNS Organ`
  const description =
    organ.description ||
    `Discover the ${organ.name} organ at GLUNS, a Model United Nations simulation empowering students in Kenya, Africa, and around the world.`

  const imageUrl =
    typeof organ.image === 'object' && organ.image?.url ? organ.image.url : '/seo/committee.jpg'

  const url = `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/organs/${slug}`

  return {
    title,
    description,
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_PAYLOAD_URL || process.env.PAYLOAD_URL || 'http://localhost:3000',
    ),

    openGraph: {
      title,
      description,
      url,
      siteName: 'GLUNS',
      images: [
        {
          url: imageUrl,
          secureUrl: imageUrl,
          width: 1200,
          height: 630,
          alt: organ.name,
        },
      ],
      type: 'article',
      locale: 'en_KE',
    },

    alternates: {
      canonical: url,
    },

    keywords: [
      // Brand
      'GLUNS',
      'Global Leaders United Nations Symposium',

      // Organ / Core
      'Model United Nations organ',
      'MUN organ',
      'Student diplomacy organ',
      'High school MUN organ',

      // Geography
      'Model United Nations Kenya',
      'MUN Kenya',
      'Model United Nations Africa',
      'MUN Africa',
      'International Model United Nations',

      // Leadership / Education
      'Youth leadership programs',
      'Student leadership simulation',
      'Diplomacy education',
      'Global affairs education',
    ],
  }
}

export default async function CommitteePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs } = await payload.find({
    collection: 'organs',
    where: {
      slug: {
        equals: slug,
      },
    },
    depth: 2,
  })

  const organ = docs[0]
  if (!organ) {
    notFound()
  }

  const { docs: committees } =
    organ.organType === 'committee_based'
      ? await payload.find({
          collection: 'committees',
          where: {
            organ: {
              equals: organ.id,
            },
            active: {
              equals: true,
            },
          },
          sort: 'name',
        })
      : { docs: [] }

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <header className="relative overflow-hidden bg-[#104179] px-6 pb-20 pt-32 md:px-12 lg:px-16 lg:pb-28">
        {typeof organ.image === 'object' && organ.image?.url && (
          <Image
            src={organ.image.url}
            alt=""
            fill
            priority
            className="object-cover opacity-20 mix-blend-screen"
          />
        )}
        <div className="absolute inset-0 bg-[#104179]/75" />
        <div className="absolute -right-24 -top-32 h-96 w-96 rounded-full bg-[#85c226]/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-px w-full bg-[#85c226]" />
        <div className="relative mx-auto max-w-7xl">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href="/"
                    className="text-sm font-medium uppercase tracking-[0.18em] text-white/65 transition-colors hover:text-[#85c226]"
                  >
                    Home
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <SlashIcon className="size-3 text-[#85c226]" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href="/organs"
                    className="text-sm font-medium uppercase tracking-[0.18em] text-white/65 transition-colors hover:text-[#85c226]"
                  >
                    Organs
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <SlashIcon className="size-3 text-[#85c226]" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="max-w-40 truncate text-sm font-semibold uppercase tracking-[0.18em] text-[#85c226] sm:max-w-none">
                  {organ.name}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="mt-14 grid items-end gap-12 lg:gap-20">
            <div>
              <p className="mb-5 text-sm font-semibold uppercase tracking-[0.28em] text-[#85c226]">
                GLUNS organ
              </p>
              <h1 className="max-w-4xl text-6xl font-semibold uppercase leading-[0.88] tracking-tight text-white sm:text-7xl lg:text-9xl">
                {organ.name}
              </h1>
              <div className="mt-8 h-1 w-24 bg-[#85c226]" />
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 -mt-8 rounded-t-[2rem] bg-[#0d1a0d] px-6 py-16 md:px-12 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <section className="grid gap-12 border-b border-white/10 pb-16 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24 lg:pb-24">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#85c226]">
                About the organ
              </p>
              <h2 className="mt-5 max-w-sm text-4xl font-semibold uppercase leading-none text-white md:text-6xl">
                A space for <span className="text-[#85c226]">global</span> dialogue.
              </h2>
            </div>
            <div className="max-w-3xl text-lg leading-relaxed text-white/65 md:text-2xl">
              <p>{organ.description}</p>
            </div>
          </section>

          {organ.organType === 'committee_based' && (
            <section className="pt-16 lg:pt-24">
              <div className="mb-10 flex items-end justify-between gap-6">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#85c226]">
                    Explore the structure
                  </p>
                  <h2 className="mt-3 text-5xl font-semibold uppercase leading-none text-white md:text-7xl">
                    Committees<span className="text-[#85c226]">.</span>
                  </h2>
                </div>
                <span className="hidden text-sm uppercase tracking-[0.2em] text-white/40 sm:block">
                  {committees.length} {committees.length === 1 ? 'committee' : 'committees'}
                </span>
              </div>
              {committees.length > 0 ? (
                <div className="grid gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-2">
                  {committees.map((committee, index) => (
                    <div
                      key={committee.id}
                      className="group bg-[#0d1a0d] p-6 transition-colors duration-300 hover:bg-[#104179] md:p-8"
                    >
                      <div className="mb-14 flex items-start justify-between">
                        <span className="font-mono text-sm text-[#85c226]">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <ArrowUpRight className="size-5 text-white/35 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#85c226]" />
                      </div>
                      <h3 className="max-w-sm text-2xl font-semibold uppercase leading-tight text-white md:text-3xl">
                        {committee.name}
                      </h3>
                      {committee.description && (
                        <p className="mt-4 max-w-md text-base leading-relaxed text-white/55">
                          {committee.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border border-dashed border-white/20 p-10 text-center text-white/55">
                  No committees have been listed yet.
                </div>
              )}
            </section>
          )}
        </div>
      </main>
    </div>
  )
}
