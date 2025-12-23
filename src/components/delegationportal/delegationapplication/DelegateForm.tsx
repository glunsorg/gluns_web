/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Delegate } from '@/app/types/types'
import { useAuthStore } from '@/app/store/authStore'

type Props = {
  open: boolean
  delegate: Delegate | null
  onClose: () => void
  onSaved: (delegate: Delegate) => void
}

export default function DelegateForm({ open, delegate, onClose, onSaved }: Props) {
  const { setUser } = useAuthStore()
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  })

  // Populate form when editing
  useEffect(() => {
    if (delegate) {
      setFormData({
        firstName: delegate.firstName,
        lastName: delegate.lastName,
        email: delegate.email,
        phoneNumber: delegate.phoneNumber,
      })
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
      })
    }
  }, [delegate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    setSaving(true)

    try {
      const method = delegate?.id ? 'PATCH' : 'POST'
      const url = delegate?.id ? `/api/delegates/${delegate.id}` : '/api/delegates'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.status === 401) {
        setUser(null)
        return
      }

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Failed to save faculty advisor')
      }

      onSaved(data)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSave}>
          <DialogHeader>
            <DialogTitle>{delegate ? 'Edit Delegate' : 'Add Delegate'}</DialogTitle>
            <DialogDescription>
              {delegate ? "Update your delegate's information." : 'Add a new delegate.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {['firstName', 'lastName', 'email', 'phoneNumber'].map((field) => (
              <div key={field} className="grid gap-2">
                <Label htmlFor={field}>{field.replace(/([A-Z])/g, ' $1')}</Label>
                <Input
                  id={field}
                  name={field}
                  value={(formData as any)[field]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
