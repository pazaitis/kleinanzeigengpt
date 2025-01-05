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
    const prompt = `Analyze this iPhone listing's title and description to extract the following information:
1. The exact iPhone model being sold (e.g. "iPhone 12", "iPhone 15 Pro Max")
2. The storage capacity in GB (e.g. 128, 256, 512)
3. A rating for the condition of the device on a scale from 1 to 5, where 1 is poor and 5 is excellent. Highlight the text passages that influence this rating.

Title: ${listing.title}
Description: ${listing.long_desc}

Return the information in this exact format:
Model: [iPhone model]
Storage: [number only, or Unknown if not specified]
Rating: [1-5]
Highlights: [text passages that influenced the rating]`

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 150,
      messages: [{ role: 'user', content: prompt }],
    })

    const result = response.content[0].text.trim()
    const modelMatch = result.match(/Model: (.+)/)
    const storageMatch = result.match(/Storage: (.+)/)
    const ratingMatch = result.match(/Rating: (\d)/)
    const highlightsMatch = result.match(/Highlights: (.+)/)

    return {
      model: modelMatch ? modelMatch[1].trim() : 'Unknown',
      storage: storageMatch ? 
        (storageMatch[1].toLowerCase() === 'unknown' ? null : parseInt(storageMatch[1])) 
        : null,
      rating: ratingMatch ? parseInt(ratingMatch[1]) : null,
      highlights: highlightsMatch ? highlightsMatch[1].trim() : ''
    }
  } catch (error) {
    console.error('Error analyzing with Claude:', error)
    return { model: 'Unknown', storage: null, rating: null, highlights: '' }
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
      storage_gb: analysis.storage,
      rating: analysis.rating,
      highlights: analysis.highlights
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

    // Get only listings that:
    // 1. Have a long description
    // 2. Don't have an existing analysis record
    // 3. Haven't been analyzed before (no iphone_analysis entry)
    const { data: listings, error } = await supabaseAdmin
      .from('listings')
      .select(`
        article_id,
        title,
        long_desc,
        iphone_analysis!left(iphone_model)
      `)
      .not('long_desc', 'is', null)  // Must have description
      .is('iphone_analysis.iphone_model', null)  // No existing analysis

    if (error) throw error

    const unanalyzedCount = listings.length
    console.log(`Found ${unanalyzedCount} unanalyzed listings`)

    if (unanalyzedCount === 0) {
      console.log('No new listings to analyze. Exiting...')
      return
    }

    // Process each unanalyzed listing
    for (const listing of listings) {
      await analyzeListing(listing)
      // Add a small delay between API calls
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    console.log(`Analysis completed! Processed ${unanalyzedCount} listings`)
  } catch (error) {
    console.error('Analysis error:', error)
  }
}

// Run the analysis
analyzeListings() 