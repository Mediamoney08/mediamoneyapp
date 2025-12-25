import { createClient } from "jsr:@supabase/supabase-js@2";
import Stripe from "npm:stripe@19.1.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const supabase = createClient(supabaseUrl, supabaseKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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

async function updateOrderStatus(
  sessionId: string,
  session: Stripe.Checkout.Session
): Promise<boolean> {
  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select("id, status, user_id, total_amount")
    .eq("stripe_session_id", sessionId)
    .single();

  if (fetchError || !order) {
    console.error("Failed to fetch order:", fetchError);
    return false;
  }

  if (order.status === "completed") {
    return true;
  }

  if (order.status !== "pending") {
    console.error(`Order status is ${order.status}, cannot complete payment`);
    return false;
  }

  const { error } = await supabase
    .from("orders")
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
      customer_email: session.customer_details?.email,
      customer_name: session.customer_details?.name,
      stripe_payment_intent_id: session.payment_intent as string,
    })
    .eq("id", order.id)
    .eq("status", "pending");

  if (error) {
    console.error("Failed to update order:", error);
    return false;
  }

  // Update user wallet balance if user exists
  if (order.user_id) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("wallet_balance")
      .eq("id", order.user_id)
      .single();

    if (profile) {
      const newBalance = Number(profile.wallet_balance) + Number(order.total_amount);
      
      await supabase
        .from("profiles")
        .update({ wallet_balance: newBalance })
        .eq("id", order.user_id);

      // Create wallet transaction record
      await supabase
        .from("wallet_transactions")
        .insert({
          user_id: order.user_id,
          amount: order.total_amount,
          type: "deposit",
          description: "Balance top-up via Stripe",
          order_id: order.id,
          balance_after: newBalance,
        });

      // Create notification
      await supabase
        .from("notifications")
        .insert({
          user_id: order.user_id,
          type: "order_completed",
          title: "Payment Successful",
          message: `Your payment of $${order.total_amount} has been completed successfully.`,
          metadata: { order_id: order.id },
        });
    }
  }

  return true;
}

Deno.serve(async (req) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const { sessionId } = await req.json();
    if (!sessionId) throw new Error("Missing session_id parameter");

    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      throw new Error("STRIPE_SECRET_KEY not configured");
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2025-08-27.basil",
    });

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return ok({
        verified: false,
        status: session.payment_status,
        sessionId: session.id,
      });
    }

    const orderUpdated = await updateOrderStatus(sessionId, session);

    return ok({
      verified: true,
      status: "paid",
      sessionId: session.id,
      paymentIntentId: session.payment_intent,
      amount: session.amount_total,
      currency: session.currency,
      customerEmail: session.customer_details?.email,
      customerName: session.customer_details?.name,
      orderUpdated,
    });
  } catch (error) {
    console.error("Payment verification failed:", error);
    return fail(error instanceof Error ? error.message : "Payment verification failed", 500);
  }
});
