export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { url } = req.body
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      }
    })

    const html = await response.text()

    // Extract article ID
    const articleIdMatch = html.match(/id="viewad-ad-id-box"[^>]*>[\s\S]*?<li>(\d+)<\/li>/);
    const articleId = articleIdMatch ? articleIdMatch[1] : '';

    // Extract image URL
    const imageMatch = html.match(/data-imgsrc="([^"]+)"/);
    let imageUrl = imageMatch ? imageMatch[1] : null;

    if (!imageUrl) {
      const altMatch = html.match(/galleryimage-large--cover[^>]*background-image:\s*url\(['"]?([^'")\s]+)['"]?\)/);
      imageUrl = altMatch ? altMatch[1] : null;
    }

    if (imageUrl && !imageUrl.startsWith('http')) {
      imageUrl = `https:${imageUrl}`;
    }

    // Extract listing details
    const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
    const title = titleMatch ? titleMatch[1].trim() : '';

    const priceMatch = html.match(/(\d+(?:\.\d+)?)\s*€/);
    const price = priceMatch ? priceMatch[1] + ' €' : '';

    const locationMatch = html.match(/(\d{5})\s+([^<]+)/);
    const location = locationMatch ? `${locationMatch[1]} ${locationMatch[2].trim()}` : '';

    const dateMatch = html.match(/(\d{2}\.\d{2}\.\d{4})/);
    const date = dateMatch ? dateMatch[1] : '';

    return res.status(200).json({
      imageUrl,
      details: {
        articleId,
        title,
        price,
        location,
        date
      }
    })
  } catch (error) {
    console.error('Error fetching listing details:', error)
    return res.status(500).json({ message: 'Error fetching listing details' })
  }
} 