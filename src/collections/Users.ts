import type { CollectionConfig } from 'payload'
import { isAdmin } from './access/isAdmin'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    create: () => true,
    read: () => true,
    delete: isAdmin,
    update: isAdmin,
  },
  fields: [
    {
      name: 'roles',
      type: 'select',
      required: true,
      saveToJWT: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Teacher', value: 'teacher' },
      ],
      defaultValue: 'teacher',
    },
    {
      name: 'delegationName',
      type: 'text',
      required: true,
      admin: {
        condition: (data, { user }) => !!user && user.roles === 'teacher',
      },
    },
  ],
}
