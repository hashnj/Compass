import fs from 'fs';
import pdf from 'pdf-parse';

export async function parsePDF(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);

    const data = await pdf(dataBuffer);
    // console.log(data); 

    if (!data.text) {
      throw new Error("No text content found in the PDF.");
    }

    return data.text.toLowerCase();
  } catch (error) {
    console.error("Error parsing PDF:", error.message);
    throw error; 
  }
}
