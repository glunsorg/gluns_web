import type { CollectionConfig } from 'payload'

export const Delegates: CollectionConfig = {
  slug: 'delegates',

  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'registration', 'batch', 'delegateState'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },

  fields: [
    {
      name: 'fullName',
      type: 'text',
      required: true,
    },

    {
      name: 'email',
      type: 'email',
    },

    {
      name: 'phone',
      type: 'text',
    },

    {
      name: 'gender',
      type: 'select',
      required: true,
      defaultValue: 'male',
      options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Not specified', value: 'not-specified' },
      ],
    },
    {
      name: 'gradeLevel',
      type: 'text',
      required: true,
      defaultValue: 'Grade 12',
    },

    {
      name: 'registration',
      type: 'relationship',
      relationTo: 'registrations',
      required: true,
    },

    {
      name: 'batch',
      type: 'relationship',
      relationTo: 'registration-batches',
      required: true,
    },

    {
      name: 'institution',
      type: 'relationship',
      relationTo: 'institutions',
    },

    {
      name: 'delegateState',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
  ],

  indexes: [
    {
      fields: ['registration'],
    },
    {
      fields: ['batch'],
    },
  ],
}
