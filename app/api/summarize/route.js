import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { articleText } = await request.json();

    if (!articleText) {
      return NextResponse.json({ error: "Teks artikel tidak ditemukan" }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API Key Groq tidak ditemukan. Silakan atur GROQ_API_KEY di variabel lingkungan." }, { status: 500 });
    }

    const prompt = `
      Anda adalah asisten AI yang bertugas membuat ringkasan berita.
      Berikan ringkasan cerdas dari teks berita berikut ke dalam 3-4 poin utama.
      Setiap poin harus singkat, padat, dan jelas.
      
      Teks Berita:
      "${articleText}"
      
      Balas HANYA dengan format JSON object yang memiliki key "points" berisi array string untuk setiap poin.
      Contoh format balasan:
      {
        "points": ["Ringkasan poin pertama.", "Ringkasan poin kedua.", "Ringkasan poin ketiga."]
      }
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
          temperature: 0.2,
          response_format: { type: "json_object" }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Groq API Error:", errorData);
      const errMsg = errorData.error?.message || "Gagal memproses dengan AI";
      return NextResponse.json({ error: errMsg }, { status: response.status });
    }

    const data = await response.json();
    const textResponse = data.choices?.[0]?.message?.content;

    if (!textResponse) {
      throw new Error("Format respons tidak valid dari Groq");
    }

    let summaryPoints = [];
    try {
      const parsedJson = JSON.parse(textResponse);
      summaryPoints = parsedJson.points || [];
    } catch (e) {
      summaryPoints = [textResponse];
    }

    return NextResponse.json({ summary: summaryPoints });
  } catch (error) {
    console.error("Summarize API Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
