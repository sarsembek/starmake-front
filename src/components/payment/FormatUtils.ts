/**
 * Utility functions for formatting payment card data
 */

/**
 * Formats a credit card number by adding spaces after every 4 digits
 * @param value - The input string to format
 * @returns Formatted card number string with spaces (e.g., "1234 5678 9012 3456")
 */
export const formatCardNumber = (value: string): string => {
   // Remove all non-digit characters
   const digitsOnly = value.replace(/\D/g, "");

   // Insert space after every 4 digits
   const formatted = digitsOnly.replace(/(\d{4})(?=\d)/g, "$1 ");

   // Limit to 19 characters (16 digits + 3 spaces)
   return formatted.substring(0, 19);
};

/**
 * Formats an expiry date into MM/YY format
 * @param value - The input string to format
 * @returns Formatted expiry date string (e.g., "12/25")
 */
export const formatExpiryDate = (value: string): string => {
   // Remove all non-digit characters
   const digitsOnly = value.replace(/\D/g, "");

   // Insert slash after first 2 digits
   if (digitsOnly.length > 2) {
      return digitsOnly.substring(0, 2) + "/" + digitsOnly.substring(2, 4);
   }

   return digitsOnly;
};
