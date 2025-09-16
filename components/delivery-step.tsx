"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useCartStore, type City } from "@/lib/store"
import { fetchCities } from "@/lib/data"
import { deliverySchema, type DeliveryFormData } from "@/lib/validation"
import { Loader2, Check, X, AlertCircle, Wifi, WifiOff } from "lucide-react"
import { cn } from "@/lib/utils"

interface DeliveryStepProps {
  onNext: () => void
  onBack: () => void
}

export function DeliveryStep({ onNext, onBack }: DeliveryStepProps) {
  const { checkoutData, updateCheckoutData } = useCartStore()
  const [cities, setCities] = useState<City[]>([])
  const [isLoadingCities, setIsLoadingCities] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedCity, setSelectedCity] = useState<City | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [citiesError, setCitiesError] = useState<string | null>(null)

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    trigger,
  } = useForm<DeliveryFormData>({
    resolver: zodResolver(deliverySchema),
    mode: "onChange",
    defaultValues: {
      cityId: checkoutData.cityId || undefined,
      deliveryType: checkoutData.deliveryType || undefined,
    },
  })

  const watchedCityId = watch("cityId")
  const watchedDeliveryType = watch("deliveryType")

  useEffect(() => {
    const loadCities = async () => {
      try {
        setIsLoadingCities(true)
        setCitiesError(null)

        // Simulate potential network failure (5% chance)
        if (Math.random() < 0.05) {
          throw new Error("Failed to load cities. Please check your connection and try again.")
        }

        const citiesData = await fetchCities()
        setCities(citiesData)

        if (checkoutData.cityId) {
          const city = citiesData.find((c) => c.id === checkoutData.cityId)
          setSelectedCity(city || null)
        }
      } catch (error) {
        console.error("Failed to fetch cities:", error)
        setCitiesError(error instanceof Error ? error.message : "Failed to load cities")
      } finally {
        setIsLoadingCities(false)
      }
    }

    loadCities()
  }, [checkoutData.cityId])

  useEffect(() => {
    if (watchedCityId) {
      const city = cities.find((c) => c.id === watchedCityId)
      setSelectedCity(city || null)
      setValue("deliveryType", undefined as any)
      trigger("deliveryType")
    }
  }, [watchedCityId, cities, setValue, trigger])

  const onSubmit = async (data: DeliveryFormData) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Validate that selected delivery type is available for the city
      const city = cities.find((c) => c.id === data.cityId)
      if (!city) {
        throw new Error("Selected city is no longer available")
      }

      const deliveryPrice = city.delivery[data.deliveryType]
      if (deliveryPrice === null) {
        throw new Error("Selected delivery type is not available for this city")
      }

      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate server-side validation errors (3% chance)
          if (Math.random() < 0.03) {
            reject(new Error("Delivery validation failed. Please try a different option."))
          } else {
            resolve(true)
          }
        }, 600)
      })

      updateCheckoutData({
        cityId: data.cityId,
        deliveryType: data.deliveryType,
      })
      onNext()
    } catch (error) {
      console.error("Delivery step validation failed:", error)
      setSubmitError(error instanceof Error ? error.message : "Validation failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getDeliveryOptions = () => {
    if (!selectedCity) return []

    return [
      {
        type: "fast" as const,
        label: "Fast",
        price: selectedCity.delivery.fast,
        available: selectedCity.delivery.fast !== null,
      },
      {
        type: "regular" as const,
        label: "Regular",
        price: selectedCity.delivery.regular,
        available: selectedCity.delivery.regular !== null,
      },
      {
        type: "slow" as const,
        label: "Slow",
        price: selectedCity.delivery.slow,
        available: selectedCity.delivery.slow !== null,
      },
    ]
  }

  const retryLoadCities = () => {
    setCitiesError(null)
    setIsLoadingCities(true)
    // Trigger useEffect to reload cities
    window.location.reload()
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
        <div>
          <Label htmlFor="city">City</Label>
          {isLoadingCities ? (
            <div className="flex items-center gap-2 p-3 border rounded-md">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-muted-foreground">Loading cities...</span>
            </div>
          ) : citiesError ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-3 border border-destructive rounded-md bg-destructive/5">
                <WifiOff className="h-4 w-4 text-destructive" />
                <span className="text-sm text-destructive">{citiesError}</span>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={retryLoadCities}>
                <Wifi className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          ) : (
            <Select
              value={watchedCityId?.toString() || ""}
              onValueChange={(value) => setValue("cityId", Number.parseInt(value))}
            >
              <SelectTrigger className={`w-full mt-2 ${errors.cityId ? "border-destructive focus:ring-destructive bg-black" : ""}`}>
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city.id} value={city.id.toString()}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {errors.cityId && (
            <p className="text-sm text-destructive mt-1 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.cityId.message}
            </p>
          )}
        </div>

        {selectedCity && (
          <div>
            <Label>Delivery type</Label>
            <RadioGroup
              value={watchedDeliveryType || ""}
              onValueChange={(value) => setValue("deliveryType", value as any)}
              className="mt-2"
            >
              <div className="grid grid-cols-3 gap-3">
                {getDeliveryOptions().map((option) => (
                  <div key={option.type}>
                    <div
                      className={cn(
                        "flex items-center space-x-3 p-4 border rounded-lg transition-colors",
                        !option.available && "opacity-50 cursor-not-allowed bg-muted/50",
                        option.available && watchedDeliveryType === option.type && "border-primary bg-primary/5",
                        option.available && watchedDeliveryType !== option.type && "hover:bg-muted/50",
                      )}
                    >
                      <RadioGroupItem
                        value={option.type}
                        id={option.type}
                        disabled={!option.available}
                        className={!option.available ? "opacity-50" : ""}
                      />
                      <div className="flex-1 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Label
                            htmlFor={option.type}
                            className={cn("font-medium cursor-pointer", !option.available && "cursor-not-allowed line-through")}
                          >
                            {option.label} - ${option.price || 0}
                          </Label>
                          {watchedDeliveryType === option.type && option.available && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>
            {errors.deliveryType && (
              <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.deliveryType.message}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <Button type="submit" disabled={isSubmitting || !selectedCity || citiesError !== null} className="w-full">
          {isSubmitting ? "Processing..." : "To summary"}
        </Button>
        <Button type="button" variant="outline" onClick={onBack} className="w-full bg-transparent">
          Back to information
        </Button>
      </div>
    </form>
  )
}
