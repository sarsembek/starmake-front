export type Category = {
  id: number;
  name: string;
  name_rus: string;
  count_reels: number;
};

export interface UICategory extends Category {
  icon?: React.ReactNode;
}

export interface CategoryGroup {
  name: string;
  name_rus: string;
  categories: Category[];
}