"use client";

import { useState, useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { User } from "@/types/auth/auth.type";
import { useFavoriteReels } from "@/hooks/reels/useFavoriteReels";
import { ReelCard } from "@/components/reel/reel-card/reel-card";
import { VideoProvider } from "@/context/VideoContext";
import {
   Pagination,
   PaginationContent,
   PaginationEllipsis,
   PaginationItem,
   PaginationLink,
   PaginationNext,
   PaginationPrevious,
} from "@/components/ui/pagination";
import { PromoCodeForm } from "@/components/profile/PromoCodeForm";
import { UserScenarios } from "@/components/profile/UserScenarios";
import { useSearchParams } from "next/navigation";

// Define number of items per page
const ITEMS_PER_PAGE = 12;

export default function ProfilePage() {
   // Add search params to handle tab selection from URL
   const searchParams = useSearchParams();
   const tabParam = searchParams.get("tab");

   // Fetch user profile from API
   const { data: apiUser, isLoading, error } = useProfile();

   // Current page state for favorites pagination
   const [currentPage, setCurrentPage] = useState(1);

   // Fetch favorites with pagination
   const { data: favoriteReelsData, isLoading: loadingFavorites } =
      useFavoriteReels(currentPage, ITEMS_PER_PAGE);

   // Fallback to localStorage if API fails
   const [user, setUser] = useState<User | null>(null);

   // Form state
   const [formData, setFormData] = useState({
      email: "",
      name_tg: "",
      email_tg: "",
      instagram: "",
   });

   // For mobile detection
   const [isMobile, setIsMobile] = useState(false);

   // Detect screen size
   useEffect(() => {
      const checkIfMobile = () => {
         setIsMobile(window.innerWidth < 768);
      };

      // Set initial value
      checkIfMobile();

      // Add window resize listener
      window.addEventListener("resize", checkIfMobile);

      return () => {
         window.removeEventListener("resize", checkIfMobile);
      };
   }, []);

   // Initialize user data from API or localStorage
   useEffect(() => {
      if (apiUser) {
         // If API returns data, use it
         setUser(apiUser);
         setFormData({
            email: apiUser.email || "",
            name_tg: apiUser.name_tg || "",
            email_tg: apiUser.email_tg || "",
            instagram: apiUser.instagram || "",
         });
      } else if (error) {
         // If API fails, try to get from localStorage
         try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
               const parsedUser = JSON.parse(storedUser) as User;
               setUser(parsedUser);
               setFormData({
                  email: parsedUser.email || "",
                  name_tg: parsedUser.name_tg || "",
                  email_tg: parsedUser.email_tg || "",
                  instagram: parsedUser.instagram || "",
               });
            }
         } catch (localError) {
            console.error("Failed to load user from localStorage:", localError);
         }
      }
   }, [apiUser, error]);

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { id, value } = e.target;
      // Extract main ID without potential suffix (for mobile/desktop variants)
      const mainId = id.split("-")[0];
      setFormData((prev) => ({
         ...prev,
         [mainId]: value,
      }));
   };

   const handleSaveChanges = async () => {
      if (!user) return;

      // Update user object with form data
      const updatedUser = {
         ...user,
         ...formData,
      };

      // Save to localStorage as backup
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      // Here you would typically send the updated profile to your API
      // For now, we'll just log it
      console.log("Profile updated:", updatedUser);
   };

   // Handle page change for favorites pagination
   const handlePageChange = (page: number) => {
      setCurrentPage(page);
      // Scroll to top of favorites section
      document.querySelector('[data-value="favorites"]')?.scrollIntoView({
         behavior: "smooth",
         block: "start",
      });
   };

   // Function to generate pagination items
   const renderPaginationItems = () => {
      const totalPages = favoriteReelsData?.pages || 1;

      // For small number of pages, show all of them
      if (totalPages <= 5) {
         return Array.from({ length: totalPages }, (_, i) => (
            <PaginationItem key={i + 1}>
               <PaginationLink
                  isActive={currentPage === i + 1}
                  onClick={() => handlePageChange(i + 1)}
               >
                  {i + 1}
               </PaginationLink>
            </PaginationItem>
         ));
      }

      // For larger number of pages, show a limited set with ellipsis
      const items = [];

      // Always show the first page
      items.push(
         <PaginationItem key={1}>
            <PaginationLink
               isActive={currentPage === 1}
               onClick={() => handlePageChange(1)}
            >
               1
            </PaginationLink>
         </PaginationItem>
      );

      // Show ellipsis if current page is far from the first page
      if (currentPage > 3) {
         items.push(<PaginationEllipsis key="start-ellipsis" />);
      }

      // Show pages around the current page
      for (
         let i = Math.max(2, currentPage - 1);
         i <= Math.min(totalPages - 1, currentPage + 1);
         i++
      ) {
         items.push(
            <PaginationItem key={i}>
               <PaginationLink
                  isActive={currentPage === i}
                  onClick={() => handlePageChange(i)}
               >
                  {i}
               </PaginationLink>
            </PaginationItem>
         );
      }

      // Show ellipsis if current page is far from the last page
      if (currentPage < totalPages - 2) {
         items.push(<PaginationEllipsis key="end-ellipsis" />);
      }

      // Always show the last page
      items.push(
         <PaginationItem key={totalPages}>
            <PaginationLink
               isActive={currentPage === totalPages}
               onClick={() => handlePageChange(totalPages)}
            >
               {totalPages}
            </PaginationLink>
         </PaginationItem>
      );

      return items;
   };

   // Format dates with error handling
   const formatDate = (dateString?: string) => {
      if (!dateString) return "Not specified";
      try {
         return format(new Date(dateString), "dd.MM.yyyy");
      } catch {
         return "Invalid date";
      }
   };

   // Determine default tab based on URL parameter, mobile state, and allowed values
   const getDefaultTab = () => {
      if (tabParam) {
         // Only accept valid tab values
         if (["profile", "favorites", "scenarios"].includes(tabParam)) {
            // If on mobile and trying to access profile tab, default to favorites
            if (isMobile && tabParam === "profile") {
               return "favorites";
            }
            return tabParam;
         }
      }

      // Default behavior if no valid tab parameter
      return isMobile ? "favorites" : "profile";
   };

   // Show loading state
   if (isLoading || !user) {
      return (
         <div className="container mx-auto py-8 px-4 min-h-[80vh] flex items-center justify-center">
            <div className="text-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
               <p className="mt-4">Загружаем ваши данные...</p>
            </div>
         </div>
      );
   }

   return (
      <VideoProvider>
         <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-6">Профиль</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {/* Profile Summary Card */}
               <Card className="md:col-span-1">
                  <CardHeader>
                     <div className="flex flex-col items-center">
                        <Avatar className="h-24 w-24 mb-4">
                           <AvatarImage
                              src={`/placeholder.svg?height=96&width=96`}
                              alt={user.name_tg || "User"}
                           />
                           <AvatarFallback className="text-xl">
                              {(
                                 user.name_tg?.substring(0, 2) || "UN"
                              ).toUpperCase()}
                           </AvatarFallback>
                        </Avatar>
                        <CardTitle className="text-center">
                           {user.name_tg || "User"}
                        </CardTitle>
                        <CardDescription className="text-center">
                           {user.email}
                        </CardDescription>
                     </div>
                  </CardHeader>
                  <CardContent>
                     <div className="space-y-4">
                        <div className="flex items-center justify-between">
                           <span className="text-sm font-medium">План:</span>
                           <Badge variant="outline" className="capitalize">
                              {user.plan_type || "Basic"}
                           </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                           <span className="text-sm font-medium">Статус:</span>
                           <Badge
                              variant={
                                 user.subscription_expired
                                    ? "destructive"
                                    : "default"
                              }
                           >
                              {user.subscription_expired ? "Истек" : "Активен"}
                           </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                           <span className="text-sm font-medium">
                              Осталось дней:
                           </span>
                           <span>{user.left_days || 0}</span>
                        </div>

                        <div className="flex items-center justify-between">
                           <span className="text-sm font-medium">Роль:</span>
                           <span className="capitalize">
                              {user.role || "user"}
                           </span>
                        </div>
                     </div>
                  </CardContent>
                  <CardFooter>
                     <Button className="w-full">Обновить план</Button>
                  </CardFooter>
               </Card>

               {/* Main Content Area */}
               <div className="md:col-span-2">
                  {/* Profile Section for Mobile (always visible on mobile) */}
                  {isMobile && (
                     <div className="mb-6">
                        <Card>
                           <CardHeader>
                              <CardTitle>Информация профиля</CardTitle>
                              <CardDescription>
                                 Управляйте своей личной информацией
                              </CardDescription>
                           </CardHeader>
                           <CardContent className="space-y-4">
                              <div className="space-y-2">
                                 <Label htmlFor="email-mobile">Email</Label>
                                 <Input
                                    id="email-mobile"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                 />
                              </div>

                              <div className="space-y-2">
                                 <Label htmlFor="name_tg-mobile">
                                    Имя в Telegram
                                 </Label>
                                 <Input
                                    id="name_tg-mobile"
                                    value={formData.name_tg}
                                    onChange={handleInputChange}
                                 />
                              </div>

                              <div className="space-y-2">
                                 <Label htmlFor="email_tg-mobile">
                                    Email в Telegram
                                 </Label>
                                 <Input
                                    id="email_tg-mobile"
                                    value={formData.email_tg}
                                    onChange={handleInputChange}
                                 />
                              </div>

                              <div className="space-y-2">
                                 <Label htmlFor="instagram-mobile">
                                    Instagram
                                 </Label>
                                 <Input
                                    id="instagram-mobile"
                                    value={formData.instagram}
                                    onChange={handleInputChange}
                                 />
                              </div>

                              <div className="space-y-2">
                                 <Label htmlFor="start_date-mobile">
                                    Дата начала подписки
                                 </Label>
                                 <div className="flex items-center border rounded-md px-3 py-2">
                                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span>{formatDate(user.start_date)}</span>
                                 </div>
                              </div>

                              <div className="space-y-2">
                                 <Label htmlFor="end_date-mobile">
                                    Дата окончания подписки
                                 </Label>
                                 <div className="flex items-center border rounded-md px-3 py-2">
                                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span>{formatDate(user.end_date)}</span>
                                 </div>
                              </div>
                           </CardContent>
                           <CardFooter>
                              <Button onClick={handleSaveChanges}>
                                 Сохранить изменения
                              </Button>
                           </CardFooter>
                        </Card>

                        <section className="space-y-4 mt-6">
                           <h2 className="text-2xl font-bold">Промокоды</h2>
                           <PromoCodeForm />
                        </section>
                     </div>
                  )}

                  {/* Tabs - Mobile: 2 columns, Desktop: 3 columns */}
                  <Tabs defaultValue={getDefaultTab()}>
                     <TabsList className="grid w-full grid-cols-2 md:grid-cols-3">
                        {/* Profile tab only shown on desktop */}
                        {!isMobile && (
                           <TabsTrigger value="profile">Профиль</TabsTrigger>
                        )}
                        <TabsTrigger value="favorites">
                           Избранные ролики
                        </TabsTrigger>
                        <TabsTrigger value="scenarios">
                           Мои сценарии
                        </TabsTrigger>
                     </TabsList>

                     {/* Profile Tab Content - Only visible on desktop */}
                     {!isMobile && (
                        <TabsContent value="profile">
                           <Card>
                              <CardHeader>
                                 <CardTitle>Информация профиля</CardTitle>
                                 <CardDescription>
                                    Управляйте своей личной информацией
                                 </CardDescription>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                 <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                       id="email"
                                       value={formData.email}
                                       onChange={handleInputChange}
                                    />
                                 </div>

                                 <div className="space-y-2">
                                    <Label htmlFor="name_tg">
                                       Имя в Telegram
                                    </Label>
                                    <Input
                                       id="name_tg"
                                       value={formData.name_tg}
                                       onChange={handleInputChange}
                                    />
                                 </div>

                                 <div className="space-y-2">
                                    <Label htmlFor="email_tg">
                                       Email в Telegram
                                    </Label>
                                    <Input
                                       id="email_tg"
                                       value={formData.email_tg}
                                       onChange={handleInputChange}
                                    />
                                 </div>

                                 <div className="space-y-2">
                                    <Label htmlFor="instagram">Instagram</Label>
                                    <Input
                                       id="instagram"
                                       value={formData.instagram}
                                       onChange={handleInputChange}
                                    />
                                 </div>

                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                       <Label htmlFor="start_date">
                                          Дата начала подписки
                                       </Label>
                                       <div className="flex items-center border rounded-md px-3 py-2">
                                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                          <span>
                                             {formatDate(user.start_date)}
                                          </span>
                                       </div>
                                    </div>

                                    <div className="space-y-2">
                                       <Label htmlFor="end_date">
                                          Дата окончания подписки
                                       </Label>
                                       <div className="flex items-center border rounded-md px-3 py-2">
                                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                          <span>
                                             {formatDate(user.end_date)}
                                          </span>
                                       </div>
                                    </div>
                                 </div>
                              </CardContent>
                              <CardFooter>
                                 <Button onClick={handleSaveChanges}>
                                    Сохранить изменения
                                 </Button>
                              </CardFooter>
                           </Card>

                           <section className="space-y-4 mt-6">
                              <h2 className="text-2xl font-bold">Промокоды</h2>
                              <PromoCodeForm />
                           </section>
                        </TabsContent>
                     )}

                     {/* Favorites Tab Content */}
                     <TabsContent value="favorites">
                        <Card>
                           <CardHeader>
                              <CardTitle>Избранные ролики</CardTitle>
                              <CardDescription>
                                 Ролики, которые вы добавили в избранное
                              </CardDescription>
                           </CardHeader>
                           <CardContent>
                              {loadingFavorites ? (
                                 <div className="flex justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                 </div>
                              ) : !favoriteReelsData?.items ||
                                favoriteReelsData.items.length === 0 ? (
                                 <div className="text-center py-8 text-muted-foreground">
                                    <p>У вас пока нет избранных роликов</p>
                                    <p className="mt-2">
                                       Добавляйте ролики в избранное, чтобы
                                       вернуться к ним позже
                                    </p>
                                 </div>
                              ) : (
                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {favoriteReelsData.items.map(({ reel }) => (
                                       <ReelCard
                                          size="sm"
                                          key={reel.id}
                                          {...reel}
                                          is_favorite={true}
                                       />
                                    ))}
                                 </div>
                              )}
                           </CardContent>
                           <CardFooter>
                              {/* Only show pagination when there's more than one page */}
                              {(favoriteReelsData?.pages ?? 0) > 1 && (
                                 <Pagination>
                                    {currentPage > 1 && (
                                       <PaginationPrevious
                                          onClick={() =>
                                             handlePageChange(currentPage - 1)
                                          }
                                       />
                                    )}
                                    <PaginationContent>
                                       {renderPaginationItems()}
                                    </PaginationContent>
                                    {currentPage <
                                       (favoriteReelsData?.pages || 1) && (
                                       <PaginationNext
                                          onClick={() =>
                                             handlePageChange(currentPage + 1)
                                          }
                                       />
                                    )}
                                 </Pagination>
                              )}
                           </CardFooter>
                        </Card>
                     </TabsContent>

                     {/* Scenarios Tab Content */}
                     <TabsContent value="scenarios">
                        <Card>
                           <CardHeader>
                              <CardTitle>Мои сценарии</CardTitle>
                              <CardDescription>
                                 Сценарии, которые вы создали
                              </CardDescription>
                           </CardHeader>
                           <CardContent>
                              <UserScenarios />
                           </CardContent>
                        </Card>
                     </TabsContent>
                  </Tabs>
               </div>
            </div>
         </div>
      </VideoProvider>
   );
}
