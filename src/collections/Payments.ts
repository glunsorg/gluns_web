import { CollectionConfig } from 'payload'

export const Payments: CollectionConfig = {
  slug: 'payments',
  admin: {
    useAsTitle: 'reference',
    group: 'Administration',
  },
  access: {
    read: ({ req }) => req.user?.roles === 'admin',
    create: () => false,
    update: () => false,
    delete: () => true,
  },
  fields: [
    {
      name: 'teacher',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'delegation',
      type: 'relationship',
      relationTo: 'delegations',
      required: true,
    },
    {
      name: 'delegateSlotsPurchased',
      type: 'number',
      required: true,
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Paid', value: 'paid' },
        { label: 'Failed', value: 'failed' },
      ],
    },
    { name: 'reference', type: 'text' }, // Paystack transaction reference
  ],
}
