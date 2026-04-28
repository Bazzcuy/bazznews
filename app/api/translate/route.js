import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { articleText, language } = await request.json();

    if (!articleText || !language) {
      return NextResponse.json({ error: "Parameter tidak lengkap" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || "AIzaSyAQamskWkRCOfvIub_Qr2p_0Mz-ETe8vUI";

    const prompt = `
      Terjemahkan seluruh teks berita berikut ke dalam bahasa ${language}.
      Pastikan hasil terjemahan alami, akurat, dan mempertahankan format paragraf berita.
      Jangan tambahkan teks pembuka atau penutup lainnya.

      Teks Berita:
      "${articleText}"
    `;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errMsg = errorData.error?.message || "Gagal menerjemahkan";
      return NextResponse.json({ error: errMsg }, { status: response.status });
    }

    const data = await response.json();
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textResponse) {
      throw new Error("Format respons tidak valid dari Gemini");
    }

    return NextResponse.json({ translatedText: textResponse.trim() });
  } catch (error) {
    console.error("Translate API Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
