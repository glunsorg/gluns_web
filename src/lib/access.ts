import type { AccessArgs, Where } from 'payload'

export const isAdmin = ({ req }: AccessArgs) =>
  Array.isArray(req.user?.roles) && req.user.roles.includes('admin')

export const hasRole = (
  { req }: AccessArgs,
  role: 'teacher' | 'delegate' | 'secretariat' | 'admin',
) =>
  Array.isArray(req.user?.roles) && req.user.roles.includes(role)

const isRegistrationUser = ({ req }: AccessArgs) =>
  !!req.user && (hasRole({ req }, 'teacher') || hasRole({ req }, 'delegate'))

const ownWhere = (path: string, userId: string | number): Where =>
  ({ [path]: { equals: userId } }) as Where

const ownRegistration = (path: string, userId: string | number): Where =>
  ownWhere(`${path}.registeredBy`, userId)

export const adminAccess = {
  create: isAdmin,
  read: () => true,
  update: isAdmin,
  delete: isAdmin,
}

export const registrationAccess = {
  create: isRegistrationUser,
  read: ({ req }: AccessArgs) =>
    isAdmin({ req }) || (req.user ? ownWhere('registeredBy', req.user.id) : false),
  update: ({ req }: AccessArgs) =>
    isAdmin({ req }) || (req.user ? ownWhere('registeredBy', req.user.id) : false),
  delete: ({ req }: AccessArgs) =>
    isAdmin({ req }) || (req.user ? ownWhere('registeredBy', req.user.id) : false),
}

export const delegateAccess = {
  create: isRegistrationUser,
  read: ({ req }: AccessArgs) =>
    isAdmin({ req }) || (req.user ? ownRegistration('registration', req.user.id) : false),
  update: ({ req }: AccessArgs) =>
    isAdmin({ req }) || (req.user ? ownRegistration('registration', req.user.id) : false),
  delete: ({ req }: AccessArgs) =>
    isAdmin({ req }) || (req.user ? ownRegistration('registration', req.user.id) : false),
}

export const ownRegistrationReadAccess = (path: string) => ({
  create: isAdmin,
  read: ({ req }: AccessArgs) =>
    isAdmin({ req }) || (req.user ? ownRegistration(path, req.user.id) : false),
  update: isAdmin,
  delete: isAdmin,
})

export const ownRecipientReadAccess = {
  create: isAdmin,
  read: ({ req }: AccessArgs) =>
    isAdmin({ req }) || (req.user ? ownWhere('recipient', req.user.id) : false),
  update: isAdmin,
  delete: isAdmin,
}

export const assignmentAccess = {
  create: ({ req }: AccessArgs) => isAdmin({ req }) || hasRole({ req }, 'secretariat'),
  read: ({ req }: AccessArgs) =>
    isAdmin({ req }) ||
    hasRole({ req }, 'secretariat') ||
    (req.user ? ownRegistration('delegate.registration', req.user.id) : false),
  update: ({ req }: AccessArgs) => isAdmin({ req }) || hasRole({ req }, 'secretariat'),
  delete: ({ req }: AccessArgs) => isAdmin({ req }) || hasRole({ req }, 'secretariat'),
}
