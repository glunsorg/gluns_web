import type { CollectionConfig, AccessArgs, FieldAccess } from 'payload'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isAdmin = (req: any) => Array.isArray(req.user?.roles) && req.user.roles.includes('admin')

// Allow admins to update any user.
// Allow regular users to update only their own account.
const canUpdateUser = ({ req, id }: AccessArgs) => {
  if (!req.user) return false

  if (isAdmin(req.user)) return true

  return String(req.user.id) === String(id)
}

// Only admins can modify roles.
const canUpdateRoles: FieldAccess = ({ req }) => {
  return isAdmin(req)
}

export const Users: CollectionConfig = {
  slug: 'users',

  admin: {
    useAsTitle: 'email',
    group: 'Administration',
    defaultColumns: ['email', 'fullName', 'roles', 'institutionName', 'institution'],
  },

  auth: true,

  access: {
    create: () => true,

    read: () => true,

    update: canUpdateUser,

    delete: ({ req }: AccessArgs) => isAdmin(req),
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

      // Prevent non-admin users from changing their roles.
      access: {
        read: () => true,
        update: canUpdateRoles,
      },
    },

    {
      name: 'fullName',
      type: 'text',
      required: true,
      defaultValue: 'Unknown',
    },

    {
      name: 'institution',
      type: 'relationship',
      relationTo: 'institutions',
      required: false,

      admin: {
        condition: (data) => Array.isArray(data?.roles) && data.roles.includes('teacher'),
      },
    },

    {
      name: 'institutionName',
      type: 'text',
      required: false,

      admin: {
        condition: (data) => Array.isArray(data?.roles) && data.roles.includes('delegate'),
      },
    },
  ],
}
