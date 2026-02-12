import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

export const extractResumeText = async (file) => {
  if (!file) {
    throw new Error("No file uploaded");
  }

  // ===== PDF =====
  if (file.mimetype === "application/pdf") {

    // 🔥 Convert Buffer → Uint8Array
    const uint8Array = new Uint8Array(file.buffer);

    const pdf = await pdfjsLib.getDocument({
      data: uint8Array,
    }).promise;

    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map(item => item.str).join(" ");
      text += pageText + " ";
    }

    return text;
  }

  // ===== DOCX =====
  if (
    file.mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({
      buffer: file.buffer,
    });

    return result.value;
  }

  throw new Error("Unsupported file type");
};
