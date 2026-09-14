// collections/Faculty.ts
import { CollectionConfig } from 'payload'
import { AccessArgs } from 'payload'

export const Faculty: CollectionConfig = {
  slug: 'faculty-advisors',
  labels: {
    singular: 'Faculty Advisor',
    plural: 'Faculty Advisors',
  },
  admin: {
    useAsTitle: 'email',
    group: 'Delegation Management',
  },
  access: {
    read: ({ req }: AccessArgs) => {
      if (!req.user) return false
      return !!(
        req.user &&
        'roles' in req.user &&
        (req.user.roles.includes('admin') || req.user.roles.includes('teacher'))
      )
    },
    create: ({ req }: AccessArgs) => {
      return !!(
        req.user &&
        'roles' in req.user &&
        (req.user.roles.includes('admin') || req.user.roles.includes('teacher'))
      )
    },
    update: ({ req, data }: AccessArgs) => {
      if (!req.user) return false
      return !!(
        req.user &&
        'roles' in req.user &&
        (req.user.roles.includes('admin') || req.user.id === data?.teacher)
      )
    },
    delete: ({ req }: AccessArgs) => {
      if (!req.user) return false
      return !!(req.user && 'roles' in req.user && req.user.roles.includes('admin'))
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
      name: 'delegation',
      type: 'relationship',
      relationTo: 'delegation-applications',
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
