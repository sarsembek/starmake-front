/**
 * Generates a return URL with the current origin
 * @param path The path to redirect to after payment (without the origin)
 * @returns A complete return URL with origin
 */
export const getReturnUrl = (path: string = "/profile/plan"): string => {
   if (typeof window === "undefined") {
      // For server-side rendering, return a relative path
      return path;
   }

   // For client-side, include the origin
   const origin = window.location.origin;

   // Ensure the path starts with a slash
   const formattedPath = path.startsWith("/") ? path : `/${path}`;

   return `${origin}${formattedPath}`;
};

/**
 * Gets payment status from URL query parameters
 * @returns The payment status or null if not present
 */
export const getPaymentStatusFromUrl = (): string | null => {
   if (typeof window === "undefined") {
      return null;
   }

   const urlParams = new URLSearchParams(window.location.search);
   return urlParams.get("status");
};

/**
 * Cleans up payment status parameters from the URL
 */
export const cleanupPaymentParams = (): void => {
   if (typeof window === "undefined") {
      return;
   }

   window.history.replaceState({}, document.title, window.location.pathname);
};
