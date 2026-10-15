import type { Payload } from 'payload'
import { generateReceiptPdf, type ReceiptPdfData } from './generateReceiptPdf'

export async function uploadReceiptPdf(
  payload: Payload,
  receiptId: string | number,
  data: ReceiptPdfData,
) {
  const pdfBuffer = await generateReceiptPdf(data)

  // Assumes your Payload upload collection is named "media".
  const media = await payload.create({
    collection: 'media',
    data: {
      alt: `Payment receipt ${data.receiptNumber}`,
    },
    file: {
      data: pdfBuffer,
      name: `${data.receiptNumber}.pdf`,
      mimetype: 'application/pdf',
      size: pdfBuffer.length,
    },
    overrideAccess: true,
  })

  // Attach the uploaded PDF to the existing receipt.
  await payload.update({
    collection: 'receipts',
    id: receiptId,
    data: {
      pdf: media.id,
    },
    overrideAccess: true,
  })

  return media
}
