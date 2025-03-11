import { UICategory } from "@/types/reel/category.type";

// Define the structure for category groups
export const categoryGroupsMap = {
   "Экспертные видео": [
      "Бизнес",
      "Здоровье",
      "Спорт",
      "Красота",
      "Уход",
      "Путешествия",
      "Финансы",
      "Искусственный интеллект",
      "Психология",
      "Юриспруденция",
      "Маркетинг",
      "Видео/Фото",
      "SMM",
      "Ремонт и недвижимость",
      "Запуск курса",
      "Продажи",
      "Управление HR",
      "Обзоры гаджетов",
      "Наука",
      "Духовное развитие",
      "Рестораны и кулинария",
      "Лайфстайл",
   ],
   "Товары и одежда": [
      "Одежда и аксессуары",
      "Бижутерия и ювелирные изделия",
      "Товары для дома",
      "Косметика и уход",
      "Товары для детей",
      "Электроника и гаджеты",
      "Продукты питания",
      "Спортивные товары",
      "Подарки и сувениры",
      "Туристические товары",
      "Автомобильные товары",
      "Хобби и творчество",
      "Зоотовары",
      "Мебель и интерьер",
   ],
   Другое: ["Услуги", "Мероприятия", "Мемы приколы"],
};

export interface CategoryGroup {
   name: string;
   categories: UICategory[];
}

/**
 * Groups categories according to predefined category groups
 * And handles uncategorized items
 */
export const groupCategories = (categories: UICategory[]): CategoryGroup[] => {
   if (!categories.length) return [];

   // Create initial groups
   const groups = Object.entries(categoryGroupsMap).map(
      ([groupName, categoryNames]) => {
         const categoriesInGroup = categories.filter((cat) =>
            categoryNames.includes(cat.name_rus)
         );

         return {
            name: groupName,
            categories: categoriesInGroup,
         };
      }
   );

   // Handle uncategorized categories
   const categorizedIds = new Set(
      groups.flatMap((group) => group.categories.map((cat) => cat.id))
   );

   const uncategorized = categories.filter(
      (cat) => !categorizedIds.has(cat.id)
   );

   if (uncategorized.length > 0) {
      const otherGroupIndex = groups.findIndex(
         (group) => group.name === "Другое"
      );

      if (otherGroupIndex >= 0) {
         groups[otherGroupIndex].categories = [
            ...groups[otherGroupIndex].categories,
            ...uncategorized,
         ];
      } else {
         groups.push({
            name: "Другое",
            categories: uncategorized,
         });
      }
   }

   return groups;
};
