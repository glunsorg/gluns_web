import { CollectionConfig } from 'payload'
import slugify from 'slugify'

export const Events: CollectionConfig = {
  slug: 'event',
  admin: {
    useAsTitle: 'title',
    description: 'Add Event',
    group: 'Administration',
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
      required: true,
    },
    {
      name: 'conference_policy',
      label: 'Conference Policy',
      type: 'upload',
      relationTo: 'documents',
      required: false,
    },
  ],
}
