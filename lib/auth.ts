export type UserRole = "admin" | "agent"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  agentId?: string
}

// Default users for testing
export const defaultUsers = [
  {
    id: "1",
    email: "admin@yolodhub.com",
    password: "admin123", // In production, this should be hashed
    name: "YOLO Admin",
    role: "admin" as UserRole,
  },
  {
    id: "2",
    email: "agent@yolodhub.com",
    password: "agent123", // In production, this should be hashed
    name: "YOLO Agent #1",
    role: "agent" as UserRole,
    agentId: "AGT001234",
  },
]

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const user = defaultUsers.find((u) => u.email === email && u.password === password)
  if (!user) return null

  // Don't send password back
  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}

// Add logout function
export function logoutUser() {
  localStorage.removeItem("user")
}

