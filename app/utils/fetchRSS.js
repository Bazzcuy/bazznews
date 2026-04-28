export async function fetchRSS(provider, category) {
  // Mapping provider and category to actual RSS URLs
  // This mimics the 'feedid' package behavior used in api-berita-indonesia
  let url = "";

  if (provider === "cnn") {
    url = category === "terbaru" ? "https://www.cnnindonesia.com/nasional/rss" : `https://www.cnnindonesia.com/${category}/rss`;
  } else if (provider === "cnbc") {
    url = category === "terbaru" ? "https://www.cnbcindonesia.com/news/rss" : `https://www.cnbcindonesia.com/${category}/rss`;
  } else if (provider === "antara") {
    url = category === "terbaru" ? "https://www.antaranews.com/rss/terbaru.xml" : `https://www.antaranews.com/rss/${category}.xml`;
  } else if (provider === "tribun") {
    url = category === "terbaru" ? "https://www.tribunnews.com/rss" : `https://www.tribunnews.com/${category}/rss`;
  } else {
    // Fallback to CNN terbaru
    url = "https://www.cnnindonesia.com/nasional/rss";
  }

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*'
      },
      next: { revalidate: 60 } // Cache for 60 seconds
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch RSS: ${res.status}`);
    }

    const xml = await res.text();
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xml)) !== null) {
      const itemXml = match[1];
      
      const titleMatch = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || itemXml.match(/<title>(.*?)<\/title>/);
      const linkMatch = itemXml.match(/<link>(.*?)<\/link>/);
      const pubDateMatch = itemXml.match(/<pubDate>(.*?)<\/pubDate>/);
      const descMatch = itemXml.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/) || itemXml.match(/<description>([\s\S]*?)<\/description>/);
      
      let image = "";
      const enclosureMatch = itemXml.match(/<enclosure[^>]*url="(.*?)"/i);
      const mediaContentMatch = itemXml.match(/<media:content[^>]*url="(.*?)"/i);
      
      if (enclosureMatch) {
        image = enclosureMatch[1];
      } else if (mediaContentMatch) {
        image = mediaContentMatch[1];
      } else if (descMatch) {
        const descImgMatch = descMatch[1].match(/<img[^>]*src="(.*?)"/i);
        if (descImgMatch) {
          image = descImgMatch[1];
        }
      }

      // Default image if none found
      if (!image) {
        image = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=600";
      }

      const rawDesc = descMatch ? descMatch[1] : "";
      const excerpt = rawDesc.replace(/<[^>]+>/g, '').trim().substring(0, 150) + '...';
      
      const link = linkMatch ? linkMatch[1] : "#";
      // Extract a slug from the link
      const slugParts = link.split('/');
      const slug = slugParts[slugParts.length - 1] || slugParts[slugParts.length - 2] || "news-article";

      items.push({
        title: titleMatch ? titleMatch[1].trim() : "Tanpa Judul",
        link: link,
        isoDate: pubDateMatch ? new Date(pubDateMatch[1]).toISOString() : new Date().toISOString(),
        date: pubDateMatch ? pubDateMatch[1] : new Date().toDateString(),
        description: rawDesc,
        excerpt: excerpt,
        image: image,
        slug: slug
      });
    }

    return {
      success: true,
      message: "Berhasil mengambil berita",
      data: items
    };
  } catch (error) {
    console.error("RSS Fetch Error:", error);
    return {
      success: false,
      message: error.message,
      data: []
    };
  }
}
