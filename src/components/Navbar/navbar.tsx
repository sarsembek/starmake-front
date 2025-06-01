"use client";
import { Menu, User, LogOut } from "lucide-react"; // Added MessageSquare icon
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
   NavigationMenu,
   NavigationMenuItem,
   NavigationMenuLink,
   NavigationMenuList,
   navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
   Sheet,
   SheetContent,
   SheetTitle,
   SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { shouldShowChatbot } from "@/utils/subscriptionUtils";

export function Navbar() {
   const { user, isAuthenticated, logout } = useAuth();
   const router = useRouter();
   const [mounted, setMounted] = useState(false);
   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
   const [isSheetOpen, setIsSheetOpen] = useState(false);

   // Debug auth state
   useEffect(() => {
      console.log("Auth state in Navbar:", { isAuthenticated, user });
      setMounted(true);
   }, [isAuthenticated, user]);

   // Custom navigation link style without hover background
   const navLinkStyle = cn(
      navigationMenuTriggerStyle(),
      "hover:bg-transparent hover:text-primary transition-colors"
   );

   const handleLogout = () => {
      logout();
      setIsDropdownOpen(false);
      setIsSheetOpen(false);
      router.push("/");
   };

   const navigateToProfile = () => {
      setIsDropdownOpen(false);
      setIsSheetOpen(false);
      router.push("/profile/");
   };

   // Function to handle chatbot navigation
   const navigateToChatbot = () => {
      setIsDropdownOpen(false);
      setIsSheetOpen(false);

      // Navigate to chatbot domain - the HTTP-only cookie will be sent automatically
      window.location.href = "https://direct.starmake.ai";
   };

   // Don't render authentication-dependent UI until after client-side hydration
   if (!mounted) {
      return (
         <header className="sticky top-0 z-50 border-b bg-white">
            <div className="container flex h-14 items-center justify-between px-4 md:px-0 m-auto">
               <div className="flex items-center gap-4">
                  <Logo href="/" />
                  {/* Navigation menu skeleton */}
                  <div className="hidden md:flex">
                     <NavigationMenu>
                        <NavigationMenuList>
                           {/* Same menu items */}
                        </NavigationMenuList>
                     </NavigationMenu>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  {/* Auth placeholder */}
                  <div className="h-9 w-20"></div>
               </div>
            </div>
         </header>
      );
   }

   return (
      <header className="sticky top-0 z-50 border-b bg-white">
         <div className="container flex h-14 items-center justify-between px-4 md:px-0 m-auto">
            <div className="flex items-center gap-4">
               <Logo href="/" />

               {/* Navigation menu after the logo */}
               <div className="hidden md:flex">
                  <NavigationMenu>
                     <NavigationMenuList>
                        <NavigationMenuItem>
                           <Link href="/" legacyBehavior passHref>
                              <NavigationMenuLink className={navLinkStyle}>
                                 Главная
                              </NavigationMenuLink>
                           </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                           <Link href="/library/" legacyBehavior passHref>
                              <NavigationMenuLink className={navLinkStyle}>
                                 Библиотека рилсов
                              </NavigationMenuLink>
                           </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                           <Link
                              href="/script-builder/"
                              legacyBehavior
                              passHref
                           >
                              <NavigationMenuLink className={navLinkStyle}>
                                 Конструктор сценария
                              </NavigationMenuLink>
                           </Link>
                        </NavigationMenuItem>
                        {shouldShowChatbot(user) && (
                           <NavigationMenuItem>
                              <NavigationMenuLink
                                 className={navLinkStyle}
                                 onClick={navigateToChatbot}
                                 style={{ cursor: 'pointer' }}
                              >
                                 Чатбот
                              </NavigationMenuLink>
                           </NavigationMenuItem>
                        )}
                     </NavigationMenuList>
                  </NavigationMenu>
               </div>
            </div>

            <div className="flex items-center gap-4">
               {/* Show user email or login button based on authentication state */}
               {isAuthenticated ? (
                  <DropdownMenu
                     open={isDropdownOpen}
                     onOpenChange={setIsDropdownOpen}
                  >
                     <DropdownMenuTrigger asChild>
                        <Button
                           variant="ghost"
                           className="flex items-center gap-2"
                        >
                           <User className="h-4 w-4" />
                           <span className="hidden md:inline-block">
                              {user?.email}
                           </span>
                        </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuItem
                           className="font-medium cursor-pointer"
                           onClick={navigateToProfile}
                        >
                           Профиль
                        </DropdownMenuItem>
                        {/* Chatbot link in dropdown menu */}
                        {shouldShowChatbot(user) && (
                           <DropdownMenuItem
                              className="font-medium cursor-pointer"
                              onClick={navigateToChatbot}
                           >
                              <span>Чатбот</span>
                           </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                           onClick={handleLogout}
                           className="text-destructive focus:text-destructive cursor-pointer"
                        >
                           <LogOut className="mr-2 h-4 w-4" />
                           <span>Выйти</span>
                        </DropdownMenuItem>
                     </DropdownMenuContent>
                  </DropdownMenu>
               ) : (
                  <Button
                     variant="outline"
                     asChild
                     className="hidden md:inline-flex"
                  >
                     <Link href="/login/">Войти</Link>
                  </Button>
               )}

               {/* Mobile menu button */}
               <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                  <SheetTrigger asChild>
                     <Button
                        variant="outline"
                        size="icon"
                        className="md:hidden"
                     >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle menu</span>
                     </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="p-0">
                     <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between p-6 border-b">
                           <SheetTitle className="sr-only">
                              Navigation Menu
                           </SheetTitle>
                           <Logo />
                        </div>
                        <nav className="flex-1 p-6">
                           <div className="flex flex-col space-y-8">
                              <Link
                                 href="/"
                                 className="text-lg font-medium hover:text-primary"
                                 onClick={() => setIsSheetOpen(false)}
                              >
                                 Главная
                              </Link>
                              <Link
                                 href="/library/"
                                 className="text-lg font-medium hover:text-primary"
                                 onClick={() => setIsSheetOpen(false)}
                              >
                                 Библиотека рилсов
                              </Link>
                              <Link
                                 href="/script-builder/"
                                 className="text-lg font-medium hover:text-primary"
                                 onClick={() => setIsSheetOpen(false)}
                              >
                                 Конструктор сценария
                              </Link>
                              {/* Chatbot link in mobile menu */}
                              {shouldShowChatbot(user) && (
                                 <button
                                    onClick={() => {
                                       setIsSheetOpen(false);
                                       navigateToChatbot();
                                    }}
                                    className="flex items-center gap-2 text-left text-lg font-medium hover:text-primary"
                                 >
                                    <span>Чатбот</span>
                                 </button>
                              )}

                              {/* Show user email or login link based on auth state */}
                              {isAuthenticated ? (
                                 <>
                                    <div className="flex items-center gap-2 text-lg font-medium">
                                       <User className="h-4 w-4" />
                                       <span>{user?.email}</span>
                                    </div>
                                    <button
                                       onClick={navigateToProfile}
                                       className="flex items-center gap-2 text-lg font-medium hover:text-primary"
                                    >
                                       Профиль
                                    </button>
                                    <button
                                       onClick={handleLogout}
                                       className="flex items-center gap-2 text-lg font-medium text-destructive hover:text-destructive"
                                    >
                                       <LogOut className="h-4 w-4" />
                                       <span>Выйти</span>
                                    </button>
                                 </>
                              ) : (
                                 <Link
                                    href="/login/"
                                    className="text-lg font-medium hover:text-primary"
                                    onClick={() => setIsSheetOpen(false)}
                                 >
                                    Войти
                                 </Link>
                              )}
                           </div>
                        </nav>
                     </div>
                  </SheetContent>
               </Sheet>
            </div>
         </div>
      </header>
   );
}
