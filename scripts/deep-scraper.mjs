import axios from 'axios'
import * as cheerio from 'cheerio'
import { supabaseAdmin } from '../supabase.mjs'
import { faker } from '@faker-js/faker'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Load environment variables
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: join(__dirname, '..', '.env.local') })

async function scrapeDetailPage(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': faker.internet.userAgent(),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      }
    })

    const $ = cheerio.load(response.data)
    
    // Get the description element
    const descElement = $('p[itemprop="description"]')
    
    // Replace <br> tags with newlines and preserve paragraph spacing
    let longDesc = descElement
      .html()
      .replace(/<br\s*\/?>/gi, '\n') // Replace <br> tags with newlines
      .replace(/<\/p><p>/gi, '\n\n')  // Add double newlines between paragraphs
    
    // Clean up any remaining HTML tags
    longDesc = $('<div>').html(longDesc).text()
    
    // Clean up multiple consecutive newlines and spaces
    longDesc = longDesc
      .replace(/\n{3,}/g, '\n\n')  // Replace 3+ newlines with 2
      .replace(/[ \t]+/g, ' ')     // Replace multiple spaces with single space
      .trim()                      // Remove leading/trailing whitespace
    
    console.log('Scraped description:', longDesc.substring(0, 100) + '...')
    return longDesc
  } catch (error) {
    console.error(`Error scraping ${url}:`, error.message)
    return null
  }
}

async function deepScrape() {
  try {
    console.log('Starting deep scrape...')

    // Get all listings with URLs but no long description
    const { data: listings, error } = await supabaseAdmin
      .from('listings')
      .select('article_id, url')
      .is('long_desc', null)
      .not('url', 'is', null)

    if (error) throw error

    console.log(`Found ${listings.length} listings to process`)

    // Process each listing with a delay to avoid rate limiting
    for (let i = 0; i < listings.length; i++) {
      const listing = listings[i]
      console.log(`Processing listing ${i + 1}/${listings.length}: ${listing.url}`)

      const longDesc = await scrapeDetailPage(listing.url)
      
      if (longDesc) {
        const { error: updateError } = await supabaseAdmin
          .from('listings')
          .update({ long_desc: longDesc })
          .eq('article_id', listing.article_id)

        if (updateError) {
          console.error(`Error updating listing ${listing.article_id}:`, updateError)
        } else {
          console.log(`Updated listing ${listing.article_id}`)
        }
      }

      // Add a delay between requests to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 2000))
    }

    console.log('Deep scrape completed!')
  } catch (error) {
    console.error('Deep scrape error:', error)
  }
}

// Run the deep scraper
deepScrape() 