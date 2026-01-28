/* eslint-disable @typescript-eslint/no-explicit-any */
// utils/uploadPositionPaper.ts
import { apiFetch } from './apiFetch'

/**
 * Upload a file to Payload Media and attach it to a committee assignment
 */
export async function uploadPositionPaper(assignmentId: number, file: File): Promise<any> {
  try {
    // Step 1: Upload file to Payload media
    const formData = new FormData()
    formData.append('file', file)

    const uploadRes = await fetch('/api/documents', {
      method: 'POST',
      body: formData,
    })

    if (!uploadRes.ok) throw new Error('Failed to upload file')

    const media = await uploadRes.json() // should return { id, url }

    // Step 2: PATCH committee assignment with uploaded file
    const patchRes = await apiFetch('/api/comm/committee-assignments', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        assignmentId,
        positionPaper: media, // { id, url }
      }),
    })

    if (!patchRes.ok) {
      const data = await patchRes.json().catch(() => ({}))
      throw new Error(data.message || 'Failed to attach position paper')
    }

    const data = await patchRes.json()
    return data.assignment
  } catch (err) {
    console.error(err)
    throw err
  }
}
