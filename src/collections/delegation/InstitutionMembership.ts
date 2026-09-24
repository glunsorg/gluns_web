// institutions collection
import { CollectionConfig } from 'payload'
import { AccessArgs } from 'payload'

export const InstitutionMemberships: CollectionConfig = {
  slug: 'institution-memberships',
  admin: {
    useAsTitle: 'user',
    group: 'Delegation Management',
    defaultColumns: ['name', 'country'],
    enableRichTextLink: false,
  },
  access: {
    read: ({ req }: AccessArgs) => !!req.user,
    create: ({ req }: AccessArgs) => !!req.user,
    update: ({ req }: AccessArgs) => !!req.user,
    delete: ({ req }: AccessArgs) => {
      return !!(req.user && 'roles' in req.user && req.user.roles.includes('admin'))
    },
  },
  hooks: {},

  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'institution',
      type: 'relationship',
      relationTo: 'institutions',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Student',
          value: 'student',
        },
        {
          label: 'Teacher',
          value: 'teacher',
        },
        {
          label: 'Administrator',
          value: 'administrator',
        },
      ],
    },
  ],
}
