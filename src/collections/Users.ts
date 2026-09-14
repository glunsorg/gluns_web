import type { CollectionConfig } from 'payload'
import { AccessArgs } from 'payload'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isAdmin = (req: any) => Array.isArray(req.user?.roles) && req.user.roles.includes('admin')

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: 'Administration',
  },

  auth: true,
  access: {
    create: () => true,
    read: () => true,
    update: ({ req }: AccessArgs) => {
      return isAdmin(req)
    },
    delete: ({ req }: AccessArgs) => {
      return isAdmin(req)
    },
  },

  fields: [
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['delegate'],
      options: [
        {
          label: 'Teacher',
          value: 'teacher',
        },
        {
          label: 'Delegate',
          value: 'delegate',
        },
        {
          label: 'Secretariat',
          value: 'secretariat',
        },
        {
          label: 'Admin',
          value: 'admin',
        },
      ],
    },
  ],
}
