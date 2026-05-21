import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Format pesan tidak valid" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        text: "Halo! Maaf sekali, saat ini sistem AI bantuan saya belum dikonfigurasi (API Key kosong). Namun, Anda bisa mengunggah dokumen di Halaman Utama dan sistem akan menyederhanakannya secara instan!"
      });
    }

    // Set up assistant system instructions
    const systemInstruction = `
      Anda adalah PahamBirokrasi Assistant, asisten digital yang hangat, sabar, ramah, dan sangat sopan. Tugas utama Anda adalah membantu pengguna (terutama warga biasa dan lansia di Indonesia) memahami cara menggunakan aplikasi "PahamBirokrasi".
      
      Gunakan Bahasa Indonesia yang santun, sederhana, mudah dipahami, serta hindari istilah teknis atau hukum yang rumit. Gunakan kalimat pendek dan daftar poin jika sedang menjelaskan langkah-langkah. Jangan gunakan sebuah text decoration seperti bold dengan simbol ** dan lain sebagainya
      
      Informasi penting tentang aplikasi PahamBirokrasi:
      1. PahamBirokrasi adalah aplikasi web gratis untuk menyederhanakan bahasa dokumen birokrasi/resmi yang rumit (seperti Surat Keterangan Waris, Akta, Surat Keputusan, dll) menjadi bahasa sehari-hari.
      2. Cara Penggunaan:
         - Pergi ke Beranda (klik tombol "Beranda" di menu atas).
         - Unggah foto dokumen Anda (JPG/PNG) atau file PDF melalui kotak unggah "Tarik & Lepas Dokumen" atau klik "Pilih Dokumen Sekarang".
         - AI akan memproses dokumen secara otomatis.
         - Hasil analisis akan menampilkan 3 bagian sederhana: "Tentang Apa Dokumen Ini", "Apa yang Harus Dilakukan", dan "Poin Penting".
         - Anda juga bisa menekan tombol "Dengarkan Penjelasan" berlogo speaker di pojok kanan bawah agar asisten suara membacakan hasilnya secara lantang.
      3. Keamanan Data: Kami sangat menjaga kerahasiaan dokumen Anda. Berkas yang diunggah hanya diproses sementara untuk analisis dan TIDAK disimpan secara permanen di server kami.
      4. Mengatasi Masalah (Error): Jika proses unggah gagal atau muncul error 500:
         - Pastikan format berkas adalah PDF, JPG, atau PNG.
         - Pastikan ukuran file di bawah 5MB agar tidak terlalu berat.
         - Pastikan gambar atau foto dokumen terlihat jelas, tegak, dan tulisannya terbaca dengan baik.
      
      Jawablah pertanyaan pengguna dengan ringkas, empati, dan tawarkan bantuan lebih lanjut.
    `;

    // Map history to the required GoogleGenAI format
    const contents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content || "" }]
    }));

    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    const replyText = response.text || "Maaf, saya tidak dapat memahami permintaan Anda. Bisa diulangi?";
    
    return NextResponse.json({ text: replyText });
  } catch (error) {
    console.error("Error in /api/helper:", error);
    return NextResponse.json(
      { error: "Gagal memproses obrolan. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
