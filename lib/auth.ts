import type { User } from "./store"

// Simulate different user scenarios for testing
const mockUsers: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
  },
  {
    id: 3,
    name: "Donald McDuck",
    email: "donald@mcduck.com",
  },
]

export const getServerSideUser = async (): Promise<User | null> => {
  await new Promise((resolve) => setTimeout(resolve, 100))

  // For demo purposes, randomly return a user or null
  const randomIndex = Math.floor(Math.random() * (mockUsers.length + 1))

  if (randomIndex === mockUsers.length) {
    return null 
  }

  return mockUsers[randomIndex]
}

export const getCurrentUser = (): User | null => {
  return mockUsers[2]
}

export const simulateLogin = async (email: string, password: string): Promise<User> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const user = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase())

  if (!user) {
    throw new Error("User not found")
  }

  // For demo purposes, accept any password
  return user
}

export const simulateLogout = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  console.log("User logged out")
}
