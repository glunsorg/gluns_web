// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/media/Media'
import { Documents } from './collections/media/Documents'
import { Portraits } from './collections/media/Portraits'
import { DelegationApplications } from './collections/delegation/DelegationApplication'
import { Delegations } from './collections/delegation/Delegations'
import { Delegates } from './collections/delegation/Delegates'

import Blog from './collections/Blog'

// committees
import { Committees } from './collections/committee/Committees'
import { CommitteeCategories } from './collections/committee/CommitteeCategories'
import { CommitteeTeam } from './collections/committee/CommitteeTeam'

// secretariat
import { Secretariat } from './collections/Secretariat'

import { Faculty } from './collections/delegation/Faculty'

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
    CommitteeCategories,
    CommitteeTeam,
    Secretariat,
  ],
  serverURL: process.env.NEXT_PUBLIC_PAYLOAD_URL,
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
