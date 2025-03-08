"use client";
import Link from "next/link";
import { Menu } from "lucide-react";

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

export function Navbar() {
   return (
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
         <div className="container flex h-14 items-center justify-between px-4 md:px-0 m-auto">
            <div className="flex items-center gap-4">
               <Link href="/" className="font-bold text-lg">
                  <span
                     className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-purple-300 font-extrabold"
                     style={{
                        textShadow: "0px 0px 1px rgba(168, 85, 247, 0.4)",
                     }}
                  >
                     STAR
                  </span>
                  <span className="text-gray-700 dark:text-gray-400">MAKE</span>
               </Link>

               {/* Navigation menu after the logo */}
               <div className="hidden md:flex">
                  <NavigationMenu>
                     <NavigationMenuList>
                        <NavigationMenuItem>
                           <Link href="/" legacyBehavior passHref>
                              <NavigationMenuLink
                                 className={navigationMenuTriggerStyle()}
                              >
                                 Главная
                              </NavigationMenuLink>
                           </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                           <Link href="/library/" legacyBehavior passHref>
                              <NavigationMenuLink
                                 className={navigationMenuTriggerStyle()}
                              >
                                 Библиотека рилсов
                              </NavigationMenuLink>
                           </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                           <Link
                              href="/sandbox/script-builder/"
                              legacyBehavior
                              passHref
                           >
                              <NavigationMenuLink
                                 className={navigationMenuTriggerStyle()}
                              >
                                 Конструктор сценария
                              </NavigationMenuLink>
                           </Link>
                        </NavigationMenuItem>
                     </NavigationMenuList>
                  </NavigationMenu>
               </div>
            </div>

            <div className="flex items-center gap-4">
               {/* Login button visible only on desktop */}
               <Button
                  variant="outline"
                  asChild
                  className="hidden md:inline-flex"
               >
                  <Link href="/login/">Войти</Link>
               </Button>

               {/* Mobile menu button moved to right */}
               <Sheet>
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
                           <div className="font-bold text-lg">
                              <span
                                 className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-purple-300 font-extrabold"
                                 style={{
                                    textShadow:
                                       "0px 0px 1px rgba(168, 85, 247, 0.4)",
                                 }}
                              >
                                 STAR
                              </span>
                              <span className="text-gray-700 dark:text-gray-400">
                                 MAKE
                              </span>
                           </div>
                        </div>
                        <nav className="flex-1 p-6">
                           <div className="flex flex-col space-y-8">
                              <Link
                                 href="/"
                                 className="text-lg font-medium hover:text-primary"
                              >
                                 Главная
                              </Link>
                              <Link
                                 href="/library/"
                                 className="text-lg font-medium hover:text-primary"
                              >
                                 Библиотека рилсов
                              </Link>
                              <Link
                                 href="/sandbox/script-builder/"
                                 className="text-lg font-medium hover:text-primary"
                              >
                                 Конструктор сценария
                              </Link>
                              <Link
                                 href="/login/"
                                 className="text-lg font-medium hover:text-primary"
                              >
                                 Войти
                              </Link>
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
