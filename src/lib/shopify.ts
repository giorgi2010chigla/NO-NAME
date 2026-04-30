// Shopify Storefront API Client Configuration
// Documentation: https://shopify.dev/docs/api/storefront

const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN
const SHOPIFY_STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN

export const SHOPIFY_API_URL = `https://${SHOPIFY_DOMAIN}/api/2024-10/graphql.json`

export const isShopifyConfigured = Boolean(SHOPIFY_DOMAIN && SHOPIFY_STOREFRONT_TOKEN)

export interface ShopifyProduct {
  id: string
  title: string
  handle: string
  description: string
  priceRange: {
    minVariantPrice: {
      amount: string
      currencyCode: string
    }
  }
  images: {
    edges: Array<{
      node: {
        url: string
        altText: string | null
      }
    }>
  }
  variants: {
    edges: Array<{
      node: {
        id: string
        title: string
        price: {
          amount: string
          currencyCode: string
        }
        availableForSale: boolean
      }
    }>
  }
}

export interface ShopifyCart {
  id: string
  checkoutUrl: string
  totalQuantity: number
  cost: {
    totalAmount: {
      amount: string
      currencyCode: string
    }
    subtotalAmount: {
      amount: string
      currencyCode: string
    }
  }
  lines: {
    edges: Array<{
      node: {
        id: string
        quantity: number
        merchandise: {
          id: string
          title: string
          product: {
            title: string
            images: {
              edges: Array<{
                node: {
                  url: string
                }
              }>
            }
          }
          price: {
            amount: string
            currencyCode: string
          }
        }
      }
    }>
  }
}

// GraphQL fetch helper
export async function shopifyFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  if (!isShopifyConfigured) {
    throw new Error("Shopify Storefront API is not configured. Please set VITE_SHOPIFY_STORE_DOMAIN and VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN in your .env file.")
  }

  const response = await fetch(SHOPIFY_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  })

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.status} ${response.statusText}`)
  }

  const json = await response.json()

  if (json.errors) {
    throw new Error(`Shopify GraphQL error: ${JSON.stringify(json.errors)}`)
  }

  return json.data
}

// Create a new cart
export async function createCart(): Promise<ShopifyCart> {
  const query = `
    mutation createCart {
      cartCreate {
        cart {
          id
          checkoutUrl
          totalQuantity
          cost {
            totalAmount { amount currencyCode }
            subtotalAmount { amount currencyCode }
          }
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price { amount currencyCode }
                    product {
                      title
                      images(first: 1) {
                        edges { node { url } }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `

  const data = await shopifyFetch<{ cartCreate: { cart: ShopifyCart } }>(query)
  return data.cartCreate.cart
}

// Add item to cart
export async function addToCart(cartId: string, variantId: string, quantity: number = 1): Promise<ShopifyCart> {
  const query = `
    mutation addToCart($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          totalQuantity
          cost {
            totalAmount { amount currencyCode }
            subtotalAmount { amount currencyCode }
          }
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price { amount currencyCode }
                    product {
                      title
                      images(first: 1) {
                        edges { node { url } }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `

  const data = await shopifyFetch<{ cartLinesAdd: { cart: ShopifyCart } }>(query, {
    cartId,
    lines: [{ merchandiseId: variantId, quantity }],
  })
  return data.cartLinesAdd.cart
}

// Update cart item quantity
export async function updateCartLine(cartId: string, lineId: string, quantity: number): Promise<ShopifyCart> {
  const query = `
    mutation updateCartLine($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          totalQuantity
          cost {
            totalAmount { amount currencyCode }
            subtotalAmount { amount currencyCode }
          }
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price { amount currencyCode }
                    product {
                      title
                      images(first: 1) {
                        edges { node { url } }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `

  const data = await shopifyFetch<{ cartLinesUpdate: { cart: ShopifyCart } }>(query, {
    cartId,
    lines: [{ id: lineId, quantity }],
  })
  return data.cartLinesUpdate.cart
}

// Remove item from cart
export async function removeFromCart(cartId: string, lineIds: string[]): Promise<ShopifyCart> {
  const query = `
    mutation removeFromCart($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
          checkoutUrl
          totalQuantity
          cost {
            totalAmount { amount currencyCode }
            subtotalAmount { amount currencyCode }
          }
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price { amount currencyCode }
                    product {
                      title
                      images(first: 1) {
                        edges { node { url } }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `

  const data = await shopifyFetch<{ cartLinesRemove: { cart: ShopifyCart } }>(query, {
    cartId,
    lineIds,
  })
  return data.cartLinesRemove.cart
}

// Get cart by ID
export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const query = `
    query getCart($cartId: ID!) {
      cart(id: $cartId) {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount { amount currencyCode }
          subtotalAmount { amount currencyCode }
        }
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price { amount currencyCode }
                  product {
                    title
                    images(first: 1) {
                      edges { node { url } }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `

  try {
    const data = await shopifyFetch<{ cart: ShopifyCart | null }>(query, { cartId })
    return data.cart
  } catch {
    return null
  }
}

// Get products
export async function getProducts(first: number = 20): Promise<ShopifyProduct[]> {
  const query = `
    query getProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
            description
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  price { amount currencyCode }
                  availableForSale
                }
              }
            }
          }
        }
      }
    }
  `

  const data = await shopifyFetch<{ products: { edges: Array<{ node: ShopifyProduct }> } }>(query, { first })
  return data.products.edges.map((edge) => edge.node)
}

// Get product by handle
export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const query = `
    query getProduct($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        handle
        description
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 10) {
          edges {
            node {
              url
              altText
            }
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              price { amount currencyCode }
              availableForSale
            }
          }
        }
      }
    }
  `

  try {
    const data = await shopifyFetch<{ productByHandle: ShopifyProduct | null }>(query, { handle })
    return data.productByHandle
  } catch {
    return null
  }
}

// Redirect to Shopify checkout
export function redirectToCheckout(cart: ShopifyCart): void {
  if (!cart.checkoutUrl) {
    throw new Error("Checkout URL not available")
  }
  window.location.href = cart.checkoutUrl
}