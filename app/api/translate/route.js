import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { articleText, language } = await request.json();

    if (!articleText || !language) {
      return NextResponse.json({ error: "Parameter tidak lengkap" }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API Key Groq tidak ditemukan. Silakan atur GROQ_API_KEY di variabel lingkungan." }, { status: 500 });
    }

    const prompt = `
      Terjemahkan seluruh teks berita berikut ke dalam bahasa ${language}.
      Pastikan hasil terjemahan alami, akurat, dan mempertahankan format paragraf berita.
      Jangan tambahkan teks pembuka atau penutup lainnya.

      Teks Berita:
      "${articleText}"
    `;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errMsg = errorData.error?.message || "Gagal menerjemahkan";
      return NextResponse.json({ error: errMsg }, { status: response.status });
    }

    const data = await response.json();
    const textResponse = data.choices?.[0]?.message?.content;

    if (!textResponse) {
      throw new Error("Format respons tidak valid dari Groq");
    }

    return NextResponse.json({ translatedText: textResponse.trim() });
  } catch (error) {
    console.error("Translate API Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
