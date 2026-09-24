import { AccessArgs, CollectionConfig } from 'payload'
import slugify from 'slugify'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    description: 'Add Event',
    group: 'Administration',
  },
  access: {
    create: ({ req }: AccessArgs) => {
      return !!(req.user && 'roles' in req.user && req.user.roles.includes('admin'))
    },
    update: ({ req }: AccessArgs) => {
      return !!(req.user && 'roles' in req.user && req.user.roles.includes('admin'))
    },
    delete: ({ req }: AccessArgs) => {
      return !!(req.user && 'roles' in req.user && req.user.roles.includes('admin'))
    },
    read: () => true,
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
      name: 'description',
      label: 'Event Information',
      type: 'richText',
      required: true,
    },
    {
      name: 'venue',
      label: 'Venue',
      type: 'text',
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
    {
      name: 'eventType',
      label: 'Event Type',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Local',
          value: 'local',
        },
        {
          label: 'International',
          value: 'international',
        },
      ],
    },

    {
      name: 'registrationState',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Open', value: 'open' },
        { label: 'Closed', value: 'closed' },
      ],
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
    },

    {
      name: 'endDate',
      type: 'date',
      required: true,
    },

    {
      name: 'registrationOpen',
      type: 'date',
      required: true,
    },

    {
      name: 'registrationClose',
      type: 'date',
      required: true,
    },
    {
      name: 'allowIndividualRegistration',
      type: 'checkbox',
      defaultValue: true,
    },

    {
      name: 'allowInstitutionRegistration',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
