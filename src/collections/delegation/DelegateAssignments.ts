// src/collections/DelegateAssignments.ts

import type { CollectionConfig } from 'payload'
import { assignmentAccess } from '@/lib/access'

export const DelegateAssignments: CollectionConfig = {
  slug: 'delegate-assignments',
  access: assignmentAccess,

  admin: {
    useAsTitle: 'id',
    defaultColumns: ['delegate', 'country', 'eventCommittee'],
  },

  fields: [
    {
      name: 'delegate',
      type: 'relationship',
      relationTo: 'delegates',
      required: true,
      unique: true,
    },

    {
      name: 'country',
      type: 'relationship',
      relationTo: 'countries',
      required: true,
    },

    {
      name: 'eventCommittee',
      type: 'relationship',
      relationTo: 'event-committees',
      required: true,
    },

    {
      name: 'assignmentState',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Assigned', value: 'assigned' },
        { label: 'Confirmed', value: 'confirmed' },
      ],
    },
    {
      name: 'positionPaper',
      type: 'relationship',
      relationTo: 'documents',
      required: false,
    },
  ],

  indexes: [
    {
      fields: ['delegate'],
      unique: true,
    },
  ],
}
