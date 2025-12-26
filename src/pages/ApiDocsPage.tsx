import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, Check, Key, Code, Webhook, BookOpen, Zap, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface ApiEndpoint {
  id: string;
  endpoint: string;
  method: string;
  description: string;
  request_schema: any;
  response_schema: any;
  requires_auth: boolean;
  rate_limit: number;
}

export default function ApiDocsPage() {
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([]);
  const [apiKey, setApiKey] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const baseUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/api-v1`;

  useEffect(() => {
    loadEndpoints();
    loadApiKey();
  }, []);

  const loadEndpoints = async () => {
    try {
      const { data, error } = await supabase
        .from('api_endpoints')
        .select('*')
        .eq('is_active', true)
        .order('endpoint');

      if (error) throw error;
      setEndpoints(data || []);
    } catch (error) {
      console.error('Error loading endpoints:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadApiKey = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('api_keys')
        .select('key')
        .eq('created_by', user.id)
        .eq('status', 'active')
        .single();

      if (error) {
        console.log('No API key found');
        return;
      }

      if (data) {
        setApiKey(data.key);
      }
    } catch (error) {
      console.error('Error loading API key:', error);
    }
  };

  const generateApiKey = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: 'Error',
          description: 'You must be logged in to generate an API key',
          variant: 'destructive',
        });
        return;
      }

      // Generate API key using database function
      const { data: keyData, error: keyError } = await supabase.rpc('generate_api_key');
      if (keyError) throw keyError;

      const newKey = keyData;

      // Insert API key
      const { error: insertError } = await supabase
        .from('api_keys')
        .insert({
          key: newKey,
          name: 'Default API Key',
          status: 'active',
          created_by: user.id,
          permissions: ['read', 'write']
        });

      if (insertError) throw insertError;

      setApiKey(newKey);
      toast({
        title: 'Success',
        description: 'API key generated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: 'Copied',
      description: 'Copied to clipboard',
    });
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-blue-500';
      case 'POST': return 'bg-green-500';
      case 'PUT': return 'bg-yellow-500';
      case 'DELETE': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">API Documentation</h1>
        <p className="text-muted-foreground">
          Integrate Recharge Hub services into your application
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">
            <BookOpen className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="authentication">
            <Key className="h-4 w-4 mr-2" />
            Authentication
          </TabsTrigger>
          <TabsTrigger value="endpoints">
            <Code className="h-4 w-4 mr-2" />
            Endpoints
          </TabsTrigger>
          <TabsTrigger value="webhooks">
            <Webhook className="h-4 w-4 mr-2" />
            Webhooks
          </TabsTrigger>
          <TabsTrigger value="examples">
            <Zap className="h-4 w-4 mr-2" />
            Examples
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to Recharge Hub API</CardTitle>
              <CardDescription>
                Our RESTful API allows you to integrate digital recharge services into your application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Base URL</h3>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-muted p-3 rounded text-sm">
                    {baseUrl}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(baseUrl)}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Card>
                  <CardHeader>
                    <Shield className="h-8 w-8 text-primary mb-2" />
                    <CardTitle className="text-lg">Secure</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      All API requests are encrypted with HTTPS and require authentication
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Zap className="h-8 w-8 text-primary mb-2" />
                    <CardTitle className="text-lg">Fast</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Low latency responses with efficient caching and optimization
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Code className="h-8 w-8 text-primary mb-2" />
                    <CardTitle className="text-lg">RESTful</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Standard HTTP methods and JSON responses for easy integration
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Alert>
                <AlertDescription>
                  <strong>Rate Limits:</strong> Default limits are 60 requests/minute, 1000 requests/hour, and 10,000 requests/day per API key.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Authentication Tab */}
        <TabsContent value="authentication" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Authentication</CardTitle>
              <CardDescription>
                Secure your API requests with API keys
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Your API Key</h3>
                {apiKey ? (
                  <div className="flex items-center gap-2">
                    <Input
                      type="password"
                      value={apiKey}
                      readOnly
                      className="font-mono"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(apiKey)}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-muted-foreground mb-4">
                      You don't have an API key yet. Generate one to get started.
                    </p>
                    <Button onClick={generateApiKey}>
                      <Key className="h-4 w-4 mr-2" />
                      Generate API Key
                    </Button>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-2">How to Use</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Include your API key in the request header:
                </p>
                <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
{`curl -X GET "${baseUrl}/balance" \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
                </pre>
              </div>

              <Alert>
                <AlertDescription>
                  <strong>Security:</strong> Never share your API key publicly or commit it to version control. Treat it like a password.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Endpoints Tab */}
        <TabsContent value="endpoints" className="space-y-6">
          {loading ? (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">Loading endpoints...</p>
              </CardContent>
            </Card>
          ) : (
            endpoints.map((endpoint) => (
              <Card key={endpoint.id}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Badge className={`${getMethodColor(endpoint.method)} text-white`}>
                      {endpoint.method}
                    </Badge>
                    <code className="text-sm">{endpoint.endpoint}</code>
                  </div>
                  <CardDescription>{endpoint.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Request</h4>
                    <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
                      {JSON.stringify(endpoint.request_schema, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Response</h4>
                    <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
                      {JSON.stringify(endpoint.response_schema, null, 2)}
                    </pre>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Rate Limit: {endpoint.rate_limit} req/min</span>
                    {endpoint.requires_auth && (
                      <Badge variant="outline">
                        <Key className="h-3 w-3 mr-1" />
                        Requires Auth
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Webhooks Tab */}
        <TabsContent value="webhooks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Integration</CardTitle>
              <CardDescription>
                Receive real-time notifications for events
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Available Events</h3>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li><code>order.created</code> - Triggered when a new order is created</li>
                  <li><code>order.completed</code> - Triggered when an order is completed</li>
                  <li><code>order.failed</code> - Triggered when an order fails</li>
                  <li><code>payment.approved</code> - Triggered when a payment is approved</li>
                  <li><code>payment.rejected</code> - Triggered when a payment is rejected</li>
                </ul>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-2">Register a Webhook</h3>
                <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
{`curl -X POST "${baseUrl}/webhooks" \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://your-domain.com/webhook",
    "events": ["order.completed", "order.failed"]
  }'`}
                </pre>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-2">Webhook Payload Example</h3>
                <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
{`{
  "event": "order.completed",
  "timestamp": "2025-12-26T10:30:00Z",
  "data": {
    "order_id": "123e4567-e89b-12d3-a456-426614174000",
    "product": "PUBG Mobile 60 UC",
    "status": "completed",
    "amount": 5.99,
    "delivery_data": {
      "code": "XXXX-XXXX-XXXX"
    }
  }
}`}
                </pre>
              </div>

              <Alert>
                <AlertDescription>
                  <strong>Security:</strong> Webhook requests include a signature in the <code>X-Webhook-Signature</code> header. Verify this signature using your webhook secret.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Examples Tab */}
        <TabsContent value="examples" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Code Examples</CardTitle>
              <CardDescription>
                Quick start examples in different languages
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">JavaScript / Node.js</h3>
                <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
{`const axios = require('axios');

const apiKey = 'YOUR_API_KEY';
const baseUrl = '${baseUrl}';

// Get balance
async function getBalance() {
  const response = await axios.get(\`\${baseUrl}/balance\`, {
    headers: {
      'X-API-Key': apiKey
    }
  });
  console.log(response.data);
}

// Create order
async function createOrder(productId, quantity) {
  const response = await axios.post(\`\${baseUrl}/orders\`, {
    product_id: productId,
    quantity: quantity,
    player_id: '123456789'
  }, {
    headers: {
      'X-API-Key': apiKey,
      'Content-Type': 'application/json'
    }
  });
  console.log(response.data);
}`}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Python</h3>
                <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
{`import requests

api_key = 'YOUR_API_KEY'
base_url = '${baseUrl}'

# Get balance
def get_balance():
    response = requests.get(
        f'{base_url}/balance',
        headers={'X-API-Key': api_key}
    )
    return response.json()

# Create order
def create_order(product_id, quantity):
    response = requests.post(
        f'{base_url}/orders',
        headers={
            'X-API-Key': api_key,
            'Content-Type': 'application/json'
        },
        json={
            'product_id': product_id,
            'quantity': quantity,
            'player_id': '123456789'
        }
    )
    return response.json()`}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold mb-2">PHP</h3>
                <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
{`<?php

$apiKey = 'YOUR_API_KEY';
$baseUrl = '${baseUrl}';

// Get balance
function getBalance($apiKey, $baseUrl) {
    $ch = curl_init("$baseUrl/balance");
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "X-API-Key: $apiKey"
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    curl_close($ch);
    return json_decode($response);
}

// Create order
function createOrder($apiKey, $baseUrl, $productId, $quantity) {
    $ch = curl_init("$baseUrl/orders");
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "X-API-Key: $apiKey",
        "Content-Type: application/json"
    ]);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        'product_id' => $productId,
        'quantity' => $quantity,
        'player_id' => '123456789'
    ]));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    curl_close($ch);
    return json_decode($response);
}

?>`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}