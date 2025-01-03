import { supabaseAdmin } from '../../supabase'
import { scrapeListings } from '../../utils/scraper'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const listings = await scrapeListings()
    
    const { data, error } = await supabaseAdmin
      .from('listings')
      .upsert(listings, {
        onConflict: 'article_id',
        returning: true,
      })

    if (error) throw error

    res.status(200).json({ success: true, count: data.length })
  } catch (error) {
    console.error('Scraping error:', error)
    res.status(500).json({ error: error.message })
  }
} 