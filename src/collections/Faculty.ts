// collections/Faculty.ts
import { CollectionConfig } from 'payload'

export const Faculty: CollectionConfig = {
  slug: 'faculty-advisors',
  labels: {
    singular: 'Faculty Advisor',
    plural: 'Faculty Advisors',
  },
  admin: {
    useAsTitle: 'email',
  },
  access: {
    read: ({ req }) => {
      if (!req.user) return false
      return req.user.roles === 'admin' || { teacher: { equals: req.user.id } }
    },
    create: ({ req }) => req.user?.roles === 'teacher',
    update: ({ req }) => {
      if (!req.user) return false
      return req.user.roles === 'admin' || { teacher: { equals: req.user.id } }
    },
    delete: ({ req }) => {
      if (!req.user) return false
      return req.user.roles === 'admin' || { teacher: { equals: req.user.id } }
    },
  },

  fields: [
    {
      name: 'teacher',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        condition: () => false,
      },
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
      unique: true,
    },
    {
      name: 'phoneNumber',
      type: 'text',
      required: true,
      unique: true,
    },
  ],
}
