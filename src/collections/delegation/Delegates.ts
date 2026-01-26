import { CollectionConfig } from 'payload'
import { enforceDelegateOwnership } from '../hooks/DelegateOwnership'
import { ensurePaidSlots } from '../hooks/EnsurePaidSlots'

export const Delegates: CollectionConfig = {
  slug: 'delegates',
  admin: {
    useAsTitle: 'email',
    group: 'Delegation Management',
    defaultColumns: ['firstName', 'lastName', 'email', 'delegation', 'country'],
  },
  access: {
    read: ({ req }) => req.user?.roles === 'admin' || req.user?.roles === 'teacher',
    create: ({ req }) => req.user?.roles === 'admin' || req.user?.roles === 'teacher',
    update: ({ req, data }) => req.user?.roles === 'admin' || req.user?.id === data?.teacher,
    delete: ({ req, data }) => req.user?.roles === 'admin' || req.user?.id === data?.teacher,
  },
  hooks: {
    beforeChange: [enforceDelegateOwnership, ensurePaidSlots],
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
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'gradeLevel',
      type: 'select',
      options: Array.from({ length: 12 }, (_, i) => ({
        label: `Grade ${i + 1}`,
        value: `Grade ${i + 1}`,
      })),
      required: true,
    },
    {
      name: 'phoneNumber',
      type: 'number',
      required: true,
    },
    {
      name: 'country',
      type: 'relationship',
      relationTo: 'countries',
      required: false,
      unique: true, // ensures one country per delegate
    },
    {
      name: 'committee',
      type: 'relationship',
      relationTo: 'committees',
      required: false,
      hasMany: true,
    },
    {
      name: 'positionPaper',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
  ],
}
