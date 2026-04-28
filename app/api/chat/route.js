import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { articleText, messages } = await request.json();

    if (!articleText) {
      return NextResponse.json({ error: "Teks artikel tidak ditemukan" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API Key Gemini tidak ditemukan. Silakan atur GEMINI_API_KEY di variabel lingkungan." }, { status: 500 });
    }

    // Format prompt + history
    const chatHistory = messages.map(m => `${m.role === 'user' ? 'User' : 'AI'}: ${m.text}`).join('\n');
    
    const prompt = `
      Anda adalah asisten AI interaktif di portal berita Bazznews.
      Tugas Anda adalah menjawab pertanyaan pembaca mengenai berita berikut.
      
      Konteks Berita:
      "${articleText}"
      
      Riwayat Chat:
      ${chatHistory}
      
      Berikan jawaban yang ramah, ringkas, informatif, dan HANYA berdasarkan fakta yang ada di teks berita di atas.
    `;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errMsg = errorData.error?.message || "Gagal terhubung dengan AI";
      return NextResponse.json({ error: errMsg }, { status: response.status });
    }

    const data = await response.json();
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textResponse) {
      throw new Error("Format respons tidak valid dari Gemini");
    }

    return NextResponse.json({ answer: textResponse.trim() });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
