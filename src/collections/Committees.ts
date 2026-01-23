import { CollectionConfig } from 'payload'
import slugify from 'slugify'

export const Committees: CollectionConfig = {
  slug: 'committees',
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
      name: 'committee_photo',
      label: 'Committee BG',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'summary',
      type: 'richText',
      required: true,
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
      name: 'director_name',
      label: "Director's Name",
      type: 'text',
      required: false,
    },
    {
      name: 'director_photo',
      label: "Director's Photo",
      type: 'upload',
      relationTo: 'portraits',
      required: false,
    },
    {
      name: 'director_statement',
      label: "Director's Statement",
      type: 'richText',
      required: false,
    },
  ],
}
