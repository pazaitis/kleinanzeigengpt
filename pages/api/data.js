import { supabase } from '../../supabase'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { limit = 10, history = false } = req.query

  try {
    let query = supabase
      .from('listings')
      .select('*')
      .order('last_seen', { ascending: false })
      .limit(limit)

    if (history === 'true') {
      query = query.select(`
        *,
        listing_history (
          id,
          price,
          title,
          change_detected_at
        )
      `)
    }

    const { data, error } = await query

    if (error) throw error

    res.status(200).json(data)
  } catch (error) {
    console.error('Data fetch error:', error)
    res.status(500).json({ error: error.message })
  }
} 