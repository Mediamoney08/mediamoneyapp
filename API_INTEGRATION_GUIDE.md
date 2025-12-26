# Recharge Hub API Integration Guide

## 🚀 Quick Start

This guide will help you integrate Recharge Hub's API into your application in just a few minutes.

---

## 📋 Prerequisites

- Active Recharge Hub account
- API key (generate from your dashboard)
- Basic knowledge of REST APIs
- HTTPS-enabled server (for webhooks)

---

## 🔑 Step 1: Get Your API Key

### Option A: Generate from Dashboard

1. Login to your Recharge Hub account
2. Navigate to **API Documentation** page (`/api-docs`)
3. Click on the **Authentication** tab
4. Click **Generate API Key** button
5. Copy and securely store your API key

### Option B: Generate Programmatically

```javascript
// After logging in, call the generate function
const { data, error } = await supabase.rpc('generate_api_key');
```

### API Key Format

```
rh_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

**⚠️ Security Warning:** Never expose your API key in:
- Client-side JavaScript
- Public repositories
- Mobile app code
- Browser console

---

## 🌐 Step 2: Make Your First API Call

### Base URL

```
https://ufaljqeldjuquuazubam.supabase.co/functions/v1/api-v1
```

### Test Connection

```bash
curl -X GET "https://ufaljqeldjuquuazubam.supabase.co/functions/v1/api-v1/balance" \
  -H "X-API-Key: YOUR_API_KEY"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "balance": 100.00,
    "currency": "USD"
  }
}
```

---

## 📦 Step 3: Integration Examples

### JavaScript / Node.js

#### Install Dependencies

```bash
npm install axios
```

#### Create API Client

```javascript
// api-client.js
const axios = require('axios');

class RechargeHubAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://ufaljqeldjuquuazubam.supabase.co/functions/v1/api-v1';
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'X-API-Key': this.apiKey,
        'Content-Type': 'application/json'
      }
    });
  }

  async getBalance() {
    const response = await this.client.get('/balance');
    return response.data;
  }

  async listProducts(category = null, limit = 50) {
    const params = { limit };
    if (category) params.category = category;
    const response = await this.client.get('/products', { params });
    return response.data;
  }

  async getProduct(productId) {
    const response = await this.client.get(`/products/${productId}`);
    return response.data;
  }

  async createOrder(productId, quantity, playerId, customFields = {}) {
    const response = await this.client.post('/orders', {
      product_id: productId,
      quantity,
      player_id: playerId,
      custom_fields: customFields
    });
    return response.data;
  }

  async listOrders(status = null, limit = 50) {
    const params = { limit };
    if (status) params.status = status;
    const response = await this.client.get('/orders', { params });
    return response.data;
  }

  async getOrder(orderId) {
    const response = await this.client.get(`/orders/${orderId}`);
    return response.data;
  }

  async registerWebhook(url, events) {
    const response = await this.client.post('/webhooks', {
      url,
      events
    });
    return response.data;
  }
}

module.exports = RechargeHubAPI;
```

#### Usage Example

```javascript
const RechargeHubAPI = require('./api-client');

const api = new RechargeHubAPI('YOUR_API_KEY');

async function main() {
  try {
    // Get balance
    const balance = await api.getBalance();
    console.log('Balance:', balance.data.balance);

    // List products
    const products = await api.listProducts('game');
    console.log('Products:', products.data.products);

    // Create order
    const order = await api.createOrder(
      'product-uuid',
      1,
      '123456789',
      { server: 'Asia' }
    );
    console.log('Order created:', order.data.order_id);

    // Check order status
    const orderDetails = await api.getOrder(order.data.order_id);
    console.log('Order status:', orderDetails.data.status);

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

main();
```

---

### Python

#### Install Dependencies

```bash
pip install requests
```

#### Create API Client

```python
# api_client.py
import requests
from typing import Optional, List, Dict

class RechargeHubAPI:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = 'https://ufaljqeldjuquuazubam.supabase.co/functions/v1/api-v1'
        self.headers = {
            'X-API-Key': api_key,
            'Content-Type': 'application/json'
        }

    def get_balance(self) -> Dict:
        response = requests.get(
            f'{self.base_url}/balance',
            headers=self.headers
        )
        response.raise_for_status()
        return response.json()

    def list_products(self, category: Optional[str] = None, limit: int = 50) -> Dict:
        params = {'limit': limit}
        if category:
            params['category'] = category
        
        response = requests.get(
            f'{self.base_url}/products',
            headers=self.headers,
            params=params
        )
        response.raise_for_status()
        return response.json()

    def get_product(self, product_id: str) -> Dict:
        response = requests.get(
            f'{self.base_url}/products/{product_id}',
            headers=self.headers
        )
        response.raise_for_status()
        return response.json()

    def create_order(
        self,
        product_id: str,
        quantity: int,
        player_id: str,
        custom_fields: Optional[Dict] = None
    ) -> Dict:
        data = {
            'product_id': product_id,
            'quantity': quantity,
            'player_id': player_id
        }
        if custom_fields:
            data['custom_fields'] = custom_fields

        response = requests.post(
            f'{self.base_url}/orders',
            headers=self.headers,
            json=data
        )
        response.raise_for_status()
        return response.json()

    def list_orders(self, status: Optional[str] = None, limit: int = 50) -> Dict:
        params = {'limit': limit}
        if status:
            params['status'] = status

        response = requests.get(
            f'{self.base_url}/orders',
            headers=self.headers,
            params=params
        )
        response.raise_for_status()
        return response.json()

    def get_order(self, order_id: str) -> Dict:
        response = requests.get(
            f'{self.base_url}/orders/{order_id}',
            headers=self.headers
        )
        response.raise_for_status()
        return response.json()

    def register_webhook(self, url: str, events: List[str]) -> Dict:
        response = requests.post(
            f'{self.base_url}/webhooks',
            headers=self.headers,
            json={'url': url, 'events': events}
        )
        response.raise_for_status()
        return response.json()
```

#### Usage Example

```python
from api_client import RechargeHubAPI

api = RechargeHubAPI('YOUR_API_KEY')

try:
    # Get balance
    balance = api.get_balance()
    print(f"Balance: {balance['data']['balance']}")

    # List products
    products = api.list_products(category='game')
    print(f"Found {len(products['data']['products'])} products")

    # Create order
    order = api.create_order(
        product_id='product-uuid',
        quantity=1,
        player_id='123456789',
        custom_fields={'server': 'Asia'}
    )
    print(f"Order created: {order['data']['order_id']}")

    # Check order status
    order_details = api.get_order(order['data']['order_id'])
    print(f"Order status: {order_details['data']['status']}")

except requests.exceptions.HTTPError as e:
    print(f"Error: {e.response.json()}")
```

---

### PHP

#### Create API Client

```php
<?php
// RechargeHubAPI.php

class RechargeHubAPI {
    private $apiKey;
    private $baseUrl = 'https://ufaljqeldjuquuazubam.supabase.co/functions/v1/api-v1';

    public function __construct($apiKey) {
        $this->apiKey = $apiKey;
    }

    private function request($method, $endpoint, $data = null) {
        $url = $this->baseUrl . $endpoint;
        $ch = curl_init($url);

        $headers = [
            "X-API-Key: {$this->apiKey}",
            "Content-Type: application/json"
        ];

        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        if ($method === 'POST') {
            curl_setopt($ch, CURLOPT_POST, true);
            if ($data) {
                curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
            }
        }

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $result = json_decode($response, true);

        if ($httpCode >= 400) {
            throw new Exception($result['error'] ?? 'API request failed');
        }

        return $result;
    }

    public function getBalance() {
        return $this->request('GET', '/balance');
    }

    public function listProducts($category = null, $limit = 50) {
        $query = "?limit=$limit";
        if ($category) {
            $query .= "&category=$category";
        }
        return $this->request('GET', "/products$query");
    }

    public function getProduct($productId) {
        return $this->request('GET', "/products/$productId");
    }

    public function createOrder($productId, $quantity, $playerId, $customFields = []) {
        $data = [
            'product_id' => $productId,
            'quantity' => $quantity,
            'player_id' => $playerId
        ];
        if (!empty($customFields)) {
            $data['custom_fields'] = $customFields;
        }
        return $this->request('POST', '/orders', $data);
    }

    public function listOrders($status = null, $limit = 50) {
        $query = "?limit=$limit";
        if ($status) {
            $query .= "&status=$status";
        }
        return $this->request('GET', "/orders$query");
    }

    public function getOrder($orderId) {
        return $this->request('GET', "/orders/$orderId");
    }

    public function registerWebhook($url, $events) {
        return $this->request('POST', '/webhooks', [
            'url' => $url,
            'events' => $events
        ]);
    }
}
?>
```

#### Usage Example

```php
<?php
require_once 'RechargeHubAPI.php';

$api = new RechargeHubAPI('YOUR_API_KEY');

try {
    // Get balance
    $balance = $api->getBalance();
    echo "Balance: " . $balance['data']['balance'] . "\n";

    // List products
    $products = $api->listProducts('game');
    echo "Found " . count($products['data']['products']) . " products\n";

    // Create order
    $order = $api->createOrder(
        'product-uuid',
        1,
        '123456789',
        ['server' => 'Asia']
    );
    echo "Order created: " . $order['data']['order_id'] . "\n";

    // Check order status
    $orderDetails = $api->getOrder($order['data']['order_id']);
    echo "Order status: " . $orderDetails['data']['status'] . "\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
```

---

## 🔔 Step 4: Set Up Webhooks

Webhooks allow you to receive real-time notifications when events occur.

### Create Webhook Endpoint

```javascript
// webhook-handler.js
const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.json());

function verifyWebhookSignature(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = 'sha256=' + hmac.update(JSON.stringify(payload)).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

app.post('/webhook', (req, res) => {
  const signature = req.headers['x-webhook-signature'];
  const webhookSecret = 'YOUR_WEBHOOK_SECRET'; // From webhook registration

  // Verify signature
  if (!verifyWebhookSignature(req.body, signature, webhookSecret)) {
    return res.status(401).send('Invalid signature');
  }

  const { event, data } = req.body;

  // Handle different events
  switch (event) {
    case 'order.completed':
      console.log('Order completed:', data.order_id);
      // Send delivery email, update database, etc.
      break;

    case 'order.failed':
      console.log('Order failed:', data.order_id);
      // Notify user, refund, etc.
      break;

    case 'payment.approved':
      console.log('Payment approved:', data.payment_id);
      // Credit user balance, send confirmation, etc.
      break;

    default:
      console.log('Unknown event:', event);
  }

  // Respond quickly (within 5 seconds)
  res.status(200).send('OK');
});

app.listen(3000, () => {
  console.log('Webhook server running on port 3000');
});
```

### Register Webhook

```javascript
const api = new RechargeHubAPI('YOUR_API_KEY');

const webhook = await api.registerWebhook(
  'https://your-domain.com/webhook',
  ['order.completed', 'order.failed', 'payment.approved']
);

console.log('Webhook secret:', webhook.data.secret);
// Save this secret securely!
```

---

## 🛡️ Security Best Practices

### 1. API Key Storage

**✅ DO:**
```javascript
// Use environment variables
const apiKey = process.env.RECHARGE_HUB_API_KEY;
```

**❌ DON'T:**
```javascript
// Never hardcode API keys
const apiKey = 'rh_abc123...';
```

### 2. Error Handling

```javascript
async function safeApiCall() {
  try {
    const result = await api.getBalance();
    return result;
  } catch (error) {
    if (error.response?.status === 429) {
      // Rate limit exceeded - implement backoff
      console.log('Rate limit exceeded, waiting...');
      await sleep(60000); // Wait 1 minute
      return safeApiCall(); // Retry
    } else if (error.response?.status === 401) {
      // Invalid API key
      console.error('Invalid API key');
      throw error;
    } else {
      // Other errors
      console.error('API error:', error.message);
      throw error;
    }
  }
}
```

### 3. Rate Limit Handling

```javascript
class RateLimitedAPI extends RechargeHubAPI {
  constructor(apiKey) {
    super(apiKey);
    this.requestQueue = [];
    this.requestsPerMinute = 60;
  }

  async throttledRequest(fn) {
    // Implement request queuing and throttling
    // to stay within rate limits
  }
}
```

---

## 📊 Monitoring & Logging

### Track API Usage

```javascript
const api = new RechargeHubAPI('YOUR_API_KEY');

// Wrap API calls with logging
async function loggedApiCall(fn, name) {
  const startTime = Date.now();
  try {
    const result = await fn();
    const duration = Date.now() - startTime;
    console.log(`[${name}] Success in ${duration}ms`);
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[${name}] Failed in ${duration}ms:`, error.message);
    throw error;
  }
}

// Usage
const balance = await loggedApiCall(
  () => api.getBalance(),
  'getBalance'
);
```

---

## 🧪 Testing

### Test Mode

Use a separate API key for testing:

```javascript
const apiKey = process.env.NODE_ENV === 'production'
  ? process.env.PROD_API_KEY
  : process.env.TEST_API_KEY;

const api = new RechargeHubAPI(apiKey);
```

### Unit Tests

```javascript
const { expect } = require('chai');
const RechargeHubAPI = require('./api-client');

describe('RechargeHubAPI', () => {
  let api;

  before(() => {
    api = new RechargeHubAPI(process.env.TEST_API_KEY);
  });

  it('should get balance', async () => {
    const result = await api.getBalance();
    expect(result.success).to.be.true;
    expect(result.data).to.have.property('balance');
  });

  it('should list products', async () => {
    const result = await api.listProducts();
    expect(result.success).to.be.true;
    expect(result.data.products).to.be.an('array');
  });
});
```

---

## 🚨 Troubleshooting

### Common Issues

#### 1. 401 Unauthorized

**Problem:** Invalid or missing API key

**Solution:**
- Verify API key is correct
- Check header name is `X-API-Key`
- Ensure API key is active

#### 2. 429 Too Many Requests

**Problem:** Rate limit exceeded

**Solution:**
- Implement request throttling
- Add exponential backoff
- Cache responses when possible

#### 3. 400 Bad Request

**Problem:** Invalid request parameters

**Solution:**
- Validate all required fields
- Check data types match schema
- Review API documentation

#### 4. 500 Internal Server Error

**Problem:** Server error

**Solution:**
- Retry request after delay
- Check API status page
- Contact support if persistent

---

## 📞 Support

Need help? We're here for you!

- **Email:** api-support@rechargehub.com
- **Documentation:** https://rechargehub.com/api-docs
- **Status Page:** https://status.rechargehub.com
- **Discord:** https://discord.gg/rechargehub

---

## 📚 Additional Resources

- [Full API Reference](./API_DOCUMENTATION.md)
- [Webhook Guide](#webhooks)
- [Code Examples](#code-examples)
- [Best Practices](#security-best-practices)

---

*Happy Coding! 🚀*
