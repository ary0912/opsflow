export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("token")
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
  return Boolean(getAuthToken())
}
