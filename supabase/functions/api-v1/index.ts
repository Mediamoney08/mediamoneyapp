import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
}

interface ApiResponse {
  success: boolean
  data?: any
  error?: string
  message?: string
}

// Authenticate API request
async function authenticateRequest(req: Request, supabase: any): Promise<{ authenticated: boolean; userId?: string; apiKeyId?: string; error?: string }> {
  const apiKey = req.headers.get('x-api-key') || req.headers.get('authorization')?.replace('Bearer ', '')
  
  if (!apiKey) {
    return { authenticated: false, error: 'API key is required' }
  }

  // Verify API key
  const { data: keyData, error: keyError } = await supabase
    .from('api_keys')
    .select('id, created_by, status, permissions')
    .eq('key', apiKey)
    .single()

  if (keyError || !keyData) {
    return { authenticated: false, error: 'Invalid API key' }
  }

  if (keyData.status !== 'active') {
    return { authenticated: false, error: 'API key is inactive' }
  }

  // Check rate limit
  const { data: rateLimitOk } = await supabase.rpc('check_rate_limit', { p_api_key_id: keyData.id })
  
  if (!rateLimitOk) {
    return { authenticated: false, error: 'Rate limit exceeded' }
  }

  // Update last used timestamp
  await supabase
    .from('api_keys')
    .update({ last_used_at: new Date().toISOString() })
    .eq('id', keyData.id)

  return { 
    authenticated: true, 
    userId: keyData.created_by,
    apiKeyId: keyData.id
  }
}

// Log API usage
async function logApiUsage(supabase: any, apiKeyId: string, endpoint: string, method: string, statusCode: number, responseTime: number, error?: string) {
  await supabase
    .from('api_usage_logs')
    .insert({
      api_key_id: apiKeyId,
      endpoint,
      method,
      status_code: statusCode,
      response_time: responseTime,
      error_message: error
    })
}

serve(async (req) => {
  const startTime = Date.now()
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const url = new URL(req.url)
    const path = url.pathname.replace('/api/v1', '')
    const method = req.method

    // Authenticate request
    const auth = await authenticateRequest(req, supabaseClient)
    
    if (!auth.authenticated) {
      const response: ApiResponse = {
        success: false,
        error: auth.error || 'Authentication failed'
      }
      return new Response(
        JSON.stringify(response),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    let response: ApiResponse
    let statusCode = 200

    // Route handling
    if (path === '/balance' && method === 'GET') {
      // Get user balance
      const { data: profile, error } = await supabaseClient
        .from('profiles')
        .select('wallet_balance, currency')
        .eq('id', auth.userId)
        .single()

      if (error) throw error

      response = {
        success: true,
        data: {
          balance: profile.wallet_balance,
          currency: profile.currency || 'USD'
        }
      }
    }
    else if (path === '/products' && method === 'GET') {
      // List products
      const category = url.searchParams.get('category')
      const limit = parseInt(url.searchParams.get('limit') || '50')
      const offset = parseInt(url.searchParams.get('offset') || '0')

      let query = supabaseClient
        .from('products')
        .select('id, name, description, category, price, stock_quantity, service_name, image_url')
        .eq('is_active', true)
        .range(offset, offset + limit - 1)

      if (category) {
        query = query.eq('category', category)
      }

      const { data: products, error } = await query

      if (error) throw error

      response = {
        success: true,
        data: {
          products,
          total: products?.length || 0
        }
      }
    }
    else if (path.startsWith('/products/') && method === 'GET') {
      // Get product details
      const productId = path.split('/')[2]

      const { data: product, error } = await supabaseClient
        .from('products')
        .select('*')
        .eq('id', productId)
        .eq('is_active', true)
        .single()

      if (error) throw error

      response = {
        success: true,
        data: product
      }
    }
    else if (path === '/orders' && method === 'POST') {
      // Create order
      const body = await req.json()
      const { product_id, quantity = 1, player_id, custom_fields } = body

      if (!product_id) {
        throw new Error('product_id is required')
      }

      // Get product details
      const { data: product, error: productError } = await supabaseClient
        .from('products')
        .select('price, stock_quantity')
        .eq('id', product_id)
        .single()

      if (productError) throw productError

      if (product.stock_quantity < quantity) {
        throw new Error('Insufficient stock')
      }

      const totalAmount = product.price * quantity

      // Check user balance
      const { data: profile, error: profileError } = await supabaseClient
        .from('profiles')
        .select('wallet_balance')
        .eq('id', auth.userId)
        .single()

      if (profileError) throw profileError

      if (profile.wallet_balance < totalAmount) {
        throw new Error('Insufficient balance')
      }

      // Create order
      const { data: order, error: orderError } = await supabaseClient
        .from('orders')
        .insert({
          user_id: auth.userId,
          product_id,
          quantity,
          unit_price: product.price,
          total_amount: totalAmount,
          player_id,
          custom_fields,
          status: 'pending'
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Deduct balance
      await supabaseClient
        .from('profiles')
        .update({ wallet_balance: profile.wallet_balance - totalAmount })
        .eq('id', auth.userId)

      // Update stock
      await supabaseClient
        .from('products')
        .update({ stock_quantity: product.stock_quantity - quantity })
        .eq('id', product_id)

      response = {
        success: true,
        data: {
          order_id: order.id,
          status: order.status,
          total_amount: order.total_amount
        },
        message: 'Order created successfully'
      }
      statusCode = 201
    }
    else if (path === '/orders' && method === 'GET') {
      // List orders
      const status = url.searchParams.get('status')
      const limit = parseInt(url.searchParams.get('limit') || '50')
      const offset = parseInt(url.searchParams.get('offset') || '0')

      let query = supabaseClient
        .from('orders')
        .select('id, product_id, quantity, total_amount, status, player_id, created_at, completed_at')
        .eq('user_id', auth.userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (status) {
        query = query.eq('status', status)
      }

      const { data: orders, error } = await query

      if (error) throw error

      response = {
        success: true,
        data: {
          orders,
          total: orders?.length || 0
        }
      }
    }
    else if (path.startsWith('/orders/') && method === 'GET') {
      // Get order details
      const orderId = path.split('/')[2]

      const { data: order, error } = await supabaseClient
        .from('orders')
        .select('*, products(*)')
        .eq('id', orderId)
        .eq('user_id', auth.userId)
        .single()

      if (error) throw error

      response = {
        success: true,
        data: order
      }
    }
    else if (path === '/categories' && method === 'GET') {
      // List categories
      const { data: categories, error } = await supabaseClient
        .from('categories')
        .select('id, name, description, service_type, icon')
        .eq('is_active', true)
        .order('display_order')

      if (error) throw error

      response = {
        success: true,
        data: {
          categories
        }
      }
    }
    else if (path === '/webhooks' && method === 'POST') {
      // Register webhook
      const body = await req.json()
      const { url: webhookUrl, events } = body

      if (!webhookUrl || !events || !Array.isArray(events)) {
        throw new Error('url and events are required')
      }

      // Generate webhook secret
      const secret = crypto.randomUUID()

      const { data: webhook, error } = await supabaseClient
        .from('webhooks')
        .insert({
          user_id: auth.userId,
          url: webhookUrl,
          events,
          secret,
          is_active: true
        })
        .select()
        .single()

      if (error) throw error

      response = {
        success: true,
        data: {
          webhook_id: webhook.id,
          url: webhook.url,
          secret: webhook.secret
        },
        message: 'Webhook registered successfully'
      }
      statusCode = 201
    }
    else if (path === '/webhooks' && method === 'GET') {
      // List webhooks
      const { data: webhooks, error } = await supabaseClient
        .from('webhooks')
        .select('id, url, events, is_active, last_triggered_at, created_at')
        .eq('user_id', auth.userId)

      if (error) throw error

      response = {
        success: true,
        data: {
          webhooks
        }
      }
    }
    else {
      response = {
        success: false,
        error: 'Endpoint not found'
      }
      statusCode = 404
    }

    // Log API usage
    const responseTime = Date.now() - startTime
    await logApiUsage(supabaseClient, auth.apiKeyId!, path, method, statusCode, responseTime)

    return new Response(
      JSON.stringify(response),
      { 
        status: statusCode, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('API Error:', error)
    
    const response: ApiResponse = {
      success: false,
      error: error.message || 'Internal server error'
    }

    return new Response(
      JSON.stringify(response),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})