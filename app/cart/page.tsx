"use client"

import { useCartStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, Plus, Minus } from "lucide-react"
import { useRouter } from "next/navigation"
import { UserInfo } from "@/components/user-info"
import Image from "next/image"
import { useHasHydrated } from "@/hooks/use-hydrated"

export default function CartPage() {
  const hasHydrated = useHasHydrated()
  const router = useRouter()
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore()

  const handleCheckout = () => {
    if (items.length === 0) return
    router.push("/checkout")
  }

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id)
    } else {
      updateQuantity(id, newQuantity)
    }
  }

  if (!hasHydrated) {
    return null
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto">
          <UserInfo />
          <Card className="p-8 text-center">
            <h1 className="text-3xl font-bold mb-4">Cart</h1>
            <p className="text-muted-foreground mb-6">Your cart is empty</p>
            <Button onClick={() => router.push("/")}>Continue Shopping</Button>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <UserInfo />
        <Card>
          <CardContent className="p-6">
            <h1 className="text-3xl font-bold mb-6">Cart</h1>

            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <Image
                      src={item.imageUrl || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate">
                      {item.name} - {item.price.toFixed(2)}$
                    </h3>
                    <p className="text-muted-foreground">By: {item.manufacturer}</p>

                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-lg">{(item.price * item.quantity).toFixed(2)}$</p>
                    <Button variant="outline" size="sm" onClick={() => removeItem(item.id)} className="mt-2">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-semibold">Total:</span>
                <span className="text-2xl font-bold">{getTotalPrice().toFixed(2)}$</span>
              </div>

              <Button onClick={handleCheckout} className="w-full" size="lg">
                Go to checkout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
