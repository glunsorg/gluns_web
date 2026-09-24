import { addDelegates } from '@/services/registration/addDelegates'

export async function addDelegatesEdnpoint({ req }: any) {
  const delegatesResult = await addDelegates({
    payload: req.payload,
    registrationId: req.body.registrationId,
    delegates: req.body.delegates,
  })

  return Response.json(delegatesResult, { status: 200 })
}
