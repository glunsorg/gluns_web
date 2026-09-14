import type { CollectionConfig } from 'payload'
import { createDelegationOnApproval } from '../hooks/DelegationCreate'
import { AccessArgs } from 'payload'

export const DelegationApplications: CollectionConfig = {
  slug: 'delegation-applications',
  admin: {
    useAsTitle: 'delegationName',
    group: 'Delegation Management',
  },
  access: {
    create: ({ req }: AccessArgs) => {
      return !!(
        req.user &&
        'roles' in req.user &&
        (req.user.roles.includes('teacher') || req.user.roles.includes('delegate'))
      )
    },
    read: () => true,
    update: ({ req, data }: AccessArgs) => {
      return !!(
        req.user &&
        'roles' in req.user &&
        (req.user.roles.includes('admin') || req.user.id === data?.user)
      )
    },
    delete: ({ req, data }: AccessArgs) => {
      return !!(
        req.user &&
        'roles' in req.user &&
        (req.user.roles.includes('admin') || req.user.id === data?.user)
      )
    },
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
      name: 'event',
      type: 'relationship',
      relationTo: 'event',
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
      required: false,
      defaultValue: 0,
      min: 0,
    },
    {
      name: 'numberOfFacultyAdvisors',
      type: 'number',
      required: false,
      defaultValue: 0,
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
