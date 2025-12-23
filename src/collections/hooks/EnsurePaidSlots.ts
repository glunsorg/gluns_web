// hooks/ensurePaidSlots.ts
import type { CollectionBeforeChangeHook } from 'payload'

export const ensurePaidSlots: CollectionBeforeChangeHook = async ({ data, req, operation }) => {
  if (operation !== 'create') return data // Only check on create

  const teacherId = data.teacher
  const delegationId = data.delegation

  // Fetch all payments for this teacher + delegation
  const payments = await req.payload.find({
    collection: 'payments',
    where: {
      teacher: {
        equals: teacherId,
      },
      delegation: {
        equals: delegationId,
      },
      status: {
        equals: 'paid',
      },
    },
    limit: 0, // fetch all matching payments
  })

  // Count how many slots have already been used
  const delegates = await req.payload.find({
    collection: 'delegates',
    where: {
      teacher: {
        equals: teacherId,
      },
      delegation: {
        equals: delegationId,
      },
    },
    limit: 0,
  })

  const totalSlotsPaid = payments.docs.reduce((acc, p) => acc + p.delegateSlotsPurchased, 0)
  const totalSlotsUsed = delegates.totalDocs // number of delegates already added

  if (totalSlotsUsed >= totalSlotsPaid) {
    throw new Error(`Cannot add delegate: all ${totalSlotsPaid} paid slots have been used.`)
  }

  return data
}
