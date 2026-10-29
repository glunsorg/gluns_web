/* eslint-disable @typescript-eslint/no-explicit-any */
import { createRegistration } from '@/services/registration/createRegistration'

export async function createRegistrationEndpoint(req: any) {
  const registration = await createRegistration({
    payload: req.payload,
    eventId: req.body.event,
    registrationType: req.body.registrationType,
    userId: req.user.id,
  })

  return Response.json(registration, { status: 201 })
}
