import PDFDocument from 'pdfkit'
import path from 'path'
import fs from 'fs'

export type ReceiptPdfData = {
  receiptNumber: string
  payerName: string
  registrationNumber: string
  invoiceNumber: string
  amount: number
  currency: string
  paymentMethod: string
  transactionReference: string
  paidAt: string
  issuedAt: string
}

// Brand palette
const NAVY = '#104179'
const GREEN = '#85c226'
const GREEN_DARK = '#3f6b0f'
const GREEN_TINT = '#f0f7e4'
const INK = '#1b2733'
const MUTED = '#6b7785'
const LINE = '#e3e8ee'
const SURFACE = '#f6f8fb'

export function generateReceiptPdf(data: ReceiptPdfData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margin: 0, // we position everything manually; avoids accidental page breaks
      info: {
        Title: `GLUNS Receipt ${data.receiptNumber}`,
        Author: 'Global Leaders United Nations Symposium',
      },
    })

    const chunks: Buffer[] = []
    doc.on('data', (chunk: Buffer) => chunks.push(chunk))
    doc.on('error', reject)
    doc.on('end', () => resolve(Buffer.concat(chunks)))

    const W = doc.page.width // 595.28
    const H = doc.page.height // 841.89
    const L = 50
    const R = W - 50
    const CW = R - L

    // ───────────────────────── Top accent bar ─────────────────────────
    doc.rect(0, 0, W, 10).fill(NAVY)
    doc.rect(0, 10, W, 3).fill(GREEN)

    // ───────────────────────── Header ─────────────────────────
    const logoPath = path.join(process.cwd(), 'public/logos', 'bluelogo.png')
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, L, 30, { fit: [170, 74], align: 'center', valign: 'center' })
    } else {
      doc.circle(L + 37, 67, 37).fill(NAVY)
    }

    // Right-hand meta block
    doc
      .font('Helvetica')
      .fontSize(8)
      .fillColor(MUTED)
      .text('RECEIPT NUMBER', L, 44, { width: CW, align: 'right', characterSpacing: 1.5 })

    doc
      .font('Helvetica-Bold')
      .fontSize(15)
      .fillColor(NAVY)
      .text(data.receiptNumber, L, 58, { width: CW, align: 'right' })

    doc
      .font('Helvetica')
      .fontSize(8.5)
      .fillColor(MUTED)
      .text(`Issued ${formatDate(data.issuedAt)}`, L, 80, { width: CW, align: 'right' })

    doc.moveTo(L, 118).lineTo(R, 118).lineWidth(0.75).strokeColor(LINE).stroke()

    // ───────────────────────── Title + status pill ─────────────────────────
    doc
      .font('Helvetica-Bold')
      .fontSize(28)
      .fillColor(INK)
      .text('Payment Receipt', L, 146, { lineBreak: false })

    doc
      .font('Helvetica')
      .fontSize(10)
      .fillColor(MUTED)
      .text('Thank you. Your payment has been received and confirmed.', L, 182, {
        lineBreak: false,
      })

    // Pill
    const pillW = 146
    const pillH = 30
    const pillX = R - pillW
    const pillY = 150
    doc
      .roundedRect(pillX, pillY, pillW, pillH, pillH / 2)
      .lineWidth(1)
      .fillAndStroke(GREEN_TINT, GREEN)
    doc.circle(pillX + 16, pillY + pillH / 2, 8).fill(GREEN)
    doc
      .moveTo(pillX + 12.5, pillY + pillH / 2 + 0.5)
      .lineTo(pillX + 15, pillY + pillH / 2 + 3)
      .lineTo(pillX + 19.5, pillY + pillH / 2 - 2.5)
      .lineWidth(1.6)
      .lineCap('round')
      .lineJoin('round')
      .strokeColor('#ffffff')
      .stroke()
    doc
      .font('Helvetica-Bold')
      .fontSize(8.5)
      .fillColor(GREEN_DARK)
      .text('PAYMENT CONFIRMED', pillX + 31, pillY + 11, {
        characterSpacing: 0.6,
        lineBreak: false,
      })

    // ───────────────────────── Amount hero card ─────────────────────────
    const heroY = 222
    const heroH = 112

    doc.save()
    doc.roundedRect(L, heroY, CW, heroH, 12).clip()
    doc.rect(L, heroY, CW, heroH).fill(NAVY)
    // decorative rings
    doc.opacity(0.1)
    doc.circle(R - 20, heroY + 10, 90).fill(GREEN)
    doc.opacity(0.07)
    doc.circle(R - 110, heroY + heroH + 30, 70).fill('#ffffff')
    doc.opacity(1)
    // green accent edge
    doc.rect(L, heroY, 6, heroH).fill(GREEN)
    doc.restore()

    doc
      .font('Helvetica')
      .fontSize(8.5)
      .fillColor('#b9c9de')
      .text('AMOUNT RECEIVED', L + 30, heroY + 26, { characterSpacing: 1.8, lineBreak: false })

    const amountText = data.amount.toLocaleString('en-KE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })

    doc.font('Helvetica-Bold').fontSize(16)
    const currencyW = doc.widthOfString(data.currency)
    doc.fillColor(GREEN).text(data.currency, L + 30, heroY + 58, { lineBreak: false })
    doc
      .font('Helvetica-Bold')
      .fontSize(36)
      .fillColor('#ffffff')
      .text(amountText, L + 30 + currencyW + 8, heroY + 44, { lineBreak: false })

    // Paid-on block inside card (right side)
    doc
      .font('Helvetica')
      .fontSize(8)
      .fillColor('#b9c9de')
      .text('PAID ON', L, heroY + 26, {
        width: CW - 28,
        align: 'right',
        characterSpacing: 1.5,
        lineBreak: false,
      })
    doc
      .font('Helvetica-Bold')
      .fontSize(10.5)
      .fillColor('#ffffff')
      .text(formatDate(data.paidAt), L, heroY + 40, {
        width: CW - 28,
        align: 'right',
        lineBreak: false,
      })

    // ───────────────────────── Details grid ─────────────────────────
    let y = heroY + heroH + 38

    doc.rect(L, y + 1, 4, 12).fill(GREEN)
    doc
      .font('Helvetica-Bold')
      .fontSize(10)
      .fillColor(NAVY)
      .text('RECEIPT DETAILS', L + 14, y + 2, { characterSpacing: 1.5, lineBreak: false })
    y += 28

    type Cell = { label: string; value: string }
    const gridRows: [Cell, Cell][] = [
      [
        { label: 'Received from', value: data.payerName },
        { label: 'Registration no.', value: data.registrationNumber },
      ],
      [
        { label: 'Invoice no.', value: data.invoiceNumber },
        { label: 'Payment date', value: formatDate(data.paidAt) },
      ],
      [
        { label: 'Payment method', value: data.paymentMethod },
        { label: 'Transaction reference', value: data.transactionReference },
      ],
    ]

    const colW = CW / 2
    const pad = 18

    // Pre-measure row heights so long values never overlap
    doc.font('Helvetica-Bold').fontSize(11)
    const rowHeights = gridRows.map((row) => {
      const hs = row.map((c) => doc.heightOfString(c.value || '—', { width: colW - pad * 2 }))
      return Math.max(...hs) + 52 // label + paddings
    })
    const gridH = rowHeights.reduce((a, b) => a + b, 0)

    // Card
    doc.roundedRect(L, y, CW, gridH, 10).lineWidth(0.75).fillAndStroke(SURFACE, LINE)

    let ry = y
    gridRows.forEach((row, i) => {
      row.forEach((cell, j) => {
        const cx = L + j * colW + pad
        doc
          .font('Helvetica')
          .fontSize(7.5)
          .fillColor(MUTED)
          .text(cell.label.toUpperCase(), cx, ry + 18, {
            characterSpacing: 1.1,
            lineBreak: false,
          })
        doc
          .font('Helvetica-Bold')
          .fontSize(11)
          .fillColor(INK)
          .text(cell.value || '—', cx, ry + 33, { width: colW - pad * 2 })
      })
      ry += rowHeights[i]
      if (i < gridRows.length - 1) {
        doc
          .moveTo(L + 14, ry)
          .lineTo(R - 14, ry)
          .lineWidth(0.75)
          .strokeColor(LINE)
          .stroke()
      }
    })
    // vertical divider
    doc
      .moveTo(L + colW, y + 14)
      .lineTo(L + colW, y + gridH - 14)
      .lineWidth(0.75)
      .strokeColor(LINE)
      .stroke()

    y += gridH + 22

    // ───────────────────────── Note strip ─────────────────────────
    doc.roundedRect(L, y, CW, 44, 8).fill(GREEN_TINT)
    doc.rect(L, y + 8, 3, 28).fill(GREEN)
    doc
      .font('Helvetica')
      .fontSize(9)
      .fillColor(GREEN_DARK)
      .text(
        'This document confirms receipt of the payment listed above. It is computer-generated and does not require a signature.',
        L + 18,
        y + 11,
        { width: CW - 36, lineGap: 2 },
      )

    // ───────────────────────── Footer ─────────────────────────
    const fy = H - 92
    doc.moveTo(L, fy).lineTo(R, fy).lineWidth(0.75).strokeColor(LINE).stroke()

    doc
      .font('Helvetica-Bold')
      .fontSize(11)
      .fillColor(NAVY)
      .text('Thank you for being part of GLUNS.', L, fy + 16, {
        width: CW,
        align: 'center',
        lineBreak: false,
      })
    doc
      .font('Helvetica')
      .fontSize(8)
      .fillColor(MUTED)
      .text('Global Leaders United Nations Symposium', L, fy + 34, {
        width: CW,
        align: 'center',
        characterSpacing: 0.6,
        lineBreak: false,
      })

    // Bottom accent bar
    doc.rect(0, H - 13, W, 3).fill(GREEN)
    doc.rect(0, H - 10, W, 10).fill(NAVY)

    doc.end()
  })
}

function formatDate(value: string): string {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value || '—'
  }

  return new Intl.DateTimeFormat('en-KE', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Africa/Nairobi',
  }).format(date)
}
