import { supabaseAdmin } from '../supabase.mjs'
import Anthropic from '@anthropic-ai/sdk'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Load environment variables
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: join(__dirname, '..', '.env.local') })

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

async function analyzeDescription(listing) {
  try {
    const prompt = `Analyze this iPhone listing's title and description and extract two pieces of information:
1. The exact iPhone model being sold (e.g. "iPhone 12", "iPhone 15 Pro Max")
2. The storage capacity in GB (e.g. 128, 256, 512)

Title: ${listing.title}
Description: ${listing.long_desc}

Return the information in this exact format (just these two lines):
Model: [iPhone model]
Storage: [number only, or Unknown if not specified]`

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 50,
      messages: [{ role: 'user', content: prompt }],
    })

    const result = response.content[0].text.trim()
    const modelMatch = result.match(/Model: (.+)/)
    const storageMatch = result.match(/Storage: (.+)/)

    return {
      model: modelMatch ? modelMatch[1].trim() : 'Unknown',
      storage: storageMatch ? 
        (storageMatch[1].toLowerCase() === 'unknown' ? null : parseInt(storageMatch[1])) 
        : null
    }
  } catch (error) {
    console.error('Error analyzing with Claude:', error)
    return { model: 'Unknown', storage: null }
  }
}

async function analyzeListing(listing) {
  console.log(`Analyzing listing ${listing.article_id}...`)
  
  const analysis = await analyzeDescription(listing)
  
  const { error } = await supabaseAdmin
    .from('iphone_analysis')
    .upsert({
      listing_id: listing.article_id,
      iphone_model: analysis.model,
      storage_gb: analysis.storage
    }, {
      onConflict: 'listing_id'
    })

  if (error) {
    console.error(`Error saving analysis for listing ${listing.article_id}:`, error)
  } else {
    console.log(`Saved analysis for listing ${listing.article_id}:`, analysis)
  }
}

async function analyzeListings() {
  try {
    console.log('Starting iPhone analysis...')

    // Get all listings with long descriptions that haven't been analyzed yet
    const { data: listings, error } = await supabaseAdmin
      .from('listings')
      .select(`
        article_id,
        title,
        long_desc,
        iphone_analysis!left(iphone_model)
      `)
      .not('long_desc', 'is', null)
      .is('iphone_analysis.iphone_model', null)

    if (error) throw error

    console.log(`Found ${listings.length} listings to analyze`)

    // Process each listing
    for (const listing of listings) {
      await analyzeListing(listing)
      // Add a small delay between API calls
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    console.log('Analysis completed!')
  } catch (error) {
    console.error('Analysis error:', error)
  }
}

// Run the analysis
analyzeListings() 