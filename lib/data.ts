import type { City } from "./store"
import { getCurrentUser } from "./auth"

export const cities: City[] = [
  {
    id: 1,
    name: "New York",
    delivery: { fast: 40, regular: 20, slow: 0 }
  },
  {
    id: 2,
    name: "Los Angeles",
    delivery: { fast: null, regular: 25, slow: 5 }
  },
  {
    id: 3,
    name: "Chicago",
    delivery: { fast: 35, regular: null, slow: 0 }
  },
  {
    id: 4,
    name: "Houston",
    delivery: { fast: 50, regular: 30, slow: null }
  },
  {
    id: 5,
    name: "Miami",
    delivery: { fast: null, regular: 22, slow: 10 }
  },
  {
    id: 6,
    name: "San Francisco",
    delivery: { fast: 45, regular: null, slow: null }
  },
  {
    id: 7,
    name: "Boston",
    delivery: { fast: 38, regular: 18, slow: 0 }
  },
  {
    id: 8,
    name: "Seattle",
    delivery: { fast: null, regular: 28, slow: 0 }
  },
  {
    id: 9,
    name: "Denver",
    delivery: { fast: 42, regular: 21, slow: 0 }
  },
  {
    id: 10,
    name: "Atlanta",
    delivery: { fast: 36, regular: null, slow: 30 }
  }
];


export const fetchCities = async (): Promise<City[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return cities
}

// Simulate authenticated user (SSR simulation)
export const getAuthenticatedUser = () => {
  return getCurrentUser()
}
