import { supabaseAdmin } from '../../supabase'
import { scrapeListings } from '../../utils/scraper'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const listings = await scrapeListings()
    console.log('First listing example:', listings[0]) // Debug log
    
    const { data, error } = await supabaseAdmin
      .from('listings')
      .upsert(
        listings.map(listing => ({
          article_id: listing.article_id,
          title: listing.title,
          price: listing.price,
          location: listing.location,
          timestamp: listing.timestamp,
          description: listing.description,
          url: listing.url,
          thumbnail_url: listing.thumbnail_url,
          last_seen: listing.last_seen
        })),
        {
          onConflict: 'article_id',
          returning: true,
        }
      )

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    res.status(200).json({ success: true, count: data.length })
  } catch (error) {
    console.error('Scraping error:', error)
    res.status(500).json({ error: error.message })
  }
} 