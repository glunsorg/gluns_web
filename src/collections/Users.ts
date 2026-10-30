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

  auth: {
    forgotPassword: {
      expiration: 60 * 60 * 1000,

      generateEmailSubject: () => {
        return 'Reset Your Password'
      },

      generateEmailHTML: (args) => {
        if (!args) {
          return '<p>Password reset requested.</p>'
        }

        const { token, user } = args

        const resetURL = `${process.env.NEXT_PUBLIC_SERVER_URL}/reset-password?token=${encodeURIComponent(token ?? '')}`

        return `
    <!DOCTYPE html>
    <html>
      <body>
        <h2>Password Reset Request</h2>

        <p>Hello ${user?.email ?? 'User'},</p>

        <p>
          We received a request to reset your password.
        </p>

        <p>
          Click the link below to reset your password.
        </p>

        <a href="${resetURL}">
          Reset Password
        </a>

        <p>
          This link expires in one hour.
        </p>

        <p>
          If you did not request this, you can ignore this email.
        </p>
      </body>
    </html>
  `
      },
    },
  },

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
