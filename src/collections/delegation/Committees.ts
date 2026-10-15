import { CollectionConfig } from 'payload'
import slugify from 'slugify'
import { AccessArgs } from 'payload'

export const Committees: CollectionConfig = {
  slug: 'committees',
  admin: {
    useAsTitle: 'name',
    group: 'Committee Management',
  },
  access: {
    read: () => true,
    create: ({ req }: AccessArgs) => {
      return !!(req.user && 'roles' in req.user && req.user.roles.includes('admin'))
    },
    update: ({ req }: AccessArgs) => {
      return !!(req.user && 'roles' in req.user && req.user.roles.includes('admin'))
    },
    delete: ({ req }: AccessArgs) => {
      return !!(req.user && 'roles' in req.user && req.user.roles.includes('admin'))
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'committee_photo',
      label: 'Committee BG',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      admin: {
        position: 'sidebar',
        description:
          'This field is auto-generated from the Title field. Please do not edit manually.',
      },
      hooks: {
        beforeValidate: [
          ({ data }) => {
            if (data?.name) return slugify(data.name, { lower: true, strict: true })
          },
        ],
      },
    },

    {
      name: 'committee_code',
      label: 'Committee Code',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'summary',
      label: 'Summary',
      type: 'textarea',
      required: false,
    },

    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },
  ],

  indexes: [
    {
      fields: ['committee_code'],
      unique: true,
    },
  ],
}
