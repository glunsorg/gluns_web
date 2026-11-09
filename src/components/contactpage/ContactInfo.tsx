'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { Mail, MapPin } from 'lucide-react'
import Link from 'next/link'
import { FaInstagram, FaLinkedin, FaFacebookF, FaXTwitter } from 'react-icons/fa6'

export default function ContactInfo() {
  const containerVariants = {
    hidden: { opacity: 0, x: 50 },
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

  const contactMethods = [
    {
      icon: Mail,
      title: 'General Inquiries',
      value: 'info@gluns.org',
      description: 'Questions about GLUNS programmes, events, or participation.',
      href: 'mailto:info@gluns.org',
    },
    {
      icon: Mail,
      title: 'Delegations & Registration',
      value: 'delegateaffairs@gluns.org',
      description: 'Support for schools, delegation leaders, and delegate registration.',
      href: 'mailto:delegateaffairs@gluns.org',
    },
    {
      icon: Mail,
      title: 'Partnerships & Sponsorships',
      value: 'info@gluns.org',
      description: 'Explore partnerships that strengthen youth diplomacy and leadership.',
      href: 'mailto:info@gluns.org',
    },
    {
      icon: Mail,
      title: 'Media & Press',
      value: 'admin@gluns.org',
      description: 'For interviews, event coverage, and GLUNS media enquiries.',
      href: 'mailto:admin@gluns.org',
    },
  ]

  const socialLinks = [
    { name: 'Instagram', href: '#', icon: FaInstagram },
    { name: 'Twitter', href: '#', icon: FaXTwitter },
    { name: 'LinkedIn', href: '#', icon: FaLinkedin },
    { name: 'Facebook', href: '#', icon: FaFacebookF },
  ]

  return (
    <motion.div
      id="contact-info"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="space-y-8 pb-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h2 className="text-4xl lg:text-5xl font-bold text-[#104179] mb-4 uppercase">
          Get In Touch
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          We’re here to support delegates, schools, partners, and media teams. Choose the right
          contact and we’ll respond shortly.
        </p>
      </motion.div>

      {/* Contact Methods Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {contactMethods.map((method, index) => (
          <motion.a
            key={index}
            href={method.href}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="group block transition-all duration-300"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[#104179] shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <method.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-[#104179] mb-1 transition-colors">
                  {method.title}
                </h3>
                <p className="text-[#85c226] md:font-medium mb-1">{method.value}</p>
                <p className="text-sm text-gray-500">{method.description}</p>
              </div>
            </div>
          </motion.a>
        ))}
      </motion.div>

      {/* Office Location */}
      <motion.div
        variants={itemVariants}
        className="bg-linear-to-br from-[#104179]/5 to-purple-100/50 p-8 rounded-3xl border border-[#104179]/10"
      >
        <div className="flex items-start gap-6">
          <div className="p-4 bg-[#104179] rounded-2xl shadow-lg">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-[#104179] mb-3">Our Office</h3>
            <div className="space-y-2 text-gray-600">
              <p>Luther Plaza, Nairobi </p>
              <p> Kenya</p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} className="inline-block mt-4">
              <Link
                href="#map"
                className="text-[#104179] font-semibold hover:underline flex items-center gap-2"
              >
                View on Map
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Social Links */}
      <motion.div variants={itemVariants}>
        <h3 className="text-xl font-semibold text-[#104179] mb-4">Follow Us</h3>
        <div className="flex gap-4">
          {socialLinks.map((social, index) => (
            <motion.a
              key={index}
              href={social.href}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 bg-[#104179] rounded-xl flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
              title={social.name}
            >
              <social.icon className="w-6 h-6" />
            </motion.a>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
