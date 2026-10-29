// institutions collection
import { CollectionConfig } from 'payload'
import { AccessArgs } from 'payload'

function normalizeInstitutionName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\b(high\s*school|highschool|schools?|school)\b/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
}

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
  hooks: {
    beforeValidate: [
      async ({ data }) => {
        if (data?.name && typeof data.name === 'string') {
          data.normalizedName = normalizeInstitutionName(data.name)
        }
        return data
      },
    ],
  },

  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'normalizedName',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        readOnly: true,
        description: 'Automatically normalized institution name.',
      },
    },
  ],
}
