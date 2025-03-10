"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer/footer";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar/navbar"; 

const geistSans = Geist({
   variable: "--font-geist-sans",
   subsets: ["latin"],
});

const geistMono = Geist_Mono({
   variable: "--font-geist-mono",
   subsets: ["latin"],
});

// Create a client
const queryClient = new QueryClient();

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   const pathname = usePathname();
   const isAuthPage = pathname === "/login" || pathname === "/register";

   return (
      <QueryClientProvider client={queryClient}>
         <AuthProvider>
            <html lang="en">
               <body
                  className={`${geistSans.variable} ${geistMono.variable} antialiased`}
               >
                  {!isAuthPage && <Navbar />}
                  <main>{children}</main>
                  {!isAuthPage && <Footer />}
               </body>
            </html>
         </AuthProvider>
      </QueryClientProvider>
   );
}
