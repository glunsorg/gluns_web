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
import { Documents } from './collections/media/Documents'
import { Portraits } from './collections/media/Portraits'
import { DelegationApplications } from './collections/delegation/DelegationApplication'
import { Delegations } from './collections/delegation/Delegations'
import { Delegates } from './collections/delegation/Delegates'

import Blog from './collections/Blog'
import { Events } from './collections/administration/Events'

// assignments
import { PositionPapers } from './collections/delegation/PositionPapers'
import { Countries } from './collections/delegation/Countries'
import { CommitteeAssignments } from './collections/delegation/CommitteeAssignments'
// committees
import { Committees } from './collections/committee/Committees'
import { CommitteeCategories } from './collections/committee/CommitteeCategories'
import { CommitteeTeam } from './collections/committee/CommitteeTeam'

// secretariat
import { Secretariat } from './collections/administration/Secretariat'

import { Faculty } from './collections/delegation/Faculty'

import { Payments } from './collections/administration/Payments'

// endpoints

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

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
    Documents,
    Portraits,
    DelegationApplications,
    Delegations,
    Delegates,
    Faculty,
    Payments,
    Events,
    Blog,
    Committees,
    CommitteeCategories,
    CommitteeTeam,
    Secretariat,
    Countries,
    PositionPapers,
    CommitteeAssignments,
  ],
  serverURL: process.env.NEXT_PUBLIC_BASE_URL,
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
  email: nodemailerAdapter({
    defaultFromAddress: `${process.env.SMTP_USER}`,
    defaultFromName: 'Global Leaders UN Symposium',
    transport: await nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    }),
  }),
  plugins: [
    s3Storage({
      collections: {
        media: {
          prefix: 'media',
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
      defaultToEmail: 'info.gluns@gmail.com',
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
