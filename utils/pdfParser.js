import fs from 'fs';
import { PDFDocument } from 'pdf-lib';

export async function parsePDF(filePath) {
  try {
    // Read the PDF file into a buffer
    const dataBuffer = fs.readFileSync(filePath);

    // Load the PDF document
    const pdfDoc = await PDFDocument.load(dataBuffer);

    // Extract text from all pages
    let extractedText = '';
    const pages = pdfDoc.getPages();
    for (const page of pages) {
      extractedText += page.getTextContent();
    }

    if (!extractedText) {
      throw new Error('No text content found in the PDF.');
    }

    return extractedText.toLowerCase();
  } catch (error) {
    console.error('Error parsing PDF:', error.message);
    throw error;
  }
}
