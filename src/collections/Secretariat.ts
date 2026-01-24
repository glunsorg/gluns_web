import { CollectionConfig } from 'payload'

export const Secretariat: CollectionConfig = {
  slug: 'secretariat',
  admin: {
    useAsTitle: 'full_name',
    description: 'Add Secretariat Member',
    group: 'Administration',
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
