import { CollectionConfig } from 'payload'

export const Delegations: CollectionConfig = {
  slug: 'delegations',
  admin: {
    useAsTitle: 'name',
    group: 'Delegation Management',
  },
  access: {
    read: ({ req }) =>
      !!(req.user?.roles?.includes('admin') || req.user?.roles?.includes('teacher')),

    create: ({ req }) => !!req.user?.roles?.includes('admin'),

    update: ({ req }) => !!req.user?.roles?.includes('admin'),
  },

  fields: [
    {
      name: 'teacher',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'application',
      type: 'relationship',
      relationTo: 'delegation-applications',
      required: true,
      unique: true,
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'maxDelegates',
      type: 'number',
      required: true,
    },
    {
      name: 'year',
      type: 'number',
      required: true,
    },
  ],
}
