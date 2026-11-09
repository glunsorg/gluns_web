import { CollectionConfig } from 'payload'
import { adminAccess } from '@/lib/access'

export const Sponsors: CollectionConfig = {
  slug: 'sponsors',
  access: adminAccess,
  admin: {
    useAsTitle: 'name',
    group: 'Administration',
    description: 'Add Sponsor',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
}
