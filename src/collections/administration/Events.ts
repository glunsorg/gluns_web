import { CollectionConfig } from 'payload'
import slugify from 'slugify'

export const Events: CollectionConfig = {
  slug: 'event',
  admin: {
    useAsTitle: 'title',
    description: 'Add Event',
    group: 'Administration',
  },
  access: {
    read: () => true,
    create: ({ req }) => req.user?.roles === 'admin',
    update: ({ req }) => req.user?.roles === 'admin',
    delete: ({ req }) => req.user?.roles === 'admin',
  },
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      required: true,
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
      name: 'subtitle',
      label: 'Subtitle',
      type: 'textarea',
      required: false,
    },
    {
      name: 'banner',
      label: 'Event Image',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'description',
      label: 'Event Information',
      type: 'richText',
      required: true,
    },
    {
      name: 'location',
      label: 'Location',
      type: 'text',
      required: true,
    },
    {
      name: 'date',
      label: 'Event Date',
      type: 'date',
      required: true,
    },
    {
      name: 'cost',
      label: 'Event Cost',
      type: 'number',
      required: false,
    },
    {
      name: 'currency',
      label: 'Currency',
      type: 'text',
      required: false,
      defaultValue: 'KES',
    },
  ],
}
