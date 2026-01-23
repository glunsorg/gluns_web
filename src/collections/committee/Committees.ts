import { CollectionConfig } from 'payload'
import slugify from 'slugify'

export const Committees: CollectionConfig = {
  slug: 'committees',
  admin: {
    useAsTitle: 'title',
    group: 'Committee Management',
  },
  access: {
    read: ({ req }) => req.user?.roles === 'admin',
    delete: () => true,
    create: () => true,
    update: () => true,
  },
  fields: [
    {
      name: 'title',
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
      },
      hooks: {
        beforeValidate: [
          ({ data }) => {
            if (data?.title) return slugify(data.title, { lower: true, strict: true })
          },
        ],
      },
    },
    {
      name: 'committee_category',
      label: 'Committee Category',
      type: 'select',
      options: [
        { label: 'Politics', value: 'politics' },
        { label: 'Economics', value: 'economics' },
        { label: 'Social', value: 'social' },
        { label: 'Environment', value: 'environment' },
        { label: 'Specialized', value: 'specialized' },
      ],
      required: true,
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
      type: 'richText',
      required: true,
    },
  ],
}
