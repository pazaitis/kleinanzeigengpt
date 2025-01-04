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

    // Debug Supabase connection
    console.log('Supabase Admin client:', !!supabaseAdmin)
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Has Service Role Key:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)

    if (!supabaseAdmin) {
      throw new Error('Supabase admin client is not initialized')
    }

    // Prepare the data for insertion
    const preparedListings = listings.map(listing => ({
      article_id: listing.article_id,
      title: listing.title,
      price: listing.price,
      location: listing.location,
      timestamp: listing.timestamp,
      description: listing.description,
      last_seen: new Date(listing.last_seen).toISOString()
    }))

    console.log('Attempting to save to Supabase...')
    console.log('First listing example:', preparedListings[0])

    const { data, error } = await supabaseAdmin
      .from('listings')
      .upsert(preparedListings, {
        onConflict: 'article_id',
        returning: 'minimal'
      })

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    // Verify the insertion by fetching the latest records
    const { data: verificationData, error: verificationError } = await supabaseAdmin
      .from('listings')
      .select('*')
      .order('last_seen', { ascending: false })
      .limit(5)

    if (verificationError) {
      console.error('Verification error:', verificationError)
    } else {
      console.log('Latest 5 records in database:', verificationData)
    }

    console.log(`Successfully processed ${preparedListings.length} listings`)
  } catch (error) {
    console.error('Detailed error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    })
  }
}

testScraper() 