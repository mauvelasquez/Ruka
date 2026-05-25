import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { data } = await supabase
    .from('yankis_balance')
    .select('balance, total_earned, total_spent')
    .eq('user_id', user.id)
    .single()

  return NextResponse.json(data || { balance: 0, total_earned: 0, total_spent: 0 })
}
