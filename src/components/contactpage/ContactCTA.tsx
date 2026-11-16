'use client'
import React from 'react'
import { motion } from 'framer-motion'

export default function ContactCTA() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.75,
        ease: 'easeInOut' as const,
      },
    },
  }

  return (
    <section className="py-16 md:py-24 px-8 md:px-12 -mt-6 md:-mt-7 dark:border-t dark:border-white rounded-t-4xl relative z-30 overflow-hidden">
      {/* Background with Gradient */}
      <div className="absolute inset-0 bg-[#0d1a0d]"></div>

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="md:text-center">
          <h2 className="text-5xl lg:text-7xl font-bold mb-6 uppercase">
            <span className="text-white">
              Ready to Begin Your <span className="text-[#85c226]">GLUNS</span> Journey?{' '}
            </span>
          </h2>
          <p className="text-base md:text-xl text-purple-100 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Step forward and be part of a global community shaping positive change. Whether you{"'"}
            re a student, educator, partner, or institution—we{"'"}re here to support your GLUNS
            experience.
          </p>
        </motion.div>
      </motion.div>
    </section>
  )
}
