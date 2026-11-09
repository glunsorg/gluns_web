// institutions collection
import { CollectionConfig } from 'payload'
import { adminAccess } from '@/lib/access'

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
  access: adminAccess,
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
