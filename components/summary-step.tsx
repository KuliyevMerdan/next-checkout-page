"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useCartStore, type City } from "@/lib/store"
import { fetchCities } from "@/lib/data"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { placeOrder } from "@/lib/orders"
import type { OrderData } from "@/lib/validation"

interface SummaryStepProps {
  onBack: () => void
}

export function SummaryStep({ onBack }: SummaryStepProps) {
  const router = useRouter()
  const { items, checkoutData, getTotalPrice, clearCart, setCurrentStep } = useCartStore()
  const [cities, setCities] = useState<City[]>([])
  const [isLoadingCities, setIsLoadingCities] = useState(true)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [orderError, setOrderError] = useState<string | null>(null)

  useEffect(() => {
    const loadCities = async () => {
      try {
        const citiesData = await fetchCities()
        setCities(citiesData)
      } catch (error) {
        console.error("Failed to fetch cities:", error)
      } finally {
        setIsLoadingCities(false)
      }
    }

    loadCities()
  }, [])

  const selectedCity = cities.find((c) => c.id === checkoutData.cityId)
  const deliveryPrice =
    selectedCity && checkoutData.deliveryType ? selectedCity.delivery[checkoutData.deliveryType] || 0 : 0
  const totalPrice = getTotalPrice()
  const finalTotal = totalPrice + deliveryPrice
  const deliveryLabel = checkoutData.deliveryType
    ? checkoutData.deliveryType.charAt(0).toUpperCase() + checkoutData.deliveryType.slice(1)
    : "Delivery"

  const handlePlaceOrder = async () => {
    if (!agreedToTerms) return

    setIsPlacingOrder(true)
    setOrderError(null)

    try {
      if (!checkoutData.cityId || !checkoutData.deliveryType) {
        throw new Error("Please select a city and delivery type.")
      }

      const orderData: OrderData = {
        customerInfo: {
          firstName: checkoutData.firstName,
          lastName: checkoutData.lastName,
          email: checkoutData.email,
        },
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          manufacturer: item.manufacturer,
          price: item.price,
          quantity: item.quantity,
        })),
        delivery: {
          cityId: checkoutData.cityId,
          deliveryType: checkoutData.deliveryType,
        },
        total: finalTotal,
      }

      const result = await placeOrder(orderData, { mock: true })

      if (!result.success) {
        throw new Error(result.error || "Failed to place order")
      }

      clearCart()
      // setCurrentStep(1)
      router.push("/success")
    } catch (error) {
      console.error("Order placement failed:", error)
      setOrderError(error instanceof Error ? error.message : "Failed to place order")
    } finally {
      setIsPlacingOrder(false)
    }
  }

  if (isLoadingCities) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading order summary...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Products</h3>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src={item.imageUrl || "/placeholder.svg"}
                  alt={item.name}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{item.name}</p>
                <p className="text-sm text-muted-foreground">By: {item.manufacturer}</p>
                {item.quantity > 1 && <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>}
              </div>
              <div className="text-right">
                <p className="font-medium">{(item.price * item.quantity).toFixed(2)}$</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Customer information</h3>
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-muted-foreground">First name</span>
            <p className="font-medium">{checkoutData.firstName}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Last name</span>
            <p className="font-medium">{checkoutData.lastName}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Email</span>
            <p className="font-medium">{checkoutData.email}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="terms"
          checked={agreedToTerms}
          onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
        />
        <label htmlFor="terms" className="text-sm cursor-pointer">
          I approve this information isn't real
        </label>
      </div>

      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between">
          <span>Products</span>
          <span>{totalPrice.toFixed(2)}$</span>
        </div>
        <div className="flex justify-between">
          <span>
            {deliveryLabel} delivery to <span className="font-bold">{selectedCity?.name ?? "-"}</span>
          </span>
          <span>{deliveryPrice.toFixed(2)}$</span>
        </div>
        <div className="flex justify-between text-xl font-bold pt-2">
          <span>Total</span>
          <span>{finalTotal.toFixed(2)}$</span>
        </div>
      </div>

      {orderError && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{orderError}</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <Button onClick={handlePlaceOrder} disabled={isPlacingOrder || !agreedToTerms} className="w-full">
          {isPlacingOrder ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Placing order...
            </>
          ) : (
            "Place an order"
          )}
        </Button>
        <Button type="button" variant="outline" onClick={onBack} className="w-full bg-transparent">
          Back to delivery
        </Button>
      </div>
    </div>
  )
}
