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

// Validate API key and check permissions
async function validateApiKey(apiKey: string, requiredPermission: string): Promise<boolean> {
  const { data: keyData, error } = await supabase
    .from("api_keys")
    .select("*")
    .eq("key", apiKey)
    .eq("status", "active")
    .eq("version", "v2")
    .single();

  if (error || !keyData) {
    return false;
  }

  // Update last_used_at
  await supabase
    .from("api_keys")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", keyData.id);

  // Check if permission is granted
  const permissions = keyData.permissions || {};
  return permissions[requiredPermission] === true;
}

// Orders endpoints
async function handleOrders(req: Request, apiKey: string): Promise<Response> {
  const url = new URL(req.url);
  const action = url.searchParams.get("action");

  switch (action) {
    case "list":
      if (!await validateApiKey(apiKey, "orders_get_list")) {
        return fail("Permission denied: orders_get_list", 403);
      }
      const { data: orders } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      return ok(orders || []);

    case "get":
      if (!await validateApiKey(apiKey, "orders_edit_link")) {
        return fail("Permission denied: orders_edit_link", 403);
      }
      const orderId = url.searchParams.get("order_id");
      if (!orderId) return fail("Missing order_id");
      
      const { data: order } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();
      return ok(order);

    case "update_status":
      if (!await validateApiKey(apiKey, "orders_change_status")) {
        return fail("Permission denied: orders_change_status", 403);
      }
      const body = await req.json();
      const { order_id, status } = body;
      
      const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", order_id);
      
      if (error) return fail(error.message);
      return ok({ success: true });

    case "cancel":
      if (!await validateApiKey(apiKey, "orders_request_cancel")) {
        return fail("Permission denied: orders_request_cancel", 403);
      }
      const cancelBody = await req.json();
      const { order_id: cancelOrderId } = cancelBody;
      
      // Release reserved stock
      await supabase
        .from("stock_items")
        .update({
          status: "available",
          reserved_by: null,
          reserved_at: null,
          order_id: null,
        })
        .eq("order_id", cancelOrderId)
        .eq("status", "reserved");
      
      const { error: cancelError } = await supabase
        .from("orders")
        .update({ status: "cancelled" })
        .eq("id", cancelOrderId);
      
      if (cancelError) return fail(cancelError.message);
      return ok({ success: true });

    default:
      return fail("Invalid action");
  }
}

// Payments endpoints
async function handlePayments(req: Request, apiKey: string): Promise<Response> {
  const url = new URL(req.url);
  const action = url.searchParams.get("action");

  switch (action) {
    case "list":
      if (!await validateApiKey(apiKey, "payments_get_list")) {
        return fail("Permission denied: payments_get_list", 403);
      }
      const { data: payments } = await supabase
        .from("payment_proofs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      return ok(payments || []);

    case "add":
      if (!await validateApiKey(apiKey, "payments_add")) {
        return fail("Permission denied: payments_add", 403);
      }
      const body = await req.json();
      const { error } = await supabase
        .from("payment_proofs")
        .insert(body);
      
      if (error) return fail(error.message);
      return ok({ success: true });

    default:
      return fail("Invalid action");
  }
}

// Users endpoints
async function handleUsers(req: Request, apiKey: string): Promise<Response> {
  const url = new URL(req.url);
  const action = url.searchParams.get("action");

  switch (action) {
    case "list":
      if (!await validateApiKey(apiKey, "users_get_list")) {
        return fail("Permission denied: users_get_list", 403);
      }
      const { data: users } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      return ok(users || []);

    case "get":
      if (!await validateApiKey(apiKey, "users_view_details")) {
        return fail("Permission denied: users_view_details", 403);
      }
      const userId = url.searchParams.get("user_id");
      if (!userId) return fail("Missing user_id");
      
      const { data: user } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      return ok(user);

    case "add":
      if (!await validateApiKey(apiKey, "users_add")) {
        return fail("Permission denied: users_add", 403);
      }
      const body = await req.json();
      const { email, password, ...profileData } = body;
      
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      
      if (authError) return fail(authError.message);
      
      // Create profile
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: authData.user.id,
          ...profileData,
        });
      
      if (profileError) return fail(profileError.message);
      return ok({ success: true, user_id: authData.user.id });

    default:
      return fail("Invalid action");
  }
}

// Tickets endpoints
async function handleTickets(req: Request, apiKey: string): Promise<Response> {
  const url = new URL(req.url);
  const action = url.searchParams.get("action");

  switch (action) {
    case "list":
      if (!await validateApiKey(apiKey, "tickets_get_list")) {
        return fail("Permission denied: tickets_get_list", 403);
      }
      const { data: tickets } = await supabase
        .from("tickets")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      return ok(tickets || []);

    case "get":
      if (!await validateApiKey(apiKey, "tickets_get")) {
        return fail("Permission denied: tickets_get", 403);
      }
      const ticketId = url.searchParams.get("ticket_id");
      if (!ticketId) return fail("Missing ticket_id");
      
      const { data: ticket } = await supabase
        .from("tickets")
        .select("*")
        .eq("id", ticketId)
        .single();
      return ok(ticket);

    case "reply":
      if (!await validateApiKey(apiKey, "tickets_reply")) {
        return fail("Permission denied: tickets_reply", 403);
      }
      const replyBody = await req.json();
      const { ticket_id, message } = replyBody;
      
      // Add reply to ticket
      const { data: ticket } = await supabase
        .from("tickets")
        .select("messages")
        .eq("id", ticket_id)
        .single();
      
      const messages = ticket?.messages || [];
      messages.push({
        message,
        sender: "admin",
        timestamp: new Date().toISOString(),
      });
      
      const { error } = await supabase
        .from("tickets")
        .update({ messages, status: "replied" })
        .eq("id", ticket_id);
      
      if (error) return fail(error.message);
      return ok({ success: true });

    case "add":
      if (!await validateApiKey(apiKey, "tickets_add")) {
        return fail("Permission denied: tickets_add", 403);
      }
      const addBody = await req.json();
      const { error: addError } = await supabase
        .from("tickets")
        .insert(addBody);
      
      if (addError) return fail(addError.message);
      return ok({ success: true });

    default:
      return fail("Invalid action");
  }
}

Deno.serve(async (req) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Get API key from header
    const apiKey = req.headers.get("x-api-key");
    if (!apiKey) {
      return fail("Missing API key", 401);
    }

    // Verify API key exists and is active
    const { data: keyData } = await supabase
      .from("api_keys")
      .select("*")
      .eq("key", apiKey)
      .eq("status", "active")
      .eq("version", "v2")
      .single();

    if (!keyData) {
      return fail("Invalid or inactive API key", 401);
    }

    // Route to appropriate handler based on endpoint
    const url = new URL(req.url);
    const endpoint = url.searchParams.get("endpoint");

    switch (endpoint) {
      case "orders":
        return await handleOrders(req, apiKey);
      case "payments":
        return await handlePayments(req, apiKey);
      case "users":
        return await handleUsers(req, apiKey);
      case "tickets":
        return await handleTickets(req, apiKey);
      default:
        return fail("Invalid endpoint");
    }
  } catch (error) {
    console.error("Error:", error);
    return fail(error.message || "Internal server error", 500);
  }
});
