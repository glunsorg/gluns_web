import { CollectionConfig } from 'payload'

export const Faculty: CollectionConfig = {
  slug: 'faculty',
  labels: {
    singular: 'Faculty Advisor',
    plural: 'Faculty Advisors',
  },
  admin: {
    useAsTitle: 'email',
  },
  access: {
    read: ({ req }) => req.user?.roles === 'admin' || req.user?.roles === 'teacher',
    create: ({ req }) => req.user?.roles === 'teacher',
    update: ({ req, data }) => req.user?.roles === 'admin' || req.user?.id === data?.teacher,
  },
  fields: [
    {
      name: 'teacher',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'delegation',
      type: 'relationship',
      relationTo: 'delegations',
      required: true,
    },
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
  ],
}
