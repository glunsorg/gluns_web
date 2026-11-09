import type { CollectionConfig } from 'payload'
import { adminAccess } from '@/lib/access'

export const Portraits: CollectionConfig = {
  slug: 'portraits',
  admin: {
    description: 'Media',
    group: 'Media & File Uploads',
  },
  access: adminAccess,
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}
