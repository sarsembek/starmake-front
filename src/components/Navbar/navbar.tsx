"use client";
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
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Logo } from "@/components/shared/Logo";

export function Navbar() {
   // Custom navigation link style without hover background
   const navLinkStyle = cn(
      navigationMenuTriggerStyle(),
      "hover:bg-transparent hover:text-primary transition-colors"
   );

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
                              href="/sandbox/script-builder/"
                              legacyBehavior
                              passHref
                           >
                              <NavigationMenuLink className={navLinkStyle}>
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
                           <Logo />
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
