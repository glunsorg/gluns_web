import { CollectionConfig } from 'payload'

export const CommitteeCategories: CollectionConfig = {
  slug: 'committee-categories',
  admin: {
    useAsTitle: 'name',
    group: 'Committee Management',
  },
  access: {
    read: ({ req }) => req.user?.roles === 'admin',
    delete: () => true,
    create: () => true,
    update: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: false,
    },
  ],
}
