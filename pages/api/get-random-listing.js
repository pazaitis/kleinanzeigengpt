export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // Fetch the iPhone listings page
    const response = await fetch('https://www.kleinanzeigen.de/s-iphone/k0', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      }
    })

    const html = await response.text()

    // Extract all listing URLs
    const listingMatches = html.match(/<article[^>]*data-href="([^"]+)"[^>]*>/g)
    if (!listingMatches) {
      return res.status(404).json({ message: 'No listings found' })
    }

    // Extract URLs and filter out any invalid ones
    const listingUrls = listingMatches
      .map(match => {
        const urlMatch = match.match(/data-href="([^"]+)"/)
        return urlMatch ? urlMatch[1] : null
      })
      .filter(Boolean)
      .map(path => `https://www.kleinanzeigen.de${path}`)

    // Select a random URL from the list
    const randomUrl = listingUrls[Math.floor(Math.random() * listingUrls.length)]

    if (!randomUrl) {
      return res.status(404).json({ message: 'No valid listings found' })
    }

    return res.status(200).json({ url: randomUrl })

  } catch (error) {
    console.error('Error fetching random listing:', error)
    return res.status(500).json({ message: 'Error fetching random listing' })
  }
} 