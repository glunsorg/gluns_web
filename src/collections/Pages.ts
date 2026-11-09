import type { CollectionConfig } from 'payload'
import { OurTeam } from '@/app/blocks/committee/schema'
import { adminAccess } from '@/lib/access'

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: adminAccess,
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
      admin: {
        position: 'sidebar',
      },
      required: true,
    },
    {
      name: 'layout',
      label: 'Layout',
      type: 'blocks',
      blocks: [OurTeam],
    },
  ],
}
