'use client'

import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'

const faqs = [
  {
    question: 'What is GLUNS?',
    answer:
      'GLUNS (Global Leaders United Nations Symposium) is an international youth conference focused on diplomacy, leadership, and global affairs through UN-style simulations and workshops.',
  },
  {
    question: 'Who can participate in GLUNS?',
    answer:
      'GLUNS is open to high school students and young leaders from around the world. No prior experience is required.',
  },
  {
    question: 'Do I need Model UN experience to attend?',
    answer:
      'No. GLUNS welcomes both beginners and experienced delegates and provides training sessions throughout the conference.',
  },
  {
    question: 'What activities are included?',
    answer:
      'Activities include committee simulations, crisis scenarios, leadership workshops, panel discussions, and cultural exchange events.',
  },
  {
    question: 'Is GLUNS online or in-person?',
    answer:
      'GLUNS may be held in-person, virtually, or in a hybrid format depending on the edition.',
  },
  {
    question: 'Will I receive a certificate?',
    answer:
      'Yes. All participants receive certificates, and outstanding delegates may receive awards.',
  },
  {
    question: 'Is GLUNS affiliated with the United Nations?',
    answer: 'No. GLUNS is an independent educational initiative inspired by the United Nations.',
  },
]

export default function FAQS() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="relative bg-white min-h-screen py-12 px-6 md:px-12 lg:px-24">
      {/* FAQ Accordion */}
      <div className="max-w-5xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border-2 border-[#104179]/20 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex items-center justify-between p-6 md:p-8 text-left hover:bg-[#104179]/5 transition-all duration-300"
              aria-expanded={openIndex === index}
            >
              <h3 className="text-[#104179] font-bold text-lg md:text-xl lg:text-2xl pr-4 flex-1">
                {faq.question}
              </h3>
              <div
                className={`shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  openIndex === index ? 'bg-[#85c226] rotate-180' : 'bg-[#104179]'
                }`}
              >
                <ChevronDown className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
            </button>

            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-6 md:px-8 pb-6 md:pb-8">
                <div className="h-0.5 w-full bg-[#85c226] mb-4"></div>
                <p className="text-[#104179]/80 text-base md:text-lg leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="max-w-5xl mx-auto mt-16 text-center">
        <div className="bg-[#104179]/5 border-2 border-[#104179]/20 rounded-2xl p-8 md:p-12">
          <h3 className="text-[#104179] text-2xl md:text-3xl font-bold mb-4">
            Still have questions?
          </h3>
          <p className="text-[#104179]/70 text-lg mb-6">
            Our team is here to help you with any additional inquiries.
          </p>
          <Link
            href="/contact"
            className="bg-[#85c226] text-white font-semibold px-8 py-4 rounded-xl hover:bg-[#104179] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  )
}
