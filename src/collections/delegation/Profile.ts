// profile collection
import { CollectionConfig } from 'payload'
import { adminAccess } from '@/lib/access'

export const Profile: CollectionConfig = {
  slug: 'profile',
  admin: {
    useAsTitle: 'user',
  },
  access: adminAccess,
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      unique: true,
    },
  ],
}
