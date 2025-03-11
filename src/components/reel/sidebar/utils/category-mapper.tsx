import React from "react";
import { Hash } from "lucide-react";
import { Category, UICategory } from "@/types/reel/category.type";

/**
 * Convert API categories to UI categories with icons
 */
export const mapCategoriesToUI = (
   categories: Category[] | undefined
): UICategory[] => {
   if (!categories) return [];

   return categories.map((category) => ({
      ...category,
      icon: <Hash className="h-4 w-4" />,
   }));
};
