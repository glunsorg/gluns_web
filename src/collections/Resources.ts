import { CollectionConfig } from 'payload'

export const Resources: CollectionConfig = {
  slug: 'resources',
  admin: {
    useAsTitle: 'title',
    description: 'Add Resource',
    group: 'Publications',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'resource_file',
      type: 'upload',
      relationTo: 'documents',
      required: true,
    },
  ],
}
