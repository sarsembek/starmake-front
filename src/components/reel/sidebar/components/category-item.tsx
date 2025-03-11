import React from "react";
import { Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UICategory } from "@/types/reel/category.type";

interface CategoryItemProps {
  category: UICategory;
  isActive: boolean;
  onClick: () => void;
}

export const CategoryItem: React.FC<CategoryItemProps> = ({ 
  category, 
  isActive, 
  onClick 
}) => (
  <Button
    variant="ghost"
    className={cn(
      "w-full justify-start gap-2 text-left font-normal",
      isActive && "bg-muted font-medium"
    )}
    onClick={onClick}
  >
    {category.icon || <Hash className="h-4 w-4" />}
    {category.name_rus}
    {category.count_reels !== undefined && (
      <span className="ml-auto text-xs text-muted-foreground">
        {category.count_reels}
      </span>
    )}
  </Button>
);