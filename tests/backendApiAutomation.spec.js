import {
  test,
  expect
} from '@playwright/test'
import dotenv from 'dotenv'

dotenv.config() // Load environment variables

const API_BASE_URL = process.env.API_BASE_URL
const API_KEY = process.env.API_KEY
const ACCOUNT_ID = process.env.ACCOUNT_ID

const headers = {
  'Accept': 'application/vnd.api+json',
  'Authorization': `Bearer ${API_KEY}`,
  'Content-Type': 'application/vnd.api+json',
  'Keygen-Version': '1.7',
  'Origin': 'https://app.keygen.sh',
}

test.describe.serial('Products API Automation', () => {
  let productId
  const uniqueCode = `test${Math.floor(Math.random() * 100000)}`

  // ✅ Ensure product is created before other tests
  test.beforeAll(async ({
    request
  }) => {
    const response = await request.post(`${API_BASE_URL}/${ACCOUNT_ID}/products`, {
      headers,
      data: {
        data: {
          attributes: {
            name: "Test Product",
            code: uniqueCode,
            url: "https://google.com",
            distributionStrategy: "OPEN",
            platforms: ["test"],
            metadata: {}
          },
          type: "products"
        }
      }
    })

    expect(response.status()).toBe(201)
    const responseBody = await response.json()
    productId = responseBody.data.id
  })

  // ✅ 1. Retrieve the created product
  test('Should retrieve the created product', async ({
    request
  }) => {
    expect(productId).toBeDefined() // Ensure productId is not undefined

    const response = await request.get(`${API_BASE_URL}/${ACCOUNT_ID}/products/${productId}`, {
      headers
    })
    expect(response.status()).toBe(200)

    const responseBody = await response.json()
    expect(responseBody.data.id).toBe(productId)
  })

  // ✅ 2. Update the product
  test('Should update the product', async ({
    request
  }) => {
    expect(productId).toBeDefined()

    const updatedName = "Updated Test Product"
    const response = await request.patch(`${API_BASE_URL}/${ACCOUNT_ID}/products/${productId}`, {
      headers,
      data: {
        data: {
          attributes: {
            name: updatedName,
          },
          type: "products"
        }
      }
    })

    expect(response.status()).toBe(200)
    const responseBody = await response.json()
    expect(responseBody.data.attributes.name).toBe(updatedName)
  })

  // ✅ 3. List all products
  test('Should list all products', async ({
    request
  }) => {
    const response = await request.get(`${API_BASE_URL}/${ACCOUNT_ID}/products`, {
      headers
    })
    expect(response.status()).toBe(200)

    const responseBody = await response.json()
    expect(responseBody).toHaveProperty("data")
    expect(Array.isArray(responseBody.data)).toBe(true)
  })

  // ✅ 4. Delete the product
  test('Should delete the product', async ({
    request
  }) => {
    expect(productId).toBeDefined()

    const response = await request.delete(`${API_BASE_URL}/${ACCOUNT_ID}/products/${productId}`, {
      headers
    })
    expect(response.status()).toBe(204)
  })

  // ❌ Negative Test Case: Retrieve a deleted product
  test('Should return 404 for a deleted product', async ({
    request
  }) => {
    expect(productId).toBeDefined()

    const response = await request.get(`${API_BASE_URL}/${ACCOUNT_ID}/products/${productId}`, {
      headers
    })
    expect(response.status()).toBe(404)
  })
})