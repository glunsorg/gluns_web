import type { CollectionConfig } from 'payload'

export const Organs: CollectionConfig = {
  slug: 'organs',

  admin: {
    useAsTitle: 'name',
  },

  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },

    {
      name: 'code',
      type: 'text',
      required: true,
    },

    {
      name: 'organType',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Committee Based',
          value: 'committee_based',
        },
        {
          label: 'Court',
          value: 'court',
        },
        {
          label: 'Commission',
          value: 'commission',
        },
        {
          label: 'Other',
          value: 'other',
        },
      ],
    },

    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },
  ],

  indexes: [
    {
      fields: ['code'],
      unique: true,
    },
  ],
}

// General Assembly
// organType = committee_based

// International Court of Justice
// organType = court

// International Law Commission
// organType = commission
