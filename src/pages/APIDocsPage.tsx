import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code } from 'lucide-react';

export default function APIDocsPage() {
  const apiEndpoint = 'https://ufaljqeldjuquuazubam.supabase.co/functions/v1';

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">API Documentation</h1>
          <p className="text-muted-foreground">Integrate Recharge Hub services into your application</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Learn how to use our API endpoints</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Base URL</h3>
              <code className="block bg-muted p-3 rounded-lg text-sm">
                {apiEndpoint}
              </code>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Authentication</h3>
              <p className="text-sm text-muted-foreground mb-2">
                All API requests require authentication using a Bearer token in the Authorization header.
              </p>
              <code className="block bg-muted p-3 rounded-lg text-sm">
                Authorization: Bearer YOUR_ACCESS_TOKEN
              </code>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="checkout" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="checkout">Create Checkout</TabsTrigger>
            <TabsTrigger value="verify">Verify Payment</TabsTrigger>
          </TabsList>

          <TabsContent value="checkout" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Code className="h-5 w-5" />
                  <span>POST /create_stripe_checkout</span>
                </CardTitle>
                <CardDescription>Create a new checkout session for payment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Request Body</h4>
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "items": [
    {
      "product_id": "uuid",
      "name": "Product Name",
      "price": 9.99,
      "quantity": 1,
      "image_url": "https://example.com/image.jpg"
    }
  ],
  "currency": "usd",
  "payment_method_types": ["card"],
  "player_id": "optional_player_id"
}`}
                  </pre>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Response</h4>
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "code": "SUCCESS",
  "message": "Success",
  "data": {
    "url": "https://checkout.stripe.com/...",
    "sessionId": "cs_test_...",
    "orderId": "uuid"
  }
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verify" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Code className="h-5 w-5" />
                  <span>POST /verify_stripe_payment</span>
                </CardTitle>
                <CardDescription>Verify the status of a payment session</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Request Body</h4>
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "sessionId": "cs_test_..."
}`}
                  </pre>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Response</h4>
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "code": "SUCCESS",
  "message": "Success",
  "data": {
    "verified": true,
    "status": "paid",
    "sessionId": "cs_test_...",
    "paymentIntentId": "pi_...",
    "amount": 999,
    "currency": "usd",
    "customerEmail": "user@example.com",
    "customerName": "John Doe",
    "orderUpdated": true
  }
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Error Handling</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              All API errors follow a consistent format:
            </p>
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "code": "FAIL",
  "message": "Error description"
}`}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rate Limiting</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              API requests are rate-limited to ensure fair usage. Current limits:
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>• 100 requests per minute per user</li>
              <li>• 1000 requests per hour per user</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
