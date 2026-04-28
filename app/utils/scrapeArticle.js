export async function scrapeArticle(url) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
      },
      next: { revalidate: 3600 } // Cache scraped article for 1 hour
    });

    if (!res.ok) throw new Error(`Gagal memuat URL: ${res.status}`);

    const html = await res.text();

    // Ekstrak Title
    const titleMatch = html.match(/<title>(.*?)<\/title>/);
    let title = titleMatch ? titleMatch[1] : 'Berita Bazznews';
    title = title.replace(' - CNN Indonesia', '').replace(' - CNBC Indonesia', '').replace(' - Tribunnews.com', '').trim();

    // Ekstrak Image
    const imgMatch = html.match(/<meta property="og:image" content="(.*?)"/);
    const image = imgMatch ? imgMatch[1] : 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=1200';

    // Ekstrak Author / Date
    const authorMatch = html.match(/<meta name="author" content="(.*?)"/);
    const author = authorMatch ? authorMatch[1] : 'Redaksi';
    
    // Ekstrak Tanggal
    const dateMatch = html.match(/<meta name="pubdate" content="(.*?)"/) || html.match(/<meta property="article:published_time" content="(.*?)"/);
    let date = dateMatch ? new Date(dateMatch[1]).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    // Ekstrak Isi Konten Berita
    let contentHtml = "";
    
    // Pattern untuk CNN / CNBC
    let contentMatch = html.match(/class="detail_text[^>]*>([\s\S]*?)<div class="clearfix"/);
    if (!contentMatch) {
      contentMatch = html.match(/class="detail-text[^>]*>([\s\S]*?)<div class="clearfix"/);
    }
    if (!contentMatch) {
      contentMatch = html.match(/<div class="txt-article[^>]*>([\s\S]*?)<div class="clearfix"/); // Tribunnews
    }

    if (contentMatch) {
      let rawContent = contentMatch[1];
      
      // Hapus tags yang tidak perlu
      rawContent = rawContent.replace(/<script[\s\S]*?<\/script>/gi, '');
      rawContent = rawContent.replace(/<style[\s\S]*?<\/style>/gi, '');
      rawContent = rawContent.replace(/<div class="parallax[^>]*>[\s\S]*?<\/div>/gi, '');
      rawContent = rawContent.replace(/<div class="box_wrap[^>]*>[\s\S]*?<\/div>/gi, '');
      rawContent = rawContent.replace(/<table[\s\S]*?<\/table>/gi, '');
      rawContent = rawContent.replace(/<div class="link[^>]*>[\s\S]*?<\/div>/gi, '');
      rawContent = rawContent.replace(/<div class="video[^>]*>[\s\S]*?<\/div>/gi, '');
      
      // Ambil teks di dalam tag p
      const pMatches = rawContent.match(/<p>([\s\S]*?)<\/p>/g);
      if (pMatches && pMatches.length > 0) {
        contentHtml = pMatches.map(p => {
          // Bersihkan HTML di dalam P tapi pertahankan b, i, strong, em
          let cleanP = p.replace(/<(?!\/?(b|i|strong|em)\b)[^>]+>/g, '').trim();
          return cleanP.length > 10 ? `<p>${cleanP}</p>` : '';
        }).join('');
      } else {
        // Fallback kalau tidak ada tag p tapi ada teks
        let cleanText = rawContent.replace(/<[^>]+>/g, '\n').replace(/\n\s*\n/g, '\n\n').trim();
        contentHtml = cleanText.split('\n\n').map(p => `<p>${p}</p>`).join('');
      }
    } else {
      // Fallback sangat generik: cari semua paragraf di seluruh dokumen
      const pMatches = html.match(/<p>([\s\S]*?)<\/p>/g);
      if (pMatches) {
        let paragraphs = pMatches.map(p => p.replace(/<[^>]+>/g, '').trim()).filter(p => p.length > 50);
        // Buang beberapa paragraf pertama atau terakhir yang biasanya header/footer
        if (paragraphs.length > 5) {
          paragraphs = paragraphs.slice(1, paragraphs.length - 2);
        }
        contentHtml = paragraphs.map(p => `<p>${p}</p>`).join('');
      } else {
         contentHtml = "<p>Maaf, isi berita tidak dapat diekstrak untuk saat ini.</p>";
      }
    }

    return {
      success: true,
      data: {
        title,
        image,
        author,
        date,
        content: contentHtml,
        source: url
      }
    };
  } catch (error) {
    console.error("Gagal melakukan scraping:", error);
    return {
      success: false,
      data: null,
      message: error.message
    };
  }
}
