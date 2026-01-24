import type { CollectionConfig } from 'payload'
import { canUpdateUser } from './hooks/AccessHooks'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: 'Administration',
  },
  auth: true,

  access: {
    create: () => true,
    read: ({ req }) => req.user?.roles === 'admin',
    delete: canUpdateUser,
  },
  fields: [
    {
      name: 'roles',
      type: 'select',
      required: true,
      saveToJWT: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Secretariat', value: 'secretariat' },
        { label: 'Editor', value: 'editor' },
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
