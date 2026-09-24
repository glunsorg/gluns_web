// institutions collection
import { CollectionConfig } from 'payload'
import { AccessArgs } from 'payload'

export const Institutions: CollectionConfig = {
  slug: 'institutions',
  admin: {
    useAsTitle: 'name',
    group: 'Delegation Management',
    defaultColumns: ['name', 'institutionType', 'email'],
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
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'institutionType',
      type: 'select',
      required: true,
      options: [
        {
          label: 'School',
          value: 'school',
        },
        {
          label: 'University',
          value: 'university',
        },
        {
          label: 'Organization',
          value: 'organization',
        },
      ],
    },
    {
      name: 'country',
      type: 'text',
      required: true,
    },
    {
      name: 'city',
      type: 'text',
      required: true,
    },
    { name: 'address', type: 'text', required: true },
    {
      name: 'email',
      type: 'email',
      required: true,
    },

    {
      name: 'phoneNumber',
      type: 'number',
      required: true,
    },
    { name: 'website', type: 'text', required: false },
  ],

  indexes: [
    {
      fields: ['name'],
      unique: true,
    },
  ],
}
