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
    
    // Get description
    const descElement = $('p[itemprop="description"]')
    let longDesc = descElement.html()
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p><p>/gi, '\n\n')
    longDesc = $('<div>').html(longDesc).text()
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[ \t]+/g, ' ')
      .trim()

    // Get all gallery images
    const images = []
    $('.galleryimage-element').each((index, element) => {
      const $el = $(element)
      const imageUrl = $el.find('meta[itemprop="contentUrl"]').attr('content')
      if (imageUrl && !imageUrl.includes('google_ads')) {
        images.push({
          url: imageUrl,
          is_main: index === 0  // First image is usually the main one
        })
      }
    })
    
    return {
      longDesc,
      images
    }
  } catch (error) {
    console.error(`Error scraping ${url}:`, error.message)
    return { longDesc: null, images: [] }
  }
}

async function saveImages(listingId, images) {
  for (const image of images) {
    const { error } = await supabaseAdmin
      .from('listing_images')
      .upsert({
        listing_id: listingId,
        image_url: image.url,
        is_main: image.is_main
      }, {
        onConflict: 'listing_id,image_url'
      })

    if (error) {
      console.error(`Error saving image for listing ${listingId}:`, error)
    }
  }
}

async function processListing(listing) {
  console.log(`Processing listing ${listing.article_id}...`)

  const { longDesc, images } = await scrapeDetailPage(listing.url)
  
  if (longDesc) {
    const { error: descError } = await supabaseAdmin
      .from('listings')
      .update({ long_desc: longDesc })
      .eq('article_id', listing.article_id)

    if (descError) {
      console.error(`Error updating description for listing ${listing.article_id}:`, descError)
    }
  }

  if (images.length > 0) {
    await saveImages(listing.article_id, images)
    console.log(`Saved ${images.length} images for listing ${listing.article_id}`)
  }
}

async function deepScrape() {
  try {
    console.log('Starting deep scrape...')

    const { data: listings, error } = await supabaseAdmin
      .from('listings')
      .select('article_id, url')
      .is('long_desc', null)
      .not('url', 'is', null)

    if (error) throw error

    console.log(`Found ${listings.length} listings to process`)

    for (const listing of listings) {
      await processListing(listing)
      await new Promise(resolve => setTimeout(resolve, 2000))
    }

    console.log('Deep scrape completed!')
  } catch (error) {
    console.error('Deep scrape error:', error)
  }
}

// Run the deep scraper
deepScrape() 