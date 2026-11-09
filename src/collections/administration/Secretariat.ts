import { CollectionConfig } from 'payload'
import { adminAccess } from '@/lib/access'

export const Secretariat: CollectionConfig = {
  slug: 'secretariat',
  access: adminAccess,
  admin: {
    useAsTitle: 'full_name',
    description: 'Add Secretariat Member',
    group: 'Administration',
  },
  labels: {
    singular: 'Secretariat',
    plural: 'Secretariat',
  },
  fields: [
    {
      name: 'full_name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'text',
      required: true,
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'portraits',
      required: false,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'bio',
      type: 'textarea',
      required: true,
    },
  ],
}
