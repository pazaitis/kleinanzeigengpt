import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { userId, adminId } = req.body

  try {
    // Verify that the requester is an admin
    const { data: adminUser } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', adminId)
      .single()

    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' })
    }

    // Delete user from auth
    const { error: authError } = await supabase.auth.admin.deleteUser(userId)
    if (authError) throw authError

    // Delete from profiles (should be handled by cascade, but let's make sure)
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId)

    if (profileError) throw profileError

    res.status(200).json({ success: true })
  } catch (error) {
    console.error('Error deleting user:', error)
    res.status(500).json({ error: error.message })
  }
} 