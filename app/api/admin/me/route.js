import { NextResponse } from 'next/server'
import { createClient } from '../../../../lib/supabase/server'

export const runtime = 'nodejs'

// SECURITY FIX: endpoint server-side para verificar si el usuario es admin
// sin exponer el email del admin en el bundle JS del cliente
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ isAdmin: false })

    const adminEmail = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL
    return NextResponse.json({ isAdmin: user.email === adminEmail })
  } catch {
    return NextResponse.json({ isAdmin: false })
  }
}
