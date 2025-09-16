"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCartStore } from "@/lib/store"
import { getAuthenticatedUser } from "@/lib/data"

export default function HomePage() {
  const router = useRouter()
  const setUser = useCartStore((state) => state.setUser)

  useEffect(() => {
    const user = getAuthenticatedUser()
    setUser(user)

    router.push("/cart")
  }, [setUser, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        <p className="text-muted-foreground">Redirecting to cart...</p>
      </div>
    </div>
  )
}
