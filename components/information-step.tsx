"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useCartStore } from "@/lib/store"
import { informationSchema, type InformationFormData } from "@/lib/validation"
import { AlertCircle } from "lucide-react"

interface InformationStepProps {
  onNext: () => void
  onBack: () => void
}

export function InformationStep({ onNext, onBack }: InformationStepProps) {
  const { checkoutData, updateCheckoutData, user } = useCartStore()
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
    setValue,
    trigger,
  } = useForm<InformationFormData>({
    resolver: zodResolver(informationSchema),
    mode: "onBlur", 
    defaultValues: {
      firstName: checkoutData.firstName,
      lastName: checkoutData.lastName,
      email: checkoutData.email,
    },
  })

  useEffect(() => {
    if (user && !checkoutData.firstName && !checkoutData.lastName && !checkoutData.email) {
      const [firstName, lastName] = user.name.split(" ")
      setValue("firstName", firstName || "")
      setValue("lastName", lastName || "")
      setValue("email", user.email)
      updateCheckoutData({
        firstName: firstName || "",
        lastName: lastName || "",
        email: user.email,
      })
      // Trigger validation for pre-filled fields
      trigger()
    }
  }, [user, checkoutData, setValue, updateCheckoutData, trigger])

  const onSubmit = async (data: InformationFormData) => {
    setIsLoading(true)
    setSubmitError(null)

    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate server-side validation errors (5% chance)
          if (Math.random() < 0.05) {
            reject(new Error("Server validation failed. Please check your information and try again."))
          } else {
            resolve(true)
          }
        }, 800)
      })

      updateCheckoutData(data)
      onNext()
    } catch (error) {
      console.error("[v0] Information step validation failed:", error)
      setSubmitError(error instanceof Error ? error.message : "Validation failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {submitError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First name</Label>
          <Input
            id="firstName"
            {...register("firstName")}
            className={errors.firstName ? "border-destructive focus-visible:ring-destructive" : ""}
            placeholder="Enter your first name"
          />
          {errors.firstName && (
            <p className="text-sm text-destructive mt-1 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last name</Label>
          <Input
            id="lastName"
            {...register("lastName")}
            className={errors.lastName ? "border-destructive focus-visible:ring-destructive" : ""}
            placeholder="Enter your last name"
          />
          {errors.lastName && (
            <p className="text-sm text-destructive mt-1 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.lastName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
            placeholder="Enter your email address"
          />
          {errors.email && (
            <p className="text-sm text-destructive mt-1 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Button type="submit" disabled={isLoading || !isValid} className="w-full">
          {isLoading ? "Validating..." : "To delivery step"}
        </Button>
        <Button type="button" variant="outline" onClick={onBack} className="w-full bg-transparent">
          Back to cart
        </Button>
      </div>
    </form>
  )
}
