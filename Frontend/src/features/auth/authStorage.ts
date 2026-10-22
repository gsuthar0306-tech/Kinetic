import type { AuthUser } from "@/features/auth/auth.types";

export function getAuthSession(): AuthUser | null {
  return null;
}

export function saveAuthSession(_user: AuthUser): void {
  // User information will be managed by AuthContext.
}

export function removeAuthSession(): void {
  // No authentication tokens or session data are stored in browser storage.
}

// import type { AuthSession } from "@/features/auth/auth.types";

// const SESSION_KEY = "kinetic-session";

// export function getAuthSession(): AuthSession | null {
//   const storedSession = sessionStorage.getItem(SESSION_KEY);

//   if (!storedSession) {
//     return null;
//   }

//   try {
//     return JSON.parse(storedSession) as AuthSession;
//   } catch {
//     sessionStorage.removeItem(SESSION_KEY);
//     return null;
//   }
// }

// export function saveAuthSession(session: AuthSession) {
//   sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
// }

// export function removeAuthSession() {
//   sessionStorage.removeItem(SESSION_KEY);
// }
