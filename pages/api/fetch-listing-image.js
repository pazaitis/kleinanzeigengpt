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

    // Extract seller name
    const sellerNameMatch = html.match(/class="text-body-regular-strong text-force-linebreak userprofile-vip">\s*<a[^>]*>([^<]+)<\/a>/);
    const sellerName = sellerNameMatch ? sellerNameMatch[1].trim() : '';

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

    // Add this after the sellerName extraction
    const registeredSinceMatch = html.match(/class="userprofile-vip-details-text">Aktiv seit ([^<]+)<\/span>/);
    const registeredSince = registeredSinceMatch ? registeredSinceMatch[1].trim() : '';

    // Add after the registeredSince extraction
    const activeListingsMatch = html.match(/id="poster-other-ads-link"[^>]*>([^<]+)<\/a>/);
    const activeListingsText = activeListingsMatch ? activeListingsMatch[1].trim() : '';
    const activeListingsCount = activeListingsText ? parseInt(activeListingsText) : 0;

    // Extract the user ID for the listings link
    const userIdMatch = html.match(/\/s-bestandsliste\.html\?userId=(\d+)/);
    const userId = userIdMatch ? userIdMatch[1] : null;

    // Add after the userId extraction
    const badgeMatch = html.match(/class="badge user-profile-vip-badge">([^<]+)<\/a>/);
    const badge = badgeMatch ? badgeMatch[1].trim() : null;

    // Add after the other extractions
    const descriptionMatch = html.match(/<p id="viewad-description-text"[^>]*>([\s\S]*?)<\/p>/);
    const description = descriptionMatch 
      ? descriptionMatch[1]
          .trim()
          .replace(/\s+/g, ' ')         // Normalize whitespace
          .replace(/&nbsp;/g, ' ')      // Replace &nbsp; with spaces
      : '';

    // Extract all images including the first one
    const extractImages = (html) => {
      const images = [];
      
      // First try to get the main image from the first galleryimage-element
      const mainImageMatch = html.match(/class="galleryimage-element current"[^>]*>[\s\S]*?<img[^>]*src="([^"]+)"[^>]*>/);
      if (mainImageMatch && mainImageMatch[1]) {
        images.push(mainImageMatch[1]);
      }

      // Then get all other gallery images
      const galleryImagesMatch = html.match(/class="galleryimage-element(?!\s+current)[^>]*>[\s\S]*?<img[^>]*src="([^"]+)"[^>]*>/g);
      if (galleryImagesMatch) {
        const additionalImages = galleryImagesMatch
          .map(match => {
            const srcMatch = match.match(/src="([^"]+)"/);
            return srcMatch ? srcMatch[1] : null;
          })
          .filter(Boolean);
        
        images.push(...additionalImages);
      }

      // If still no images found, try to get the single image
      if (images.length === 0 && imageUrl) {
        images.push(imageUrl);
      }

      return images;
    };

    // Use the new extraction function
    const galleryImages = extractImages(html);

    return res.status(200).json({
      imageUrl,
      details: {
        articleId,
        title,
        price,
        location,
        date,
        sellerName,
        registeredSince,
        activeListings: activeListingsCount,
        userId,
        badge,
        description,
        images: galleryImages
      }
    })
  } catch (error) {
    console.error('Error fetching listing details:', error)
    return res.status(500).json({ message: 'Error fetching listing details' })
  }
} 