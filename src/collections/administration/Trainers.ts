import { CollectionConfig } from 'payload'
import slugify from 'slugify'
import { adminAccess } from '@/lib/access'

export const Trainers: CollectionConfig = {
  slug: 'trainers',
  access: adminAccess,
  admin: {
    useAsTitle: 'full_name',
    description: 'Add trainer records for QR badge verification',
    group: 'Administration',
  },
  labels: {
    singular: 'Trainer',
    plural: 'Trainers',
  },
  fields: [
    {
      name: 'full_name',
      type: 'text',
      required: true,
    },
    {
      name: 'verification_code',
      label: 'Badge Verification Code',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      hooks: {
        beforeValidate: [
          ({ value, data, originalDoc }) => {
            if (value) return slugify(value, { lower: true, strict: true })

            if (originalDoc?.verification_code) {
              return originalDoc.verification_code
            }

            const baseName = data?.full_name
              ? slugify(data.full_name, { lower: true, strict: true })
              : 'trainer'

            const randomSuffix = Math.random().toString(36).slice(2, 8)

            return `${baseName}-${randomSuffix}`
          },
        ],
      },
    },
    {
      name: 'organ',
      type: 'text',
      required: true,
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'portraits',
      required: false,
    },
    {
      name: 'gender',
      type: 'select',
      options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
      ],
      required: true,
    },
  ],
}
