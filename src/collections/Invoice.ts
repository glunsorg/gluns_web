import { CollectionConfig } from 'payload'

export const Invoice: CollectionConfig = {
  slug: 'invoices',
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
      name: 'amount',
      type: 'number',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'unpaid',
      options: [
        { label: 'Unpaid', value: 'unpaid' },
        { label: 'Paid', value: 'paid' },
      ],
    },
  ],
}
