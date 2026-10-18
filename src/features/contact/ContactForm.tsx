"use client"

import React, { useState } from 'react'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Send, CheckCircle2, Loader2 } from 'lucide-react'

const TOPICS = [
  { value: 'role', label: 'Job opportunity' },
  { value: 'collaboration', label: 'Collaboration' },
  { value: 'project-question', label: 'Question about a project' },
  { value: 'other', label: 'Something else' },
] as const

const ContactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  company: z.string().optional(),
  topic: z.enum(['role', 'collaboration', 'project-question', 'other'], {
    errorMap: () => ({ message: 'Please select a topic' }),
  }),
  message: z.string().min(20, 'Message must be at least 20 characters'),
})

type Status = 'idle' | 'sending' | 'success' | 'error'

/**
 * Sends the message to Formspree (https://formspree.io), which forwards it to the site email.
 * The form ID comes from content/site.yaml; without it the form explains how to email directly.
 */
export default function ContactForm({ formspreeId, email }: { formspreeId: string; email: string }) {
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({})
  const [message, setMessage] = useState('')
  const isPending = status === 'sending'

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = Object.fromEntries(new FormData(form))

    if (data._gotcha) return // honeypot field filled in: a bot

    const result = ContactSchema.safeParse(data)
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors)
      setStatus('error')
      setMessage('Please fix the errors below.')
      return
    }
    setErrors({})

    if (!formspreeId) {
      setStatus('error')
      setMessage(`The form is not connected yet. Please email me directly at ${email}.`)
      return
    }

    setStatus('sending')
    try {
      const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...result.data, _subject: `GeoWorldLook: ${result.data.topic} from ${result.data.name}` }),
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      form.reset()
      setStatus('success')
      setMessage("Thanks! Your message has been delivered and I'll get back to you soon.")
    } catch {
      setStatus('error')
      setMessage(`Sending failed. Please try again or email me at ${email}.`)
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4 animate-in zoom-in duration-500 text-center">
        <CheckCircle2 className="w-16 h-16 text-emerald-400" />
        <h3 className="text-2xl font-bold text-white">Message Sent!</h3>
        <p className="text-gray-400 max-w-xs mx-auto">{message}</p>
        <Button
          variant="outline"
          className="border-emerald-400/20 text-emerald-400 hover:bg-emerald-400/10"
          onClick={() => setStatus('idle')}
        >
          Send another message
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-gray-400">Full Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Jane Doe"
            className="bg-black/40 border-white/[0.1] focus:border-emerald-400/50 text-white"
            required
            disabled={isPending}
          />
          {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name[0]}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-400">Email Address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="jane@example.com"
            className="bg-black/40 border-white/[0.1] focus:border-emerald-400/50 text-white"
            required
            disabled={isPending}
          />
          {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email[0]}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="company" className="text-gray-400">Company (Optional)</Label>
          <Input
            id="company"
            name="company"
            placeholder="Organization"
            className="bg-black/40 border-white/[0.1] focus:border-emerald-400/50 text-white"
            disabled={isPending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="topic" className="text-gray-400">Topic</Label>
          <select
            id="topic"
            name="topic"
            className="w-full h-10 rounded-md bg-black/40 border border-white/[0.1] focus:border-emerald-400/50 text-white px-3 text-sm focus:outline-none"
            required
            disabled={isPending}
            defaultValue=""
          >
            <option value="">Select topic...</option>
            {TOPICS.map((topic) => (
              <option key={topic.value} value={topic.value}>{topic.label}</option>
            ))}
          </select>
          {errors.topic && <p className="text-xs text-red-400 mt-1">{errors.topic[0]}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-gray-400">Message</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="What would you like to talk about?"
          rows={5}
          className="bg-black/40 border-white/[0.1] focus:border-emerald-400/50 text-white"
          required
          disabled={isPending}
        />
        {errors.message && <p className="text-xs text-red-400 mt-1">{errors.message[0]}</p>}
      </div>

      {status === 'error' && (
        <p className="text-sm text-red-400 font-medium animate-in fade-in slide-in-from-top-1">{message}</p>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold gap-2"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            Send Message
            <Send className="w-4 h-4" />
          </>
        )}
      </Button>
    </form>
  )
}
