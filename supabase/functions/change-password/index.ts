import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface PasswordChangeRequest {
  current_password: string
  new_password: string
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get user from auth header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token)
    
    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    const { current_password, new_password } = await req.json() as PasswordChangeRequest

    // Validate input
    if (!current_password || !new_password) {
      throw new Error('Current password and new password are required')
    }

    if (new_password.length < 8) {
      throw new Error('New password must be at least 8 characters')
    }

    // Password strength validation
    const hasUpperCase = /[A-Z]/.test(new_password)
    const hasLowerCase = /[a-z]/.test(new_password)
    const hasNumbers = /\d/.test(new_password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(new_password)

    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      throw new Error('Password must contain uppercase, lowercase, and numbers')
    }

    // Verify current password by attempting to sign in
    const { error: signInError } = await supabaseClient.auth.signInWithPassword({
      email: user.email!,
      password: current_password
    })

    if (signInError) {
      // Log failed attempt
      const serviceClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      await serviceClient.rpc('log_security_event', {
        p_user_id: user.id,
        p_event_type: 'password_change_failed',
        p_description: 'Failed password change attempt - incorrect current password',
        p_ip_address: req.headers.get('x-forwarded-for') || 'unknown'
      })

      throw new Error('Current password is incorrect')
    }

    // Update password using service role
    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { error: updateError } = await serviceClient.auth.admin.updateUserById(
      user.id,
      { password: new_password }
    )

    if (updateError) throw updateError

    // Log successful password change
    await serviceClient.rpc('log_security_event', {
      p_user_id: user.id,
      p_event_type: 'password_changed',
      p_description: 'Password changed successfully',
      p_ip_address: req.headers.get('x-forwarded-for') || 'unknown'
    })

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Password updated successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    console.error('Password Change Error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Internal server error'
      }),
      { 
        status: error.message === 'Unauthorized' ? 401 : 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})