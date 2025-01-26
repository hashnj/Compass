import fs from 'fs';
import pdf from 'pdf-parse';

export async function parsePDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdf(dataBuffer);
  return data.text.toLowerCase();
}
