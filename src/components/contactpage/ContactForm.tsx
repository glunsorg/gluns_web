'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Send,
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  MessageSquare,
  LoaderCircle,
} from 'lucide-react'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    id: '',
    full_name: '',
    email: '',
    subject: '',
    message: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const validateForm = (elements: HTMLFormControlsCollection) => {
    const newErrors: Record<string, string> = {}
    let isValid = true

    Array.from(elements)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((el: any) => el.full_name && el.required)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .forEach((el: any) => {
        if (!el.value.trim()) {
          newErrors[el.full_name] = `${el.full_name} is required`
          isValid = false
        } else if (el.type === 'email' && !/^\S+@\S+\.\S+$/.test(el.value)) {
          newErrors[el.full_name] = 'Please enter a valid email address'
          isValid = false
        }
      })

    setErrors(newErrors)
    return isValid
  }

  useEffect(() => {
    fetch('/api/get-form')
      .then((res) => res.json())
      .then((data) => setFormData(data))
      .catch(() => console.error('Could not load form data'))
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formEl = e.currentTarget

    if (!validateForm(formEl.elements)) return

    const payload = {
      form: formData.id,
      submissionData: Array.from(formEl.elements)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((el: any) => el.name)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((el: any) => ({ field: el.name, value: el.value })),
    }

    setIsSubmitting(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/form-submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        setIsSubmitted(true)
        formEl.reset()
      } else {
        throw new Error('Form submission failed')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setErrors({ form: 'There was a problem submitting your form. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  if (!formData)
    return (
      <section className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="bg-[#104179] border border-[#85cc26] rounded-lg p-6 sm:p-8 text-center flex flex-col items-center space-y-4 shadow-md max-w-md mx-auto">
          <LoaderCircle className="w-10 h-10 text-white animate-spin" />
          <h3 className="text-lg sm:text-xl font-semibold text-white">Please Wait!</h3>
          <p className="text-gray-50 text-sm sm:text-base">
            We{"'"}re loading the contact form for you.
          </p>
        </div>
      </section>
    )

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center p-12 bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-3xl border border-green-200 dark:border-green-800"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <CheckCircle className="w-16 h-16 text-green-500 mb-6" />
        </motion.div>
        <h3 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-4">
          Message Sent Successfully!
        </h3>
        <p className="text-green-700 dark:text-green-400 text-center">
          Thank you for reaching out. We{"'"}ll get back to you within 24 hours.
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      id="contact-form"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.div variants={itemVariants} className="mb-8">
        <h2 className="text-4xl lg:text-5xl font-bold text-[#104179] dark:text-white mb-4">
          Connect With Our Team
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Share your inquiry with us - whether it{"'"}s about participation, partnerships, or
          support, we{"'"}re here to help you take the next step.
        </p>
      </motion.div>

      <motion.form onSubmit={handleSubmit} variants={containerVariants} className="space-y-6">
        {/* Name and Email Row */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 transition-all duration-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                  ${
                    errors.full_name
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-200 dark:border-gray-700 focus:border-[#85c226]'
                  } focus:outline-none`}
                placeholder="John Doe"
              />
              {errors.full_name && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1 text-red-500 text-sm mt-2"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.full_name}
                </motion.div>
              )}
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 transition-all duration-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                  ${
                    errors.email
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-200 focus:border-[#85c226]'
                  } focus:outline-none`}
                placeholder="john@example.com"
              />
              {errors.email && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1 text-red-500 text-sm mt-2"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Subject */}
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Subject *
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className={`w-full px-4 py-4 rounded-2xl border-2 transition-all duration-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
              ${
                errors.subject
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : 'border-gray-200 focus:border-[#85c226]'
              } focus:outline-none`}
            placeholder="What is your inquiry about?"
          />
          {errors.subject && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-1 text-red-500 text-sm mt-2"
            >
              <AlertCircle className="w-4 h-4" />
              {errors.subject}
            </motion.div>
          )}
        </motion.div>

        {/* Message */}
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Message *
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-4 top-6 text-gray-400 w-5 h-5" />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={6}
              className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 transition-all duration-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none
                ${
                  errors.message
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-gray-200 focus:border-[#85c226]'
                } focus:outline-none`}
              placeholder="Provide details about your inquiry or request"
            />
            {errors.message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1 text-red-500 text-sm mt-2"
              >
                <AlertCircle className="w-4 h-4" />
                {errors.message}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.div variants={itemVariants}>
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: isSubmitting ? 1 : 1.02, y: isSubmitting ? 0 : -2 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
            className={`w-full py-4 px-8 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-lg cursor-pointer
              ${
                isSubmitting
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  : 'bg-[#104179] hover:from-purple-700 hover:to-[#104179] text-white'
              }`}
          >
            {isSubmitting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-gray-700 border-t-transparent rounded-full"
                />
                Sending Message...
              </>
            ) : (
              <>
                Send Message
                <Send className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </motion.div>
      </motion.form>
    </motion.div>
  )
}
