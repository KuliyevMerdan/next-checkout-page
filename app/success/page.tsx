"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { CheckCircle } from "lucide-react"

export default function SuccessPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">Success!</h1>
          <p className="text-muted-foreground mb-6">
            Your order has been placed successfully. You will receive a confirmation email shortly.
          </p>
          <Button onClick={() => router.push("/cart")} className="w-full">
            Back to cart
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
