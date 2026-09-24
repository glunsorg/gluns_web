import type { CollectionConfig } from 'payload'

export const EventCommittees: CollectionConfig = {
  slug: 'event-committees',

  admin: {
    useAsTitle: 'name',
    defaultColumns: ['event', 'committee', 'capacity', 'available'],
  },

  fields: [
    {
      name: 'name',
      type: 'text',
      admin: {
        description: 'Optional event-specific committee name.',
      },
    },

    {
      name: 'event',
      type: 'relationship',
      relationTo: 'events',
      required: true,
    },

    {
      name: 'committee',
      type: 'relationship',
      relationTo: 'committees',
      required: true,
    },

    {
      name: 'available',
      type: 'checkbox',
      defaultValue: true,
    },

    {
      name: 'capacity',
      type: 'number',
      min: 1,
    },

    {
      name: 'fee',
      type: 'number',
      min: 0,
    },

    {
      name: 'currency',
      type: 'text',
      defaultValue: 'KES',
    },
  ],

  indexes: [
    {
      fields: ['event', 'committee'],
      unique: true,
    },
  ],
}
