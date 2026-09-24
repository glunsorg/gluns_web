// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { s3Storage } from '@payloadcms/storage-s3'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import nodemailer from 'nodemailer'

import { Users } from './collections/Users'
import { Media } from './collections/media/Media'
import { Pages } from './collections/Pages'
import { Documents } from './collections/media/Documents'
import { Portraits } from './collections/media/Portraits'

import { Events } from './collections/administration/Events'

// registration
import { Registrations } from './collections/delegation/Registrations'
import { RegistrationBatches } from './collections/delegation/RegistrationBatches'
import { Institutions } from './collections/delegation/Institutions'
import { InstitutionMemberships } from './collections/delegation/InstitutionMembership'
import { Delegates } from './collections/delegation/Delegates'
import { DelegateAssignments } from './collections/delegation/DelegateAssignments'
import { Countries } from './collections/delegation/Countries'
import { Organs } from './collections/delegation/Organs'
import { Committees } from './collections/delegation/Committees'
import { EventCommittees } from './collections/delegation/EventCommittees'

// secretariat
import { Secretariat } from './collections/administration/Secretariat'

// payments
import { Payments } from './collections/payment/Payments'
import { Invoices } from './collections/payment/Invoices'
import { InvoiceItems } from './collections/payment/InvoiceItems'
import { Receipts } from './collections/payment/Receipts'

import { Sponsors } from './collections/administration/Sponsors'
import { Trainers } from './collections/administration/Trainers'

// endpoints

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const smtpConfigured =
  !!process.env.SMTP_HOST &&
  !!process.env.SMTP_PORT &&
  !!process.env.SMTP_USER &&
  !!process.env.SMTP_PASS

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      graphics: {
        Logo: './components/admin/Logo',
        Icon: './components/admin/Icon',
      },
    },
    meta: {
      title: 'GLUNS Admin',
      description: 'Global Leaders United Nations Symposium Admin Portal',
      icons: [
        {
          rel: 'icon',
          type: 'image/ico',
          url: '/favicon.ico',
        },
        {
          rel: 'apple-touch-icon',
          type: 'image/png',
          url: '/apple-icon.png',
        },
      ],
      robots: 'noindex, nofollow',
    },
  },

  collections: [
    Users,
    Media,
    Pages,
    Documents,
    Portraits,
    Delegates,
    Invoices,
    InvoiceItems,
    Receipts,
    Payments,
    Events,
    Registrations,
    DelegateAssignments,
    Sponsors,
    Trainers,
    RegistrationBatches,
    Committees,
    EventCommittees,
    Organs,
    Institutions,
    InstitutionMemberships,
    Secretariat,
    Countries,
  ],
  // serverURL: process.env.PAYLOAD_URL,
  serverURL: 'http://localhost:3001',
  cors: [process.env.NEXT_PUBLIC_CORS_ORIGIN || '', 'http://localhost:3001'],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  email: smtpConfigured
    ? nodemailerAdapter({
        defaultFromAddress: `${process.env.SMTP_USER}`,
        defaultFromName: 'Global Leaders UN Symposium',
        transport: nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT),
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        }),
      })
    : undefined,
  plugins: [
    s3Storage({
      collections: {
        media: {
          prefix: 'media',
        },
        documents: {
          prefix: 'documents',
        },
        portraits: {
          prefix: 'portraits',
        },
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        forcePathStyle: true,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        region: process.env.S3_REGION,
        endpoint: process.env.S3_ENDPOINT,
      },
    }),
    formBuilderPlugin({
      fields: {
        text: true,
        textarea: true,
        email: true,
        number: true,
        payment: false,
      },
      defaultToEmail: 'info@gluns.org',
      formOverrides: {
        admin: {
          group: 'Forms',
        },
      },
      formSubmissionOverrides: {
        admin: {
          group: 'Forms',
        },
      },
    }),
  ],
})
