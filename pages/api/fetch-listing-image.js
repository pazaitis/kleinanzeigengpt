export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { url } = req.body
    const response = await fetch(url)
    const html = await response.text()

    // Extract image URL using regex - updated pattern
    const imageMatch = html.match(/data-imgsrc="([^"]+)"/);
    let imageUrl = imageMatch ? imageMatch[1] : null;

    // If not found, try alternative pattern
    if (!imageUrl) {
      const altMatch = html.match(/galleryimage-large--cover[^>]*background-image:\s*url\(['"]?([^'")\s]+)['"]?\)/);
      imageUrl = altMatch ? altMatch[1] : null;
    }

    // Clean up the URL if needed
    if (imageUrl && !imageUrl.startsWith('http')) {
      imageUrl = `https:${imageUrl}`;
    }

    return res.status(200).json({ imageUrl })
  } catch (error) {
    console.error('Error fetching listing image:', error)
    return res.status(500).json({ message: 'Error fetching listing image' })
  }
} 