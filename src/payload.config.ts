// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Documents } from './collections/Documents'
import { Portraits } from './collections/Portraits'
import { DelegationApplications } from './collections/DelegationApplication'
import { Delegations } from './collections/Delegations'
import { Delegates } from './collections/Delegates'

import Blog from './collections/Blog'
import { Committees } from './collections/Committees'

import { Faculty } from './collections/Faculty'

import { Payments } from './collections/Payments'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
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
    Blog,
    Committees,
  ],
  serverURL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
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
  plugins: [
    // storage-adapter-placeholder
  ],
})
