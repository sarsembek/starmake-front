import { jwtVerify, SignJWT } from "jose";

// Define proper types for our session data
export interface SessionPayload {
   userId?: string;
   email?: string;
   name?: string;
   role?: string;
   iat?: number;
   exp?: number;
   [key: string]: unknown; // Allow for additional properties
}

// Use a strong secret key in production (store in environment variables)
const SECRET_KEY = new TextEncoder().encode(
   process.env.JWT_SECRET || "your_fallback_secret_key"
);

/**
 * Encrypts a payload into a JWT token
 * @param payload The data to encrypt in the token
 * @returns A promise that resolves to the JWT token string
 */
export async function encrypt(payload: SessionPayload): Promise<string> {
   return new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d") // Token expires in 7 days
      .sign(SECRET_KEY);
}

/**
 * Decrypts a JWT token and returns the payload
 * @param token The JWT token to decrypt
 * @returns A promise that resolves to the payload or null if invalid
 */
export async function decrypt(
   token: string | undefined
): Promise<SessionPayload | null> {
   if (!token) return null;

   try {
      const { payload } = await jwtVerify(token, SECRET_KEY);
      return payload as SessionPayload;
   } catch {
      // Error is intentionally unused, but we acknowledge it with underscore
      return null;
   }
}

/**
 * Sets the authentication cookie in the browser
 * @param token JWT token to store in the cookie
 */
export function setAuthCookie(token: string): void {
   // Client-side method to set auth cookie
   document.cookie = `auth_token=${token}; path=/; max-age=${
      7 * 24 * 60 * 60
   }; SameSite=Lax`;
}

/**
 * Removes the authentication cookie from the browser
 */
export function removeAuthCookie(): void {
   // Client-side method to remove auth cookie
   document.cookie =
      "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
}
