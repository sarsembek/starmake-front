/**
 * Generic paginated response interface used across all API responses
 * that return paginated data
 */
export interface PaginatedResponse<T> {
   items: T[];
   total: number;
   page: number;
   size: number;
   pages: number;
   links: {
      first: string;
      last: string;
      self: string;
      next: string | null;
      prev: string | null;
   };
}
