import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Berkas tidak ditemukan" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Data = buffer.toString("base64");
    const mimeType = file.type;

    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY is not set. Returning mocked data.");
      return NextResponse.json({
        title: "Dokumen Simulasi (API Key belum diatur)",
        whatToDo:
          "Anda perlu membawa dokumen ini ke Kantor Kelurahan. Jangan lupa bawa KTP asli.",
        importantPoints: [
          "Ada batas waktu 30 hari untuk melapor.",
          "Pastikan ejaan nama di surat sama persis dengan yang ada di KTP.",
        ],
      });
    }

    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Data
          }
        },
        {
          text: `Please read the following Indonesian official/bureaucratic document (which can be a PDF or image) and simplify it for a senior citizen.
Return a JSON object with:
- "title": A simple sentence explaining what the document is about.
- "whatToDo": Simple instructions on what the user needs to do next based on the document.
- "importantPoints": An array of strings, each being a short important point to note (e.g. deadlines, required items).
Use clear, easy-to-understand Indonesian language suitable for elderly citizens.`
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            whatToDo: { type: Type.STRING },
            importantPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ["title", "whatToDo", "importantPoints"],
        },
      },
    });

    const text = response.text;
    if (text) {
      const result = JSON.parse(text);
      return NextResponse.json(result);
    } else {
      throw new Error("Empty response from Gemini API");
    }
  } catch (error) {
    console.error("Error in /api/simplify:", error);
    return NextResponse.json(
      { error: "Gagal memproses dokumen. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
