// app/components/secretariat/SecList.server.tsx
import SecList from './SecList'
import { fetchSecretariat } from '@/data/secretariatFetch'

export default async function SecListServer() {
  const { secretariat } = await fetchSecretariat()

  return <SecList secretariat={secretariat} />
}
