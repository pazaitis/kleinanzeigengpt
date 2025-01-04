import { scrapeListings } from '../utils/scraper.mjs'
import { supabaseAdmin } from '../supabase.mjs'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Load environment variables
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: join(__dirname, '..', '.env.local') })

async function testScraper() {
  try {
    console.log('Starting scrape...')
    const listings = await scrapeListings()
    console.log(`Scraped ${listings.length} listings`)

    // Debug first listing
    console.log('Sample listing with URL:', listings[0])

    if (!supabaseAdmin) {
      throw new Error('Supabase admin client is not initialized')
    }

    console.log('Attempting to save to Supabase...')
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
          returning: 'minimal'
        }
      )

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    // Verify the data was saved
    const { data: verificationData, error: verificationError } = await supabaseAdmin
      .from('listings')
      .select('*')
      .order('last_seen', { ascending: false })
      .limit(1)

    if (verificationError) {
      console.error('Verification error:', verificationError)
    } else {
      console.log('Latest record in database:', verificationData[0])
    }

    console.log(`Successfully processed ${listings.length} listings`)
  } catch (error) {
    console.error('Detailed error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    })
  }
}

testScraper() 