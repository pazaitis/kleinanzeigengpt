import { scrapeListings } from '../utils/scraper'
import { supabaseAdmin } from '../supabase'

async function testScraper() {
  try {
    console.log('Starting scrape...')
    const listings = await scrapeListings()
    console.log(`Scraped ${listings.length} listings`)

    const { data, error } = await supabaseAdmin
      .from('listings')
      .upsert(listings, {
        onConflict: 'article_id',
        returning: true,
      })

    if (error) throw error
    console.log(`Successfully saved ${data.length} listings to Supabase`)
    
    // Print some sample data
    console.log('\nSample listings:')
    console.log(data.slice(0, 3))
  } catch (error) {
    console.error('Error:', error)
  }
}

testScraper() 