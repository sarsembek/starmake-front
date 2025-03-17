import React from "react";
import {
   // Expert video icons
   Briefcase, // Business
   Heart, // Health
   Dumbbell, // Sports
   Sparkles, // Beauty
   Snowflake, // Care
   Plane, // Travel
   DollarSign, // Finance
   Cpu, // AI
   Brain, // Psychology
   Scale, // Jurisprudence
   BarChart2, // Marketing
   Camera, // Video/Photo
   Share2, // SMM
   Home, // Repair and Real Estate
   Rocket, // Course Launch
   ShoppingCart, // Sales
   Users, // HR Management
   Smartphone, // Gadget Reviews
   FlaskConical, // Science
   Flower2, // Spiritual Development
   UtensilsCrossed, // Restaurants and Culinary
   Coffee, // Lifestyle

   // Goods and clothing icons
   Shirt, // Clothing and Accessories
   Gem, // Jewelry
   Sofa, // Home Goods
   Brush, // Cosmetics and Care
   Baby, // Children's Goods
   Laptop, // Electronics and Gadgets
   Apple, // Food Products
   Medal, // Sporting Goods
   Gift, // Gifts and Souvenirs
   Compass, // Tourist Goods
   Car, // Automotive Goods
   Palette, // Hobbies and Creativity
   Dog, // Pet Supplies
   LampDesk, // Furniture and Interior

   // Other icons
   Bell, // Services
   CalendarDays, // Events
   Laugh, // Memes Jokes
   MoreHorizontal, // Other

   // Additional icons
   GraduationCap, // Education
   Film, // Entertainment
   HelpCircle, // Uncategorized
   Hash, // Fallback
} from "lucide-react";

import { Category, UICategory } from "@/types/reel/category.type";

// Map of category names to their corresponding icons
const categoryIconMap: Record<string, React.ReactNode> = {
   // Expert videos
   Бизнес: <Briefcase className="h-4 w-4" />,
   Здоровье: <Heart className="h-4 w-4" />,
   Спорт: <Dumbbell className="h-4 w-4" />,
   Красота: <Sparkles className="h-4 w-4" />,
   Уход: <Snowflake className="h-4 w-4" />,
   Путешествия: <Plane className="h-4 w-4" />,
   Финансы: <DollarSign className="h-4 w-4" />,
   "Искусственный интеллект": <Cpu className="h-4 w-4" />,
   Психология: <Brain className="h-4 w-4" />,
   Юриспруденция: <Scale className="h-4 w-4" />,
   Маркетинг: <BarChart2 className="h-4 w-4" />,
   "Видео/Фото": <Camera className="h-4 w-4" />,
   SMM: <Share2 className="h-4 w-4" />,
   "Ремонт и недвижимость": <Home className="h-4 w-4" />,
   "Запуск курса": <Rocket className="h-4 w-4" />,
   Продажи: <ShoppingCart className="h-4 w-4" />,
   "Управление HR": <Users className="h-4 w-4" />,
   "Обзоры гаджетов": <Smartphone className="h-4 w-4" />,
   Наука: <FlaskConical className="h-4 w-4" />,
   "Духовное развитие": <Flower2 className="h-4 w-4" />,
   "Рестораны и кулинария": <UtensilsCrossed className="h-4 w-4" />,
   Лайфстайл: <Coffee className="h-4 w-4" />,

   // Goods and clothing
   "Одежда и аксессуары": <Shirt className="h-4 w-4" />,
   "Бижутерия и ювелирные изделия": <Gem className="h-4 w-4" />,
   "Товары для дома": <Sofa className="h-4 w-4" />,
   "Косметика и уход": <Brush className="h-4 w-4" />,
   "Товары для детей": <Baby className="h-4 w-4" />,
   "Электроника и гаджеты": <Laptop className="h-4 w-4" />,
   "Продукты питания": <Apple className="h-4 w-4" />,
   "Спортивные товары": <Medal className="h-4 w-4" />,
   "Подарки и сувениры": <Gift className="h-4 w-4" />,
   "Туристические товары": <Compass className="h-4 w-4" />,
   "Автомобильные товары": <Car className="h-4 w-4" />,
   "Хобби и творчество": <Palette className="h-4 w-4" />,
   Зоотовары: <Dog className="h-4 w-4" />,
   "Мебель и интерьер": <LampDesk className="h-4 w-4" />,

   // Other
   Услуги: <Bell className="h-4 w-4" />,
   Мероприятия: <CalendarDays className="h-4 w-4" />,
   "Мемы приколы": <Laugh className="h-4 w-4" />,
   Другое: <MoreHorizontal className="h-4 w-4" />,

   // Additional categories
   Образование: <GraduationCap className="h-4 w-4" />,
   Развлечения: <Film className="h-4 w-4" />,
   "Без категории": <HelpCircle className="h-4 w-4" />,
};

/**
 * Convert API categories to UI categories with appropriate icons
 */
export const mapCategoriesToUI = (
   categories: Category[] | undefined
): UICategory[] => {
   if (!categories) return [];

   return categories.map((category) => ({
      ...category,
      icon: categoryIconMap[category.name_rus] || <Hash className="h-4 w-4" />,
   }));
};
