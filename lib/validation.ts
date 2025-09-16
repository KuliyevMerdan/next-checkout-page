import * as z from "zod"

// Information step validation schema
export const informationSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "First name can only contain letters, spaces, hyphens, and apostrophes"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Last name can only contain letters, spaces, hyphens, and apostrophes"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(100, "Email must be less than 100 characters"),
})

// Delivery step validation schema
export const deliverySchema = z.object({
  cityId: z.number().min(1, "Please select a city"),
  deliveryType: z.enum(["fast", "regular", "slow"], {
    required_error: "Please select a delivery type",
  }),
})

// Order validation schema
export const orderSchema = z.object({
  customerInfo: informationSchema,
  delivery: deliverySchema,
  items: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
        manufacturer: z.string(),
        price: z.number().positive(),
        quantity: z.number().positive(),
      }),
    )
    .min(1, "Cart cannot be empty"),
  total: z.number().positive("Total must be greater than 0"),
})

export type InformationFormData = z.infer<typeof informationSchema>
export type DeliveryFormData = z.infer<typeof deliverySchema>
export type OrderData = z.infer<typeof orderSchema>

// Custom validation functions
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validateName = (name: string): boolean => {
  const nameRegex = /^[a-zA-Z\s'-]+$/
  return nameRegex.test(name) && name.trim().length >= 2
}

// Error message helpers
export const getFieldError = (errors: any, fieldName: string): string | undefined => {
  return errors[fieldName]?.message
}

export const hasFieldError = (errors: any, fieldName: string): boolean => {
  return !!errors[fieldName]
}
