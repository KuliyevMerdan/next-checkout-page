import type { OrderData } from "./validation"

export interface PlaceOrderSuccess {
  success: true
  orderId: string
  message: string
  estimatedDelivery: string
}

export interface PlaceOrderError {
  success: false
  error: string
}

export type PlaceOrderResult = PlaceOrderSuccess | PlaceOrderError

interface PlaceOrderOptions {
  mock?: boolean
  delayMs?: number
}

// Mocked order placement. If mock=false, falls back to API call.
export async function placeOrder(order: OrderData, options: PlaceOrderOptions = {}): Promise<PlaceOrderResult> {
  const { mock = true, delayMs = 1200 } = options

  if (mock) {
    await new Promise((resolve) => setTimeout(resolve, delayMs))

    // Simulate occasional failures
    const random = Math.random()
    if (random < 0.05) {
      return { success: false, error: "Payment processing failed. Please try again." }
    }
    if (random < 0.08) {
      return { success: false, error: "Inventory check failed. Item unavailable." }
    }

    const orderId = Math.random().toString(36).substr(2, 9).toUpperCase()
    return {
      success: true,
      orderId,
      message: "Order placed successfully!",
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    }
  }

  // Real API call fallback
  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    })
    const json = await response.json()
    if (!response.ok) {
      return { success: false, error: json?.error ?? "Failed to place order" }
    }
    return {
      success: true,
      orderId: json.orderId,
      message: json.message,
      estimatedDelivery: json.estimatedDelivery,
    }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Network error" }
  }
}


