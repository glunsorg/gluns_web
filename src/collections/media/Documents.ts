import type { CollectionConfig } from 'payload'
import { adminAccess } from '@/lib/access'

export const Documents: CollectionConfig = {
  slug: 'documents',
  admin: {
    description: 'Media',
    group: 'Media & File Uploads',
  },

  access: adminAccess,
  fields: [
    { name: 'title', type: 'text', required: false },
    {
      name: 'alt',
      type: 'text',
      required: false,
    },
  ],
  upload: true,
}
