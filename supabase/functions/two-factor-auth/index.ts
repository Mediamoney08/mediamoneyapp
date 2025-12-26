import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import * as OTPAuth from "https://esm.sh/otpauth@9.1.4"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface SetupRequest {
  action: 'setup' | 'verify' | 'disable'
  code?: string
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
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

    const { action, code } = await req.json() as SetupRequest

    if (action === 'setup') {
      // Generate new TOTP secret
      const secret = new OTPAuth.Secret({ size: 20 })
      const totp = new OTPAuth.TOTP({
        issuer: 'RechargeHub',
        label: user.email || 'User',
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: secret,
      })

      // Generate backup codes
      const backupCodes: string[] = []
      for (let i = 0; i < 10; i++) {
        const code = Array.from(crypto.getRandomValues(new Uint8Array(4)))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('')
          .toUpperCase()
        backupCodes.push(code)
      }

      // Hash backup codes before storing
      const hashedBackupCodes = await Promise.all(
        backupCodes.map(async (code) => {
          const encoder = new TextEncoder()
          const data = encoder.encode(code)
          const hashBuffer = await crypto.subtle.digest('SHA-256', data)
          const hashArray = Array.from(new Uint8Array(hashBuffer))
          return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
        })
      )

      // Store in database (not enabled yet)
      const { error: insertError } = await supabaseClient
        .from('two_factor_auth')
        .upsert({
          user_id: user.id,
          secret: secret.base32,
          is_enabled: false,
          backup_codes: hashedBackupCodes,
          created_at: new Date().toISOString()
        })

      if (insertError) throw insertError

      // Return QR code URL and backup codes (unhashed)
      return new Response(
        JSON.stringify({
          success: true,
          data: {
            secret: secret.base32,
            qr_url: totp.toString(),
            backup_codes: backupCodes
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'verify') {
      if (!code || code.length !== 6) {
        throw new Error('Invalid verification code')
      }

      // Get user's 2FA secret
      const { data: twoFactorData, error: fetchError } = await supabaseClient
        .from('two_factor_auth')
        .select('secret, is_enabled')
        .eq('user_id', user.id)
        .single()

      if (fetchError || !twoFactorData) {
        throw new Error('2FA not set up')
      }

      // Verify TOTP code
      const totp = new OTPAuth.TOTP({
        issuer: 'RechargeHub',
        label: user.email || 'User',
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: OTPAuth.Secret.fromBase32(twoFactorData.secret),
      })

      const delta = totp.validate({ token: code, window: 1 })
      
      if (delta === null) {
        // Log failed attempt
        await supabaseClient.rpc('log_security_event', {
          p_user_id: user.id,
          p_event_type: '2fa_verification_failed',
          p_description: 'Failed 2FA verification attempt',
          p_ip_address: req.headers.get('x-forwarded-for') || 'unknown'
        })

        throw new Error('Invalid verification code')
      }

      // Enable 2FA
      const { error: updateError } = await supabaseClient
        .from('two_factor_auth')
        .update({
          is_enabled: true,
          enabled_at: new Date().toISOString(),
          last_used_at: new Date().toISOString()
        })
        .eq('user_id', user.id)

      if (updateError) throw updateError

      // Log success
      await supabaseClient.rpc('log_security_event', {
        p_user_id: user.id,
        p_event_type: '2fa_enabled',
        p_description: '2FA successfully enabled',
        p_ip_address: req.headers.get('x-forwarded-for') || 'unknown'
      })

      return new Response(
        JSON.stringify({
          success: true,
          message: '2FA enabled successfully'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'disable') {
      // Disable 2FA
      const { error: deleteError } = await supabaseClient
        .from('two_factor_auth')
        .delete()
        .eq('user_id', user.id)

      if (deleteError) throw deleteError

      // Log event
      await supabaseClient.rpc('log_security_event', {
        p_user_id: user.id,
        p_event_type: '2fa_disabled',
        p_description: '2FA disabled by user',
        p_ip_address: req.headers.get('x-forwarded-for') || 'unknown'
      })

      return new Response(
        JSON.stringify({
          success: true,
          message: '2FA disabled successfully'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    throw new Error('Invalid action')

  } catch (error: any) {
    console.error('2FA Error:', error)
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