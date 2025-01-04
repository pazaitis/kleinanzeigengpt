import { supabaseAdmin } from '../supabase'

async function seedData() {
  // Sample listings data
  const listings = [
    {
      article_id: "1234567890",
      title: "iPhone 13 Pro Max - Wie neu",
      price: "899 €",
      location: "10115 Berlin",
      description: "Verkaufe mein iPhone 13 Pro Max, 256GB in Sierra Blau",
      timestamp: "Heute, 14:30",
      last_seen: new Date().toISOString()
    },
    {
      article_id: "2345678901",
      title: "iPhone 12 - Guter Zustand",
      price: "550 €",
      location: "20095 Hamburg",
      description: "iPhone 12, 128GB, Schwarz, mit Originalverpackung",
      timestamp: "Gestern, 18:45",
      last_seen: new Date().toISOString()
    }
  ]

  // Sample history data
  const history = [
    {
      listing_id: "1234567890",
      price: "999 €",
      title: "iPhone 13 Pro Max - Wie neu",
      change_detected_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      listing_id: "1234567890",
      price: "949 €",
      title: "iPhone 13 Pro Max - Wie neu",
      change_detected_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]

  // Insert listings
  const { data: listingsData, error: listingsError } = await supabaseAdmin
    .from('listings')
    .upsert(listings)

  if (listingsError) {
    console.error('Error inserting listings:', listingsError)
    return
  }

  // Insert history
  const { data: historyData, error: historyError } = await supabaseAdmin
    .from('listing_history')
    .upsert(history)

  if (historyError) {
    console.error('Error inserting history:', historyError)
    return
  }

  console.log('Sample data inserted successfully!')
}

seedData() 