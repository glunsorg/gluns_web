import { AccessArgs } from 'payload'

export const isAdmin = ({ req }: AccessArgs) => {
  return Boolean(req.user && !('roles' in req.user))
}
