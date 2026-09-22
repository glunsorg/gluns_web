export interface Delegation {
  id?: string
  delegationName: string
  event: string
  countryOfOrigin: string
  numberOfDelegates: number
  numberOfFacultyAdvisors: number
  previousExperience: string
  hmunExperience: string
  preferredRegions?: string
  prefersDoubleDelegations: 'yes' | 'no'
  crisisCommitteeRequests?: string
  committeeInterests: string
  status: string
}

export interface Delegate {
  id?: number
  firstName: string
  lastName: string
  gradeLevel: string
  email: string
  phoneNumber: string
}

export interface FacultyAdvisor {
  id?: number
  teacher?: string
  delegation?: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
}

export interface Delegation {
  id?: number
  country: string
  school: string
  delegates: Delegate[]
  facultyAdvisors: FacultyAdvisor[]
}

// app/types/types.ts
export interface SecretariatMember {
  id: number
  full_name: string
  role: string
  email: string
  bio: string
  photo: {
    url: string
    alt: string
  }
}

export interface CommitteeAssignment {
  id: number

  delegation: {
    id: number
    delegationName: string
  }

  delegates: Array<{
    id: number
    firstName: string
    lastName: string
    email: string
  }>

  committee: {
    id: number
    title: string
  }

  country: {
    id: number
    name: string
  }

  positionPaper?: {
    id: number
    filename: string
    url: string
  }

  assignedAt: string
  seatType: string
}

export interface User {
  id: number
  email: string
  roles: string[]
}
