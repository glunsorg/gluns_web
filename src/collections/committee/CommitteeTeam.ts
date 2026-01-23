import { CollectionConfig } from 'payload'

export const CommitteeTeam: CollectionConfig = {
  slug: 'committee-team',
  admin: {
    useAsTitle: 'name',
    group: 'Committee Management',
  },
  access: {
    read: ({ req }) => req.user?.roles === 'admin',
    create: ({ req }) => req.user?.roles === 'admin',
    update: ({ req }) => req.user?.roles === 'admin',
    delete: ({ req }) => req.user?.roles === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'position',
      type: 'text',
      required: true,
    },
    {
      name: 'rank',
      type: 'number',
      required: true,
      unique: true,
      admin: {
        description: 'Lower numbers appear first',
      },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'portraits',
      required: false,
    },
    {
      name: 'committee',
      type: 'relationship',
      relationTo: 'committees',
      required: true,
    },
  ],
}
