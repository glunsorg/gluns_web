import { CollectionConfig } from 'payload'

export const Countries: CollectionConfig = {
  slug: 'countries',
  admin: {
    useAsTitle: 'name',
    group: 'Delegation Management',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },

  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'ISO 3166-1 alpha-2 country code (e.g., US, GB, FR)',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      required: true,
      defaultValue: true,
      admin: { description: 'Indicates whether the country is active or not' },
    },
  ],

  indexes: [
    {
      fields: ['code'],
      unique: true,
    },
  ],
}
