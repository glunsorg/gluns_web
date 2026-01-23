import type { CollectionConfig } from 'payload'
import { createDelegationOnApproval } from '../hooks/DelegationCreate'

export const DelegationApplications: CollectionConfig = {
  slug: 'delegation-applications',
  admin: {
    useAsTitle: 'delegationName',
    group: 'Delegation Management',
  },
  access: {
    create: ({ req }) => req.user?.roles === 'teacher',
    read: ({ req }) => req.user?.roles === 'admin',
    update: ({ req, data }) => req.user?.roles === 'admin' || req.user?.id === data?.user,
  },
  hooks: {
    afterChange: [createDelegationOnApproval],
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'delegationName',
      type: 'text',
      required: true,
    },
    {
      name: 'countryOfOrigin',
      type: 'text',
      required: true,
    },
    {
      name: 'numberOfDelegates',
      type: 'number',
      required: true,
      min: 1,
    },
    {
      name: 'numberOfFacultyAdvisors',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'previousExperience',
      type: 'textarea',
      required: true,
    },
    {
      name: 'hmunExperience',
      type: 'text',
      required: true,
    },
    {
      name: 'preferredRegions',
      type: 'text',
      maxLength: 255,
    },
    {
      name: 'prefersDoubleDelegations',
      type: 'select',
      required: true,
      options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
      ],
    },
    {
      name: 'crisisCommitteeRequests',
      type: 'textarea',
      maxLength: 255,
    },
    {
      name: 'committeeInterests',
      type: 'select',
      required: true,
      options: [
        { label: 'Advanced Committees', value: 'advanced' },
        { label: 'Press Corps', value: 'press' },
        { label: 'Novice Committees', value: 'novice' },
        { label: 'Bilingual Spanish', value: 'spanish' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
      ],
    },
  ],
}
