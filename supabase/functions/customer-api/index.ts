import { createClient } from "jsr:@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const supabase = createClient(supabaseUrl, supabaseKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-api-key",
};

function ok(data: any): Response {
  return new Response(
    JSON.stringify({ code: "SUCCESS", message: "Success", data }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    }
  );
}

function fail(msg: string, code = 400): Response {
  return new Response(
    JSON.stringify({ code: "FAIL", message: msg }),
    {
      status: code,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    }
  );
}

// Validate API key or user token
async function validateAuth(req: Request): Promise<string | null> {
  // Check for API key
  const apiKey = req.headers.get("x-api-key");
  if (apiKey) {
    const { data: keyData } = await supabase
      .from("api_keys")
      .select("*")
      .eq("key", apiKey)
      .eq("status", "active")
      .single();

    if (keyData) {
      await supabase
        .from("api_keys")
        .update({ last_used_at: new Date().toISOString() })
        .eq("id", keyData.id);
      return "api";
    }
  }

  // Check for user token
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (!error && user) {
      return user.id;
    }
  }

  return null;
}

// Get products
async function getProducts(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const category = url.searchParams.get("category");

  let query = supabase
    .from("products")
    .select("*")
    .eq("is_active", true);

  if (category) {
    query = query.eq("category", category);
  }

  const { data: products, error } = await query.order("created_at", { ascending: false });

  if (error) return fail(error.message);
  return ok(products || []);
}

// Create order
async function createOrder(req: Request, userId: string): Promise<Response> {
  const body = await req.json();
  const { product_id, quantity = 1, player_id } = body;

  if (!product_id) return fail("Missing product_id");

  // Get product details
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("*")
    .eq("id", product_id)
    .single();

  if (productError || !product) return fail("Product not found");

  // Check stock availability
  const { count } = await supabase
    .from("stock_items")
    .select("*", { count: "exact", head: true })
    .eq("product_id", product_id)
    .eq("status", "available");

  if ((count || 0) < quantity) {
    return fail(`Insufficient stock. Available: ${count || 0}, Required: ${quantity}`);
  }

  // Calculate total
  const totalAmount = product.price * quantity;

  // Create order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      items: [{
        product_id: product.id,
        name: product.name,
        price: Math.round(product.price * 100),
        quantity,
        image_url: product.image_url,
      }],
      total_amount: totalAmount,
      currency: "usd",
      status: "pending",
      player_id: player_id || null,
    })
    .select()
    .single();

  if (orderError) return fail(orderError.message);

  // Reserve stock items
  for (let i = 0; i < quantity; i++) {
    const { data: availableStock } = await supabase
      .from("stock_items")
      .select("id")
      .eq("product_id", product_id)
      .eq("status", "available")
      .limit(1)
      .single();

    if (availableStock) {
      await supabase
        .from("stock_items")
        .update({
          status: "reserved",
          reserved_by: userId,
          reserved_at: new Date().toISOString(),
          order_id: order.id,
        })
        .eq("id", availableStock.id);
    }
  }

  return ok(order);
}

// Get order status
async function getOrderStatus(req: Request, userId: string): Promise<Response> {
  const url = new URL(req.url);
  const orderId = url.searchParams.get("order_id");

  if (!orderId) return fail("Missing order_id");

  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .eq("user_id", userId)
    .single();

  if (error) return fail(error.message);

  // If order is completed, include stock codes
  if (order.status === "completed") {
    const { data: stockCodes } = await supabase
      .from("stock_items")
      .select("code, product_id")
      .eq("order_id", orderId)
      .eq("sold_to", userId)
      .eq("status", "sold");

    return ok({ ...order, codes: stockCodes || [] });
  }

  return ok(order);
}

// Get user balance
async function getUserBalance(req: Request, userId: string): Promise<Response> {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("wallet_balance")
    .eq("id", userId)
    .single();

  if (error) return fail(error.message);
  return ok({ balance: profile.wallet_balance || 0 });
}

// Add balance (requires payment proof)
async function addBalance(req: Request, userId: string): Promise<Response> {
  const body = await req.json();
  const { amount, payment_method_id, proof_url } = body;

  if (!amount || amount <= 0) return fail("Invalid amount");
  if (!payment_method_id) return fail("Missing payment_method_id");

  // Create payment proof
  const { data: proof, error } = await supabase
    .from("payment_proofs")
    .insert({
      user_id: userId,
      amount,
      payment_method_id,
      proof_url,
      status: "pending",
    })
    .select()
    .single();

  if (error) return fail(error.message);
  return ok(proof);
}

Deno.serve(async (req) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Validate authentication
    const auth = await validateAuth(req);
    if (!auth) {
      return fail("Unauthorized", 401);
    }

    // Route to appropriate handler
    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    switch (action) {
      case "get_products":
        return await getProducts(req);
      
      case "create_order":
        if (auth === "api") return fail("API key cannot create orders", 403);
        return await createOrder(req, auth);
      
      case "get_order":
        if (auth === "api") return fail("API key cannot get orders", 403);
        return await getOrderStatus(req, auth);
      
      case "get_balance":
        if (auth === "api") return fail("API key cannot get balance", 403);
        return await getUserBalance(req, auth);
      
      case "add_balance":
        if (auth === "api") return fail("API key cannot add balance", 403);
        return await addBalance(req, auth);
      
      default:
        return fail("Invalid action");
    }
  } catch (error) {
    console.error("Error:", error);
    return fail(error.message || "Internal server error", 500);
  }
});
