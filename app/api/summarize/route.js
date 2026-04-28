import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { articleText } = await request.json();

    if (!articleText) {
      return NextResponse.json({ error: "Teks artikel tidak ditemukan" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API Key belum dikonfigurasi. Silakan isi file .env" }, { status: 500 });
    }

    const prompt = `
      Anda adalah asisten AI yang bertugas membuat ringkasan berita.
      Berikan ringkasan cerdas dari teks berita berikut ke dalam 3-4 poin utama.
      Setiap poin harus singkat, padat, dan jelas.
      
      Teks Berita:
      "${articleText}"
      
      Balas HANYA dengan format JSON array berisi string untuk setiap poin. 
      Contoh format balasan:
      ["Ringkasan poin pertama.", "Ringkasan poin kedua.", "Ringkasan poin ketiga."]
      Jangan tambahkan teks markdown seperti \`\`\`json.
    `;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Gemini API Error:", errorData);
      const errMsg = errorData.error?.message || "Gagal memproses dengan AI";
      return NextResponse.json({ error: errMsg }, { status: response.status });
    }

    const data = await response.json();
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textResponse) {
      throw new Error("Format respons tidak valid dari Gemini");
    }

    // Membersihkan markdown jika ada
    let cleanedText = textResponse.replace(/```json/g, '').replace(/```/gi, '').trim();
    
    let summaryPoints = [];
    try {
      // Coba parse JSON langsung
      summaryPoints = JSON.parse(cleanedText);
      if (!Array.isArray(summaryPoints)) {
        summaryPoints = [summaryPoints.toString()];
      }
    } catch (e) {
      // Jika gagal, coba bersihkan bullets dan split per baris
      summaryPoints = cleanedText
        .split('\n')
        .map(line => line.replace(/^(\d+\.\s*|-\s*|\*\s*)/, '').trim()) // Hapus format 1., -, *
        .filter(line => line.length > 10);
        
      if (summaryPoints.length === 0) {
        summaryPoints = [textResponse.substring(0, 150) + "..."];
      }
    }

    return NextResponse.json({ summary: summaryPoints });
  } catch (error) {
    console.error("Summarize API Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
