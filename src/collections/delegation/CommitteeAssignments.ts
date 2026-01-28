/* eslint-disable @typescript-eslint/no-explicit-any */
import { CollectionConfig } from 'payload'

export const CommitteeAssignments: CollectionConfig = {
  slug: 'committee-assignments',

  admin: {
    group: 'Committee Management',
    useAsTitle: 'id',
    defaultColumns: ['delegation', 'committee', 'country', 'seatType', 'assignedAt'],
  },

  access: {
    read: () => true,

    create: ({ req }) => req.user?.roles === 'admin' || req.user?.roles === 'teacher',

    update: ({ req }) => req.user?.roles === 'admin' || req.user?.roles === 'secretariat',

    delete: ({ req }) => req.user?.roles === 'admin' || req.user?.roles === 'teacher',
  },

  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        if (operation !== 'create') return data

        // Prevent duplicate committee-country per delegation
        const existing = await req.payload.find({
          collection: 'committee-assignments',
          where: {
            delegation: { equals: data.delegation },
            committee: { equals: data.committee },
            country: { equals: data.country },
          },
          limit: 1,
        })

        if (existing.totalDocs > 0) {
          throw new Error(
            'This delegation already has an assignment for this committee and country.',
          )
        }

        // Enforce 1–2 delegates
        if (
          !Array.isArray(data.delegates) ||
          data.delegates.length < 1 ||
          data.delegates.length > 2
        ) {
          throw new Error('Assignments must have 1 or 2 delegates.')
        }

        return data
      },
    ],
  },

  fields: [
    /**
     * Delegation (anchor field)
     */
    {
      name: 'delegation',
      type: 'relationship',
      relationTo: 'delegation-applications',
      required: true,
      index: true,
    },

    /**
     * Delegates (1–2 only)
     */
    {
      name: 'delegates',
      type: 'relationship',
      relationTo: 'delegates',
      hasMany: true,
      required: true,
      minRows: 1,
      maxRows: 2,

      filterOptions: ({ siblingData, user }) => {
        const delegationId = (siblingData as any)?.delegation
        if (!delegationId) return false

        const baseFilter = {
          delegation: { equals: delegationId },
        }

        // Admin & Secretariat: all delegates in delegation
        if (user?.roles === 'admin' || user?.roles === 'secretariat') {
          return baseFilter
        }

        // Teachers: only their own delegates
        return {
          ...baseFilter,
          ...(user?.id && { teacher: { equals: user.id } }),
        }
      },
    },

    /**
     * Committee
     */
    {
      name: 'committee',
      type: 'relationship',
      relationTo: 'committees',
      required: true,
    },

    /**
     * Country
     */
    {
      name: 'country',
      type: 'relationship',
      relationTo: 'countries',
      required: true,
    },

    /**
     * Derived seat type (read-only)
     */
    {
      name: 'seatType',
      type: 'select',
      admin: { readOnly: true },
      options: [
        { label: 'Single Delegation', value: 'single' },
        { label: 'Double Delegation', value: 'double' },
      ],
      hooks: {
        beforeChange: [
          ({ siblingData }) => (siblingData?.delegates?.length === 2 ? 'double' : 'single'),
        ],
      },
    },

    /**
     * Position paper (shared)
     */
    {
      name: 'positionPaper',
      type: 'upload',
      relationTo: 'media',
    },

    /**
     * Assignment timestamp
     */
    {
      name: 'assignedAt',
      type: 'date',
      defaultValue: () => new Date(),
      admin: {
        readOnly: true,
      },
    },
  ],
}
