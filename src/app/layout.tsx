"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer/footer";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar/navbar";
import { Providers } from "./providers";
import { Toaster } from "sonner";
// import Head from "next/head";

const geistSans = Geist({
   variable: "--font-geist-sans",
   subsets: ["latin"],
});

const geistMono = Geist_Mono({
   variable: "--font-geist-mono",
   subsets: ["latin"],
});

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   const pathname = usePathname();
   const isAuthPage =
      pathname === "/login" ||
      pathname === "/register" ||
      pathname === "/forgot-password" ||
      pathname === "/reset-password";

   // Define metadata for social sharing
   const siteUrl = "https://starmake.ai"; // Replace with your actual domain
   const siteName = "StarMake";
   const siteDescription =
      "Создайте успешные видео для социальных сетей с помощью StarMake";
   const ogImageUrl = `${siteUrl}/social-image.png`; // Update with your actual image path

   return (
      <Providers>
         <html lang="en">
            <head>
               {/* Open Graph / LinkedIn meta tags */}
               <meta property="og:type" content="website" />
               <meta property="og:url" content={siteUrl} />
               <meta property="og:title" content={siteName} />
               <meta property="og:description" content={siteDescription} />
               <meta property="og:image" content={ogImageUrl} />
               <meta property="og:image:width" content="1200" />
               <meta property="og:image:height" content="630" />
               <meta property="og:site_name" content={siteName} />

               {/* Twitter Card meta tags */}
               <meta name="twitter:card" content="summary_large_image" />
               <meta name="twitter:site" content="@starmake_ai" />
               <meta name="twitter:title" content={siteName} />
               <meta name="twitter:description" content={siteDescription} />
               <meta name="twitter:image" content={ogImageUrl} />
            </head>
            <body
               className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
               {!isAuthPage && <Navbar />}
               <main>{children}</main>
               {!isAuthPage && <Footer />}
               <Toaster />
            </body>
         </html>
      </Providers>
   );
}
