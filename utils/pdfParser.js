import fs from 'fs';
import pdf from 'pdf-parse';

export async function parsePDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdf(dataBuffer).then((data) => console.log(data));
  return data.text.toLowerCase();
}
