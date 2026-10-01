// profile collection
import { CollectionConfig } from 'payload'

export const Profile: CollectionConfig = {
  slug: 'profile',
  admin: {
    useAsTitle: 'user',
  },
  access: {
    read: () => true,
    create: () => false,
    update: ({ req: { user } }) => !!user,
    delete: () => false,
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      unique: true,
    },
    {
      name: 'institution',
      type: 'relationship',
      relationTo: 'institutions',
    },
  ],
}
