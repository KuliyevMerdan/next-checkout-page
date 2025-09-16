"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCartStore } from "@/lib/store"
import { Card, CardContent } from "@/components/ui/card"
import { CheckoutSteps } from "@/components/checkout-steps"
import { InformationStep } from "@/components/information-step"
import { DeliveryStep } from "@/components/delivery-step"
import { SummaryStep } from "@/components/summary-step"
import { useHasHydrated } from "@/hooks/use-hydrated"

const steps = ["Information", "Delivery", "Summary"]

export default function CheckoutPage() {
  const hasHydrated = useHasHydrated()
  const router = useRouter()
  const { items, currentStep, setCurrentStep } = useCartStore()

  const handleNext = () => {
    setCurrentStep(currentStep + 1)
  }

  const handleBack = () => {
    if (currentStep === 1) {
      router.push("/cart")
    } else {
      setCurrentStep(currentStep - 1)
    }
  }

  if (!hasHydrated) {
    return null
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>

            <CheckoutSteps currentStep={currentStep} steps={steps} />

            {currentStep === 1 && <InformationStep onNext={handleNext} onBack={handleBack} />}

            {currentStep === 2 && <DeliveryStep onNext={handleNext} onBack={handleBack} />}

            {currentStep === 3 && <SummaryStep onBack={handleBack} />}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
