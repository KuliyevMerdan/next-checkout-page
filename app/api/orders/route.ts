import { type NextRequest, NextResponse } from "next/server"
import { orderSchema } from "@/lib/validation"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const validationResult = orderSchema.safeParse(body)
    if (!validationResult.success) {
      console.error("[v0] Order validation failed:", validationResult.error.errors)
      return NextResponse.json(
        {
          error: "Invalid order data",
          details: validationResult.error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 },
      )
    }

    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Simulate various API failures for testing
    const random = Math.random()
    if (random < 0.05) {
      return NextResponse.json(
        { error: "Payment processing failed. Please check your payment method and try again." },
        { status: 400 },
      )
    } else if (random < 0.08) {
      return NextResponse.json(
        { error: "Inventory check failed. Some items may no longer be available." },
        { status: 409 },
      )
    } else if (random < 0.1) {
      return NextResponse.json(
        { error: "Service temporarily unavailable. Please try again in a few moments." },
        { status: 503 },
      )
    }

    // Simulate successful order creation
    const orderId = Math.random().toString(36).substr(2, 9).toUpperCase()

    console.log("[v0] Order placed successfully:", {
      orderId,
      customerInfo: body.customerInfo,
      items: body.items,
      delivery: body.delivery,
      total: body.total,
    })

    return NextResponse.json({
      success: true,
      orderId,
      message: "Order placed successfully!",
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 7 days from now
    })
  } catch (error) {
    console.error("Order API error:", error)
    return NextResponse.json({ error: "Internal server error. Please try again later." }, { status: 500 })
  }
}
