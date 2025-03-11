import React from "react";
import { Separator } from "@/components/ui/separator";
import { CategoryItem } from "./category-item";
import { CategoryGroup as CategoryGroupType } from "../utils/category-grouper";

interface CategoryGroupProps {
   group: CategoryGroupType;
   groupIndex: number;
   activeCategory?: number;
   onCategoryClick: (categoryId: number) => void;
   onClose?: () => void;
}

export const CategoryGroup: React.FC<CategoryGroupProps> = ({
   group,
   groupIndex,
   activeCategory,
   onCategoryClick,
   onClose,
}) => (
   <div className="mb-6">
      {groupIndex > 0 && <Separator className="mb-4" />}
      <h3 className="text-sm font-medium text-muted-foreground mb-2">
         {group.name}
      </h3>
      <div className="space-y-1">
         {group.categories.map((category) => (
            <CategoryItem
               key={category.id}
               category={category}
               isActive={activeCategory === category.id}
               onClick={() => {
                  onCategoryClick(category.id);
                  if (onClose) onClose();
               }}
            />
         ))}
      </div>
   </div>
);
