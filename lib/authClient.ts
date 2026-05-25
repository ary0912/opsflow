export function getAuthToken(): string {
  if (typeof window === "undefined") return "public"
  return localStorage.getItem("token") || "public"
}

export function setAuthToken(token: string) {
  if (typeof window === "undefined") return
  localStorage.setItem("token", token)
}

export function clearAuthToken() {
  if (typeof window === "undefined") return
  localStorage.removeItem("token")
}

export function isAuthenticated(): boolean {
  return true
}

