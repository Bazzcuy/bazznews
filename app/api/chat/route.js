import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { articleText, messages } = await request.json();

    if (!articleText) {
      return NextResponse.json({ error: "Teks artikel tidak ditemukan" }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API Key Groq tidak ditemukan. Silakan atur GROQ_API_KEY di variabel lingkungan." }, { status: 500 });
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
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errMsg = errorData.error?.message || "Gagal terhubung dengan AI";
      return NextResponse.json({ error: errMsg }, { status: response.status });
    }

    const data = await response.json();
    const textResponse = data.choices?.[0]?.message?.content;

    if (!textResponse) {
      throw new Error("Format respons tidak valid dari Groq");
    }

    return NextResponse.json({ answer: textResponse.trim() });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
